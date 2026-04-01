import type { Metadata } from "next";
import { sectors } from "@/data/sectors";
import { formatCurrency } from "@/lib/utils";
import SectorDeepDivePage from "./sector-deep-dive";

export function generateStaticParams() {
  return sectors.map((s) => ({ id: s.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const sector = sectors.find((s) => s.id === params.id);
  if (!sector) {
    return { title: "Sector Not Found" };
  }
  const title = `${sector.name} — Saudi VC Sector Analysis`;
  const description = `${sector.description} Attractiveness: ${sector.attractiveness}/100. Total funding: ${formatCurrency(sector.totalFunding)}. ${sector.companyCount} companies tracked.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default function Page() {
  return <SectorDeepDivePage />;
}
