"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { sectors } from "@/data/sectors";
import { companies } from "@/data/companies";
import { analyzeSector } from "@/lib/scoring";
import { formatCurrency, cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  TrendingUp,
  Building2,
  DollarSign,
  Shield,
  Target,
  Zap,
  BarChart3,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface AiInsight {
  summary: string;
  outlook: string;
  topPlay: string;
}

export default function SectorDeepDivePage() {
  const params = useParams();
  const sectorId = params.id as string;
  const sector = sectors.find((s) => s.id === sectorId);
  const sectorCompanies = useMemo(
    () => companies.filter((c) => c.sectorId === sectorId).sort((a, b) => b.investability - a.investability),
    [sectorId]
  );

  const analysis = useMemo(
    () => (sector ? analyzeSector(sector, sectorCompanies) : null),
    [sector, sectorCompanies]
  );

  const [aiInsight, setAiInsight] = useState<AiInsight | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);

  useEffect(() => {
    if (!sector) return;
    setAiLoading(true);
    setAiError(false);
    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "sector", id: sectorId }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setAiInsight(d.analysis))
      .catch(() => setAiError(true))
      .finally(() => setAiLoading(false));
  }, [sector, sectorId]);

  if (!sector || !analysis) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-center space-y-3">
          <p className="text-lg text-white font-medium">Sector not found</p>
          <Link href="/sectors" className="text-sm text-emerald-400 hover:underline">
            Back to Sectors
          </Link>
        </div>
      </div>
    );
  }

  const radarData = [
    { metric: "Attractiveness", value: sector.attractiveness },
    { metric: "Saudi Relevance", value: sector.saudiRelevance },
    { metric: "Market Gap", value: sector.marketGap },
    { metric: "Momentum", value: sector.fundingMomentum },
    { metric: "Low Risk", value: 100 - sector.riskScore },
    { metric: "Low Competition", value: 100 - sector.competitionIntensity },
  ];

  const companyChartData = sectorCompanies.slice(0, 8).map((c) => ({
    name: c.name,
    investability: c.investability,
    growth: c.growthRate,
    funding: c.totalFunding / 1_000_000,
  }));

  const scores = [
    { ...analysis.sectorAttractiveness, icon: Target, color: "emerald" },
    { ...analysis.riskScore, icon: Shield, color: "rose", label: "Risk Score" },
    { ...analysis.marketGap, icon: Zap, color: "amber" },
    { ...analysis.fundingMomentum, icon: DollarSign, color: "violet" },
    { ...analysis.competitionIntensity, icon: BarChart3, color: "cyan", label: "Competition" },
    { ...analysis.saudiRelevance, icon: Building2, color: "blue" },
  ];

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          href="/sectors"
          className="mt-1 p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#71717a]" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">{sector.name}</h1>
            <span className="text-sm text-emerald-400/70 font-medium">{sector.arabicName}</span>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full ml-auto">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-400">+{sector.yoyGrowth}% YoY</span>
            </div>
          </div>
          <p className="text-sm text-[#a1a1aa] max-w-2xl">{sector.description}</p>
        </div>
      </div>

      {/* AI Insight Banner */}
      <div className="glass rounded-xl p-5 border border-emerald-500/10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">AI Analysis</span>
          {aiLoading && <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin ml-1" />}
        </div>
        {aiInsight ? (
          <div className="space-y-2">
            <p className="text-sm text-white leading-relaxed">{aiInsight.summary}</p>
            <p className="text-sm text-[#a1a1aa] leading-relaxed">{aiInsight.outlook}</p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] text-emerald-400 uppercase font-semibold tracking-wider">Top Play:</span>
              <span className="text-sm text-white">{aiInsight.topPlay}</span>
            </div>
          </div>
        ) : aiError ? (
          <div className="space-y-2">
            <p className="text-sm text-white leading-relaxed">{analysis.overallVerdict}</p>
            <p className="text-sm text-[#a1a1aa] leading-relaxed italic">{analysis.investmentThesis}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-white/5 rounded animate-pulse w-1/2" />
          </div>
        )}
      </div>

      {/* KPI Score Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {scores.map((s) => (
          <div key={s.label} className="glass rounded-xl p-4 group relative">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={cn("w-4 h-4", `text-${s.color}-400`)} />
              <span className="text-[10px] text-[#71717a] uppercase tracking-wider font-semibold">
                {s.label}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{s.score}</span>
              <span className="text-xs text-[#71717a]">/100</span>
            </div>
            <span
              className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded mt-1 inline-block",
                s.rating === "Excellent" && "bg-emerald-500/15 text-emerald-400",
                s.rating === "Strong" && "bg-cyan-500/15 text-cyan-400",
                s.rating === "Moderate" && "bg-amber-500/15 text-amber-400",
                (s.rating === "Weak" || s.rating === "Poor") && "bg-rose-500/15 text-rose-400"
              )}
            >
              {s.rating}
            </span>
            {/* Hover tooltip */}
            <div className="absolute left-0 right-0 top-full mt-2 z-10 hidden group-hover:block">
              <div className="glass rounded-lg p-3 mx-1 shadow-xl border border-[#1e1e2e]">
                {s.factors.map((f, i) => (
                  <p key={i} className="text-[11px] text-[#a1a1aa] leading-relaxed mb-1 last:mb-0">
                    &bull; {f}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Sector Profile</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e1e2e" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "#71717a", fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#71717a", fontSize: 10 }} />
              <Radar
                name={sector.name}
                dataKey="value"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Company Bar Chart */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Top Companies by Investability</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={companyChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "#71717a", fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: "#a1a1aa", fontSize: 11 }} width={100} />
              <Tooltip
                contentStyle={{ backgroundColor: "#12121a", border: "1px solid #1e1e2e", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#e8e8ed" }}
              />
              <Bar dataKey="investability" fill="#10b981" radius={[0, 4, 4, 0]} name="Investability" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Opportunities & Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Key Opportunities</h3>
          </div>
          <div className="space-y-3">
            {analysis.keyOpportunities.map((opp, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-emerald-400">{i + 1}</span>
                </div>
                <p className="text-sm text-[#a1a1aa] leading-relaxed">{opp}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Key Risks</h3>
          </div>
          <div className="space-y-3">
            {analysis.keyRisks.map((risk, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <div className="w-5 h-5 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-amber-400">{i + 1}</span>
                </div>
                <p className="text-sm text-[#a1a1aa] leading-relaxed">{risk}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Investment Thesis */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-3">Investment Thesis</h3>
        <p className="text-sm text-[#a1a1aa] leading-relaxed">{analysis.investmentThesis}</p>
      </div>

      {/* Score Explainability */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-5">Score Explainability</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scores.map((s) => (
            <div key={s.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">{s.label}</span>
                <span className={cn(
                  "text-xs font-semibold",
                  s.rating === "Excellent" && "text-emerald-400",
                  s.rating === "Strong" && "text-cyan-400",
                  s.rating === "Moderate" && "text-amber-400",
                  (s.rating === "Weak" || s.rating === "Poor") && "text-rose-400"
                )}>
                  {s.score}/100 — {s.rating}
                </span>
              </div>
              <div className="h-1.5 bg-[#1e1e2e] rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    s.color === "emerald" && "bg-emerald-500",
                    s.color === "rose" && "bg-rose-500",
                    s.color === "amber" && "bg-amber-500",
                    s.color === "violet" && "bg-violet-500",
                    s.color === "cyan" && "bg-cyan-500",
                    s.color === "blue" && "bg-blue-500"
                  )}
                  style={{ width: `${s.score}%` }}
                />
              </div>
              <ul className="space-y-1">
                {s.factors.map((f, i) => (
                  <li key={i} className="text-[11px] text-[#71717a] leading-relaxed pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-[#71717a]">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Company Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[#1e1e2e]">
          <h3 className="text-sm font-semibold text-white">
            Companies in {sector.name}
            <span className="text-[#71717a] font-normal ml-2">({sectorCompanies.length})</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e2e]">
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">Company</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">Stage</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">Funding</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">Investability</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">Risk</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">Growth</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a]"></th>
              </tr>
            </thead>
            <tbody>
              {sectorCompanies.map((c, i) => (
                <tr
                  key={c.id}
                  className="border-b border-[#1e1e2e]/50 hover:bg-white/[0.02] transition-colors animate-fade-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-white">{c.name}</p>
                    <p className="text-[10px] text-[#71717a]">{c.hqCity} &middot; Est. {c.foundedYear}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-[#a1a1aa]">{c.stage}</td>
                  <td className="px-5 py-4 text-right text-sm font-medium text-white">{formatCurrency(c.totalFunding)}</td>
                  <td className="px-5 py-4 text-right">
                    <span className={cn("text-sm font-semibold", c.investability >= 80 ? "text-emerald-400" : c.investability >= 60 ? "text-cyan-400" : "text-amber-400")}>
                      {c.investability}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className={cn("text-sm font-semibold", c.riskScore <= 35 ? "text-emerald-400" : c.riskScore <= 50 ? "text-amber-400" : "text-rose-400")}>
                      {c.riskScore}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-sm font-medium text-emerald-400">+{c.growthRate}%</td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/companies/${c.id}`} className="text-[#71717a] hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
