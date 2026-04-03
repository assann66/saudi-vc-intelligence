import { notFound } from "next/navigation";
import { getCompanyById, getSectorById, getCompaniesBySector } from "@/lib/db";
import CompanyDeepDivePage from "./company-deep-dive";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const company = await getCompanyById(params.id);
  if (!company) notFound();
  const sector = await getSectorById(company.sectorId);
  const sectorCompanies = await getCompaniesBySector(company.sectorId);
  return <CompanyDeepDivePage company={company} sector={sector} sectorCompanies={sectorCompanies} />;
}
