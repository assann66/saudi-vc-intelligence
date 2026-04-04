"use client";

import { useState, useMemo } from "react";
import type { Company } from "@/data/companies";
import type { Sector } from "@/data/sectors";
import { analyzeCompany, analyzeSector } from "@/lib/scoring";
import { formatCurrency, cn } from "@/lib/utils";
import {
  ArrowLeftRight,
  Building2,
  PieChart,
  Plus,
  X,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";

type CompareMode = "companies" | "sectors";

const CHART_COLORS = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b"];

export default function CompareView({ companies, sectors }: { companies: Company[]; sectors: Sector[] }) {
  const [mode, setMode] = useState<CompareMode>("companies");
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([
    "stc-pay",
    "tamara",
  ]);
  const [selectedSectorIds, setSelectedSectorIds] = useState<string[]>([
    "fintech",
    "ai-data",
  ]);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);

  const selectedCompanies = useMemo(() => {
    return selectedCompanyIds.map((id) => {
      const company = companies.find((c) => c.id === id)!;
      const sector = sectors.find((s) => s.id === company.sectorId)!;
      const sectorCompanies = companies.filter((c) => c.sectorId === company.sectorId);
      const analysis = analyzeCompany(company, sector, sectorCompanies);
      return { company, sector, analysis };
    });
  }, [selectedCompanyIds, companies, sectors]);

  const selectedSectors = useMemo(() => {
    return selectedSectorIds.map((id) => {
      const sector = sectors.find((s) => s.id === id)!;
      const sectorCompanies = companies.filter((c) => c.sectorId === sector.id);
      const analysis = analyzeSector(sector, sectorCompanies);
      return { sector, analysis, companyCount: sectorCompanies.length };
    });
  }, [selectedSectorIds, companies, sectors]);

  const companyRadarData = useMemo(() => {
    if (selectedCompanies.length === 0) return [];
    return [
      { metric: "الاستثمار", ...Object.fromEntries(selectedCompanies.map((c) => [c.company.id, c.company.investability])) },
      { metric: "انخفاض المخاطر", ...Object.fromEntries(selectedCompanies.map((c) => [c.company.id, 100 - c.company.riskScore])) },
      { metric: "النمو", ...Object.fromEntries(selectedCompanies.map((c) => [c.company.id, Math.min(100, c.company.growthRate)])) },
      { metric: "الفجوة السوقية", ...Object.fromEntries(selectedCompanies.map((c) => [c.company.id, c.analysis.marketGap.score])) },
      { metric: "الزخم", ...Object.fromEntries(selectedCompanies.map((c) => [c.company.id, c.analysis.fundingMomentum.score])) },
      { metric: "الملاءمة السعودية", ...Object.fromEntries(selectedCompanies.map((c) => [c.company.id, c.analysis.saudiRelevance.score])) },
    ];
  }, [selectedCompanies]);

  const sectorRadarData = useMemo(() => {
    if (selectedSectors.length === 0) return [];
    return [
      { metric: "الجاذبية", ...Object.fromEntries(selectedSectors.map((s) => [s.sector.id, s.sector.attractiveness])) },
      { metric: "انخفاض المخاطر", ...Object.fromEntries(selectedSectors.map((s) => [s.sector.id, 100 - s.sector.riskScore])) },
      { metric: "الفجوة السوقية", ...Object.fromEntries(selectedSectors.map((s) => [s.sector.id, s.sector.marketGap])) },
      { metric: "الزخم", ...Object.fromEntries(selectedSectors.map((s) => [s.sector.id, s.sector.fundingMomentum])) },
      { metric: "انخفاض المنافسة", ...Object.fromEntries(selectedSectors.map((s) => [s.sector.id, 100 - s.sector.competitionIntensity])) },
      { metric: "الملاءمة السعودية", ...Object.fromEntries(selectedSectors.map((s) => [s.sector.id, s.sector.saudiRelevance])) },
    ];
  }, [selectedSectors]);

  const addCompany = (id: string) => {
    if (!selectedCompanyIds.includes(id) && selectedCompanyIds.length < 4) {
      setSelectedCompanyIds([...selectedCompanyIds, id]);
    }
    setShowCompanyDropdown(false);
  };

  const removeCompany = (id: string) => {
    setSelectedCompanyIds(selectedCompanyIds.filter((i) => i !== id));
  };

  const addSector = (id: string) => {
    if (!selectedSectorIds.includes(id) && selectedSectorIds.length < 4) {
      setSelectedSectorIds([...selectedSectorIds, id]);
    }
    setShowSectorDropdown(false);
  };

  const removeSector = (id: string) => {
    setSelectedSectorIds(selectedSectorIds.filter((i) => i !== id));
  };

  const getScoreColor = (score: number, inverse = false) => {
    const effective = inverse ? 100 - score : score;
    if (effective >= 80) return "text-emerald-400";
    if (effective >= 60) return "text-cyan-400";
    if (effective >= 40) return "text-amber-400";
    return "text-rose-400";
  };

  const recommendationColors: Record<string, string> = {
    "Strong Buy": "text-emerald-400 bg-emerald-500/10",
    Buy: "text-cyan-400 bg-cyan-500/10",
    Hold: "text-amber-400 bg-amber-500/10",
    Watch: "text-orange-400 bg-orange-500/10",
    Avoid: "text-rose-400 bg-rose-500/10",
  };

  return (
    <div className="p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold font-heading text-white tracking-tight">المقارنة</h1>
          </div>
          <p className="text-sm text-[#71717a]">
            مقارنة جنبًا إلى جنب بين القطاعات أو الشركات عبر جميع أبعاد مؤشرات الأداء
          </p>
        </div>

        <div className="flex gap-1 bg-[#12121a] rounded-lg border border-[#1e1e2e] p-1">
          <button
            onClick={() => setMode("companies")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              mode === "companies"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-[#71717a] hover:text-white"
            )}
          >
            <Building2 className="w-3.5 h-3.5" /> الشركات
          </button>
          <button
            onClick={() => setMode("sectors")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              mode === "sectors"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-[#71717a] hover:text-white"
            )}
          >
            <PieChart className="w-3.5 h-3.5" /> القطاعات
          </button>
        </div>
      </div>

      {/* Selection */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-[#71717a] uppercase tracking-widest">المقارنة بين:</span>

          {mode === "companies" ? (
            <>
              {selectedCompanies.map(({ company }, i) => (
                <div
                  key={company.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium"
                  style={{
                    borderColor: CHART_COLORS[i] + "40",
                    backgroundColor: CHART_COLORS[i] + "10",
                    color: CHART_COLORS[i],
                  }}
                >
                  {company.name}
                  <button onClick={() => removeCompany(company.id)} className="hover:opacity-70">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {selectedCompanyIds.length < 4 && (
                <div className="relative">
                  <button
                    onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[#1e1e2e] text-sm text-[#71717a] hover:text-white hover:border-[#3e3e4e] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> إضافة شركة
                  </button>
                  {showCompanyDropdown && (
                    <div className="absolute z-50 top-full mt-1 left-0 w-64 max-h-64 overflow-y-auto bg-[#12121a] border border-[#1e1e2e] rounded-lg shadow-xl">
                      {companies
                        .filter((c) => !selectedCompanyIds.includes(c.id))
                        .map((c) => (
                          <button
                            key={c.id}
                            onClick={() => addCompany(c.id)}
                            className="w-full text-left px-4 py-2.5 text-sm text-[#a1a1aa] hover:text-white hover:bg-white/5 transition-colors"
                          >
                            {c.name}
                            <span className="text-[10px] text-[#71717a] ml-2">
                              {sectors.find((s) => s.id === c.sectorId)?.name}
                            </span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              {selectedSectors.map(({ sector }, i) => (
                <div
                  key={sector.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium"
                  style={{
                    borderColor: CHART_COLORS[i] + "40",
                    backgroundColor: CHART_COLORS[i] + "10",
                    color: CHART_COLORS[i],
                  }}
                >
                  {sector.name}
                  <button onClick={() => removeSector(sector.id)} className="hover:opacity-70">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {selectedSectorIds.length < 4 && (
                <div className="relative">
                  <button
                    onClick={() => setShowSectorDropdown(!showSectorDropdown)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[#1e1e2e] text-sm text-[#71717a] hover:text-white hover:border-[#3e3e4e] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> إضافة قطاع
                  </button>
                  {showSectorDropdown && (
                    <div className="absolute z-50 top-full mt-1 left-0 w-64 max-h-64 overflow-y-auto bg-[#12121a] border border-[#1e1e2e] rounded-lg shadow-xl">
                      {sectors
                        .filter((s) => !selectedSectorIds.includes(s.id))
                        .map((s) => (
                          <button
                            key={s.id}
                            onClick={() => addSector(s.id)}
                            className="w-full text-left px-4 py-2.5 text-sm text-[#a1a1aa] hover:text-white hover:bg-white/5 transition-colors"
                          >
                            {s.name}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Radar Chart */}
      {((mode === "companies" && selectedCompanies.length >= 2) ||
        (mode === "sectors" && selectedSectors.length >= 2)) && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-sm font-semibold font-heading text-white mb-4">مقارنة مؤشرات الأداء بالرادار</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={mode === "companies" ? companyRadarData : sectorRadarData}
                cx="50%"
                cy="50%"
                outerRadius="75%"
              >
                <PolarGrid stroke="#1e1e2e" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: "#71717a", fontSize: 11 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: "#71717a", fontSize: 10 }}
                  axisLine={false}
                />
                {mode === "companies"
                  ? selectedCompanies.map(({ company }, i) => (
                      <Radar
                        key={company.id}
                        name={company.name}
                        dataKey={company.id}
                        stroke={CHART_COLORS[i]}
                        fill={CHART_COLORS[i]}
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    ))
                  : selectedSectors.map(({ sector }, i) => (
                      <Radar
                        key={sector.id}
                        name={sector.name}
                        dataKey={sector.id}
                        stroke={CHART_COLORS[i]}
                        fill={CHART_COLORS[i]}
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    ))}
                <Legend
                  wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Company Comparison Table */}
      {mode === "companies" && selectedCompanies.length >= 2 && (
        <div className="glass rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1e1e2e]">
            <h3 className="text-sm font-semibold font-heading text-white">مقارنة تفصيلية</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e1e2e]">
                  <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">
                    المؤشر
                  </th>
                  {selectedCompanies.map(({ company }, i) => (
                    <th
                      key={company.id}
                      className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: CHART_COLORS[i] }}
                    >
                      {company.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "القطاع", getValue: (c: typeof selectedCompanies[0]) => c.sector.name, isText: true },
                  { label: "المرحلة", getValue: (c: typeof selectedCompanies[0]) => c.company.stage, isText: true },
                  { label: "المقر", getValue: (c: typeof selectedCompanies[0]) => c.company.hqCity, isText: true },
                  { label: "سنة التأسيس", getValue: (c: typeof selectedCompanies[0]) => String(c.company.foundedYear), isText: true },
                  { label: "إجمالي التمويل", getValue: (c: typeof selectedCompanies[0]) => formatCurrency(c.company.totalFunding), isText: true },
                  { label: "آخر جولة", getValue: (c: typeof selectedCompanies[0]) => formatCurrency(c.company.lastRoundSize), isText: true },
                  { label: "الموظفون", getValue: (c: typeof selectedCompanies[0]) => String(c.company.employees), isText: true },
                  { label: "قابلية الاستثمار", getValue: (c: typeof selectedCompanies[0]) => c.company.investability, isScore: true },
                  { label: "مؤشر المخاطر", getValue: (c: typeof selectedCompanies[0]) => c.company.riskScore, isScore: true, inverse: true },
                  { label: "معدل النمو", getValue: (c: typeof selectedCompanies[0]) => c.company.growthRate, isScore: true, suffix: "%" },
                  { label: "زخم التمويل", getValue: (c: typeof selectedCompanies[0]) => c.analysis.fundingMomentum.score, isScore: true },
                  { label: "الفجوة السوقية", getValue: (c: typeof selectedCompanies[0]) => c.analysis.marketGap.score, isScore: true },
                  { label: "الملاءمة السعودية", getValue: (c: typeof selectedCompanies[0]) => c.analysis.saudiRelevance.score, isScore: true },
                  { label: "المنافسة", getValue: (c: typeof selectedCompanies[0]) => c.analysis.competitionIntensity.score, isScore: true, inverse: true },
                  { label: "التوصية", getValue: (c: typeof selectedCompanies[0]) => c.analysis.recommendation, isRec: true },
                ].map(({ label, getValue, isText, isScore, isRec, inverse, suffix }) => (
                  <tr key={label} className="border-b border-[#1e1e2e]/50">
                    <td className="px-6 py-3 text-sm text-[#a1a1aa]">{label}</td>
                    {selectedCompanies.map(({ company, analysis, sector }) => {
                      const entry = { company, sector, analysis };
                      const val = getValue(entry);
                      return (
                        <td key={company.id} className="px-6 py-3 text-right">
                          {isText && (
                            <span className="text-sm text-white">{val as string}</span>
                          )}
                          {isScore && (
                            <span className={cn("text-sm font-semibold", getScoreColor(val as number, inverse))}>
                              {val}{suffix || ""}
                            </span>
                          )}
                          {isRec && (
                            <span className={cn("text-[11px] font-semibold px-2 py-1 rounded-full", recommendationColors[val as string])}>
                              {val as string}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sector Comparison Table */}
      {mode === "sectors" && selectedSectors.length >= 2 && (
        <div className="glass rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1e1e2e]">
            <h3 className="text-sm font-semibold font-heading text-white">مقارنة تفصيلية</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e1e2e]">
                  <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">
                    المؤشر
                  </th>
                  {selectedSectors.map(({ sector }, i) => (
                    <th
                      key={sector.id}
                      className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: CHART_COLORS[i] }}
                    >
                      {sector.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "الجاذبية", getVal: (s: typeof selectedSectors[0]) => s.sector.attractiveness, isScore: true },
                  { label: "مؤشر المخاطر", getVal: (s: typeof selectedSectors[0]) => s.sector.riskScore, isScore: true, inverse: true },
                  { label: "الفجوة السوقية", getVal: (s: typeof selectedSectors[0]) => s.sector.marketGap, isScore: true },
                  { label: "زخم التمويل", getVal: (s: typeof selectedSectors[0]) => s.sector.fundingMomentum, isScore: true },
                  { label: "المنافسة", getVal: (s: typeof selectedSectors[0]) => s.sector.competitionIntensity, isScore: true, inverse: true },
                  { label: "الملاءمة السعودية", getVal: (s: typeof selectedSectors[0]) => s.sector.saudiRelevance, isScore: true },
                  { label: "إجمالي التمويل", getVal: (s: typeof selectedSectors[0]) => formatCurrency(s.sector.totalFunding), isText: true },
                  { label: "متوسط حجم الصفقة", getVal: (s: typeof selectedSectors[0]) => formatCurrency(s.sector.avgDealSize), isText: true },
                  { label: "النمو السنوي", getVal: (s: typeof selectedSectors[0]) => s.sector.yoyGrowth, isScore: true, suffix: "%" },
                  { label: "عدد الشركات", getVal: (s: typeof selectedSectors[0]) => String(s.sector.companyCount), isText: true },
                  { label: "الشركات المتابعة", getVal: (s: typeof selectedSectors[0]) => String(s.companyCount), isText: true },
                ].map(({ label, getVal, isText, isScore, inverse, suffix }) => (
                  <tr key={label} className="border-b border-[#1e1e2e]/50">
                    <td className="px-6 py-3 text-sm text-[#a1a1aa]">{label}</td>
                    {selectedSectors.map((entry) => {
                      const val = getVal(entry);
                      return (
                        <td key={entry.sector.id} className="px-6 py-3 text-right">
                          {isText && <span className="text-sm text-white">{val as string}</span>}
                          {isScore && (
                            <span className={cn("text-sm font-semibold", getScoreColor(val as number, inverse))}>
                              {val}{suffix || ""}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Verdict Cards */}
      {mode === "companies" && selectedCompanies.length >= 2 && (
        <div className="grid grid-cols-2 gap-4">
          {selectedCompanies.map(({ company, analysis }, i) => (
            <div
              key={company.id}
              className="glass rounded-xl p-5 border"
              style={{ borderColor: CHART_COLORS[i] + "30" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold" style={{ color: CHART_COLORS[i] }}>
                  {company.name}
                </span>
                <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", recommendationColors[analysis.recommendation])}>
                  {analysis.recommendation}
                </span>
              </div>
              <p className="text-xs text-[#a1a1aa] leading-relaxed mb-3">{analysis.overallVerdict}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-emerald-400 uppercase tracking-widest mb-1">نقاط القوة</p>
                  {analysis.strengths.slice(0, 2).map((s, idx) => (
                    <p key={idx} className="text-[11px] text-[#a1a1aa] mb-0.5">+ {s}</p>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] text-rose-400 uppercase tracking-widest mb-1">المخاطر</p>
                  {analysis.risks.slice(0, 2).map((r, idx) => (
                    <p key={idx} className="text-[11px] text-[#a1a1aa] mb-0.5">- {r}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === "sectors" && selectedSectors.length >= 2 && (
        <div className="grid grid-cols-2 gap-4">
          {selectedSectors.map(({ sector, analysis }, i) => (
            <div
              key={sector.id}
              className="glass rounded-xl p-5 border"
              style={{ borderColor: CHART_COLORS[i] + "30" }}
            >
              <p className="text-sm font-semibold mb-2" style={{ color: CHART_COLORS[i] }}>
                {sector.name}
              </p>
              <p className="text-xs text-[#a1a1aa] leading-relaxed mb-3">{analysis.overallVerdict}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-emerald-400 uppercase tracking-widest mb-1">الفرص</p>
                  {analysis.keyOpportunities.slice(0, 2).map((o, idx) => (
                    <p key={idx} className="text-[11px] text-[#a1a1aa] mb-0.5">+ {o}</p>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] text-rose-400 uppercase tracking-widest mb-1">المخاطر</p>
                  {analysis.keyRisks.slice(0, 2).map((r, idx) => (
                    <p key={idx} className="text-[11px] text-[#a1a1aa] mb-0.5">- {r}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {((mode === "companies" && selectedCompanies.length < 2) ||
        (mode === "sectors" && selectedSectors.length < 2)) && (
        <div className="glass rounded-xl p-12 text-center">
          <ArrowLeftRight className="w-10 h-10 text-[#71717a] mx-auto mb-3" />
          <p className="text-sm text-[#71717a]">
            اختر ٢ على الأقل من {mode === 'companies' ? 'الشركات' : 'القطاعات'} للمقارنة جنبًا إلى جنب
          </p>
        </div>
      )}
    </div>
  );
}
