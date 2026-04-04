"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Company } from "@/data/companies";
import type { Sector } from "@/data/sectors";
import { analyzeCompany, analyzeSector } from "@/lib/scoring";
import { formatCurrency, cn } from "@/lib/utils";
import {
  Shield,
  AlertTriangle,
  TrendingDown,
  Target,
  Eye,
  ChevronRight,
  Zap,
} from "lucide-react";

export default function RiskInsightsView({ companies, sectors }: { companies: Company[]; sectors: Sector[] }) {
  const companyAnalyses = useMemo(() => {
    return companies.map((company) => {
      const sector = sectors.find((s) => s.id === company.sectorId)!;
      const sectorCompanies = companies.filter((c) => c.sectorId === company.sectorId);
      const analysis = analyzeCompany(company, sector, sectorCompanies);
      return { company, sector, analysis };
    });
  }, [companies, sectors]);

  const sectorAnalyses = useMemo(() => {
    return sectors.map((sector) => {
      const sectorCompanies = companies.filter((c) => c.sectorId === sector.id);
      const analysis = analyzeSector(sector, sectorCompanies);
      return { sector, analysis, companies: sectorCompanies };
    });
  }, [companies, sectors]);

  const highRiskCompanies = companyAnalyses
    .filter((c) => c.company.riskScore >= 40)
    .sort((a, b) => b.company.riskScore - a.company.riskScore);

  const lowGrowthCompanies = companyAnalyses
    .filter((c) => c.company.growthRate < 35)
    .sort((a, b) => a.company.growthRate - b.company.growthRate);

  const highCompetitionSectors = sectorAnalyses
    .filter((s) => s.sector.competitionIntensity >= 60)
    .sort((a, b) => b.sector.competitionIntensity - a.sector.competitionIntensity);

  const underfundedSectors = sectorAnalyses
    .sort((a, b) => b.sector.marketGap - a.sector.marketGap)
    .filter((s) => s.sector.marketGap >= 70);

  const overheatedSectors = sectorAnalyses.filter(
    (s) => s.sector.fundingMomentum >= 80 && s.sector.riskScore >= 40
  );

  const getScoreColor = (score: number, inverse = false) => {
    const effective = inverse ? 100 - score : score;
    if (effective >= 80) return "text-emerald-400";
    if (effective >= 60) return "text-cyan-400";
    if (effective >= 40) return "text-amber-400";
    return "text-rose-400";
  };

  return (
    <div className="p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-rose-400" />
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight">رؤى المخاطر</h1>
        </div>
        <p className="text-sm text-[#71717a]">
          مخاطر محددة بالذكاء الاصطناعي وفجوات سوقية ومناطق ناقصة التمويل عبر منظومة رأس المال الجريء السعودي
        </p>
      </div>

      {/* Risk Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass rounded-xl p-5 border-l-2 border-rose-500/50">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <p className="text-[10px] text-[#71717a] uppercase tracking-widest">شركات مرتفعة المخاطر</p>
          </div>
          <p className="text-2xl font-bold text-rose-400">{highRiskCompanies.length}</p>
          <p className="text-xs text-[#71717a] mt-1">مؤشر المخاطر {"\u2265"} ٤٠</p>
        </div>
        <div className="glass rounded-xl p-5 border-l-2 border-amber-500/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-amber-400" />
            <p className="text-[10px] text-[#71717a] uppercase tracking-widest">نمو منخفض</p>
          </div>
          <p className="text-2xl font-bold text-amber-400">{lowGrowthCompanies.length}</p>
          <p className="text-xs text-[#71717a] mt-1">النمو أقل من ٣٥٪</p>
        </div>
        <div className="glass rounded-xl p-5 border-l-2 border-orange-500/50">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-orange-400" />
            <p className="text-[10px] text-[#71717a] uppercase tracking-widest">قطاعات محتدة</p>
          </div>
          <p className="text-2xl font-bold text-orange-400">{overheatedSectors.length}</p>
          <p className="text-xs text-[#71717a] mt-1">زخم مرتفع + مخاطر عالية</p>
        </div>
        <div className="glass rounded-xl p-5 border-l-2 border-cyan-500/50">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <p className="text-[10px] text-[#71717a] uppercase tracking-widest">الفجوات السوقية</p>
          </div>
          <p className="text-2xl font-bold text-cyan-400">{underfundedSectors.length}</p>
          <p className="text-xs text-[#71717a] mt-1">مؤشر الفجوة {"\u2265"} ٧٠</p>
        </div>
      </div>

      {/* High Risk Companies */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1e1e2e] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-semibold font-heading text-white">شركات مرتفعة المخاطر</h3>
        </div>
        <div className="divide-y divide-[#1e1e2e]/50">
          {highRiskCompanies.map(({ company, sector, analysis }) => (
            <div key={company.id} className="px-6 py-4 flex items-center gap-6 hover:bg-white/[0.02] transition-colors">
              <div className="w-14 h-14 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-rose-400">{company.riskScore}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-white">{company.name}</p>
                  <span className="text-xs text-[#a1a1aa] bg-white/5 px-2 py-0.5 rounded-md">{sector.name}</span>
                  <span className="text-xs text-[#71717a]">{company.stage}</span>
                </div>
                <div className="mt-1.5 space-y-0.5">
                  {analysis.risks.map((risk, i) => (
                    <p key={i} className="text-xs text-[#a1a1aa] flex items-start gap-1.5">
                      <span className="text-rose-400 mt-0.5">-</span> {risk}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex gap-6 text-center shrink-0">
                <div>
                  <p className="text-[10px] text-[#71717a] uppercase tracking-widest">قابلية الاستثمار</p>
                  <p className={cn("text-sm font-bold mt-1", getScoreColor(company.investability))}>{company.investability}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#71717a] uppercase tracking-widest">النمو</p>
                  <p className={cn("text-sm font-bold mt-1", getScoreColor(company.growthRate))}>+{company.growthRate}%</p>
                </div>
              </div>
              <Link href={`/companies/${company.id}`} className="text-[#71717a] hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Market Gaps */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold font-heading text-white">أكبر الفجوات السوقية</h3>
          </div>
          <p className="text-xs text-[#a1a1aa] mb-4 leading-relaxed">
            القطاعات ذات الفرص السوقية غير المستغلة. المؤشرات المرتفعة تشير إلى أسواق غير مخترقة حيث يمكن للوافدين الجدد تحقيق قيمة كبيرة.
          </p>
          <div className="space-y-3">
            {underfundedSectors.map(({ sector }) => (
              <div key={sector.id} className="p-3 bg-[#0d0d14] rounded-lg border border-[#1e1e2e]">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium text-white">{sector.name}</p>
                  <span className={cn("text-sm font-bold", getScoreColor(sector.marketGap))}>
                    {sector.marketGap}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#1e1e2e] rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                    style={{ width: `${sector.marketGap}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#71717a]">
                  <span>المنافسة: {sector.competitionIntensity}/100</span>
                  <span>التمويل: {formatCurrency(sector.totalFunding)}</span>
                  <span>{sector.companyCount} شركات</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competition Hotspots */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold font-heading text-white">بؤر المنافسة</h3>
          </div>
          <p className="text-xs text-[#a1a1aa] mb-4 leading-relaxed">
            القطاعات ذات أعلى شدة منافسة. المنافسة العالية قد تؤدي إلى ضغط الهوامش وارتفاع تكلفة الاستحواذ وتوحيد السوق.
          </p>
          <div className="space-y-3">
            {highCompetitionSectors.map(({ sector }) => (
              <div key={sector.id} className="p-3 bg-[#0d0d14] rounded-lg border border-[#1e1e2e]">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium text-white">{sector.name}</p>
                  <span className={cn("text-sm font-bold", getScoreColor(sector.competitionIntensity, true))}>
                    {sector.competitionIntensity}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#1e1e2e] rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500"
                    style={{ width: `${sector.competitionIntensity}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#71717a]">
                  <span>متوسط الصفقة: {formatCurrency(sector.avgDealSize)}</span>
                  <span>المخاطر: {sector.riskScore}/100</span>
                  <span>النمو: +{sector.yoyGrowth}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overheated Sectors Warning */}
      {overheatedSectors.length > 0 && (
        <div className="glass rounded-xl p-6 border border-orange-500/20 bg-orange-500/[0.03]">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-semibold font-heading text-orange-400">تحذير من الاحتدام</h3>
          </div>
          <p className="text-xs text-[#a1a1aa] mb-4 leading-relaxed">
            تظهر هذه القطاعات زخم تمويل مرتفع مع مؤشرات مخاطر مرتفعة. هذا النمط قد يشير إلى ضخ رأس مال مفرط يسبق أساسيات السوق.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {overheatedSectors.map(({ sector, analysis }) => (
              <div key={sector.id} className="p-4 bg-[#0d0d14] rounded-lg border border-orange-500/10">
                <p className="text-sm font-medium text-white mb-2">{sector.name}</p>
                <div className="grid grid-cols-3 gap-3 text-center mb-3">
                  <div>
                    <p className="text-[10px] text-[#71717a]">الزخم</p>
                    <p className="text-sm font-bold text-emerald-400">{sector.fundingMomentum}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#71717a]">المخاطر</p>
                    <p className="text-sm font-bold text-rose-400">{sector.riskScore}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#71717a]">النمو</p>
                    <p className="text-sm font-bold text-amber-400">+{sector.yoyGrowth}%</p>
                  </div>
                </div>
                {analysis.keyRisks.slice(0, 2).map((r, i) => (
                  <p key={i} className="text-xs text-[#a1a1aa] mb-0.5">- {r}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Sector Risks Digest */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-semibold font-heading text-white">ملخص المخاطر — جميع القطاعات</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {sectorAnalyses.map(({ sector, analysis }) => (
            <div key={sector.id} className="flex items-start gap-3 p-3 bg-[#0d0d14] rounded-lg border border-[#1e1e2e]">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
                <span className={cn("text-sm font-bold", getScoreColor(sector.riskScore, true))}>{sector.riskScore}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{sector.name}</p>
                {analysis.keyRisks.slice(0, 2).map((r, i) => (
                  <p key={i} className="text-xs text-[#a1a1aa] mt-0.5">- {r}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
