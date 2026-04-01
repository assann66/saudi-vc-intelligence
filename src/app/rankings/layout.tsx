import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rankings — Top Saudi VC Companies & Sectors",
  description:
    "AI-ranked leaderboard of Saudi Arabia's top venture-backed companies and sectors by investability, growth rate, risk score, and Vision 2030 alignment.",
  openGraph: {
    title: "Rankings — Top Saudi VC Companies & Sectors",
    description:
      "AI-ranked leaderboard of Saudi Arabia's top venture-backed companies and sectors by investability, growth rate, risk score, and Vision 2030 alignment.",
  },
};

export default function RankingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
