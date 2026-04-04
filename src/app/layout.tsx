import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { JsonLd } from "@/components/seo/json-ld";
import { Analytics } from "@/components/seo/analytics";
import { SessionProvider } from "@/components/providers/session-provider";

const siteUrl = "https://assann66.github.io/saudi-vc-intelligence";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1E3A5F",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "منصة ذكاء رأس المال الجريء السعودي",
    template: "%s | ذكاء رأس المال الجريء",
  },
  description:
    "منصة ذكاء استثماري مدعومة بالذكاء الاصطناعي لتحليل رأس المال الجريء في المملكة العربية السعودية. تتبع القطاعات والشركات والفرص عبر منظومة رأس المال الجريء في المملكة.",
  keywords: [
    "المملكة العربية السعودية",
    "رأس المال الجريء",
    "ذكاء استثماري",
    "تحليل استثماري",
    "رؤية 2030",
    "منظومة الشركات الناشئة",
    "Saudi VC",
    "fintech",
    "AI analytics",
    "الشركات الناشئة السعودية",
    "رأس المال الجريء في الشرق الأوسط",
    "Kingdom of Saudi Arabia",
  ],
  authors: [{ name: "ذكاء رأس المال الجريء السعودي" }],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: siteUrl,
    title: "منصة ذكاء رأس المال الجريء السعودي",
    description:
      "ذكاء استثماري مدعوم بالذكاء الاصطناعي لمنظومة رأس المال الجريء السعودي. تصنيفات وتقارير ورؤى مخاطر عبر 10 قطاعات و28+ شركة.",
    siteName: "ذكاء رأس المال الجريء السعودي",
    images: [
      {
        url: `${siteUrl}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: "منصة ذكاء رأس المال الجريء السعودي — تحليلات استثمارية مدعومة بالذكاء الاصطناعي",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "منصة ذكاء رأس المال الجريء السعودي",
    description:
      "ذكاء استثماري مدعوم بالذكاء الاصطناعي لتحليل رأس المال الجريء السعودي.",
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
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Tajawal:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#0a0a0f]">
        <SessionProvider>
          <JsonLd />
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto scroll-smooth">
              {children}
            </main>
          </div>
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  );
}
