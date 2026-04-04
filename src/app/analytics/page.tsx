"use client";

import { useState } from "react";
import useSWR from "swr";
import { AISummaryCard } from "@/components/analytics/ai-summary-card";
import { PeriodFilter } from "@/components/analytics/period-filter";
import { SectorFilter } from "@/components/analytics/sector-filter";
import { InvestabilityScatter } from "@/components/analytics/investability-scatter";
import { FundingBySectorChart } from "@/components/analytics/funding-by-sector-chart";
import { BarChart3, Brain } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("all");
  const [sectorId, setSectorId] = useState("");

  const params = new URLSearchParams();
  if (period !== "all") params.set("period", period);
  if (sectorId) params.set("sectorId", sectorId);
  const qs = params.toString();

  const { data, isLoading } = useSWR(
    `/api/analytics${qs ? `?${qs}` : ""}`,
    fetcher,
    { refreshInterval: 30000 }
  );

  const sectors = data?.fundingBySector?.map((s: { name: string; arabicName: string }) => ({
    id: s.name.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and"),
    name: s.name,
    arabicName: s.arabicName,
  })) || [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-heading">لوحة تحليلات الذكاء الاصطناعي</h1>
            <p className="text-sm text-[#71717a]">تحليلات مدعومة بالذكاء الاصطناعي لمنظومة رأس المال الجريء</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <SectorFilter sectors={sectors} value={sectorId} onChange={setSectorId} />
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>
      </div>

      {/* AI Summary */}
      <AISummaryCard summary={data?.aiSummary || null} loading={isLoading} />

      {/* Stats Row */}
      {data?.stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "القطاعات", value: data.stats.totalSectors, color: "emerald" },
            { label: "الشركات", value: data.stats.totalCompanies, color: "cyan" },
            { label: "إجمالي التمويل", value: `$${(data.stats.totalFunding / 1e9).toFixed(1)}B`, color: "violet" },
            { label: "متوسط الجاذبية", value: `${data.stats.avgAttractiveness}/100`, color: "amber" },
            { label: "متوسط المخاطر", value: `${data.stats.avgRisk}/100`, color: "rose" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4 text-center">
              <p className="text-xs text-[#71717a] mb-1">{stat.label}</p>
              <p className={`text-xl font-bold text-${stat.color}-400`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data?.fundingBySector && <FundingBySectorChart data={data.fundingBySector} />}
        {data?.scatterData && <InvestabilityScatter data={data.scatterData} />}
      </div>

      {/* Sector Analyses */}
      {data?.sectorAnalyses && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white font-heading">تحليل القطاعات</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.sectorAnalyses.map((sa: {
              sector: { id: string; name: string; arabicName: string; attractiveness: number };
              analysis: { overallVerdict: string; keyOpportunities: string[]; keyRisks: string[] };
              companyCount: number;
              totalFunding: number;
              avgInvestability: number;
            }) => (
              <div key={sa.sector.id} className="glass rounded-xl p-5" dir="rtl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-white">{sa.sector.arabicName}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                    {sa.sector.attractiveness}/100
                  </span>
                </div>
                <p className="text-sm text-[#a1a1aa] mb-3 leading-relaxed">{sa.analysis.overallVerdict}</p>
                <div className="flex gap-4 text-xs text-[#71717a]">
                  <span>{sa.companyCount} شركة</span>
                  <span>${(sa.totalFunding / 1e6).toFixed(0)}M تمويل</span>
                  <span>استثمارية {sa.avgInvestability}/100</span>
                </div>
                <div className="mt-3 space-y-1">
                  {sa.analysis.keyOpportunities.slice(0, 2).map((o: string, i: number) => (
                    <p key={i} className="text-xs text-emerald-400/80">+ {o}</p>
                  ))}
                  {sa.analysis.keyRisks.slice(0, 1).map((r: string, i: number) => (
                    <p key={i} className="text-xs text-rose-400/80">- {r}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
