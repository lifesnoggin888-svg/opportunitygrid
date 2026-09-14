import { NextResponse } from "next/server";
import { getLiveProcurementOpportunities } from "@/lib/adapters/ocdsAdapter";

// Real, live data — not demo. Nigeria's Bureau of Public Procurement open
// contracting data, fetched fresh on each call (cached by the platform's
// default fetch cache for a short window, not stored).
export async function GET() {
  try {
    const opportunities = await getLiveProcurementOpportunities(20);
    return NextResponse.json({ opportunities, source: "ng-bpp-ocds", fetched_at: new Date().toISOString() });
  } catch {
    return NextResponse.json({ opportunities: [], source: "ng-bpp-ocds", error: "Live source temporarily unavailable" });
  }
}
