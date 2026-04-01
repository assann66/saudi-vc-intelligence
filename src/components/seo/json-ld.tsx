const siteUrl = "https://assann66.github.io/saudi-vc-intelligence";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Saudi VC Intelligence Platform",
  url: siteUrl,
  description:
    "AI-powered investment intelligence platform for Saudi Arabian venture capital analysis.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/companies`,
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Saudi VC Intelligence",
  url: siteUrl,
  description:
    "AI-powered investment intelligence for the Saudi Arabian venture capital ecosystem. Rankings, reports, and risk insights across 10 sectors and 28+ companies.",
  areaServed: {
    "@type": "Country",
    name: "Saudi Arabia",
  },
};

const datasetSchema = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "Saudi VC Intelligence Data",
  description:
    "Comprehensive dataset of Saudi Arabian venture capital investments, companies, and sector analysis aligned with Vision 2030.",
  url: siteUrl,
  keywords: [
    "Saudi Arabia",
    "venture capital",
    "Vision 2030",
    "startup ecosystem",
    "investment data",
  ],
  spatialCoverage: "Saudi Arabia",
  temporalCoverage: "2020/..",
};

export function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
    </>
  );
}
