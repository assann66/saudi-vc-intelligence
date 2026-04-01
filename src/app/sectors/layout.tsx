import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sectors — Saudi VC Market Analysis",
  description:
    "Explore 10 key investment sectors in Saudi Arabia: FinTech, E-Commerce, HealthTech, EdTech, and more. Attractiveness scores, funding data, and Vision 2030 alignment.",
  openGraph: {
    title: "Sectors — Saudi VC Market Analysis",
    description:
      "Explore 10 key investment sectors in Saudi Arabia: FinTech, E-Commerce, HealthTech, EdTech, and more. Attractiveness scores, funding data, and Vision 2030 alignment.",
  },
};

export default function SectorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
