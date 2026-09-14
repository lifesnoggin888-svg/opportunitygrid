import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section
        className="relative overflow-hidden border-b border-[var(--color-line)]"
        style={{
          background:
            "radial-gradient(1200px 480px at 15% -10%, rgba(123,79,224,0.16), transparent), radial-gradient(900px 400px at 100% 0%, rgba(201,162,74,0.14), transparent), var(--color-paper)",
        }}
      >
        <div className="og-container relative grid gap-10 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-8">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-purple-soft)]">
              OpportunityGrid
            </p>
            <h1 className="font-serif mt-5 text-4xl leading-[1.1] text-[var(--color-ink)] md:text-5xl">
              <span className="og-metallic">Know</span> what you qualify for, and what it
              takes to act.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-muted)]">
              OpportunityGrid discovers, verifies, and matches African businesses to the
              funding, procurement, accelerator, and development-finance opportunities they
              actually qualify for — then tracks the path from discovery to a submitted
              application.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/profile" className="og-btn-primary">
                Build your business profile
              </Link>
              <Link
                href="/opportunities"
                className="inline-flex items-center justify-center rounded-sm border border-[var(--color-gold)] px-6 py-3 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-gold)]/10"
              >
                Browse opportunities
              </Link>
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="og-glass og-hud-frame p-6">
              <div className="flex items-center gap-2">
                <span className="og-ping relative inline-block h-2 w-2 rounded-full bg-[#4ade80]" />
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-gold-soft)]">
                  Current mode
                </p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white">
                Live procurement data from Nigeria&apos;s Bureau of Public Procurement, alongside
                clearly labeled demonstration records for opportunity classes not yet
                source-integrated. Nothing is ever presented as live when it is not.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="og-royal-section og-circuit">
        <div className="og-scanline" />
        <div className="og-container relative py-20">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-gold-soft)]">
            Operating model
          </p>
          <h2 className="font-serif mt-4 max-w-2xl text-2xl text-white md:text-3xl">
            Discover → Verify → Match → Qualify → Prepare → Track
          </h2>

          <div className="relative mt-16 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            <div
              className="pointer-events-none absolute left-0 right-0 top-6 hidden lg:block"
              style={{ height: 2, background: "linear-gradient(90deg, transparent, var(--color-gold) 10%, var(--color-gold) 90%, transparent)" }}
              aria-hidden
            />
            {[
              { step: "Discover", body: "Retrieve opportunities from approved sources." },
              { step: "Verify", body: "Capture issuer, source, dates, and evidence strength." },
              { step: "Match", body: "Compare against your structured business profile." },
              { step: "Qualify", body: "Likely eligible, potentially eligible, or not enough evidence." },
              { step: "Prepare", body: "A readiness checklist built from real requirements." },
              { step: "Track", body: "Discovered through submitted, won, lost, or expired." },
            ].map((s, i) => (
              <div key={s.step} className="relative flex flex-col items-center text-center">
                <div className={i === 0 ? "og-ping relative" : "relative"}>
                  <div
                    className="og-hex relative z-10 flex h-12 w-12 items-center justify-center font-serif text-sm font-semibold"
                    style={{
                      background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-soft))",
                      color: "var(--color-purple-deep)",
                      boxShadow: "0 0 0 6px rgba(10,6,18,1), 0 0 24px rgba(201,162,74,0.55)",
                    }}
                  >
                    {i + 1}
                  </div>
                </div>
                <span className="mt-3 text-sm font-medium text-white">{s.step}</span>
                <span className="mt-1 hidden text-xs leading-snug text-[var(--color-muted-on-dark)] sm:block">
                  {s.body}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
