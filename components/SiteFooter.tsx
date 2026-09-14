export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="border-t border-[rgba(201,162,74,0.25)]"
      style={{ background: "linear-gradient(180deg, var(--color-ink), var(--color-purple-deep))" }}
    >
      <div className="og-container flex flex-col gap-2 py-8 text-xs text-[var(--color-muted-on-dark)] sm:flex-row sm:items-center sm:justify-between">
        <p>
          Opportunity<span className="text-[var(--color-gold-soft)]">Grid</span> is RoyalGrid
          Technologies&apos; flagship platform. &copy; {year} RoyalGrid Technologies.
        </p>
        <p>Live procurement data + demonstration records for other opportunity classes.</p>
      </div>
    </footer>
  );
}
