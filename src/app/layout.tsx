import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { JsonLd } from "@/components/seo/json-ld";
import { Analytics } from "@/components/seo/analytics";

const siteUrl = "https://assann66.github.io/saudi-vc-intelligence";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0f",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Saudi VC Intelligence Platform",
    template: "%s | Saudi VC Intelligence",
  },
  description:
    "AI-powered investment intelligence platform for Saudi Arabian venture capital analysis. Track sectors, companies, and opportunities across the Kingdom's VC ecosystem.",
  keywords: [
    "Saudi Arabia",
    "venture capital",
    "VC intelligence",
    "investment analysis",
    "Vision 2030",
    "startup ecosystem",
    "Saudi VC",
    "fintech",
    "AI analytics",
    "Saudi startups",
    "MENA venture capital",
    "Kingdom of Saudi Arabia",
  ],
  authors: [{ name: "Saudi VC Intelligence" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Saudi VC Intelligence Platform",
    description:
      "AI-powered investment intelligence for the Saudi Arabian venture capital ecosystem. Rankings, reports, and risk insights across 10 sectors and 28+ companies.",
    siteName: "Saudi VC Intelligence",
    images: [
      {
        url: `${siteUrl}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: "Saudi VC Intelligence Platform — AI-powered investment analytics for Saudi Arabia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saudi VC Intelligence Platform",
    description:
      "AI-powered investment intelligence for Saudi Arabian venture capital analysis.",
    images: [`${siteUrl}/og-image.svg`],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: `${siteUrl}/manifest.webmanifest`,
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[#0a0a0f]">
        <JsonLd />
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto scroll-smooth md:ml-0">
            {children}
          </main>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
