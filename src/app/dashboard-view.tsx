"use client";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { SectorChart } from "@/components/dashboard/sector-chart";
import { FundingChart } from "@/components/dashboard/funding-chart";
import { CompanyTable } from "@/components/dashboard/company-table";
import type { Sector } from "@/data/sectors";
import type { Company } from "@/data/companies";
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

export default function DashboardView({ sectors, companies }: { sectors: Sector[]; companies: Company[] }) {
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
          <h1 className="text-2xl font-bold text-white tracking-tight font-heading">
            لوحة التحكم التنفيذية
          </h1>
          <span className="px-2.5 py-1 text-[10px] font-semibold tracking-widest bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
            مباشر
          </span>
        </div>
        <p className="text-sm text-[#71717a]">
          ذكاء منظومة رأس المال الجريء السعودي &mdash; {sectors.length} قطاعات، {companies.length} شركة، {formatCurrency(totalFunding)} إجمالي التمويل المتابع
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <KpiCard title="جاذبية القطاع" value={avgAttractiveness} subtitle="المتوسط عبر القطاعات" change={8} icon={Target} color="emerald" delay={0} />
        <KpiCard title="قابلية الاستثمار" value={avgInvestability} subtitle="متوسط الشركات" change={12} icon={TrendingUp} color="cyan" delay={50} />
        <KpiCard title="مؤشر المخاطر" value={avgRisk} subtitle="الأقل أفضل" change={-5} icon={Shield} color="rose" delay={100} />
        <KpiCard title="الفجوة السوقية" value={avgMarketGap} subtitle="مؤشر الفرص" change={15} icon={Crosshair} color="violet" delay={150} />
        <KpiCard title="زخم التمويل" value={avgFundingMomentum} subtitle="سرعة رأس المال" change={22} icon={Zap} color="amber" delay={200} />
        <KpiCard title="المنافسة" value={avgCompetition} subtitle="كثافة السوق" change={3} icon={Swords} color="blue" delay={250} />
        <KpiCard title="الملاءمة السعودية" value={avgSaudiRelevance} subtitle="توافق رؤية 2030" change={6} icon={Landmark} color="indigo" delay={300} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectorChart sectors={sectors} />
        <FundingChart />
      </div>

      {/* Company Table */}
      <CompanyTable companies={companies} sectors={sectors} />
    </div>
  );
}
