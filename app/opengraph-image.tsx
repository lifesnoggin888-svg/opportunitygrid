import { ImageResponse } from "next/og";

export const alt = "OpportunityGrid — African Opportunity Discovery, Matching & Readiness";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0E1512",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#FAF8F4" }}>
          Opportunity<span style={{ color: "#C99A4C" }}>Grid</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 50, color: "#FAF8F4", lineHeight: 1.15, maxWidth: 980 }}>
            Discover, verify, and act on what you qualify for.
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#B9C2BC" }}>
            A RoyalGrid Technologies platform. Currently running in DEMO_MODE.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
