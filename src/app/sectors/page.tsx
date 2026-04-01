"use client";

import Link from "next/link";
import { sectors } from "@/data/sectors";
import { companies } from "@/data/companies";
import { formatCurrency, cn } from "@/lib/utils";
import { TrendingUp, Building2, DollarSign, BarChart3 } from "lucide-react";

export default function SectorsPage() {
  const sortedSectors = [...sectors].sort((a, b) => b.attractiveness - a.attractiveness);

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">Sector Overview</h1>
        <p className="text-sm text-[#71717a]">
          Deep-dive into {sectors.length} Saudi VC sectors ranked by attractiveness
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {sortedSectors.map((sector, i) => {
          const sectorCompanies = companies.filter((c) => c.sectorId === sector.id);
          return (
            <Link
              key={sector.id}
              href={`/sectors/${sector.id}`}
              className="glass glass-hover rounded-xl p-6 transition-all duration-300 hover:scale-[1.01] animate-fade-in cursor-pointer block"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-white">{sector.name}</h3>
                  <p className="text-xs text-emerald-400/70 font-medium">{sector.arabicName}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-400">
                    +{sector.yoyGrowth}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#a1a1aa] mb-5 leading-relaxed line-clamp-2">
                {sector.description}
              </p>

              <div className="space-y-3 mb-5">
                {[
                  { label: "Attractiveness", value: sector.attractiveness, color: "bg-emerald-500" },
                  { label: "Saudi Relevance", value: sector.saudiRelevance, color: "bg-cyan-500" },
                  { label: "Funding Momentum", value: sector.fundingMomentum, color: "bg-violet-500" },
                  { label: "Market Gap", value: sector.marketGap, color: "bg-amber-500" },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                        {metric.label}
                      </span>
                      <span className="text-[10px] font-semibold text-white">
                        {metric.value}/100
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#1e1e2e] rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-700", metric.color)}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#1e1e2e]">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <DollarSign className="w-3 h-3 text-[#71717a]" />
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {formatCurrency(sector.totalFunding)}
                  </p>
                  <p className="text-[9px] text-[#71717a] uppercase">Total Funded</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Building2 className="w-3 h-3 text-[#71717a]" />
                  </div>
                  <p className="text-sm font-semibold text-white">{sectorCompanies.length}</p>
                  <p className="text-[9px] text-[#71717a] uppercase">Companies</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <BarChart3 className="w-3 h-3 text-[#71717a]" />
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {formatCurrency(sector.avgDealSize)}
                  </p>
                  <p className="text-[9px] text-[#71717a] uppercase">Avg Deal</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
