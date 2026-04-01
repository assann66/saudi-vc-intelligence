import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Risk Insights — Saudi VC Risk Analysis",
  description:
    "Comprehensive risk analysis dashboard for Saudi Arabian venture capital. Evaluate regulatory, market, operational, and financial risks across sectors and companies.",
  openGraph: {
    title: "Risk Insights — Saudi VC Risk Analysis",
    description:
      "Comprehensive risk analysis dashboard for Saudi Arabian venture capital. Evaluate regulatory, market, operational, and financial risks across sectors and companies.",
  },
};

export default function RiskInsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
