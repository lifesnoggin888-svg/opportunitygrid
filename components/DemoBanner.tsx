export default function DemoBanner() {
  return (
    <div className="border-b border-[var(--color-gold)] bg-[#2a2110] text-[var(--color-gold-soft)]">
      <div className="og-container flex items-center gap-2 py-2 text-xs font-medium">
        <span aria-hidden>&#9888;</span>
        <span>
          &quot;Live&quot;-tagged records are real Nigerian government data. Everything else is
          demonstration data, not a funding recommendation — check each record&apos;s tag.
        </span>
      </div>
    </div>
  );
}
