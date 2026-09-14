"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadPipeline } from "@/lib/store";
import { useOpportunities } from "@/lib/useOpportunities";
import type { ApplicationStage, TrackedApplication } from "@/lib/types";

const STAGE_ORDER: ApplicationStage[] = ["discovered", "qualified", "preparing", "submitted", "won", "lost", "expired"];

export default function PipelinePage() {
  const [pipeline, setPipeline] = useState<TrackedApplication[]>([]);
  const { opportunities } = useOpportunities();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration-safe read from localStorage, unavailable during SSR
    setPipeline(loadPipeline());
  }, []);

  return (
    <section className="og-container py-16">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-purple-soft)]">
        Pipeline
      </p>
      <h1 className="font-serif mt-3 text-2xl text-[var(--color-ink)] md:text-3xl">
        Your tracked applications
      </h1>

      {pipeline.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--color-muted)]">
          Nothing tracked yet.{" "}
          <Link href="/opportunities" className="text-[var(--color-purple-soft)] underline">
            Browse opportunities
          </Link>{" "}
          and set a stage from any detail page.
        </p>
      ) : (
        <div className="mt-8 grid gap-px overflow-hidden rounded-sm border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-4">
          {STAGE_ORDER.map((stage) => {
            const items = pipeline.filter((p) => p.stage === stage);
            return (
              <div key={stage} className="og-card p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
                  {stage} ({items.length})
                </p>
                <ul className="mt-3 space-y-2">
                  {items.map((item) => {
                    const opp = opportunities.find((o) => o.id === item.opportunityId);
                    return (
                      <li key={item.opportunityId}>
                        <Link
                          href={`/opportunities/${item.opportunityId}`}
                          className="text-sm text-[var(--color-ink)] hover:text-[var(--color-purple)]"
                        >
                          {opp?.title ?? item.opportunityId}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
