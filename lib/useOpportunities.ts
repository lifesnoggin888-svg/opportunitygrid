"use client";

import { useEffect, useState } from "react";
import { DEMO_OPPORTUNITIES } from "@/lib/data/demo-opportunities";
import type { NormalizedOpportunity } from "@/lib/types";

interface UseOpportunitiesResult {
  opportunities: NormalizedOpportunity[];
  liveStatus: "loading" | "ok" | "unavailable";
}

/**
 * Combines the static demo set with live results from the real Nigeria BPP
 * open-contracting source. If the live fetch fails or is slow, the demo set
 * is still shown immediately — the product never blocks on a live source.
 */
export function useOpportunities(): UseOpportunitiesResult {
  const [live, setLive] = useState<NormalizedOpportunity[]>([]);
  const [liveStatus, setLiveStatus] = useState<UseOpportunitiesResult["liveStatus"]>("loading");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/opportunities/live")
      .then((r) => r.json())
      .then((data: { opportunities?: NormalizedOpportunity[] }) => {
        if (cancelled) return;
        setLive(data.opportunities ?? []);
        setLiveStatus((data.opportunities?.length ?? 0) > 0 ? "ok" : "unavailable");
      })
      .catch(() => {
        if (cancelled) return;
        setLiveStatus("unavailable");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { opportunities: [...live, ...DEMO_OPPORTUNITIES], liveStatus };
}
