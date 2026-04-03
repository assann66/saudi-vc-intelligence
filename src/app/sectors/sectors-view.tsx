"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Sector } from "@/data/sectors";
import { formatCurrency, cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { TrendingUp, Building2, DollarSign, BarChart3, Search, X } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function SectorsView({
  sectors,
  pagination,
  currentQ,
}: {
  sectors: Sector[];
  pagination: PaginationInfo;
  currentQ?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(currentQ ?? "");

  useEffect(() => {
    setSearchValue(currentQ ?? "");
  }, [currentQ]);

  const updateSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (term) params.set("q", term);
      else params.delete("q");
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const current = currentQ ?? "";
      if (searchValue !== current) {
        updateSearch(searchValue);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue, currentQ, updateSearch]);

  const filterParams: Record<string, string> = {};
  if (currentQ) filterParams.q = currentQ;

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">Sector Overview</h1>
          <p className="text-sm text-[#71717a]">
            {pagination.total} Saudi VC sectors ranked by attractiveness
          </p>
        </div>
        <div className="relative min-w-[240px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
          <input
            type="text"
            placeholder="Search sectors..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-[#12121a] border border-[#1e1e2e] rounded-lg text-sm text-white placeholder:text-[#71717a] focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
          {searchValue && (
            <button
              onClick={() => {
                setSearchValue("");
                updateSearch("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {sectors.map((sector, i) => (
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
                <p className="text-sm font-semibold text-white">{sector.companyCount}</p>
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
        ))}
      </div>

      {sectors.length === 0 && (
        <div className="text-center py-12 text-sm text-[#71717a]">
          No sectors found matching your search.
        </div>
      )}

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        baseUrl="/sectors"
        searchParams={filterParams}
      />
    </div>
  );
}
