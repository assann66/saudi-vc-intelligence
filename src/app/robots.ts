import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://assann66.github.io/saudi-vc-intelligence/sitemap.xml",
  };
}
