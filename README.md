# OpportunityGrid

RoyalGrid Technologies' flagship platform — African opportunity discovery, verification,
matching, readiness, and application tracking.

## Live site

[opportunitygrid.vercel.app](https://opportunitygrid.vercel.app) — currently running in
**DEMO_MODE**: every opportunity shown is a fictional, clearly labeled demonstration record.

## Status (FACT)

- Discover → Verify → Match → Qualify → Prepare → Track pipeline implemented end to end
  against a static demo dataset.
- A first live source adapter (`lib/adapters/serpApiAdapter.ts`, Nigeria-scoped web search
  via SerpApi) is implemented and activates automatically once `SERPAPI_KEY` is set — see
  `.env.example`.
- No live database yet. Business profile and pipeline state are stored in browser
  `localStorage` only. A full Supabase schema with RLS is written and ready
  (`supabase/migrations/0001_init.sql`) but not yet applied — see `TRANSFER_NOTES.md` for why.

## Architecture

```
lib/types.ts              normalized opportunity, profile, eligibility, and pipeline types
lib/adapters/types.ts      SourceAdapter interface every discovery source implements
lib/adapters/demoAdapter.ts   default adapter — static demo dataset, no network calls
lib/adapters/serpApiAdapter.ts  first live adapter — server-only, Nigeria-scoped
lib/matching.ts            deterministic, rule-based eligibility assessment (no LLM, no invented eligibility)
lib/readiness.ts           readiness checklist generation from an opportunity's own requirements
lib/store.ts                client-side localStorage persistence (profile + pipeline)
app/                        Home, Opportunities, Opportunity detail, Profile, Pipeline, About
supabase/migrations/        ready-to-apply schema (organizations, opportunities, RLS, audit logs, …)
```

## Development

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Provenance

This platform's technical foundation was refactored from a prior prototype. See
`TRANSFER_NOTES.md` for what was and was not carried over. This repository is independent —
it carries no branding, corporate relationship, or affiliation to any other company.
