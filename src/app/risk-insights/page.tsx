"use client";

import { useMemo } from "react";
import Link from "next/link";
import { companies } from "@/data/companies";
import { sectors } from "@/data/sectors";
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

export default function RiskInsightsPage() {
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
      return { sector, analysis, companies: sectorCompanies };
    });
  }, []);

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
          <h1 className="text-2xl font-bold text-white tracking-tight">Risk Insights</h1>
        </div>
        <p className="text-sm text-[#71717a]">
          AI-highlighted risks, market gaps, and underfunded areas across the Saudi VC ecosystem
        </p>
      </div>

      {/* Risk Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass rounded-xl p-5 border-l-2 border-rose-500/50">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <p className="text-[10px] text-[#71717a] uppercase tracking-widest">High Risk Companies</p>
          </div>
          <p className="text-2xl font-bold text-rose-400">{highRiskCompanies.length}</p>
          <p className="text-xs text-[#71717a] mt-1">Risk score {"\u2265"} 40</p>
        </div>
        <div className="glass rounded-xl p-5 border-l-2 border-amber-500/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-amber-400" />
            <p className="text-[10px] text-[#71717a] uppercase tracking-widest">Low Growth</p>
          </div>
          <p className="text-2xl font-bold text-amber-400">{lowGrowthCompanies.length}</p>
          <p className="text-xs text-[#71717a] mt-1">Growth &lt; 35%</p>
        </div>
        <div className="glass rounded-xl p-5 border-l-2 border-orange-500/50">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-orange-400" />
            <p className="text-[10px] text-[#71717a] uppercase tracking-widest">Overheated Sectors</p>
          </div>
          <p className="text-2xl font-bold text-orange-400">{overheatedSectors.length}</p>
          <p className="text-xs text-[#71717a] mt-1">High momentum + high risk</p>
        </div>
        <div className="glass rounded-xl p-5 border-l-2 border-cyan-500/50">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <p className="text-[10px] text-[#71717a] uppercase tracking-widest">Market Gaps</p>
          </div>
          <p className="text-2xl font-bold text-cyan-400">{underfundedSectors.length}</p>
          <p className="text-xs text-[#71717a] mt-1">Gap score {"\u2265"} 70</p>
        </div>
      </div>

      {/* High Risk Companies */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1e1e2e] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-semibold text-white">Elevated Risk Companies</h3>
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
                  <p className="text-[10px] text-[#71717a] uppercase tracking-widest">Investability</p>
                  <p className={cn("text-sm font-bold mt-1", getScoreColor(company.investability))}>{company.investability}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#71717a] uppercase tracking-widest">Growth</p>
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
            <h3 className="text-sm font-semibold text-white">Biggest Market Gaps</h3>
          </div>
          <p className="text-xs text-[#a1a1aa] mb-4 leading-relaxed">
            Sectors with highest unmet market opportunity. High gap scores indicate underpenetrated
            markets where new entrants can capture significant value.
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
                  <span>Competition: {sector.competitionIntensity}/100</span>
                  <span>Funding: {formatCurrency(sector.totalFunding)}</span>
                  <span>{sector.companyCount} companies</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competition Hotspots */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Competition Hotspots</h3>
          </div>
          <p className="text-xs text-[#a1a1aa] mb-4 leading-relaxed">
            Sectors with highest competition intensity. High competition may lead to margin
            compression, elevated CAC, and market consolidation.
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
                  <span>Avg Deal: {formatCurrency(sector.avgDealSize)}</span>
                  <span>Risk: {sector.riskScore}/100</span>
                  <span>Growth: +{sector.yoyGrowth}%</span>
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
            <h3 className="text-sm font-semibold text-orange-400">Overheating Warning</h3>
          </div>
          <p className="text-xs text-[#a1a1aa] mb-4 leading-relaxed">
            These sectors show high funding momentum combined with elevated risk profiles. This
            pattern may indicate excessive capital deployment ahead of market fundamentals.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {overheatedSectors.map(({ sector, analysis }) => (
              <div key={sector.id} className="p-4 bg-[#0d0d14] rounded-lg border border-orange-500/10">
                <p className="text-sm font-medium text-white mb-2">{sector.name}</p>
                <div className="grid grid-cols-3 gap-3 text-center mb-3">
                  <div>
                    <p className="text-[10px] text-[#71717a]">Momentum</p>
                    <p className="text-sm font-bold text-emerald-400">{sector.fundingMomentum}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#71717a]">Risk</p>
                    <p className="text-sm font-bold text-rose-400">{sector.riskScore}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#71717a]">Growth</p>
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
          <h3 className="text-sm font-semibold text-white">Risk Digest — All Sectors</h3>
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
