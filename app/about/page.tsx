import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "What OpportunityGrid is today, what DEMO_MODE means, and what's next.",
};

export default function AboutPage() {
  return (
    <section className="og-container py-16">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-purple-soft)]">
        About this build
      </p>
      <h1 className="font-serif mt-3 max-w-2xl text-2xl text-[var(--color-ink)] md:text-3xl">
        What OpportunityGrid is today.
      </h1>

      <div className="mt-8 max-w-2xl space-y-6 text-sm leading-relaxed text-[var(--color-muted)]">
        <p>
          OpportunityGrid is RoyalGrid Technologies&apos; flagship platform. This build runs
          the full discover-verify-match-qualify-prepare-track pipeline end to end against two
          kinds of data, always visibly labeled: a fixed set of clearly fictional demonstration
          opportunities, and one real, live African source.
        </p>
        <p>
          <span className="font-medium text-[var(--color-ink)]">What is real and live today:</span>{" "}
          the &quot;Live&quot;-tagged procurement opportunities on the Opportunities page are
          genuine, current Nigerian government tenders — fetched directly from the Bureau of
          Public Procurement&apos;s official open-contracting data (published under the Open
          Contracting Data Standard). No API key, no scraping: it is bulk open government data,
          fetched from its official publisher on every page load. Every field OpportunityGrid
          cannot verify from that data — an eligibility summary, a document requirement — is
          left null rather than guessed, exactly as it is for demo records.
        </p>
        <p>
          <span className="font-medium text-[var(--color-ink)]">Why demo data still exists
          alongside it:</span> Nigeria&apos;s official procurement feed does not (yet) cover
          grants, accelerators, export programs, or the other opportunity classes RoyalGrid
          intends to support — those remain clearly labeled demonstration records until a real
          source for each is integrated. The source-adapter architecture (
          <code>lib/adapters/</code>) is built so each new class plugs in behind the same
          interface as procurement did.
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
        className="og-btn-primary mt-10"
      >
        Try the demo opportunities
      </Link>
    </section>
  );
}
