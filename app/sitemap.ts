import type { MetadataRoute } from "next";

const BASE_URL = "https://opportunitygrid.vercel.app";
const ROUTES = ["", "/opportunities", "/profile", "/pipeline", "/about"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.6,
  }));
}
