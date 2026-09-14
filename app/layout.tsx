import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DemoBanner from "@/components/DemoBanner";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-rg-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-rg-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = "https://opportunitygrid.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OpportunityGrid — African Opportunity Discovery, Matching & Readiness",
    template: "%s | OpportunityGrid",
  },
  description:
    "OpportunityGrid discovers, verifies, and matches African businesses to funding, procurement, accelerator, and development-finance opportunities they qualify for, then tracks the path from discovery to a submitted application.",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "OpportunityGrid",
    title: "OpportunityGrid — African Opportunity Discovery, Matching & Readiness",
    description:
      "Discover, verify, and act on the opportunities your business actually qualifies for. A RoyalGrid Technologies platform.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  icons: { icon: "/icon.svg" },
};

export const viewport = {
  themeColor: "#0e1512",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <DemoBanner />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
