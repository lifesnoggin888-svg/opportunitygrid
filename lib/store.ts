"use client";

// Client-side persistence only, scoped to this browser. There is no backend
// yet (see Supabase capacity note in TRANSFER_NOTES.md) — this keeps the
// product genuinely usable in DEMO_MODE without pretending data is shared
// or durable across devices.
import type { ApplicationStage, OrganizationProfile, TrackedApplication } from "@/lib/types";

const PROFILE_KEY = "opportunitygrid.profile.v1";
const PIPELINE_KEY = "opportunitygrid.pipeline.v1";

export function loadProfile(): OrganizationProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as OrganizationProfile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: OrganizationProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadPipeline(): TrackedApplication[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PIPELINE_KEY);
    return raw ? (JSON.parse(raw) as TrackedApplication[]) : [];
  } catch {
    return [];
  }
}

export function savePipeline(pipeline: TrackedApplication[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PIPELINE_KEY, JSON.stringify(pipeline));
}

export function upsertPipelineStage(
  pipeline: TrackedApplication[],
  opportunityId: string,
  stage: ApplicationStage
): TrackedApplication[] {
  const existing = pipeline.find((p) => p.opportunityId === opportunityId);
  const updated: TrackedApplication = {
    opportunityId,
    stage,
    updatedAt: new Date().toISOString(),
    note: existing?.note ?? null,
  };
  const rest = pipeline.filter((p) => p.opportunityId !== opportunityId);
  return [...rest, updated];
}
