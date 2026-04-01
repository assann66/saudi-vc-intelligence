"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { companies } from "@/data/companies";
import { sectors } from "@/data/sectors";
import { analyzeCompany } from "@/lib/scoring";
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
  Users,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface AiInsight {
  summary: string;
  moat: string;
  catalyst: string;
}

export default function CompanyDeepDivePage() {
  const params = useParams();
  const companyId = params.id as string;
  const company = companies.find((c) => c.id === companyId);
  const sector = company ? sectors.find((s) => s.id === company.sectorId) : null;
  const sectorCompanies = useMemo(
    () => (company ? companies.filter((c) => c.sectorId === company.sectorId) : []),
    [company]
  );

  const analysis = useMemo(
    () => (company && sector ? analyzeCompany(company, sector, sectorCompanies) : null),
    [company, sector, sectorCompanies]
  );

  const [aiInsight, setAiInsight] = useState<AiInsight | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);

  useEffect(() => {
    if (!company) return;
    setAiLoading(true);
    setAiError(false);
    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "company", id: companyId }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setAiInsight(d.analysis))
      .catch(() => setAiError(true))
      .finally(() => setAiLoading(false));
  }, [company, companyId]);

  if (!company || !sector || !analysis) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-center space-y-3">
          <p className="text-lg text-white font-medium">Company not found</p>
          <Link href="/companies" className="text-sm text-emerald-400 hover:underline">
            Back to Companies
          </Link>
        </div>
      </div>
    );
  }

  const radarData = [
    { metric: "Investability", value: company.investability },
    { metric: "Low Risk", value: 100 - company.riskScore },
    { metric: "Growth", value: Math.min(100, company.growthRate) },
    { metric: "Market Gap", value: sector.marketGap },
    { metric: "Momentum", value: analysis.fundingMomentum.score },
    { metric: "Saudi Relevance", value: sector.saudiRelevance },
  ];

  const recommendationColor = {
    "Strong Buy": "text-emerald-400 bg-emerald-500/15 border-emerald-500/20",
    Buy: "text-cyan-400 bg-cyan-500/15 border-cyan-500/20",
    Hold: "text-amber-400 bg-amber-500/15 border-amber-500/20",
    Watch: "text-orange-400 bg-orange-500/15 border-orange-500/20",
    Avoid: "text-rose-400 bg-rose-500/15 border-rose-500/20",
  }[analysis.recommendation];

  const scores = [
    { ...analysis.investability, icon: Target, color: "emerald" },
    { ...analysis.riskScore, icon: Shield, color: "rose", label: "Risk Score" },
    { ...analysis.marketGap, icon: Zap, color: "amber" },
    { ...analysis.fundingMomentum, icon: DollarSign, color: "violet" },
    { ...analysis.competitionIntensity, icon: BarChart3, color: "cyan", label: "Competition" },
    { ...analysis.saudiRelevance, icon: Building2, color: "blue" },
  ];

  const sectorPeers = sectorCompanies
    .filter((c) => c.id !== company.id)
    .sort((a, b) => b.investability - a.investability)
    .slice(0, 4);

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/companies" className="mt-1 p-2 rounded-lg hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#71717a]" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold text-white tracking-tight">{company.name}</h1>
            <span className="text-sm text-emerald-400/70 font-medium">{company.arabicName}</span>
            <Link
              href={`/sectors/${sector.id}`}
              className="text-xs text-[#a1a1aa] bg-white/5 px-2.5 py-1 rounded-md hover:bg-white/10 transition-colors flex items-center gap-1"
            >
              {sector.name} <ExternalLink className="w-3 h-3" />
            </Link>
            <div className={cn("ml-auto px-3 py-1.5 rounded-lg border text-sm font-bold", recommendationColor)}>
              {analysis.recommendation}
            </div>
          </div>
          <p className="text-sm text-[#a1a1aa] max-w-2xl">{company.description}</p>
        </div>
      </div>

      {/* Key Facts Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { icon: DollarSign, label: "Total Funding", value: formatCurrency(company.totalFunding) },
          { icon: TrendingUp, label: "Growth Rate", value: `+${company.growthRate}%` },
          { icon: Calendar, label: "Founded", value: String(company.foundedYear) },
          { icon: MapPin, label: "HQ", value: company.hqCity },
          { icon: Users, label: "Employees", value: String(company.employees) },
          { icon: BarChart3, label: "Stage", value: company.stage },
        ].map((item) => (
          <div key={item.label} className="glass rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <item.icon className="w-3.5 h-3.5 text-[#71717a]" />
              <span className="text-[10px] text-[#71717a] uppercase tracking-wider font-semibold">{item.label}</span>
            </div>
            <p className="text-base font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>

      {/* AI Insight Banner */}
      <div className="glass rounded-xl p-5 border border-emerald-500/10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">AI Investment Analysis</span>
          {aiLoading && <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin ml-1" />}
        </div>
        {aiInsight ? (
          <div className="space-y-2">
            <p className="text-sm text-white leading-relaxed">{aiInsight.summary}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-white/[0.02]">
                <span className="text-[10px] text-cyan-400 uppercase font-semibold tracking-wider">Competitive Moat</span>
                <p className="text-sm text-[#a1a1aa] mt-1">{aiInsight.moat}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02]">
                <span className="text-[10px] text-violet-400 uppercase font-semibold tracking-wider">Key Catalyst</span>
                <p className="text-sm text-[#a1a1aa] mt-1">{aiInsight.catalyst}</p>
              </div>
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
              <span className="text-[10px] text-[#71717a] uppercase tracking-wider font-semibold">{s.label}</span>
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

      {/* Radar + Strengths/Risks */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Company Profile</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e1e2e" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "#71717a", fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#71717a", fontSize: 10 }} />
              <Radar
                name={company.name}
                dataKey="value"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Strengths */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Strengths</h3>
          </div>
          <div className="space-y-3">
            {analysis.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-emerald-400">{i + 1}</span>
                </div>
                <p className="text-sm text-[#a1a1aa] leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risks */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Risk Assessment</h3>
          </div>
          <div className="space-y-3">
            {analysis.risks.map((r, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <div className="w-5 h-5 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-amber-400">{i + 1}</span>
                </div>
                <p className="text-sm text-[#a1a1aa] leading-relaxed">{r}</p>
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

      {/* Investors */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Investors</h3>
        <div className="flex flex-wrap gap-3">
          {company.investors.map((inv) => (
            <div key={inv} className="px-4 py-2.5 rounded-lg bg-white/5 border border-[#1e1e2e] hover:border-emerald-500/20 transition-colors">
              <span className="text-sm text-white font-medium">{inv}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Peers */}
      {sectorPeers.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">
            Sector Peers in {sector.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sectorPeers.map((peer) => (
              <Link
                key={peer.id}
                href={`/companies/${peer.id}`}
                className="p-4 rounded-lg bg-white/[0.02] border border-[#1e1e2e] hover:border-emerald-500/20 transition-all hover:scale-[1.01]"
              >
                <p className="text-sm font-medium text-white">{peer.name}</p>
                <p className="text-[10px] text-[#71717a] mt-0.5">{peer.stage} &middot; {peer.hqCity}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-[#a1a1aa]">{formatCurrency(peer.totalFunding)}</span>
                  <span className={cn("text-xs font-semibold", peer.investability >= 80 ? "text-emerald-400" : "text-cyan-400")}>
                    {peer.investability}/100
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
