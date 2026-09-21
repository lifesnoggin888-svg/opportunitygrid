"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { OrganizationProfile } from "@/lib/types";

// Maps the app's camelCase OrganizationProfile to the snake_case
// organization_profiles columns from supabase/migrations/0001_init.sql.
function toRow(organizationId: string, profile: OrganizationProfile) {
  return {
    organization_id: organizationId,
    registration_type: profile.registrationType,
    company_age_years: profile.companyAgeYears,
    industry: profile.industry,
    revenue_stage: profile.revenueStage,
    employee_size: profile.employeeSize,
    geography: profile.geography,
    funding_stage: profile.fundingStage,
    certifications: profile.certifications,
    export_status: profile.exportStatus,
    technology_focus: profile.technologyFocus,
    documents_on_hand: profile.documentsOnHand,
  };
}

function fromRow(row: Record<string, unknown>, name: string, country: string): OrganizationProfile {
  return {
    name,
    country,
    registrationType: row.registration_type as OrganizationProfile["registrationType"],
    companyAgeYears: (row.company_age_years as number | null) ?? null,
    industry: (row.industry as string) ?? "",
    revenueStage: row.revenue_stage as OrganizationProfile["revenueStage"],
    employeeSize: row.employee_size as OrganizationProfile["employeeSize"],
    geography: (row.geography as string[]) ?? [],
    fundingStage: row.funding_stage as OrganizationProfile["fundingStage"],
    certifications: (row.certifications as string[]) ?? [],
    exportStatus: row.export_status as OrganizationProfile["exportStatus"],
    technologyFocus: Boolean(row.technology_focus),
    documentsOnHand: (row.documents_on_hand as string[]) ?? [],
  };
}

export async function getMyOrganizationId(supabase: SupabaseClient): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("users").select("organization_id").eq("id", user.id).maybeSingle();
  return (data?.organization_id as string | undefined) ?? null;
}

export async function loadRemoteProfile(supabase: SupabaseClient, organizationId: string): Promise<OrganizationProfile | null> {
  const [{ data: org }, { data: profile }] = await Promise.all([
    supabase.from("organizations").select("name, country").eq("id", organizationId).maybeSingle(),
    supabase.from("organization_profiles").select("*").eq("organization_id", organizationId).maybeSingle(),
  ]);
  if (!org || !profile) return null;
  return fromRow(profile, org.name as string, org.country as string);
}

export async function saveRemoteProfile(supabase: SupabaseClient, organizationId: string, profile: OrganizationProfile): Promise<void> {
  const [orgResult, profileResult] = await Promise.all([
    supabase.from("organizations").update({ name: profile.name, country: profile.country }).eq("id", organizationId),
    supabase.from("organization_profiles").upsert(toRow(organizationId, profile), { onConflict: "organization_id" }),
  ]);
  if (orgResult.error) throw orgResult.error;
  if (profileResult.error) throw profileResult.error;
}
