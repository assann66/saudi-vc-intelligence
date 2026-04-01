import type { MetadataRoute } from "next";
import { companies } from "@/data/companies";
import { sectors } from "@/data/sectors";

const base = "https://assann66.github.io/saudi-vc-intelligence";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/companies`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/sectors`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/rankings`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/reports`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/risk-insights`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/compare`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const companyRoutes: MetadataRoute.Sitemap = companies.map((c) => ({
    url: `${base}/companies/${c.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const sectorRoutes: MetadataRoute.Sitemap = sectors.map((s) => ({
    url: `${base}/sectors/${s.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...companyRoutes, ...sectorRoutes];
}
