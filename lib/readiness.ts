import type { NormalizedOpportunity, OrganizationProfile, ReadinessItem } from "@/lib/types";

/**
 * Generates a readiness checklist from an opportunity's own published
 * requirements plus baseline documents implied by its type — never a
 * fabricated requirement the opportunity did not actually list or imply.
 */
export function buildReadinessChecklist(
  opportunity: NormalizedOpportunity,
  profile: OrganizationProfile
): ReadinessItem[] {
  const items: ReadinessItem[] = [];

  for (const req of opportunity.requirements ?? []) {
    const category = categorize(req);
    items.push({
      label: req,
      category,
      done: profile.documentsOnHand.some((d) => d.toLowerCase() === req.toLowerCase()),
    });
  }

  if (profile.registrationType === "unregistered") {
    items.unshift({
      label: "Business registration (at minimum a CAC Business Name)",
      category: "corporate_documents",
      done: false,
    });
  }

  if (items.length === 0) {
    items.push({
      label: "This opportunity does not publish specific requirements — contact the issuer directly before preparing documents.",
      category: "application",
      done: false,
    });
  }

  return items;
}

function categorize(requirement: string): ReadinessItem["category"] {
  const r = requirement.toLowerCase();
  if (r.includes("financial") || r.includes("bank statement") || r.includes("audited")) return "financial";
  if (r.includes("certificate") || r.includes("certification") || r.includes("compliance") || r.includes("clearance")) return "compliance";
  if (r.includes("pitch") || r.includes("deck")) return "pitch_materials";
  if (r.includes("cac") || r.includes("incorporation") || r.includes("profile")) return "corporate_documents";
  return "application";
}
