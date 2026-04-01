"use client";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { SectorChart } from "@/components/dashboard/sector-chart";
import { FundingChart } from "@/components/dashboard/funding-chart";
import { CompanyTable } from "@/components/dashboard/company-table";
import { sectors } from "@/data/sectors";
import { companies } from "@/data/companies";
import { formatCurrency } from "@/lib/utils";
import {
  Target,
  TrendingUp,
  Shield,
  Crosshair,
  Zap,
  Swords,
  Landmark,
} from "lucide-react";

function computeAvg(arr: number[]) {
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

export default function Dashboard() {
  const avgAttractiveness = computeAvg(sectors.map((s) => s.attractiveness));
  const avgInvestability = computeAvg(companies.map((c) => c.investability));
  const avgRisk = computeAvg(companies.map((c) => c.riskScore));
  const avgMarketGap = computeAvg(sectors.map((s) => s.marketGap));
  const avgFundingMomentum = computeAvg(sectors.map((s) => s.fundingMomentum));
  const avgCompetition = computeAvg(sectors.map((s) => s.competitionIntensity));
  const avgSaudiRelevance = computeAvg(sectors.map((s) => s.saudiRelevance));
  const totalFunding = sectors.reduce((sum, s) => sum + s.totalFunding, 0);

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Executive Dashboard
          </h1>
          <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
            Live
          </span>
        </div>
        <p className="text-sm text-[#71717a]">
          Saudi VC ecosystem intelligence &mdash; {sectors.length} sectors, {companies.length} companies, {formatCurrency(totalFunding)} total funding tracked
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <KpiCard
          title="Sector Attractiveness"
          value={avgAttractiveness}
          subtitle="Avg. across sectors"
          change={8}
          icon={Target}
          color="emerald"
          delay={0}
        />
        <KpiCard
          title="Investability"
          value={avgInvestability}
          subtitle="Company avg."
          change={12}
          icon={TrendingUp}
          color="cyan"
          delay={50}
        />
        <KpiCard
          title="Risk Score"
          value={avgRisk}
          subtitle="Lower is better"
          change={-5}
          icon={Shield}
          color="rose"
          delay={100}
        />
        <KpiCard
          title="Market Gap"
          value={avgMarketGap}
          subtitle="Opportunity index"
          change={15}
          icon={Crosshair}
          color="violet"
          delay={150}
        />
        <KpiCard
          title="Funding Momentum"
          value={avgFundingMomentum}
          subtitle="Capital velocity"
          change={22}
          icon={Zap}
          color="amber"
          delay={200}
        />
        <KpiCard
          title="Competition"
          value={avgCompetition}
          subtitle="Market density"
          change={3}
          icon={Swords}
          color="blue"
          delay={250}
        />
        <KpiCard
          title="Saudi Relevance"
          value={avgSaudiRelevance}
          subtitle="Vision 2030 align."
          change={6}
          icon={Landmark}
          color="indigo"
          delay={300}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectorChart />
        <FundingChart />
      </div>

      {/* Company Table */}
      <CompanyTable />
    </div>
  );
}
