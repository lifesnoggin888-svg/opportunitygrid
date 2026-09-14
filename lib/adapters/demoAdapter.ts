import type { SourceAdapter } from "@/lib/adapters/types";
import type { NormalizedOpportunity } from "@/lib/types";
import { DEMO_OPPORTUNITIES } from "@/lib/data/demo-opportunities";

/**
 * The only adapter wired in by default. It never makes a network call — it
 * returns the static, clearly labeled DEMO_OPPORTUNITIES set. This is what
 * lets OpportunityGrid function before any live African source integration
 * exists, per the product's DEMO_MODE requirement.
 */
export const demoAdapter: SourceAdapter = {
  id: "demo",
  name: "OpportunityGrid Demo Dataset",
  sourceType: "demo",

  async search(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) return DEMO_OPPORTUNITIES;
    return DEMO_OPPORTUNITIES.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        (o.sector ?? []).some((s) => s.toLowerCase().includes(q))
    );
  },

  async fetch(rawResult: unknown) {
    return rawResult;
  },

  normalize(raw: unknown) {
    return raw as NormalizedOpportunity;
  },

  validate(opportunity: NormalizedOpportunity) {
    // Demo records are exempt from the source_url requirement that applies
    // to live adapters, since they carry no real source by design.
    return opportunity.is_demo === true && Boolean(opportunity.title);
  },

  provenance() {
    return {
      sourceName: "OpportunityGrid Demo Dataset",
      sourceType: "demo",
      notes:
        "Static, hand-authored demonstration records. Not retrieved from any live source. Every issuer is fictional and labeled accordingly.",
    };
  },
};
