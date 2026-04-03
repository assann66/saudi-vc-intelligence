import { getCompanies, getSectors } from "@/lib/db";
import SectorsView from "./sectors-view";

export const dynamic = "force-dynamic";

export default async function SectorsPage() {
  const [sectors, companies] = await Promise.all([getSectors(), getCompanies()]);
  return <SectorsView sectors={sectors} companies={companies} />;
}
