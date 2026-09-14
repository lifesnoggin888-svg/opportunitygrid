export default function DemoBanner() {
  return (
    <div className="border-b border-[var(--color-gold)] bg-[#2a2110] text-[var(--color-gold-soft)]">
      <div className="og-container flex items-center gap-2 py-2 text-xs font-medium">
        <span aria-hidden>&#9888;</span>
        <span>
          Demonstration data — not a live funding recommendation. Every opportunity below is
          fictional and labeled for demo purposes only.
        </span>
      </div>
    </div>
  );
}
