import { prisma } from "./prisma";
import type { Company } from "@/data/companies";
import type { Sector } from "@/data/sectors";

export interface PaginatedResult<T> {
  data: T[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export async function getCompanies(): Promise<Company[]> {
  const rows = await prisma.company.findMany({
    orderBy: { investability: "desc" },
  });
  return rows.map((r) => ({
    ...r,
    investors: JSON.parse(r.investors) as string[],
  })) as Company[];
}

export async function getCompaniesPaginated(opts: {
  page?: number;
  pageSize?: number;
  q?: string;
  sectorId?: string;
  stage?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}): Promise<PaginatedResult<Company & { sector?: Sector }>> {
  const { page = 1, pageSize = 10, q, sectorId, stage, sortBy = "investability", order = "desc" } = opts;

  const where: Record<string, unknown> = {};
  if (sectorId) where.sectorId = sectorId;
  if (stage) where.stage = stage;
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { arabicName: { contains: q } },
      { description: { contains: q } },
      { hqCity: { contains: q } },
    ];
  }

  const [rows, total] = await Promise.all([
    prisma.company.findMany({
      where,
      include: { sector: true },
      orderBy: { [sortBy]: order },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.company.count({ where }),
  ]);

  const data = rows.map((r) => ({
    ...r,
    investors: JSON.parse(r.investors) as string[],
  })) as (Company & { sector?: Sector })[];

  return {
    data,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  };
}

export async function getSectors(): Promise<Sector[]> {
  const rows = await prisma.sector.findMany({
    orderBy: { attractiveness: "desc" },
  });
  return rows as Sector[];
}

export async function getSectorsPaginated(opts: {
  page?: number;
  pageSize?: number;
  q?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}): Promise<PaginatedResult<Sector>> {
  const { page = 1, pageSize = 12, q, sortBy = "attractiveness", order = "desc" } = opts;

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { arabicName: { contains: q } },
      { description: { contains: q } },
    ];
  }

  const [rows, total] = await Promise.all([
    prisma.sector.findMany({
      where,
      orderBy: { [sortBy]: order },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.sector.count({ where }),
  ]);

  return {
    data: rows as Sector[],
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  };
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
