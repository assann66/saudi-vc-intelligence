import { getCompanies, getSectors } from "@/lib/db";
import DashboardView from "./dashboard-view";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [sectors, companies] = await Promise.all([getSectors(), getCompanies()]);
  return <DashboardView sectors={sectors} companies={companies} />;
}
