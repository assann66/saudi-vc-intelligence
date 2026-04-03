import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const [companyCount, sectorCount, companies, sectors] = await Promise.all([
    prisma.company.count(),
    prisma.sector.count(),
    prisma.company.findMany({ select: { totalFunding: true, employees: true } }),
    prisma.sector.findMany({ select: { totalFunding: true, yoyGrowth: true } }),
  ]);

  const totalFunding = sectors.reduce((sum, s) => sum + s.totalFunding, 0);
  const totalEmployees = companies.reduce((sum, c) => sum + c.employees, 0);
  const avgGrowth = sectors.reduce((sum, s) => sum + s.yoyGrowth, 0) / sectorCount;

  return NextResponse.json({
    companyCount,
    sectorCount,
    totalFunding,
    totalEmployees,
    avgGrowth: Math.round(avgGrowth),
  });
}
