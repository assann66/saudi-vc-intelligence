import { getCompanies, getSectors } from "@/lib/db";
import CompaniesView from "./companies-view";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const [companies, sectors] = await Promise.all([getCompanies(), getSectors()]);
  return <CompaniesView companies={companies} sectors={sectors} />;
}
