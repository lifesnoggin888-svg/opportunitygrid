"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { loadProfile, saveProfile } from "@/lib/store";
import type { OrganizationProfile } from "@/lib/types";

const DEFAULT_PROFILE: OrganizationProfile = {
  name: "",
  country: "Nigeria",
  registrationType: "business_name",
  companyAgeYears: null,
  industry: "",
  revenueStage: "early_revenue",
  employeeSize: "1",
  geography: ["Nigeria"],
  fundingStage: "bootstrapped",
  certifications: [],
  exportStatus: "none",
  technologyFocus: false,
  documentsOnHand: [],
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<OrganizationProfile>(DEFAULT_PROFILE);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = loadProfile();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration-safe read from localStorage, unavailable during SSR
    if (existing) setProfile(existing);
  }, []);

  function update<K extends keyof OrganizationProfile>(key: K, value: OrganizationProfile[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
    setSaved(false);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    saveProfile(profile);
    setSaved(true);
  }

  return (
    <section className="og-container py-16">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-purple-soft)]">
        Business profile
      </p>
      <h1 className="font-serif mt-3 text-2xl text-[var(--color-ink)] md:text-3xl">
        Only attributes relevant to eligibility.
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-muted)]">
        Stored only in this browser for now — OpportunityGrid does not yet have a live backend
        (see the About page). Nothing here is sent anywhere.
      </p>

      <form onSubmit={handleSubmit} className="og-card mt-10 grid max-w-2xl gap-6 p-8 md:p-10">
        <Field label="Business name">
          <input
            required
            value={profile.name}
            onChange={(e) => update("name", e.target.value)}
            className="og-input"
          />
        </Field>

        <Field label="Country">
          <select value={profile.country} onChange={(e) => update("country", e.target.value)} className="og-input">
            <option value="Nigeria">Nigeria</option>
            <option value="Ghana">Ghana</option>
            <option value="Kenya">Kenya</option>
            <option value="South Africa">South Africa</option>
            <option value="Other">Other</option>
          </select>
        </Field>

        <Field label="Registration type">
          <select
            value={profile.registrationType}
            onChange={(e) => update("registrationType", e.target.value as OrganizationProfile["registrationType"])}
            className="og-input"
          >
            <option value="unregistered">Not yet registered</option>
            <option value="business_name">Business Name</option>
            <option value="limited_company">Limited Company</option>
            <option value="ngo_nonprofit">NGO / Nonprofit</option>
            <option value="cooperative">Cooperative</option>
          </select>
        </Field>

        <Field label="Company age (years)">
          <input
            type="number"
            min={0}
            value={profile.companyAgeYears ?? ""}
            onChange={(e) => update("companyAgeYears", e.target.value ? Number(e.target.value) : null)}
            className="og-input"
          />
        </Field>

        <Field label="Industry / sector">
          <input
            required
            placeholder="e.g. Agribusiness, Fintech, Manufacturing"
            value={profile.industry}
            onChange={(e) => update("industry", e.target.value)}
            className="og-input"
          />
        </Field>

        <Field label="Revenue stage">
          <select
            value={profile.revenueStage}
            onChange={(e) => update("revenueStage", e.target.value as OrganizationProfile["revenueStage"])}
            className="og-input"
          >
            <option value="pre_revenue">Pre-revenue</option>
            <option value="early_revenue">Early revenue</option>
            <option value="growth">Growth</option>
            <option value="established">Established</option>
          </select>
        </Field>

        <Field label="Employee size">
          <select
            value={profile.employeeSize}
            onChange={(e) => update("employeeSize", e.target.value as OrganizationProfile["employeeSize"])}
            className="og-input"
          >
            <option value="1">1 (solo founder)</option>
            <option value="2-9">2–9</option>
            <option value="10-49">10–49</option>
            <option value="50-249">50–249</option>
            <option value="250+">250+</option>
          </select>
        </Field>

        <Field label="Export status">
          <select
            value={profile.exportStatus}
            onChange={(e) => update("exportStatus", e.target.value as OrganizationProfile["exportStatus"])}
            className="og-input"
          >
            <option value="none">No export activity</option>
            <option value="exploring">Exploring export</option>
            <option value="active_exporter">Active exporter</option>
          </select>
        </Field>

        <Field label="Technology-focused business?">
          <label className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
            <input
              type="checkbox"
              checked={profile.technologyFocus}
              onChange={(e) => update("technologyFocus", e.target.checked)}
            />
            Yes, our core product/service is a technology product
          </label>
        </Field>

        <Field label="Documents currently on hand (comma-separated)">
          <input
            placeholder="e.g. CAC certificate, Business plan"
            value={profile.documentsOnHand.join(", ")}
            onChange={(e) =>
              update(
                "documentsOnHand",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
            className="og-input"
          />
        </Field>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="og-btn-primary"
          >
            Save profile
          </button>
          {saved && (
            <span className="text-sm text-[var(--color-good)]">
              Saved. <button type="button" onClick={() => router.push("/opportunities")} className="underline">See your matches &rarr;</button>
            </span>
          )}
        </div>
      </form>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-[var(--color-ink)]">{label}</span>
      {children}
    </label>
  );
}
