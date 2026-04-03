"use client";

import { useState, useMemo, useRef } from "react";
import type { Company } from "@/data/companies";
import type { Sector } from "@/data/sectors";
import { analyzeCompany, analyzeSector } from "@/lib/scoring";
import { formatCurrency, cn } from "@/lib/utils";
import {
  FileText,
  Download,
  Shield,
  Target,
  Zap,
  Star,
} from "lucide-react";

type ReportType = "top-opportunities" | "sector-overview" | "risk-assessment";

export default function ReportsView({ companies, sectors }: { companies: Company[]; sectors: Sector[] }) {
  const [reportType, setReportType] = useState<ReportType>("top-opportunities");
  const [topN, setTopN] = useState(10);
  const reportRef = useRef<HTMLDivElement>(null);

  const companyAnalyses = useMemo(() => {
    return companies.map((company) => {
      const sector = sectors.find((s) => s.id === company.sectorId)!;
      const sectorCompanies = companies.filter((c) => c.sectorId === company.sectorId);
      const analysis = analyzeCompany(company, sector, sectorCompanies);
      return { company, sector, analysis };
    }).sort((a, b) => b.company.investability - a.company.investability);
  }, [companies, sectors]);

  const sectorAnalyses = useMemo(() => {
    return sectors.map((sector) => {
      const sectorCompanies = companies.filter((c) => c.sectorId === sector.id);
      const analysis = analyzeSector(sector, sectorCompanies);
      return { sector, analysis, companies: sectorCompanies };
    }).sort((a, b) => b.sector.attractiveness - a.sector.attractiveness);
  }, [companies, sectors]);

  const topCompanies = companyAnalyses.slice(0, topN);
  const strongBuys = companyAnalyses.filter((c) => c.analysis.recommendation === "Strong Buy");
  const buys = companyAnalyses.filter((c) => c.analysis.recommendation === "Buy");

  const totalMarketFunding = sectors.reduce((s, sec) => s + sec.totalFunding, 0);
  const avgGrowth = sectors.reduce((s, sec) => s + sec.yoyGrowth, 0) / sectors.length;

  const handlePrint = () => {
    window.print();
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
    <div className="p-8 space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-violet-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Executive Reports
            </h1>
          </div>
          <p className="text-sm text-[#71717a]">
            Generate polished investment intelligence summaries
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors print:hidden"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      {/* Report Controls */}
      <div className="flex flex-wrap gap-3 items-center print:hidden">
        {[
          { key: "top-opportunities" as ReportType, label: "Top Opportunities", icon: Star },
          { key: "sector-overview" as ReportType, label: "Sector Overview", icon: Target },
          { key: "risk-assessment" as ReportType, label: "Risk Assessment", icon: Shield },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setReportType(key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border",
              reportType === key
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-[#12121a] text-[#71717a] border-[#1e1e2e] hover:text-white hover:border-[#2e2e3e]"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}

        {reportType === "top-opportunities" && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-[#71717a]">Show top:</span>
            <select
              value={topN}
              onChange={(e) => setTopN(Number(e.target.value))}
              className="px-3 py-2 bg-[#12121a] border border-[#1e1e2e] rounded-lg text-sm text-white focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={28}>All</option>
            </select>
          </div>
        )}
      </div>

      {/* Report Content */}
      <div ref={reportRef} className="space-y-6">
        {/* Report Header Banner */}
        <div className="glass rounded-xl p-8 border border-emerald-500/10 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Saudi VC Intelligence Report</h2>
              <p className="text-xs text-[#71717a]">
                Generated April 1, 2026 &middot;{" "}
                {reportType === "top-opportunities"
                  ? "Top Investment Opportunities"
                  : reportType === "sector-overview"
                  ? "Sector Landscape Overview"
                  : "Risk Assessment Summary"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-6 mt-6">
            <div>
              <p className="text-[10px] text-[#71717a] uppercase tracking-widest">Total Market</p>
              <p className="text-xl font-bold text-white mt-1">{formatCurrency(totalMarketFunding)}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#71717a] uppercase tracking-widest">Sectors Tracked</p>
              <p className="text-xl font-bold text-white mt-1">{sectors.length}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#71717a] uppercase tracking-widest">Companies Analyzed</p>
              <p className="text-xl font-bold text-white mt-1">{companies.length}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#71717a] uppercase tracking-widest">Avg. YoY Growth</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">+{avgGrowth.toFixed(0)}%</p>
            </div>
          </div>
        </div>

        {/* Top Opportunities Report */}
        {reportType === "top-opportunities" && (
          <div className="space-y-4">
            <div className="glass rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-1">Executive Summary</h3>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">
                Analysis of {companies.length} companies across {sectors.length} sectors identifies{" "}
                <span className="text-emerald-400 font-medium">{strongBuys.length} Strong Buy</span> and{" "}
                <span className="text-cyan-400 font-medium">{buys.length} Buy</span> opportunities in the
                Saudi VC ecosystem. FinTech and AI & Data Analytics lead in investability, while
                CleanTech shows the highest growth momentum at 52% YoY. The top {topN} companies
                represent a combined funding base of{" "}
                {formatCurrency(topCompanies.reduce((s, c) => s + c.company.totalFunding, 0))}.
              </p>
            </div>

            <div className="glass rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#1e1e2e]">
                <h3 className="text-sm font-semibold text-white">Top {topN} Investment Opportunities</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1e1e2e]">
                    <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">#</th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">Company</th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">Sector</th>
                    <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">Investability</th>
                    <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">Risk</th>
                    <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">Growth</th>
                    <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">Funding</th>
                    <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">Signal</th>
                  </tr>
                </thead>
                <tbody>
                  {topCompanies.map(({ company, sector, analysis }, i) => (
                    <tr key={company.id} className="border-b border-[#1e1e2e]/50">
                      <td className="px-6 py-3.5 text-sm text-[#71717a] font-medium">{i + 1}</td>
                      <td className="px-6 py-3.5">
                        <p className="text-sm font-medium text-white">{company.name}</p>
                        <p className="text-[10px] text-[#71717a]">{company.stage} &middot; {company.hqCity}</p>
                      </td>
                      <td className="px-6 py-3.5 text-xs text-[#a1a1aa]">{sector.name}</td>
                      <td className={cn("px-6 py-3.5 text-right text-sm font-semibold", getScoreColor(company.investability))}>
                        {company.investability}
                      </td>
                      <td className={cn("px-6 py-3.5 text-right text-sm font-semibold", getScoreColor(company.riskScore, true))}>
                        {company.riskScore}
                      </td>
                      <td className={cn("px-6 py-3.5 text-right text-sm font-medium", getScoreColor(company.growthRate))}>
                        +{company.growthRate}%
                      </td>
                      <td className="px-6 py-3.5 text-right text-sm font-medium text-white">
                        {formatCurrency(company.totalFunding)}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <span className={cn("text-[11px] font-semibold px-2 py-1 rounded-full", recommendationColors[analysis.recommendation])}>
                          {analysis.recommendation}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Investment Thesis for Top 3 */}
            <div className="grid grid-cols-1 gap-4">
              {topCompanies.slice(0, 3).map(({ company, analysis }, i) => (
                <div key={company.id} className="glass rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-lg font-bold text-amber-400">#{i + 1}</span>
                    <h4 className="text-sm font-semibold text-white">{company.name}</h4>
                    <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", recommendationColors[analysis.recommendation])}>
                      {analysis.recommendation}
                    </span>
                  </div>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed mb-3">{analysis.investmentThesis}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-emerald-400 uppercase tracking-widest mb-1.5">Strengths</p>
                      {analysis.strengths.slice(0, 3).map((s, idx) => (
                        <p key={idx} className="text-xs text-[#a1a1aa] mb-1">+ {s}</p>
                      ))}
                    </div>
                    <div>
                      <p className="text-[10px] text-rose-400 uppercase tracking-widest mb-1.5">Risks</p>
                      {analysis.risks.slice(0, 3).map((r, idx) => (
                        <p key={idx} className="text-xs text-[#a1a1aa] mb-1">- {r}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sector Overview Report */}
        {reportType === "sector-overview" && (
          <div className="space-y-4">
            <div className="glass rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-1">Sector Landscape Summary</h3>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">
                The Saudi VC ecosystem spans {sectors.length} key sectors with{" "}
                {formatCurrency(totalMarketFunding)} in total tracked funding. FinTech leads in
                absolute funding ($2.4B), while Entertainment & Sports Tech shows the highest growth
                trajectory (+65% YoY). CleanTech & Energy benefits from the strongest Vision 2030
                alignment (96/100 Saudi Relevance), driven by mega-project demand and energy
                transition priorities.
              </p>
            </div>

            {sectorAnalyses.map(({ sector, analysis, companies: sectorCos }) => (
              <div key={sector.id} className="glass rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{sector.name}</h4>
                    <p className="text-[10px] text-[#71717a] mt-0.5">{sector.arabicName}</p>
                  </div>
                  <div className="flex gap-4 text-right">
                    <div>
                      <p className="text-[10px] text-[#71717a] uppercase tracking-widest">Attractiveness</p>
                      <p className={cn("text-lg font-bold", getScoreColor(sector.attractiveness))}>{sector.attractiveness}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#71717a] uppercase tracking-widest">Funding</p>
                      <p className="text-lg font-bold text-white">{formatCurrency(sector.totalFunding)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#71717a] uppercase tracking-widest">YoY Growth</p>
                      <p className={cn("text-lg font-bold", getScoreColor(sector.yoyGrowth))}>+{sector.yoyGrowth}%</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[#a1a1aa] leading-relaxed mb-3">{analysis.overallVerdict}</p>
                <div className="grid grid-cols-6 gap-3 mb-3">
                  {[
                    { label: "Risk", score: sector.riskScore, inverse: true },
                    { label: "Mkt Gap", score: sector.marketGap },
                    { label: "Momentum", score: sector.fundingMomentum },
                    { label: "Competition", score: sector.competitionIntensity, inverse: true },
                    { label: "Saudi Rel.", score: sector.saudiRelevance },
                    { label: "Companies", score: sectorCos.length, raw: true },
                  ].map(({ label, score, inverse, raw }) => (
                    <div key={label} className="text-center">
                      <p className="text-[10px] text-[#71717a] uppercase tracking-widest">{label}</p>
                      <p className={cn("text-sm font-bold mt-1", raw ? "text-white" : getScoreColor(score, inverse))}>
                        {score}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-emerald-400 uppercase tracking-widest mb-1">Opportunities</p>
                    {analysis.keyOpportunities.slice(0, 2).map((o, i) => (
                      <p key={i} className="text-xs text-[#a1a1aa] mb-0.5">+ {o}</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] text-rose-400 uppercase tracking-widest mb-1">Risks</p>
                    {analysis.keyRisks.slice(0, 2).map((r, i) => (
                      <p key={i} className="text-xs text-[#a1a1aa] mb-0.5">- {r}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Risk Assessment Report */}
        {reportType === "risk-assessment" && (
          <div className="space-y-4">
            <div className="glass rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-1">Risk Assessment Overview</h3>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">
                Comprehensive risk analysis across {companies.length} companies and {sectors.length}{" "}
                sectors. Entertainment & Sports Tech carries the highest sector risk (55/100), while
                FinTech demonstrates the lowest (35/100). At the company level,{" "}
                {companyAnalyses.filter((c) => c.company.riskScore >= 45).length} companies show
                elevated risk profiles requiring enhanced monitoring.
              </p>
            </div>

            {/* High Risk Companies */}
            <div className="glass rounded-xl p-6">
              <h4 className="text-sm font-semibold text-rose-400 mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Elevated Risk Companies (Risk Score {"\u2265"} 45)
              </h4>
              <div className="space-y-3">
                {companyAnalyses
                  .filter((c) => c.company.riskScore >= 45)
                  .sort((a, b) => b.company.riskScore - a.company.riskScore)
                  .map(({ company, sector, analysis }) => (
                    <div key={company.id} className="flex items-center justify-between py-2 border-b border-[#1e1e2e]/50">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-rose-400">{company.riskScore}</span>
                        <div>
                          <p className="text-sm font-medium text-white">{company.name}</p>
                          <p className="text-[10px] text-[#71717a]">{sector.name} &middot; {company.stage}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {analysis.risks.slice(0, 1).map((r, i) => (
                          <p key={i} className="text-xs text-[#a1a1aa]">{r}</p>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Sector Risk Ranking */}
            <div className="glass rounded-xl p-6">
              <h4 className="text-sm font-semibold text-white mb-4">Sector Risk Ranking (Low to High)</h4>
              <div className="space-y-2">
                {[...sectors]
                  .sort((a, b) => a.riskScore - b.riskScore)
                  .map((sector) => {
                    const sectorCos = companies.filter((c) => c.sectorId === sector.id);
                    const avgCompanyRisk = sectorCos.length > 0
                      ? sectorCos.reduce((s, c) => s + c.riskScore, 0) / sectorCos.length
                      : 0;
                    return (
                      <div key={sector.id} className="flex items-center gap-4">
                        <div className="w-32 text-sm text-white font-medium truncate">{sector.name}</div>
                        <div className="flex-1 h-6 bg-[#1e1e2e] rounded-full overflow-hidden relative">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              sector.riskScore <= 40
                                ? "bg-gradient-to-r from-emerald-500/60 to-emerald-500/30"
                                : sector.riskScore <= 50
                                ? "bg-gradient-to-r from-amber-500/60 to-amber-500/30"
                                : "bg-gradient-to-r from-rose-500/60 to-rose-500/30"
                            )}
                            style={{ width: `${sector.riskScore}%` }}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-white">
                            {sector.riskScore}/100
                          </span>
                        </div>
                        <div className="w-24 text-right text-xs text-[#71717a]">
                          Avg Co: {avgCompanyRisk.toFixed(0)}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Underfunded Sectors */}
            <div className="glass rounded-xl p-6">
              <h4 className="text-sm font-semibold text-amber-400 mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" /> Market Gaps & Underfunded Opportunities
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {sectorAnalyses
                  .sort((a, b) => b.sector.marketGap - a.sector.marketGap)
                  .slice(0, 6)
                  .map(({ sector }) => (
                    <div key={sector.id} className="p-4 bg-[#0d0d14] rounded-lg border border-[#1e1e2e]">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-white">{sector.name}</p>
                        <span className={cn("text-sm font-bold", getScoreColor(sector.marketGap))}>
                          Gap: {sector.marketGap}
                        </span>
                      </div>
                      <p className="text-xs text-[#a1a1aa] leading-relaxed">{sector.description}</p>
                      <div className="flex gap-4 mt-2">
                        <span className="text-[10px] text-[#71717a]">
                          Funding: {formatCurrency(sector.totalFunding)}
                        </span>
                        <span className="text-[10px] text-[#71717a]">
                          Competition: {sector.competitionIntensity}/100
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-[10px] text-[#71717a]">
            Saudi VC Intelligence Platform &middot; Confidential Report &middot; Generated April 1, 2026 &middot; Data sources: proprietary analysis engine
          </p>
        </div>
      </div>
    </div>
  );
}
