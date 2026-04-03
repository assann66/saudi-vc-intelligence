import { getCompanyById, getSectorById, getCompaniesBySector } from "@/lib/db";
import CompanyDeepDivePage from "./company-deep-dive";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const company = await getCompanyById(params.id);
  const sector = company ? await getSectorById(company.sectorId) : null;
  const sectorCompanies = company ? await getCompaniesBySector(company.sectorId) : [];
  return <CompanyDeepDivePage company={company} sector={sector} sectorCompanies={sectorCompanies} />;
}
