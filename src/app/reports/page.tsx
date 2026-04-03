import { getCompanies, getSectors } from "@/lib/db";
import ReportsView from "./reports-view";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const [companies, sectors] = await Promise.all([getCompanies(), getSectors()]);
  return <ReportsView companies={companies} sectors={sectors} />;
}
