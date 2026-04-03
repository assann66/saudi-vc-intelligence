import { prisma } from "./prisma";
import type { Company } from "@/data/companies";
import type { Sector } from "@/data/sectors";

export async function getCompanies(): Promise<Company[]> {
  const rows = await prisma.company.findMany({
    orderBy: { investability: "desc" },
  });
  return rows.map((r) => ({
    ...r,
    investors: JSON.parse(r.investors) as string[],
  })) as Company[];
}

export async function getSectors(): Promise<Sector[]> {
  const rows = await prisma.sector.findMany({
    orderBy: { attractiveness: "desc" },
  });
  return rows as Sector[];
}

export async function getCompanyById(id: string): Promise<Company | null> {
  const row = await prisma.company.findUnique({ where: { id } });
  if (!row) return null;
  return { ...row, investors: JSON.parse(row.investors) as string[] } as Company;
}

export async function getSectorById(id: string): Promise<Sector | null> {
  const row = await prisma.sector.findUnique({ where: { id } });
  return row as Sector | null;
}

export async function getCompaniesBySector(sectorId: string): Promise<Company[]> {
  const rows = await prisma.company.findMany({
    where: { sectorId },
    orderBy: { investability: "desc" },
  });
  return rows.map((r) => ({
    ...r,
    investors: JSON.parse(r.investors) as string[],
  })) as Company[];
}
