import { getCompanies, getSectors } from "@/lib/db";
import CompareView from "./compare-view";

export const dynamic = "force-dynamic";

export default async function ComparePage() {
  const [companies, sectors] = await Promise.all([getCompanies(), getSectors()]);
  return <CompareView companies={companies} sectors={sectors} />;
}
