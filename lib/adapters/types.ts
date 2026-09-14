import type { NormalizedOpportunity } from "@/lib/types";

/**
 * Every discovery source — an official API, a permitted RSS feed, permitted
 * public web discovery, or search-engine discovery as a last-resort fallback
 * — implements this same interface. No adapter may bypass authentication,
 * anti-bot protection, robots restrictions, paywalls, or a source's terms of
 * use. An adapter that cannot verify a field must return null for it, never
 * a guess.
 */
export interface SourceAdapter {
  /** Machine-readable id, e.g. "ng-grants-demo". */
  id: string;
  /** Human-readable name shown in provenance, e.g. "Nigeria Grants Portal (Demo)". */
  name: string;
  sourceType: NormalizedOpportunity["source_type"];

  /** Raw search against the source for a given free-text query. */
  search(query: string): Promise<unknown[]>;

  /** Fetch full detail for one raw search result. */
  fetch(rawResult: unknown): Promise<unknown>;

  /** Convert a raw fetched record into the normalized schema. Nulls, not guesses. */
  normalize(raw: unknown): NormalizedOpportunity;

  /** Reject a normalized record that fails basic integrity checks (e.g. no source_url on a non-demo record). */
  validate(opportunity: NormalizedOpportunity): boolean;

  /** Describe this adapter's provenance guarantees, shown in the UI. */
  provenance(): { sourceName: string; sourceType: NormalizedOpportunity["source_type"]; notes: string };
}
