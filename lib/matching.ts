import type { EligibilityAssessment, NormalizedOpportunity, OrganizationProfile } from "@/lib/types";

/**
 * Deterministic, rule-based eligibility matching. This function never calls
 * an LLM and never invents a qualification — it only reasons over fields
 * that are actually present on both the opportunity and the profile. Any
 * field it cannot evaluate contributes to a "not enough evidence" verdict,
 * not a guess in either direction.
 */
export function assessEligibility(
  opportunity: NormalizedOpportunity,
  profile: OrganizationProfile
): EligibilityAssessment {
  const reasons: string[] = [];
  let hasDisqualifier = false;
  let hasUnknown = false;

  // Country match
  if (opportunity.country) {
    if (opportunity.country !== profile.country) {
      hasDisqualifier = true;
      reasons.push(`Opportunity targets ${opportunity.country}; your profile is registered in ${profile.country}.`);
    } else {
      reasons.push(`Country matches (${profile.country}).`);
    }
  } else {
    hasUnknown = true;
    reasons.push("Opportunity does not publish a target country — cannot confirm geographic eligibility.");
  }

  // Registration type: most programs listed here require at least a Business Name
  if (profile.registrationType === "unregistered") {
    hasUnknown = true;
    reasons.push("Your organization is not yet registered — most programs require at least a registered Business Name; verify this specific opportunity's requirement directly.");
  }

  // Sector match, when both sides specify one
  if (opportunity.sector && opportunity.sector.length > 0 && !opportunity.sector.includes("Any")) {
    const sectorMatch = opportunity.sector.some(
      (s) => s.toLowerCase() === profile.industry.toLowerCase()
    );
    if (!sectorMatch) {
      hasUnknown = true;
      reasons.push(`Opportunity lists sectors (${opportunity.sector.join(", ")}) that do not explicitly include "${profile.industry}" — verify fit directly.`);
    } else {
      reasons.push(`Sector matches (${profile.industry}).`);
    }
  }

  // Export-specific programs
  if (opportunity.opportunity_type === "export_program" && profile.exportStatus === "none") {
    hasUnknown = true;
    reasons.push("This is an export program and your profile indicates no current export activity — many export-readiness programs accept this, but verify directly.");
  }

  // Technology-focused opportunities
  if (
    (opportunity.sector ?? []).some((s) =>
      ["Fintech", "Healthtech", "Agritech", "Climate Tech"].includes(s)
    ) &&
    !profile.technologyFocus
  ) {
    hasUnknown = true;
    reasons.push("Opportunity favors technology-sector applicants and your profile does not indicate a technology focus.");
  }

  // Deadline check
  if (opportunity.deadline) {
    const deadline = new Date(opportunity.deadline);
    if (deadline.getTime() < Date.now()) {
      hasDisqualifier = true;
      reasons.push(`Deadline (${opportunity.deadline}) has passed.`);
    }
  } else {
    hasUnknown = true;
    reasons.push("No deadline published — cannot confirm the opportunity is still open.");
  }

  if (hasDisqualifier) {
    return { opportunityId: opportunity.id, verdict: "likely_ineligible", reasons };
  }
  if (hasUnknown) {
    return { opportunityId: opportunity.id, verdict: "not_enough_evidence", reasons };
  }
  if (reasons.length > 0) {
    return { opportunityId: opportunity.id, verdict: "likely_eligible", reasons };
  }
  return {
    opportunityId: opportunity.id,
    verdict: "not_enough_evidence",
    reasons: ["Insufficient structured data on this opportunity to assess fit."],
  };
}
