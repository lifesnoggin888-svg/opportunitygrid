"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [mode, setMode] = useState<"sign_in" | "sign_up">("sign_up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [status, setStatus] = useState<{ kind: "idle" | "error" | "info"; message: string }>({ kind: "idle", message: "" });
  const [busy, setBusy] = useState(false);

  if (!supabase) {
    return (
      <section className="og-container py-16">
        <p className="text-sm text-[var(--color-muted)]">
          Accounts are not configured on this deployment yet. OpportunityGrid still works fully in
          DEMO_MODE without signing in — your profile and pipeline are saved to this browser only.
        </p>
      </section>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus({ kind: "idle", message: "" });
    try {
      if (mode === "sign_up") {
        const { data, error } = await supabase!.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) {
          setStatus({
            kind: "info",
            message: "Check your email to confirm your account, then sign in.",
          });
          setMode("sign_in");
          return;
        }
        await fetch("/api/auth/bootstrap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orgName, country: "Nigeria" }),
        });
        router.push("/profile");
      } else {
        const { error } = await supabase!.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await fetch("/api/auth/bootstrap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orgName: orgName || email.split("@")[0], country: "Nigeria" }),
        });
        router.push("/profile");
      }
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="og-container py-16">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-purple-soft)]">Account</p>
      <h1 className="font-serif mt-3 text-2xl text-[var(--color-ink)] md:text-3xl">
        {mode === "sign_up" ? "Create an account" : "Sign in"}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-muted)]">
        Signing in saves your business profile, matches, and pipeline to your organization so they
        persist across devices, instead of just this browser.
      </p>

      <form onSubmit={handleSubmit} className="og-card mt-10 grid max-w-md gap-6 p-8 md:p-10">
        {mode === "sign_up" && (
          <label className="grid gap-2">
            <span className="text-sm font-medium text-[var(--color-ink)]">Business name</span>
            <input value={orgName} onChange={(e) => setOrgName(e.target.value)} className="og-input" required />
          </label>
        )}
        <label className="grid gap-2">
          <span className="text-sm font-medium text-[var(--color-ink)]">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="og-input" required />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-[var(--color-ink)]">Password</span>
          <input
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="og-input"
            required
          />
        </label>

        {status.kind !== "idle" && (
          <p className={status.kind === "error" ? "text-sm text-red-600" : "text-sm text-[var(--color-good)]"}>
            {status.message}
          </p>
        )}

        <div className="flex items-center gap-4 pt-2">
          <button type="submit" disabled={busy} className="og-btn-primary">
            {busy ? "Working…" : mode === "sign_up" ? "Create account" : "Sign in"}
          </button>
          <button
            type="button"
            className="text-sm underline"
            onClick={() => setMode(mode === "sign_up" ? "sign_in" : "sign_up")}
          >
            {mode === "sign_up" ? "Already have an account? Sign in" : "New here? Create an account"}
          </button>
        </div>
      </form>
    </section>
  );
}
