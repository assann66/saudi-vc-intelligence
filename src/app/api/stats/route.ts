import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { companies as staticCompanies } from "@/data/companies";
import { sectors as staticSectors } from "@/data/sectors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [companyCount, sectorCount, companies, sectors] = await Promise.all([
      prisma.company.count(),
      prisma.sector.count(),
      prisma.company.findMany({ select: { totalFunding: true, employees: true } }),
      prisma.sector.findMany({ select: { totalFunding: true, yoyGrowth: true } }),
    ]);

    const totalFunding = sectors.reduce((sum, s) => sum + s.totalFunding, 0);
    const totalEmployees = companies.reduce((sum, c) => sum + c.employees, 0);
    const avgGrowth = sectorCount > 0
      ? Math.round(sectors.reduce((sum, s) => sum + s.yoyGrowth, 0) / sectorCount)
      : 0;

    return NextResponse.json({
      companyCount,
      sectorCount,
      totalFunding,
      totalEmployees,
      avgGrowth,
    });
  } catch {
    const totalFunding = staticSectors.reduce((sum, s) => sum + s.totalFunding, 0);
    const totalEmployees = staticCompanies.reduce((sum, c) => sum + c.employees, 0);
    const avgGrowth = Math.round(staticSectors.reduce((sum, s) => sum + s.yoyGrowth, 0) / staticSectors.length);

    return NextResponse.json({
      companyCount: staticCompanies.length,
      sectorCount: staticSectors.length,
      totalFunding,
      totalEmployees,
      avgGrowth,
    });
  }
}
