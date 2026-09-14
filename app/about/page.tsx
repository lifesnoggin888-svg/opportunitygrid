import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "What OpportunityGrid is today, what DEMO_MODE means, and what's next.",
};

export default function AboutPage() {
  return (
    <section className="og-container py-16">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-gold)]">
        About this build
      </p>
      <h1 className="font-serif mt-3 max-w-2xl text-2xl text-[var(--color-ink)] md:text-3xl">
        What OpportunityGrid is today.
      </h1>

      <div className="mt-8 max-w-2xl space-y-6 text-sm leading-relaxed text-[var(--color-muted)]">
        <p>
          OpportunityGrid is RoyalGrid Technologies&apos; flagship platform. This build
          demonstrates the full discover-verify-match-qualify-prepare-track pipeline end to
          end, running against a fixed set of clearly labeled demonstration opportunities
          rather than live African sources.
        </p>
        <p>
          <span className="font-medium text-[var(--color-ink)]">Why DEMO_MODE first:</span>{" "}
          the matching, readiness, and pipeline-tracking logic needs to work correctly before
          it is worth connecting to real, rate-limited, and terms-of-use-constrained African
          data sources. Every demo opportunity&apos;s issuer name is fictional and marked
          &quot;(Demonstration Program)&quot; so it cannot be mistaken for a real institution.
        </p>
        <p>
          <span className="font-medium text-[var(--color-ink)]">What is real:</span> the
          source-adapter architecture (<code>lib/adapters/</code>) is built to the same
          interface a live source will use, and a first live adapter — scoped web search over
          Nigerian sources via SerpApi — is implemented and activates automatically once a
          <code>SERPAPI_KEY</code> is configured on the server. Every result it returns keeps
          its real, verifiable source URL; fields it cannot verify (issuer, deadline, funding
          amount) are left null rather than guessed.
        </p>
        <p>
          <span className="font-medium text-[var(--color-ink)]">What is not yet built:</span>{" "}
          there is no live database. Your business profile and pipeline are stored only in
          this browser&apos;s local storage. Multi-tenant accounts, a real Supabase-backed
          schema with row-level security, and institutional/API access are designed (see the
          repository&apos;s <code>supabase/migrations/</code> and{" "}
          <code>docs/product/</code>) but not yet deployed.
        </p>
      </div>

      <Link
        href="/opportunities"
        className="mt-10 inline-flex items-center justify-center rounded-sm bg-[var(--color-ink)] px-6 py-3 text-sm font-medium text-[var(--color-paper)] hover:bg-[var(--color-ink-soft)]"
      >
        Try the demo opportunities
      </Link>
    </section>
  );
}
