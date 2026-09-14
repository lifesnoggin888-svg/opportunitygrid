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
    <header
      className="sticky top-0 z-50 border-b border-[rgba(201,162,74,0.25)] backdrop-blur"
      style={{
        background: "linear-gradient(180deg, rgba(10,6,18,0.97), rgba(26,12,56,0.94))",
      }}
    >
      <div className="og-container flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-2" onClick={() => setOpen(false)}>
          <span className="font-serif text-lg tracking-tight text-white">
            Opportunity<span className="text-[var(--color-gold-soft)]">Grid</span>
          </span>
        </Link>

        <nav className="hidden sm:flex flex-1 items-center gap-6">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors ${
                  active ? "text-white font-medium" : "text-[var(--color-muted-on-dark)] hover:text-[var(--color-gold-soft)]"
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
          className="sm:hidden flex h-10 w-10 items-center justify-center rounded-sm border border-[rgba(201,162,74,0.35)]"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <div className="flex flex-col gap-1.5">
            <span className={`block h-px w-5 bg-[var(--color-gold-soft)] transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`block h-px w-5 bg-[var(--color-gold-soft)] transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {open && (
        <div className="sm:hidden border-t border-[rgba(201,162,74,0.25)]" style={{ background: "var(--color-ink)" }}>
          <nav className="og-container flex flex-col py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base text-white border-b border-[rgba(201,162,74,0.15)] last:border-none"
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
