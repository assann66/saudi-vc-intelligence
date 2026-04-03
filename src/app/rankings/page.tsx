import { getCompanies, getSectors } from "@/lib/db";
import RankingsView from "./rankings-view";

export const dynamic = "force-dynamic";

export default async function RankingsPage() {
  const [companies, sectors] = await Promise.all([getCompanies(), getSectors()]);
  return <RankingsView companies={companies} sectors={sectors} />;
}
