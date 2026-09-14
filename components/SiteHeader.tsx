"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/opportunities", label: "Opportunities" },
  { href: "/profile", label: "Profile" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/about", label: "About" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[var(--color-paper)]/95 backdrop-blur">
      <div className="og-container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="font-serif text-lg tracking-tight text-[var(--color-ink)]">
            Opportunity<span className="text-[var(--color-gold)]">Grid</span>
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors ${
                  active ? "text-[var(--color-ink)] font-medium" : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="sm:hidden flex h-10 w-10 items-center justify-center rounded-sm border border-[var(--color-line)]"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <div className="flex flex-col gap-1.5">
            <span className={`block h-px w-5 bg-[var(--color-ink)] transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`block h-px w-5 bg-[var(--color-ink)] transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {open && (
        <div className="sm:hidden border-t border-[var(--color-line)] bg-[var(--color-paper)]">
          <nav className="og-container flex flex-col py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base text-[var(--color-ink)] border-b border-[var(--color-line)] last:border-none"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
