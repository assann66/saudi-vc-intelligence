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
      { metric: "Investability", ...Object.fromEntries(selectedCompanies.map((c) => [c.company.id, c.company.investability])) },
      { metric: "Low Risk", ...Object.fromEntries(selectedCompanies.map((c) => [c.company.id, 100 - c.company.riskScore])) },
      { metric: "Growth", ...Object.fromEntries(selectedCompanies.map((c) => [c.company.id, Math.min(100, c.company.growthRate)])) },
      { metric: "Market Gap", ...Object.fromEntries(selectedCompanies.map((c) => [c.company.id, c.analysis.marketGap.score])) },
      { metric: "Momentum", ...Object.fromEntries(selectedCompanies.map((c) => [c.company.id, c.analysis.fundingMomentum.score])) },
      { metric: "Saudi Rel.", ...Object.fromEntries(selectedCompanies.map((c) => [c.company.id, c.analysis.saudiRelevance.score])) },
    ];
  }, [selectedCompanies]);

  const sectorRadarData = useMemo(() => {
    if (selectedSectors.length === 0) return [];
    return [
      { metric: "Attractiveness", ...Object.fromEntries(selectedSectors.map((s) => [s.sector.id, s.sector.attractiveness])) },
      { metric: "Low Risk", ...Object.fromEntries(selectedSectors.map((s) => [s.sector.id, 100 - s.sector.riskScore])) },
      { metric: "Market Gap", ...Object.fromEntries(selectedSectors.map((s) => [s.sector.id, s.sector.marketGap])) },
      { metric: "Momentum", ...Object.fromEntries(selectedSectors.map((s) => [s.sector.id, s.sector.fundingMomentum])) },
      { metric: "Low Competition", ...Object.fromEntries(selectedSectors.map((s) => [s.sector.id, 100 - s.sector.competitionIntensity])) },
      { metric: "Saudi Rel.", ...Object.fromEntries(selectedSectors.map((s) => [s.sector.id, s.sector.saudiRelevance])) },
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
            <h1 className="text-2xl font-bold text-white tracking-tight">Comparison</h1>
          </div>
          <p className="text-sm text-[#71717a]">
            Side-by-side sector or company comparison across all KPI dimensions
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
            <Building2 className="w-3.5 h-3.5" /> Companies
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
            <PieChart className="w-3.5 h-3.5" /> Sectors
          </button>
        </div>
      </div>

      {/* Selection */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-[#71717a] uppercase tracking-widest">Comparing:</span>

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
                    <Plus className="w-3.5 h-3.5" /> Add Company
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
                    <Plus className="w-3.5 h-3.5" /> Add Sector
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
          <h3 className="text-sm font-semibold text-white mb-4">KPI Radar Comparison</h3>
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
            <h3 className="text-sm font-semibold text-white">Detailed Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e1e2e]">
                  <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">
                    Metric
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
                  { label: "Sector", getValue: (c: typeof selectedCompanies[0]) => c.sector.name, isText: true },
                  { label: "Stage", getValue: (c: typeof selectedCompanies[0]) => c.company.stage, isText: true },
                  { label: "HQ", getValue: (c: typeof selectedCompanies[0]) => c.company.hqCity, isText: true },
                  { label: "Founded", getValue: (c: typeof selectedCompanies[0]) => String(c.company.foundedYear), isText: true },
                  { label: "Total Funding", getValue: (c: typeof selectedCompanies[0]) => formatCurrency(c.company.totalFunding), isText: true },
                  { label: "Last Round", getValue: (c: typeof selectedCompanies[0]) => formatCurrency(c.company.lastRoundSize), isText: true },
                  { label: "Employees", getValue: (c: typeof selectedCompanies[0]) => String(c.company.employees), isText: true },
                  { label: "Investability", getValue: (c: typeof selectedCompanies[0]) => c.company.investability, isScore: true },
                  { label: "Risk Score", getValue: (c: typeof selectedCompanies[0]) => c.company.riskScore, isScore: true, inverse: true },
                  { label: "Growth Rate", getValue: (c: typeof selectedCompanies[0]) => c.company.growthRate, isScore: true, suffix: "%" },
                  { label: "Funding Momentum", getValue: (c: typeof selectedCompanies[0]) => c.analysis.fundingMomentum.score, isScore: true },
                  { label: "Market Gap", getValue: (c: typeof selectedCompanies[0]) => c.analysis.marketGap.score, isScore: true },
                  { label: "Saudi Relevance", getValue: (c: typeof selectedCompanies[0]) => c.analysis.saudiRelevance.score, isScore: true },
                  { label: "Competition", getValue: (c: typeof selectedCompanies[0]) => c.analysis.competitionIntensity.score, isScore: true, inverse: true },
                  { label: "Recommendation", getValue: (c: typeof selectedCompanies[0]) => c.analysis.recommendation, isRec: true },
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
            <h3 className="text-sm font-semibold text-white">Detailed Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e1e2e]">
                  <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">
                    Metric
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
                  { label: "Attractiveness", getVal: (s: typeof selectedSectors[0]) => s.sector.attractiveness, isScore: true },
                  { label: "Risk Score", getVal: (s: typeof selectedSectors[0]) => s.sector.riskScore, isScore: true, inverse: true },
                  { label: "Market Gap", getVal: (s: typeof selectedSectors[0]) => s.sector.marketGap, isScore: true },
                  { label: "Funding Momentum", getVal: (s: typeof selectedSectors[0]) => s.sector.fundingMomentum, isScore: true },
                  { label: "Competition", getVal: (s: typeof selectedSectors[0]) => s.sector.competitionIntensity, isScore: true, inverse: true },
                  { label: "Saudi Relevance", getVal: (s: typeof selectedSectors[0]) => s.sector.saudiRelevance, isScore: true },
                  { label: "Total Funding", getVal: (s: typeof selectedSectors[0]) => formatCurrency(s.sector.totalFunding), isText: true },
                  { label: "Avg Deal Size", getVal: (s: typeof selectedSectors[0]) => formatCurrency(s.sector.avgDealSize), isText: true },
                  { label: "YoY Growth", getVal: (s: typeof selectedSectors[0]) => s.sector.yoyGrowth, isScore: true, suffix: "%" },
                  { label: "Company Count", getVal: (s: typeof selectedSectors[0]) => String(s.sector.companyCount), isText: true },
                  { label: "Tracked Companies", getVal: (s: typeof selectedSectors[0]) => String(s.companyCount), isText: true },
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
                  <p className="text-[10px] text-emerald-400 uppercase tracking-widest mb-1">Strengths</p>
                  {analysis.strengths.slice(0, 2).map((s, idx) => (
                    <p key={idx} className="text-[11px] text-[#a1a1aa] mb-0.5">+ {s}</p>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] text-rose-400 uppercase tracking-widest mb-1">Risks</p>
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
                  <p className="text-[10px] text-emerald-400 uppercase tracking-widest mb-1">Opportunities</p>
                  {analysis.keyOpportunities.slice(0, 2).map((o, idx) => (
                    <p key={idx} className="text-[11px] text-[#a1a1aa] mb-0.5">+ {o}</p>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] text-rose-400 uppercase tracking-widest mb-1">Risks</p>
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
            Select at least 2 {mode} to compare side-by-side
          </p>
        </div>
      )}
    </div>
  );
}
