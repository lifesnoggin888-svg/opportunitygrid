export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-paper-dim)]">
      <div className="og-container flex flex-col gap-2 py-8 text-xs text-[var(--color-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>
          OpportunityGrid is RoyalGrid Technologies&apos; flagship platform. &copy; {year} RoyalGrid
          Technologies.
        </p>
        <p>Currently running in DEMO_MODE.</p>
      </div>
    </footer>
  );
}
