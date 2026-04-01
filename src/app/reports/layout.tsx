import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports — Saudi VC Investment Reports",
  description:
    "Generate and view detailed investment reports for Saudi Arabian companies and sectors. AI-powered analysis covering financials, risk, and market positioning.",
  openGraph: {
    title: "Reports — Saudi VC Investment Reports",
    description:
      "Generate and view detailed investment reports for Saudi Arabian companies and sectors. AI-powered analysis covering financials, risk, and market positioning.",
  },
};

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
