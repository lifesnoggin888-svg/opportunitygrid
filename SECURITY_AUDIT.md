# Security Audit — opportunitygrid

**Scope:** this repository's working tree, prior to first push. No secret values included.

## Method

```
grep -ril "arknet" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next

grep -riE "GROQ_API_KEY|OPENAI_API_KEY|GOOGLE_API_KEY|SERPAPI_KEY=.+[a-zA-Z0-9]|
SUPABASE_SERVICE_ROLE_KEY=.+[a-zA-Z0-9]|DATABASE_URL=.+[a-zA-Z0-9]|JWT_SECRET=.+[a-zA-Z0-9]|
RESEND_API_KEY|STRIPE_SECRET_KEY|sk-[a-zA-Z0-9]{20,}|AIza[0-9A-Za-z_-]{35}|
ghp_[a-zA-Z0-9]{30,}|github_pat_|vcp_[a-zA-Z0-9]{20,}|sbp_[a-zA-Z0-9]{20,}" . \
  --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next

find . -iname ".env*" -not -path "*/node_modules/*" -not -path "*/.next/*"
grep -r "NEXT_PUBLIC_" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next
```

## Results

| Check | Result |
|---|---|
| "ArkNet" references | None |
| Committed secret values | None |
| `.env` files present | Only `.env.example`, containing empty/commented placeholders |
| `NEXT_PUBLIC_*` in use | None active — two are listed, commented out, as reserved names for a future Supabase publishable key/URL (never a secret) |
| `SERPAPI_KEY` handling | Read only in `lib/adapters/serpApiAdapter.ts`, marked `import "server-only"` at the top of the file — a build-time guard that fails the build if this module is ever imported from client code |
| Hardcoded API keys/tokens | None |

## Notes

- `lib/adapters/serpApiAdapter.ts` is the only file in this repository that reads a secret
  (`process.env.SERPAPI_KEY`). It is never imported by a client component; `"server-only"`
  enforces this at build time rather than relying on code review alone.
- No Supabase project is connected yet (see `TRANSFER_NOTES.md`), so no
  `SUPABASE_SERVICE_ROLE_KEY` or database URL exists to leak.
- When a Supabase project is provisioned, `SUPABASE_SERVICE_ROLE_KEY` must be read
  server-side only, and RLS (already written in `supabase/migrations/0001_init.sql`) must be
  applied before any client traffic is pointed at it.

## Conclusion

No secrets, credentials, or prior-company branding are present in this repository as pushed.
