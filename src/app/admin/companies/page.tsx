import { prisma } from "@/lib/prisma";
import { AdminCompaniesView } from "./admin-companies-view";

export const dynamic = "force-dynamic";

export default async function AdminCompaniesPage() {
  const [companies, sectors] = await Promise.all([
    prisma.company.findMany({
      include: { sector: true },
      orderBy: { name: "asc" },
    }),
    prisma.sector.findMany({ orderBy: { name: "asc" } }),
  ]);

  const parsed = companies.map((c) => ({
    ...c,
    investors: JSON.parse(c.investors) as string[],
  }));

  return <AdminCompaniesView companies={parsed} sectors={sectors} />;
}
