import "server-only";
import { gunzipSync } from "node:zlib";
import type { SourceAdapter } from "@/lib/adapters/types";
import type { NormalizedOpportunity } from "@/lib/types";

// First genuinely LIVE, official source integration: Nigeria's Bureau of
// Public Procurement (BPP) open contracting data, published under the Open
// Contracting Data Standard and mirrored (with a valid, reliably-served
// certificate) by the Open Contracting Partnership's data registry. No API
// key, no scraping, no terms-of-use bypass — this is bulk open government
// data, fetched directly from its official publisher.
//
// Source: https://data.open-contracting.org/en/publication/64
// (BPP's own portal, nocopo.bpp.gov.ng, currently serves an expired TLS
// certificate — verified 2026-09-14 — so this mirror is used instead. If
// BPP's own certificate is renewed, switch back to fetching directly from
// them.)

const OCP_REGISTRY_PAGE = "https://data.open-contracting.org/en/publication/64";
const CURRENT_YEAR = new Date().getUTCFullYear();

interface OcdsMilestone {
  code?: string;
  title?: string;
  dueDate?: string;
  dateMet?: string;
}

interface OcdsTender {
  title?: string;
  description?: string;
  status?: string;
  value?: { amount?: number; currency?: string };
  tenderPeriod?: { startDate?: string; endDate?: string };
  procuringEntity?: { name?: string };
  milestones?: OcdsMilestone[];
}

interface OcdsRecord {
  ocid: string;
  date?: string;
  buyer?: { name?: string };
  tender?: OcdsTender;
}

async function fetchYearRecords(year: number): Promise<OcdsRecord[]> {
  const url = `${OCP_REGISTRY_PAGE}/download?name=${year}.jsonl.gz`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(url, { signal: controller.signal, redirect: "follow" });
    if (!res.ok) return [];
    const buf = Buffer.from(await res.arrayBuffer());
    const text = gunzipSync(buf).toString("utf-8");
    return text
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line) as OcdsRecord;
        } catch {
          return null;
        }
      })
      .filter((r): r is OcdsRecord => r !== null);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

// BPP's own open-data feed mixes a small number of sandbox/test records into
// production data (issuer name "TEST MINISTRY - NOCOPO", confirmed by
// inspecting the raw 2025/2026 feed — roughly 7% of "active" 2025 records).
// These must never be shown as real opportunities.
const TEST_ISSUER_MARKERS = ["TEST MINISTRY", "SAMPLE", "DEMO MINISTRY", "DUMMY"];

function isSandboxRecord(issuerName: string | null | undefined): boolean {
  if (!issuerName) return false;
  const upper = issuerName.toUpperCase();
  return TEST_ISSUER_MARKERS.some((marker) => upper.includes(marker));
}

function toNormalized(record: OcdsRecord): NormalizedOpportunity | null {
  const tender = record.tender;
  if (!tender || tender.status !== "active" || !tender.title) return null;
  const issuerName = tender.procuringEntity?.name?.trim() || record.buyer?.name?.trim() || null;
  if (isSandboxRecord(issuerName)) return null;

  const deadline = tender.tenderPeriod?.endDate ? tender.tenderPeriod.endDate.slice(0, 10) : null;
  const now = Date.now();
  let status: NormalizedOpportunity["status"] = "open";
  if (deadline) {
    const deadlineMs = new Date(deadline).getTime();
    if (deadlineMs < now) status = "closed";
    else if (deadlineMs - now < 14 * 24 * 60 * 60 * 1000) status = "closing_soon";
  }

  return {
    id: `ocds-${record.ocid}`,
    title: tender.title.trim(),
    issuer: issuerName,
    country: "Nigeria",
    region: null,
    opportunity_type: "procurement",
    sector: null,
    description: tender.description?.trim() || tender.title.trim(),
    eligibility_summary: null,
    requirements: null,
    deadline,
    opening_date: tender.tenderPeriod?.startDate ? tender.tenderPeriod.startDate.slice(0, 10) : null,
    funding_amount_min: null,
    funding_amount_max: tender.value?.amount ?? null,
    currency: tender.value?.currency ?? null,
    source_url: OCP_REGISTRY_PAGE,
    source_name: "Nigeria Bureau of Public Procurement (Open Contracting Data)",
    source_type: "official_api",
    retrieved_at: new Date().toISOString(),
    last_verified_at: new Date().toISOString(),
    confidence: "high",
    status,
    is_demo: false,
  };
}

export const ocdsAdapter: SourceAdapter = {
  id: "ng-bpp-ocds",
  name: "Nigeria Bureau of Public Procurement (Open Contracting Data)",
  sourceType: "official_api",

  async search(query: string) {
    const [current, prior] = await Promise.all([
      fetchYearRecords(CURRENT_YEAR),
      fetchYearRecords(CURRENT_YEAR - 1),
    ]);
    const all = [...current, ...prior];
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((r) => (r.tender?.title ?? "").toLowerCase().includes(q));
  },

  async fetch(rawResult: unknown) {
    return rawResult;
  },

  normalize(raw: unknown) {
    const normalized = toNormalized(raw as OcdsRecord);
    if (!normalized) {
      throw new Error("Record does not have an active tender and cannot be normalized.");
    }
    return normalized;
  },

  validate(opportunity: NormalizedOpportunity) {
    return !opportunity.is_demo && Boolean(opportunity.source_url) && Boolean(opportunity.title);
  },

  provenance() {
    return {
      sourceName: "Nigeria Bureau of Public Procurement (Open Contracting Data)",
      sourceType: "official_api",
      notes:
        "Real, official Nigerian government procurement data published under the Open Contracting Data Standard, mirrored by the Open Contracting Partnership's data registry. Deadline is left null when BPP itself has not published a tenderPeriod.endDate for that record — never inferred. Sandbox/test records BPP's own feed mixes into production data (issuer 'TEST MINISTRY - NOCOPO') are filtered out before normalization.",
    };
  },
};

export async function getLiveProcurementOpportunities(limit = 20): Promise<NormalizedOpportunity[]> {
  const [current, prior] = await Promise.all([
    fetchYearRecords(CURRENT_YEAR),
    fetchYearRecords(CURRENT_YEAR - 1),
  ]);
  const normalized = [...current, ...prior]
    .map(toNormalized)
    .filter((o): o is NormalizedOpportunity => o !== null && o.status !== "closed");

  normalized.sort((a, b) => {
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  return normalized.slice(0, limit);
}
