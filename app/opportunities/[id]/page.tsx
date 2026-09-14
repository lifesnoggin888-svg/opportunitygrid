"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { assessEligibility } from "@/lib/matching";
import { buildReadinessChecklist } from "@/lib/readiness";
import { loadPipeline, loadProfile, savePipeline, upsertPipelineStage } from "@/lib/store";
import { useOpportunities } from "@/lib/useOpportunities";
import type { ApplicationStage, OrganizationProfile } from "@/lib/types";

const STAGES: ApplicationStage[] = ["discovered", "qualified", "preparing", "submitted", "won", "lost", "expired"];

export default function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { opportunities, liveStatus } = useOpportunities();
  const opportunity = opportunities.find((o) => o.id === id);
  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [stage, setStage] = useState<ApplicationStage>("discovered");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration-safe read from localStorage, unavailable during SSR
    setProfile(loadProfile());
    const pipeline = loadPipeline();
    const existing = pipeline.find((p) => p.opportunityId === id);
    if (existing) setStage(existing.stage);
  }, [id]);

  if (!opportunity) {
    return (
      <section className="og-container py-16">
        <p className="text-sm text-[var(--color-muted)]">
          {liveStatus === "loading" ? "Loading…" : "Opportunity not found."}
        </p>
        <Link href="/opportunities" className="mt-4 inline-block text-sm text-[var(--color-purple-soft)] underline">
          &larr; Back to opportunities
        </Link>
      </section>
    );
  }

  const assessment = profile ? assessEligibility(opportunity, profile) : null;
  const checklist = profile ? buildReadinessChecklist(opportunity, profile) : null;

  function handleStageChange(next: ApplicationStage) {
    setStage(next);
    const updated = upsertPipelineStage(loadPipeline(), id, next);
    savePipeline(updated);
  }

  return (
    <section className="og-container py-16">
      <Link href="/opportunities" className="text-sm text-[var(--color-purple-soft)] underline">
        &larr; Back to opportunities
      </Link>

      <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-purple-soft)]">
        {opportunity.opportunity_type.replace(/_/g, " ")}
      </p>
      <h1 className="font-serif mt-2 text-2xl text-[var(--color-ink)] md:text-3xl">{opportunity.title}</h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">
        {opportunity.issuer} &middot; {opportunity.region ?? opportunity.country}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-sm leading-relaxed text-[var(--color-ink)]">{opportunity.description}</p>

          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            <Item label="Eligibility summary" value={opportunity.eligibility_summary} />
            <Item label="Deadline" value={opportunity.deadline} />
            <Item label="Opening date" value={opportunity.opening_date} />
            <Item
              label="Funding range"
              value={
                opportunity.funding_amount_min || opportunity.funding_amount_max
                  ? `${opportunity.currency ?? ""} ${opportunity.funding_amount_min?.toLocaleString() ?? "?"} – ${opportunity.funding_amount_max?.toLocaleString() ?? "?"}`
                  : null
              }
            />
          </dl>

          <div className="og-card mt-8 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">Provenance</p>
            <p className="mt-2 text-sm text-[var(--color-ink)]">
              Source: {opportunity.source_name} ({opportunity.source_type}) &middot; Confidence:{" "}
              {opportunity.confidence} &middot; Retrieved: {new Date(opportunity.retrieved_at).toLocaleDateString()}
            </p>
            {opportunity.is_demo ? (
              <p className="mt-2 text-xs text-[var(--color-purple-soft)]">
                Demonstration record — this issuer and its details are fictional.
              </p>
            ) : (
              <p className="mt-2 text-xs text-[var(--color-good)]">
                Live record — real Nigerian government procurement data, not a demo fixture.
              </p>
            )}
          </div>

          {assessment && (
            <div className="mt-8">
              <h2 className="text-base font-medium text-[var(--color-ink)]">Fit assessment</h2>
              <ul className="mt-3 space-y-2 text-sm text-[var(--color-muted)]">
                {assessment.reasons.map((r, i) => (
                  <li key={i}>— {r}</li>
                ))}
              </ul>
            </div>
          )}

          {checklist && (
            <div className="mt-8">
              <h2 className="text-base font-medium text-[var(--color-ink)]">Readiness checklist</h2>
              <ul className="mt-3 space-y-2">
                {checklist.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        item.done ? "bg-[var(--color-good)]" : "bg-[var(--color-line)]"
                      }`}
                    />
                    <span className={item.done ? "text-[var(--color-ink)]" : "text-[var(--color-muted)]"}>
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!profile && (
            <p className="mt-8 text-sm text-[var(--color-muted)]">
              <Link href="/profile" className="text-[var(--color-purple-soft)] underline">
                Build your business profile
              </Link>{" "}
              to see a fit assessment and readiness checklist here.
            </p>
          )}
        </div>

        <div>
          <div className="og-card p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
              Application pipeline stage
            </p>
            <select
              value={stage}
              onChange={(e) => handleStageChange(e.target.value as ApplicationStage)}
              className="og-input mt-3 w-full"
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <p className="mt-3 text-xs text-[var(--color-muted)]">
              Saved to this browser only. See it alongside every other tracked opportunity on{" "}
              <Link href="/pipeline" className="text-[var(--color-purple-soft)] underline">
                your pipeline
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Item({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">{label}</dt>
      <dd className="mt-1 text-[var(--color-ink)]">{value ?? "Not published"}</dd>
    </div>
  );
}
