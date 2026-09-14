"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { assessEligibility } from "@/lib/matching";
import { loadProfile } from "@/lib/store";
import { useOpportunities } from "@/lib/useOpportunities";
import type { EligibilityVerdict, OrganizationProfile } from "@/lib/types";

const VERDICT_LABEL: Record<EligibilityVerdict, string> = {
  likely_eligible: "Likely eligible",
  potentially_eligible: "Potentially eligible",
  not_enough_evidence: "Not enough evidence",
  likely_ineligible: "Likely ineligible",
};

const VERDICT_COLOR: Record<EligibilityVerdict, string> = {
  likely_eligible: "var(--color-good)",
  potentially_eligible: "var(--color-gold)",
  not_enough_evidence: "var(--color-muted)",
  likely_ineligible: "var(--color-bad)",
};

export default function OpportunitiesPage() {
  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const { opportunities, liveStatus } = useOpportunities();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration-safe read from localStorage, unavailable during SSR
    setProfile(loadProfile());
  }, []);

  const filtered = useMemo(
    () =>
      typeFilter === "all"
        ? opportunities
        : opportunities.filter((o) => o.opportunity_type === typeFilter),
    [typeFilter, opportunities]
  );

  return (
    <section className="og-container py-16">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-gold)]">
        Opportunities
      </p>
      <h1 className="font-serif mt-3 text-2xl text-[var(--color-ink)] md:text-3xl">
        {profile ? `Matched against ${profile.name || "your profile"}` : "Opportunities"}
      </h1>
      {!profile && (
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-muted)]">
          <Link href="/profile" className="text-[var(--color-gold)] underline">
            Build your business profile
          </Link>{" "}
          to see a fit assessment against each opportunity below.
        </p>
      )}

      <p className="mt-4 text-xs text-[var(--color-muted)]">
        {liveStatus === "loading" && "Checking Nigeria's live procurement source…"}
        {liveStatus === "ok" && "Live records below are real, current Nigerian government procurement data (Bureau of Public Procurement). Everything else is demonstration data."}
        {liveStatus === "unavailable" && "Live source temporarily unavailable — showing demonstration data only."}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {["all", "grant", "accelerator", "procurement", "supplier_program", "export_program", "development_finance", "innovation_challenge", "sme_support"].map(
          (t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`rounded-full border px-3 py-1.5 text-xs ${
                typeFilter === t
                  ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
                  : "border-[var(--color-line)] text-[var(--color-ink)]"
              }`}
            >
              {t === "all" ? "All" : t.replace(/_/g, " ")}
            </button>
          )
        )}
      </div>

      <div className="mt-10 grid gap-4">
        {filtered.map((opp) => {
          const assessment = profile ? assessEligibility(opp, profile) : null;
          return (
            <Link
              key={opp.id}
              href={`/opportunities/${opp.id}`}
              className="flex flex-col gap-3 rounded-sm border border-[var(--color-line)] bg-[var(--color-paper)] p-6 transition-colors hover:border-[var(--color-gold)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-medium text-[var(--color-ink)]">{opp.title}</h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                      opp.is_demo
                        ? "bg-[var(--color-paper-dim)] text-[var(--color-muted)]"
                        : "bg-[var(--color-good)] text-[var(--color-paper)]"
                    }`}
                  >
                    {opp.is_demo ? "Demo" : "Live"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {opp.issuer} &middot; {opp.region ?? opp.country}
                </p>
                {opp.deadline && (
                  <p className="mt-1 text-xs text-[var(--color-muted)]">Deadline: {opp.deadline}</p>
                )}
              </div>
              {assessment && (
                <span
                  className="inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-medium"
                  style={{ borderColor: VERDICT_COLOR[assessment.verdict], color: VERDICT_COLOR[assessment.verdict] }}
                >
                  {VERDICT_LABEL[assessment.verdict]}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
