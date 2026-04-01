import type { Metadata } from "next";
import { companies } from "@/data/companies";
import { sectors } from "@/data/sectors";
import CompanyDeepDivePage from "./company-deep-dive";

export function generateStaticParams() {
  return companies.map((c) => ({ id: c.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const company = companies.find((c) => c.id === params.id);
  if (!company) {
    return { title: "Company Not Found" };
  }
  const sector = sectors.find((s) => s.id === company.sectorId);
  const title = `${company.name} — Saudi VC Deep Dive`;
  const description = `${company.description} ${company.stage} stage, ${company.hqCity}. Investability: ${company.investability}/100. Sector: ${sector?.name ?? company.sectorId}.`;

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
  return <CompanyDeepDivePage />;
}
