"use client";

import { Brain, TrendingUp, Building2, Target } from "lucide-react";

interface AISummary {
  overview: string;
  topSectorInsight: string;
  topCompanyInsight: string;
  marketTrend: string;
}

export function AISummaryCard({ summary, loading }: { summary: AISummary | null; loading: boolean }) {
  if (loading) {
    return (
      <div className="glass rounded-xl p-6 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-violet-500/20" />
          <div className="h-6 w-48 bg-[#1e1e2e] rounded" />
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-[#1e1e2e] rounded w-full" />
          <div className="h-4 bg-[#1e1e2e] rounded w-3/4" />
          <div className="h-4 bg-[#1e1e2e] rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="glass rounded-xl p-6 border border-violet-500/20">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">ملخص الذكاء الاصطناعي</h2>
          <p className="text-xs text-[#71717a]">AI Market Intelligence Summary</p>
        </div>
      </div>

      <div className="space-y-4" dir="rtl">
        <div className="flex items-start gap-3">
          <Target className="w-4 h-4 text-violet-400 mt-1 shrink-0" />
          <p className="text-sm text-[#d4d4d8] leading-relaxed">{summary.overview}</p>
        </div>

        {summary.topSectorInsight && (
          <div className="flex items-start gap-3">
            <TrendingUp className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
            <p className="text-sm text-[#d4d4d8] leading-relaxed">{summary.topSectorInsight}</p>
          </div>
        )}

        {summary.topCompanyInsight && (
          <div className="flex items-start gap-3">
            <Building2 className="w-4 h-4 text-cyan-400 mt-1 shrink-0" />
            <p className="text-sm text-[#d4d4d8] leading-relaxed">{summary.topCompanyInsight}</p>
          </div>
        )}

        <div className="mt-4 p-3 rounded-lg bg-violet-500/5 border border-violet-500/10">
          <p className="text-sm text-violet-300 leading-relaxed">{summary.marketTrend}</p>
        </div>
      </div>
    </div>
  );
}
