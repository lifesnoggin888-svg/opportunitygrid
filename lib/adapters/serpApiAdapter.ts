import "server-only";
import type { SourceAdapter } from "@/lib/adapters/types";
import type { NormalizedOpportunity } from "@/lib/types";

// First live source-adapter integration. Server-only: SERPAPI_KEY is never
// read or exposed client-side. Ported and refactored from the grant-scout
// prototype's SerpApi integration (tracking-link filtering, timeout
// handling), but re-scoped for African opportunity discovery instead of a
// single US-centric chat query, and mapped into the shared normalized
// schema rather than returned as free-text search results.

const SERPAPI_URL = "https://serpapi.com/search";

interface RawSerpResult {
  title?: string;
  link?: string;
  snippet?: string;
}

const TRACKING_NETLOCS = new Set(["www.google.com", "google.com", "www.googleadservices.com"]);

function safeHttpUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (TRACKING_NETLOCS.has(url.hostname.toLowerCase())) return null;
    return value.trim();
  } catch {
    return null;
  }
}

export function makeSerpApiAdapter(apiKey: string): SourceAdapter {
  return {
    id: "serpapi-ng",
    name: "Live Web Search (Nigeria-scoped)",
    sourceType: "search_fallback",

    async search(query: string) {
      // African-first scoping: the query is constrained to Nigerian sources
      // and opportunity terminology, not a US grants query with the country
      // swapped — see docs/product/OPPORTUNITYGRID.md.
      const scopedQuery = `${query} Nigeria (grant OR tender OR accelerator OR "call for applications") site:.ng OR site:.org OR site:.gov.ng`;
      const params = new URLSearchParams({
        engine: "google",
        q: scopedQuery,
        api_key: apiKey,
        num: "8",
        gl: "ng",
      });

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12_000);
      try {
        const res = await fetch(`${SERPAPI_URL}?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) return [];
        const data = await res.json();
        const organic = Array.isArray(data.organic_results) ? data.organic_results : [];
        return organic
          .map((r: RawSerpResult) => ({
            title: r.title ?? null,
            link: safeHttpUrl(r.link),
            snippet: r.snippet ?? null,
          }))
          .filter((r: { link: string | null }) => r.link !== null);
      } catch {
        return [];
      } finally {
        clearTimeout(timeout);
      }
    },

    async fetch(rawResult: unknown) {
      // No detail-page fetch is implemented yet — normalize() works directly
      // from the search snippet. A future revision may fetch the source_url
      // to verify deadline/amount fields currently left null.
      return rawResult;
    },

    normalize(raw: unknown): NormalizedOpportunity {
      const r = raw as { title: string | null; link: string | null; snippet: string | null };
      return {
        id: `serpapi-${Buffer.from(r.link ?? r.title ?? "").toString("base64url").slice(0, 24)}`,
        title: r.title ?? "Untitled opportunity",
        issuer: null,
        country: "Nigeria",
        region: null,
        opportunity_type: "grant",
        sector: null,
        description: r.snippet ?? "",
        eligibility_summary: null,
        requirements: null,
        deadline: null,
        opening_date: null,
        funding_amount_min: null,
        funding_amount_max: null,
        currency: null,
        source_url: r.link,
        source_name: "Live web search (Google via SerpApi)",
        source_type: "search_fallback",
        retrieved_at: new Date().toISOString(),
        last_verified_at: null,
        confidence: "low",
        status: "open",
        is_demo: false,
      };
    },

    validate(opportunity: NormalizedOpportunity) {
      // A live, non-demo record is only valid if it carries a real,
      // non-tracking source URL — no opportunity may be shown without one.
      return !opportunity.is_demo && Boolean(opportunity.source_url) && Boolean(opportunity.title);
    },

    provenance() {
      return {
        sourceName: "Live web search (Google via SerpApi)",
        sourceType: "search_fallback",
        notes:
          "Search-engine discovery fallback, scoped to Nigerian sources. Every result retains its real source URL. Issuer, deadline, and funding amount are left null until a source-specific adapter or detail-page fetch can verify them — never inferred from the snippet.",
      };
    },
  };
}

export function getLiveAdapter(): SourceAdapter | null {
  const key = process.env.SERPAPI_KEY;
  if (!key) return null;
  return makeSerpApiAdapter(key);
}
