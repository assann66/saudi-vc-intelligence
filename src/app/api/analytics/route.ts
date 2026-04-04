import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyzeSector } from "@/lib/scoring";
import type { Sector } from "@/data/sectors";
import type { Company } from "@/data/companies";

export const dynamic = "force-dynamic";

function parseCompany(r: Record<string, unknown>): Company {
  return { ...r, investors: JSON.parse(r.investors as string) } as unknown as Company;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sectorId = searchParams.get("sectorId");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const period = searchParams.get("period") || "all";

    const sectorWhere = sectorId ? { id: sectorId } : {};
    const companyWhere = sectorId ? { sectorId } : {};

    const [sectors, companies] = await Promise.all([
      prisma.sector.findMany({ where: sectorWhere, orderBy: { attractiveness: "desc" } }),
      prisma.company.findMany({ where: companyWhere, include: { sector: true }, orderBy: { investability: "desc" } }),
    ]);

    const parsedCompanies = companies.map((c) => parseCompany(c as unknown as Record<string, unknown>));
    const parsedSectors = sectors as unknown as Sector[];

    // Generate AI summaries for each sector
    const sectorAnalyses = parsedSectors.map((sector) => {
      const sectorCompanies = parsedCompanies.filter((c) => c.sectorId === sector.id);
      const analysis = analyzeSector(sector, sectorCompanies);
      return {
        sector,
        analysis,
        companyCount: sectorCompanies.length,
        totalFunding: sectorCompanies.reduce((s, c) => s + c.totalFunding, 0),
        avgInvestability: sectorCompanies.length > 0
          ? Math.round(sectorCompanies.reduce((s, c) => s + c.investability, 0) / sectorCompanies.length)
          : 0,
      };
    });

    // Market overview summary
    const totalFunding = parsedSectors.reduce((s, sec) => s + sec.totalFunding, 0);
    const avgAttractiveness = parsedSectors.length > 0
      ? Math.round(parsedSectors.reduce((s, sec) => s + sec.attractiveness, 0) / parsedSectors.length)
      : 0;
    const avgRisk = parsedSectors.length > 0
      ? Math.round(parsedSectors.reduce((s, sec) => s + sec.riskScore, 0) / parsedSectors.length)
      : 0;
    const topSector = parsedSectors[0];
    const topCompany = parsedCompanies[0];

    // Scatter data for risk vs investability
    const scatterData = parsedCompanies.map((c) => ({
      name: c.name,
      arabicName: c.arabicName,
      investability: c.investability,
      riskScore: c.riskScore,
      totalFunding: c.totalFunding,
      sectorId: c.sectorId,
      stage: c.stage,
    }));

    // Funding by sector for charts
    const fundingBySector = parsedSectors.map((s) => ({
      name: s.name,
      arabicName: s.arabicName,
      totalFunding: s.totalFunding,
      companyCount: s.companyCount,
      attractiveness: s.attractiveness,
      riskScore: s.riskScore,
      marketGap: s.marketGap,
      fundingMomentum: s.fundingMomentum,
      saudiRelevance: s.saudiRelevance,
    }));

    const aiSummary = {
      overview: `السوق السعودي للاستثمار الجريء يضم ${parsedSectors.length} قطاعات رئيسية و${parsedCompanies.length} شركة مُتتبعة بإجمالي تمويل $${(totalFunding / 1_000_000_000).toFixed(1)}B. متوسط جاذبية القطاعات ${avgAttractiveness}/100 مع متوسط مخاطر ${avgRisk}/100.`,
      topSectorInsight: topSector
        ? `قطاع ${topSector.arabicName} يتصدر بجاذبية ${topSector.attractiveness}/100 ونمو سنوي ${topSector.yoyGrowth}%. ${sectorAnalyses[0]?.analysis.investmentThesis}`
        : "",
      topCompanyInsight: topCompany
        ? `${topCompany.arabicName} (${topCompany.name}) تتصدر الشركات بدرجة استثمارية ${topCompany.investability}/100 وتمويل إجمالي $${(topCompany.totalFunding / 1_000_000).toFixed(0)}M.`
        : "",
      marketTrend: avgAttractiveness >= 75
        ? "السوق يُظهر زخماً قوياً مع توافق واضح مع رؤية 2030 وتدفق رأسمال مؤسسي متزايد."
        : "السوق في مرحلة نمو مع فرص واعدة للمستثمرين الاستراتيجيين.",
    };

    return NextResponse.json({
      aiSummary,
      sectorAnalyses,
      scatterData,
      fundingBySector,
      stats: {
        totalSectors: parsedSectors.length,
        totalCompanies: parsedCompanies.length,
        totalFunding,
        avgAttractiveness,
        avgRisk,
      },
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ error: "حدث خطأ في تحليل البيانات" }, { status: 500 });
  }
}
