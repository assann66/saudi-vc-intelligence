import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Companies — Saudi VC Portfolio Directory",
  description:
    "Browse 28+ venture-backed companies across Saudi Arabia's startup ecosystem. Filter by sector, stage, and investability score.",
  openGraph: {
    title: "Companies — Saudi VC Portfolio Directory",
    description:
      "Browse 28+ venture-backed companies across Saudi Arabia's startup ecosystem. Filter by sector, stage, and investability score.",
  },
};

export default function CompaniesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
