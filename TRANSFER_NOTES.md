# Transfer Notes (private — provenance record, not for public distribution)

## Source

This product's technical foundation was refactored from a prior open-source prototype
(`grant-scout`), a Google ADK + Gemini chat agent that answered US-federal-grant questions
using a single live SerpApi/grants.gov search per turn.

## What was carried over

- The idea of a single, narrowly-scoped live search tool per query, with tracking-link
  filtering and a request timeout (ported into `lib/adapters/serpApiAdapter.ts`, rewritten
  from Python to TypeScript and re-scoped to Nigerian sources).
- The general shape of "search → structured result → cite the real source" — but not the
  code itself; OpportunityGrid's matching and readiness logic is new, rule-based, and
  schema-driven rather than LLM-narrated.

## What was NOT carried over

- The chat/conversational interface — replaced with structured profile → match → readiness →
  pipeline screens.
- The prior repository's branding, license copyright, and metadata (previously referenced a
  different corporate entity's name and contact email) — none of that appears anywhere in
  this repository.
- Any credentials, `.env` values, or Supabase data from the source prototype.

## Open items

- No IP assignment has been executed for this technical foundation — tracked in
  `royalgrid-technologies/docs/legal/IP_TRANSFER_CHECKLIST.md`.
- No Supabase project is provisioned yet. Every Supabase account this build had credentials
  for (lifesnoggin888, smartinvite, hardme49, hardme888, and Joy's main org) was at its
  free-tier 2-active-project cap when Phase 2 ran (verified via the Supabase Management API,
  not assumed). `supabase/migrations/0001_init.sql` is the ready-to-run schema for whichever
  project/account Joy designates once a slot is free or an org is upgraded.
