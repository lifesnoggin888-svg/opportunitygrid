-- 0001_init.sql granted organizations only a SELECT policy (organizations_self),
-- with no INSERT/UPDATE for authenticated users - intentional, since a brand-new
-- user has no organization yet and creation happens server-side under the
-- service role (see app/api/auth/bootstrap/route.ts). But that also silently
-- blocked an existing member from ever renaming their own org or updating its
-- country - discovered via live signup verification against production
-- (2026-09-21): the profile form's organization update was RLS-blocked with
-- no client-visible error.
create policy "organizations_owner_update" on organizations for update to authenticated
  using (id = public.current_organization_id())
  with check (id = public.current_organization_id());
