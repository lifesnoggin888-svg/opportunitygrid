// Normalized opportunity schema. Every field that a source does not actually
// provide must be null — never inferred, never invented.
export type OpportunityType =
  | "grant"
  | "accelerator"
  | "procurement"
  | "supplier_program"
  | "export_program"
  | "development_finance"
  | "innovation_challenge"
  | "sme_support";

export type OpportunityStatus = "open" | "closing_soon" | "closed" | "forecasted";

export type SourceType = "official_api" | "rss_feed" | "public_web" | "search_fallback" | "demo";

export interface NormalizedOpportunity {
  id: string;
  title: string;
  issuer: string | null;
  country: string | null;
  region: string | null;
  opportunity_type: OpportunityType;
  sector: string[] | null;
  description: string;
  eligibility_summary: string | null;
  requirements: string[] | null;
  deadline: string | null; // ISO date, or null if not published
  opening_date: string | null;
  funding_amount_min: number | null;
  funding_amount_max: number | null;
  currency: string | null;
  source_url: string | null;
  source_name: string;
  source_type: SourceType;
  retrieved_at: string; // ISO datetime
  last_verified_at: string | null;
  confidence: "high" | "medium" | "low";
  status: OpportunityStatus;
  is_demo: boolean;
}

// A structured business profile. Only attributes legitimately relevant to
// eligibility are collected.
export interface OrganizationProfile {
  name: string;
  country: string;
  registrationType:
    | "unregistered"
    | "business_name"
    | "limited_company"
    | "ngo_nonprofit"
    | "cooperative";
  companyAgeYears: number | null;
  industry: string;
  revenueStage: "pre_revenue" | "early_revenue" | "growth" | "established";
  employeeSize: "1" | "2-9" | "10-49" | "50-249" | "250+";
  geography: string[];
  fundingStage:
    | "bootstrapped"
    | "pre_seed"
    | "seed"
    | "series_a_plus"
    | "grant_funded"
    | "not_applicable";
  certifications: string[];
  exportStatus: "none" | "exploring" | "active_exporter";
  technologyFocus: boolean;
  documentsOnHand: string[];
}

export type EligibilityVerdict =
  | "likely_eligible"
  | "potentially_eligible"
  | "not_enough_evidence"
  | "likely_ineligible";

export interface EligibilityAssessment {
  opportunityId: string;
  verdict: EligibilityVerdict;
  reasons: string[];
}

export type ApplicationStage =
  | "discovered"
  | "qualified"
  | "preparing"
  | "submitted"
  | "won"
  | "lost"
  | "expired";

export interface TrackedApplication {
  opportunityId: string;
  stage: ApplicationStage;
  updatedAt: string;
  note: string | null;
}

export interface ReadinessItem {
  label: string;
  category: "corporate_documents" | "compliance" | "financial" | "pitch_materials" | "certifications" | "application";
  done: boolean;
}
