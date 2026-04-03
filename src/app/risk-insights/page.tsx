import { getCompanies, getSectors } from "@/lib/db";
import RiskInsightsView from "./risk-insights-view";

export const dynamic = "force-dynamic";

export default async function RiskInsightsPage() {
  const [companies, sectors] = await Promise.all([getCompanies(), getSectors()]);
  return <RiskInsightsView companies={companies} sectors={sectors} />;
}
