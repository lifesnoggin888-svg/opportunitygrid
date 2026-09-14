import Link from "next/link";

const STEPS = [
  { step: "Discover", body: "Retrieve opportunities from approved sources." },
  { step: "Verify", body: "Capture issuer, source, dates, and evidence strength." },
  { step: "Match", body: "Compare against your structured business profile." },
  { step: "Qualify", body: "Likely eligible, potentially eligible, or not enough evidence." },
  { step: "Prepare", body: "A readiness checklist built from real requirements." },
  { step: "Track", body: "Discovered through submitted, won, lost, or expired." },
];

export default function HomePage() {
  return (
    <>
      <section className="border-b border-[var(--color-line)]">
        <div className="og-container grid gap-10 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-8">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-gold)]">
              OpportunityGrid
            </p>
            <h1 className="font-serif mt-5 text-4xl leading-[1.1] text-[var(--color-ink)] md:text-5xl">
              Know what you qualify for, and what it takes to act.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-muted)]">
              OpportunityGrid discovers, verifies, and matches African businesses to the
              funding, procurement, accelerator, and development-finance opportunities they
              actually qualify for — then tracks the path from discovery to a submitted
              application.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/profile"
                className="inline-flex items-center justify-center rounded-sm bg-[var(--color-ink)] px-6 py-3 text-sm font-medium text-[var(--color-paper)] hover:bg-[var(--color-ink-soft)]"
              >
                Build your business profile
              </Link>
              <Link
                href="/opportunities"
                className="inline-flex items-center justify-center rounded-sm border border-[var(--color-ink)] px-6 py-3 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-paper-dim)]"
              >
                Browse demo opportunities
              </Link>
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="rounded-sm border border-[var(--color-line)] bg-[var(--color-paper-dim)] p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
                Current mode
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]">
                DEMO_MODE — all opportunities shown are fictional, hand-authored records used to
                demonstrate the matching, readiness, and tracking pipeline before live African
                source integrations ship.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-paper-dim)]">
        <div className="og-container py-16">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-gold)]">
            Operating model
          </p>
          <div className="mt-8 grid gap-px overflow-hidden rounded-sm border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.step} className="bg-[var(--color-paper)] p-6">
                <span className="font-serif text-sm text-[var(--color-gold)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-base font-medium text-[var(--color-ink)]">{s.step}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
