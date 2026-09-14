-- OpportunityGrid initial schema.
-- NOT YET APPLIED to any live Supabase project as of this commit — every
-- Supabase account this build had credentials for was at its free-tier
-- 2-active-project cap (see TRANSFER_NOTES.md). This file is the ready-to-run
-- migration for whichever project Joy designates once a slot is free.
--
-- Design rules followed throughout:
--   * UUID primary keys
--   * created_at / updated_at timestamps on every table
--   * multi-tenancy via organization_id, enforced by RLS, not just app code
--   * RLS enabled on every table from the start (fail closed)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Core tenancy
-- ---------------------------------------------------------------------------

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table organization_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  registration_type text not null check (registration_type in ('unregistered','business_name','limited_company','ngo_nonprofit','cooperative')),
  company_age_years int,
  industry text not null,
  revenue_stage text not null check (revenue_stage in ('pre_revenue','early_revenue','growth','established')),
  employee_size text not null check (employee_size in ('1','2-9','10-49','50-249','250+')),
  geography text[] not null default '{}',
  funding_stage text not null check (funding_stage in ('bootstrapped','pre_seed','seed','series_a_plus','grant_funded','not_applicable')),
  certifications text[] not null default '{}',
  export_status text not null check (export_status in ('none','exploring','active_exporter')),
  technology_focus boolean not null default false,
  documents_on_hand text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id)
);

create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references organizations(id) on delete set null,
  role text not null default 'member' check (role in ('owner','admin','member')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Opportunities and source provenance
-- ---------------------------------------------------------------------------

create table opportunity_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type text not null check (source_type in ('official_api','rss_feed','public_web','search_fallback','demo')),
  base_url text,
  notes text,
  created_at timestamptz not null default now()
);

create table opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text,
  country text,
  region text,
  opportunity_type text not null check (opportunity_type in ('grant','accelerator','procurement','supplier_program','export_program','development_finance','innovation_challenge','sme_support')),
  sector text[],
  description text not null default '',
  eligibility_summary text,
  requirements text[],
  deadline date,
  opening_date date,
  funding_amount_min numeric,
  funding_amount_max numeric,
  currency text,
  source_url text,
  source_id uuid references opportunity_sources(id),
  retrieved_at timestamptz not null default now(),
  last_verified_at timestamptz,
  confidence text not null default 'low' check (confidence in ('high','medium','low')),
  status text not null default 'open' check (status in ('open','closing_soon','closed','forecasted')),
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on opportunities (opportunity_type);
create index on opportunities (country);
create index on opportunities (status);
create index on opportunities (deadline);

create table source_snapshots (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  raw_payload jsonb not null,
  captured_at timestamptz not null default now()
);

create index on source_snapshots (opportunity_id);

-- ---------------------------------------------------------------------------
-- Eligibility
-- ---------------------------------------------------------------------------

create table eligibility_rules (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  rule_key text not null,
  rule_description text not null,
  created_at timestamptz not null default now()
);

create index on eligibility_rules (opportunity_id);

create table eligibility_assessments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  verdict text not null check (verdict in ('likely_eligible','potentially_eligible','not_enough_evidence','likely_ineligible')),
  reasons text[] not null default '{}',
  assessed_at timestamptz not null default now(),
  unique (organization_id, opportunity_id)
);

create index on eligibility_assessments (organization_id);

-- ---------------------------------------------------------------------------
-- Readiness, saved opportunities, applications
-- ---------------------------------------------------------------------------

create table readiness_requirements (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  label text not null,
  category text not null check (category in ('corporate_documents','compliance','financial','pitch_materials','certifications','application')),
  created_at timestamptz not null default now()
);

create index on readiness_requirements (opportunity_id);

create table saved_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  saved_at timestamptz not null default now(),
  unique (organization_id, opportunity_id)
);

create table applications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  stage text not null default 'discovered' check (stage in ('discovered','qualified','preparing','submitted','won','lost','expired')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, opportunity_id)
);

create index on applications (organization_id);
create index on applications (stage);

create table application_events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  from_stage text,
  to_stage text not null,
  occurred_at timestamptz not null default now(),
  note text
);

create index on application_events (application_id);

-- ---------------------------------------------------------------------------
-- Notifications and audit
-- ---------------------------------------------------------------------------

create table notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  kind text not null,
  payload jsonb not null default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index on notifications (organization_id);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_table text,
  target_id uuid,
  detail jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index on audit_logs (organization_id);

-- ---------------------------------------------------------------------------
-- Row Level Security — enabled on every table, fail closed.
-- Opportunities/sources/rules/readiness requirements are shared reference
-- data (readable by any authenticated user, writable only server-side via
-- the service role). Everything scoped to an organization is isolated to
-- members of that organization.
-- ---------------------------------------------------------------------------

alter table organizations enable row level security;
alter table organization_profiles enable row level security;
alter table users enable row level security;
alter table opportunity_sources enable row level security;
alter table opportunities enable row level security;
alter table source_snapshots enable row level security;
alter table eligibility_rules enable row level security;
alter table eligibility_assessments enable row level security;
alter table readiness_requirements enable row level security;
alter table saved_opportunities enable row level security;
alter table applications enable row level security;
alter table application_events enable row level security;
alter table notifications enable row level security;
alter table audit_logs enable row level security;

create function public.current_organization_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id from public.users where id = auth.uid();
$$;

-- Reference/shared data: readable by any authenticated user.
create policy "opportunity_sources_read" on opportunity_sources for select to authenticated using (true);
create policy "opportunities_read" on opportunities for select to authenticated using (true);
create policy "eligibility_rules_read" on eligibility_rules for select to authenticated using (true);
create policy "readiness_requirements_read" on readiness_requirements for select to authenticated using (true);
create policy "source_snapshots_read" on source_snapshots for select to authenticated using (true);
-- No insert/update/delete policies for reference tables: writes happen only
-- via the service role from server-side ingestion code, never from a client.

-- Tenant-scoped tables: members may only see/act on their own organization's rows.
create policy "organizations_self" on organizations for select to authenticated
  using (id = public.current_organization_id());

create policy "organization_profiles_self" on organization_profiles for all to authenticated
  using (organization_id = public.current_organization_id())
  with check (organization_id = public.current_organization_id());

create policy "users_self" on users for select to authenticated
  using (organization_id = public.current_organization_id() or id = auth.uid());

create policy "eligibility_assessments_self" on eligibility_assessments for all to authenticated
  using (organization_id = public.current_organization_id())
  with check (organization_id = public.current_organization_id());

create policy "saved_opportunities_self" on saved_opportunities for all to authenticated
  using (organization_id = public.current_organization_id())
  with check (organization_id = public.current_organization_id());

create policy "applications_self" on applications for all to authenticated
  using (organization_id = public.current_organization_id())
  with check (organization_id = public.current_organization_id());

create policy "application_events_self" on application_events for select to authenticated
  using (
    application_id in (
      select id from applications where organization_id = public.current_organization_id()
    )
  );

create policy "notifications_self" on notifications for all to authenticated
  using (organization_id = public.current_organization_id())
  with check (organization_id = public.current_organization_id());

create policy "audit_logs_self_read" on audit_logs for select to authenticated
  using (organization_id = public.current_organization_id());
-- audit_logs writes happen only via the service role, never client-side.
