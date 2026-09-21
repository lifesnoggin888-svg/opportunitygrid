"use client";

import { createBrowserClient } from "@supabase/ssr";

// Returns null (not a thrown error) when unset, so pages can fall back to
// localStorage DEMO_MODE instead of crashing when Supabase isn't configured.
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}
