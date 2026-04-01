"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { companies } from "@/data/companies";
import { sectors, Sector } from "@/data/sectors";
import { analyzeCompany, analyzeSector } from "@/lib/scoring";
import { formatCurrency, cn } from "@/lib/utils";
import {
  Search,
  ArrowUpDown,
  ChevronRight,
  Trophy,
  Building2,
  PieChart,
  Filter,
} from "lucide-react";

type ViewMode = "companies" | "sectors";

type CompanySortKey =
  | "investability"
  | "riskScore"
  | "growthRate"
  | "totalFunding"
  | "fundingMomentum"
  | "saudiRelevance"
  | "marketGap"
  | "competitionIntensity"
  | "recommendation";

type SectorSortKey =
  | "attractiveness"
  | "riskScore"
  | "marketGap"
  | "fundingMomentum"
  | "competitionIntensity"
  | "saudiRelevance"
  | "totalFunding"
  | "yoyGrowth";

const recommendationOrder = { "Strong Buy": 5, Buy: 4, Hold: 3, Watch: 2, Avoid: 1 };

const recommendationColors: Record<string, string> = {
  "Strong Buy": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Buy: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  Hold: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Watch: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  Avoid: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

export default function RankingsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("companies");
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [companySortKey, setCompanySortKey] = useState<CompanySortKey>("investability");
  const [sectorSortKey, setSectorSortKey] = useState<SectorSortKey>("attractiveness");
  const [sortAsc, setSortAsc] = useState(false);
  const [minScore, setMinScore] = useState(0);

  const stages = Array.from(new Set(companies.map((c) => c.stage)));

  const companyAnalyses = useMemo(() => {
    return companies.map((company) => {
      const sector = sectors.find((s) => s.id === company.sectorId)!;
      const sectorCompanies = companies.filter((c) => c.sectorId === company.sectorId);
      const analysis = analyzeCompany(company, sector, sectorCompanies);
      return { company, sector, analysis };
    });
  }, []);

  const sectorAnalyses = useMemo(() => {
    return sectors.map((sector) => {
      const sectorCompanies = companies.filter((c) => c.sectorId === sector.id);
      const analysis = analyzeSector(sector, sectorCompanies);
      return { sector, analysis, companyCount: sectorCompanies.length };
    });
  }, []);

  const filteredCompanies = companyAnalyses
    .filter(({ company }) => {
      const matchSearch =
        company.name.toLowerCase().includes(search.toLowerCase()) ||
        company.description.toLowerCase().includes(search.toLowerCase());
      const matchSector = sectorFilter === "all" || company.sectorId === sectorFilter;
      const matchStage = stageFilter === "all" || company.stage === stageFilter;
      const matchScore = company.investability >= minScore;
      return matchSearch && matchSector && matchStage && matchScore;
    })
    .sort((a, b) => {
      let diff = 0;
      if (companySortKey === "recommendation") {
        diff =
          recommendationOrder[a.analysis.recommendation] -
          recommendationOrder[b.analysis.recommendation];
      } else if (companySortKey === "fundingMomentum") {
        diff = a.analysis.fundingMomentum.score - b.analysis.fundingMomentum.score;
      } else if (companySortKey === "saudiRelevance") {
        diff = a.analysis.saudiRelevance.score - b.analysis.saudiRelevance.score;
      } else if (companySortKey === "marketGap") {
        diff = a.analysis.marketGap.score - b.analysis.marketGap.score;
      } else if (companySortKey === "competitionIntensity") {
        diff = a.analysis.competitionIntensity.score - b.analysis.competitionIntensity.score;
      } else {
        diff =
          (a.company[companySortKey as keyof typeof a.company] as number) -
          (b.company[companySortKey as keyof typeof b.company] as number);
      }
      return sortAsc ? diff : -diff;
    });

  const filteredSectors = sectorAnalyses
    .filter(({ sector }) => {
      const matchSearch = sector.name.toLowerCase().includes(search.toLowerCase());
      const matchScore = sector.attractiveness >= minScore;
      return matchSearch && matchScore;
    })
    .sort((a, b) => {
      const diff =
        (a.sector[sectorSortKey as keyof Sector] as number) -
        (b.sector[sectorSortKey as keyof Sector] as number);
      return sortAsc ? diff : -diff;
    });

  const handleCompanySort = (key: CompanySortKey) => {
    if (companySortKey === key) setSortAsc(!sortAsc);
    else {
      setCompanySortKey(key);
      setSortAsc(false);
    }
  };

  const handleSectorSort = (key: SectorSortKey) => {
    if (sectorSortKey === key) setSortAsc(!sortAsc);
    else {
      setSectorSortKey(key);
      setSortAsc(false);
    }
  };

  const getScoreColor = (score: number, inverse = false) => {
    const effective = inverse ? 100 - score : score;
    if (effective >= 80) return "text-emerald-400";
    if (effective >= 60) return "text-cyan-400";
    if (effective >= 40) return "text-amber-400";
    return "text-rose-400";
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
    if (index === 1) return "bg-[#c0c0c0]/20 text-[#c0c0c0] border border-[#c0c0c0]/30";
    if (index === 2) return "bg-[#cd7f32]/20 text-[#cd7f32] border border-[#cd7f32]/30";
    return "bg-white/5 text-[#71717a] border border-[#1e1e2e]";
  };

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Opportunity Rankings
            </h1>
          </div>
          <p className="text-sm text-[#71717a]">
            Rank and filter sectors and companies by any KPI dimension
          </p>
        </div>

        <div className="flex gap-1 bg-[#12121a] rounded-lg border border-[#1e1e2e] p-1">
          <button
            onClick={() => { setViewMode("companies"); setSortAsc(false); }}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              viewMode === "companies"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-[#71717a] hover:text-white"
            )}
          >
            <Building2 className="w-3.5 h-3.5" /> Companies
          </button>
          <button
            onClick={() => { setViewMode("sectors"); setSortAsc(false); }}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              viewMode === "sectors"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-[#71717a] hover:text-white"
            )}
          >
            <PieChart className="w-3.5 h-3.5" /> Sectors
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
          <input
            type="text"
            placeholder={viewMode === "companies" ? "Search companies..." : "Search sectors..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#12121a] border border-[#1e1e2e] rounded-lg text-sm text-white placeholder:text-[#71717a] focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        {viewMode === "companies" && (
          <>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="px-4 py-2.5 bg-[#12121a] border border-[#1e1e2e] rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
            >
              <option value="all">All Sectors</option>
              {sectors.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-4 py-2.5 bg-[#12121a] border border-[#1e1e2e] rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
            >
              <option value="all">All Stages</option>
              {stages.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </>
        )}

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#71717a]" />
          <span className="text-xs text-[#71717a]">Min Score:</span>
          <input
            type="range"
            min={0}
            max={90}
            step={10}
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-24 accent-emerald-500"
          />
          <span className="text-xs text-white font-medium w-6">{minScore}</span>
        </div>

        <div className="text-xs text-[#71717a] ml-auto">
          {viewMode === "companies" ? filteredCompanies.length : filteredSectors.length} results
        </div>
      </div>

      {/* Company Rankings Table */}
      {viewMode === "companies" && (
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e1e2e]">
                  <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-widest text-[#71717a] w-12">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">
                    Sector
                  </th>
                  {[
                    { key: "investability" as CompanySortKey, label: "Investability" },
                    { key: "riskScore" as CompanySortKey, label: "Risk" },
                    { key: "growthRate" as CompanySortKey, label: "Growth" },
                    { key: "totalFunding" as CompanySortKey, label: "Funding" },
                    { key: "fundingMomentum" as CompanySortKey, label: "Momentum" },
                    { key: "saudiRelevance" as CompanySortKey, label: "Saudi Rel." },
                    { key: "marketGap" as CompanySortKey, label: "Mkt Gap" },
                    { key: "recommendation" as CompanySortKey, label: "Signal" },
                  ].map(({ key, label }) => (
                    <th
                      key={key}
                      className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a] cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleCompanySort(key)}
                    >
                      <span className="flex items-center justify-end gap-1">
                        {label}
                        {companySortKey === key && (
                          <ArrowUpDown className="w-3 h-3 text-emerald-400" />
                        )}
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map(({ company, sector, analysis }, i) => (
                  <tr
                    key={company.id}
                    className="border-b border-[#1e1e2e]/50 hover:bg-white/[0.02] transition-colors animate-fade-in"
                    style={{ animationDelay: `${i * 20}ms` }}
                  >
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={cn(
                          "inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-bold",
                          getRankBadge(i)
                        )}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-white">{company.name}</p>
                      <p className="text-[10px] text-[#71717a] mt-0.5">
                        {company.hqCity} &middot; {company.stage}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-[#a1a1aa] bg-white/5 px-2 py-1 rounded-md">
                        {sector.name}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={cn("text-sm font-semibold", getScoreColor(company.investability))}>
                        {company.investability}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={cn("text-sm font-semibold", getScoreColor(company.riskScore, true))}>
                        {company.riskScore}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={cn("text-sm font-medium", getScoreColor(company.growthRate))}>
                        +{company.growthRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-sm font-medium text-white">
                        {formatCurrency(company.totalFunding)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={cn("text-sm font-semibold", getScoreColor(analysis.fundingMomentum.score))}>
                        {analysis.fundingMomentum.score}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={cn("text-sm font-semibold", getScoreColor(analysis.saudiRelevance.score))}>
                        {analysis.saudiRelevance.score}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={cn("text-sm font-semibold", getScoreColor(analysis.marketGap.score))}>
                        {analysis.marketGap.score}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span
                        className={cn(
                          "text-[11px] font-semibold px-2 py-1 rounded-full border",
                          recommendationColors[analysis.recommendation]
                        )}
                      >
                        {analysis.recommendation}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/companies/${company.id}`}
                        className="text-[#71717a] hover:text-white transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sector Rankings Table */}
      {viewMode === "sectors" && (
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e1e2e]">
                  <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-widest text-[#71717a] w-12">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">
                    Sector
                  </th>
                  {[
                    { key: "attractiveness" as SectorSortKey, label: "Attractiveness" },
                    { key: "riskScore" as SectorSortKey, label: "Risk" },
                    { key: "marketGap" as SectorSortKey, label: "Market Gap" },
                    { key: "fundingMomentum" as SectorSortKey, label: "Momentum" },
                    { key: "competitionIntensity" as SectorSortKey, label: "Competition" },
                    { key: "saudiRelevance" as SectorSortKey, label: "Saudi Rel." },
                    { key: "totalFunding" as SectorSortKey, label: "Total Funding" },
                    { key: "yoyGrowth" as SectorSortKey, label: "YoY Growth" },
                  ].map(({ key, label }) => (
                    <th
                      key={key}
                      className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a] cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSectorSort(key)}
                    >
                      <span className="flex items-center justify-end gap-1">
                        {label}
                        {sectorSortKey === key && (
                          <ArrowUpDown className="w-3 h-3 text-emerald-400" />
                        )}
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {filteredSectors.map(({ sector, companyCount }, i) => (
                  <tr
                    key={sector.id}
                    className="border-b border-[#1e1e2e]/50 hover:bg-white/[0.02] transition-colors animate-fade-in"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={cn(
                          "inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-bold",
                          getRankBadge(i)
                        )}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-white">{sector.name}</p>
                      <p className="text-[10px] text-[#71717a] mt-0.5">
                        {sector.arabicName} &middot; {companyCount} companies
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={cn("text-sm font-semibold", getScoreColor(sector.attractiveness))}>
                        {sector.attractiveness}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={cn("text-sm font-semibold", getScoreColor(sector.riskScore, true))}>
                        {sector.riskScore}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={cn("text-sm font-semibold", getScoreColor(sector.marketGap))}>
                        {sector.marketGap}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={cn("text-sm font-semibold", getScoreColor(sector.fundingMomentum))}>
                        {sector.fundingMomentum}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={cn("text-sm font-semibold", getScoreColor(sector.competitionIntensity, true))}>
                        {sector.competitionIntensity}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={cn("text-sm font-semibold", getScoreColor(sector.saudiRelevance))}>
                        {sector.saudiRelevance}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-sm font-medium text-white">
                        {formatCurrency(sector.totalFunding)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={cn("text-sm font-medium", getScoreColor(sector.yoyGrowth))}>
                        +{sector.yoyGrowth}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/sectors/${sector.id}`}
                        className="text-[#71717a] hover:text-white transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
