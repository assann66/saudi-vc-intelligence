import { notFound } from "next/navigation";
import { getSectorById, getCompaniesBySector } from "@/lib/db";
import SectorDeepDivePage from "./sector-deep-dive";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const sector = await getSectorById(params.id);
  if (!sector) notFound();
  const sectorCompanies = await getCompaniesBySector(sector.id);
  return <SectorDeepDivePage sector={sector} sectorCompanies={sectorCompanies} />;
}
