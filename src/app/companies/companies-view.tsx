"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Company } from "@/data/companies";
import type { Sector } from "@/data/sectors";
import { formatCurrency, cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { Search, ArrowUpDown, ChevronRight, X } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";

type SortKey = "investability" | "totalFunding" | "growthRate" | "riskScore" | "name";

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface Filters {
  q?: string;
  sectorId?: string;
  stage?: string;
  sortBy?: string;
  order?: string;
}

export default function CompaniesView({
  companies,
  sectors,
  pagination,
  currentFilters,
}: {
  companies: (Company & { sector?: Sector })[];
  sectors: Sector[];
  pagination: PaginationInfo;
  currentFilters: Filters;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(currentFilters.q ?? "");

  useEffect(() => {
    setSearchValue(currentFilters.q ?? "");
  }, [currentFilters.q]);

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v) params.set(k, v);
        else params.delete(k);
      }
      if (!updates.page) params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const current = currentFilters.q ?? "";
      if (searchValue !== current) {
        updateParams({ q: searchValue || undefined, page: undefined });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue, currentFilters.q, updateParams]);

  const handleSort = (key: SortKey) => {
    const currentSort = currentFilters.sortBy ?? "investability";
    const currentOrder = currentFilters.order ?? "desc";
    if (currentSort === key) {
      updateParams({ sortBy: key, order: currentOrder === "desc" ? "asc" : "desc" });
    } else {
      updateParams({ sortBy: key, order: "desc" });
    }
  };

  const getSectorName = (id: string) => sectors.find((s) => s.id === id)?.name ?? id;

  const getScoreColor = (score: number, inverse = false) => {
    const effective = inverse ? 100 - score : score;
    if (effective >= 80) return "text-emerald-400";
    if (effective >= 60) return "text-cyan-400";
    if (effective >= 40) return "text-amber-400";
    return "text-rose-400";
  };

  const stages = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C", "Growth"];

  const filterParams: Record<string, string> = {};
  if (currentFilters.q) filterParams.q = currentFilters.q;
  if (currentFilters.sectorId) filterParams.sectorId = currentFilters.sectorId;
  if (currentFilters.stage) filterParams.stage = currentFilters.stage;
  if (currentFilters.sortBy) filterParams.sortBy = currentFilters.sortBy;
  if (currentFilters.order) filterParams.order = currentFilters.order;

  return (
    <div className="p-8 space-y-6 max-w-[1400px] mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">Companies</h1>
        <p className="text-sm text-[#71717a]">
          {pagination.total} companies across {sectors.length} sectors
        </p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-[#12121a] border border-[#1e1e2e] rounded-lg text-sm text-white placeholder:text-[#71717a] focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
          {searchValue && (
            <button
              onClick={() => {
                setSearchValue("");
                updateParams({ q: undefined, page: undefined });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <select
          value={currentFilters.sectorId ?? "all"}
          onChange={(e) => updateParams({ sectorId: e.target.value === "all" ? undefined : e.target.value, page: undefined })}
          className="px-4 py-2.5 bg-[#12121a] border border-[#1e1e2e] rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
        >
          <option value="all">All Sectors</option>
          {sectors.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select
          value={currentFilters.stage ?? "all"}
          onChange={(e) => updateParams({ stage: e.target.value === "all" ? undefined : e.target.value, page: undefined })}
          className="px-4 py-2.5 bg-[#12121a] border border-[#1e1e2e] rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
        >
          <option value="all">All Stages</option>
          {stages.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e2e]">
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">Company</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">Sector</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">Stage</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a] cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("totalFunding")}>
                  <span className="flex items-center justify-end gap-1">Funding <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a] cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("investability")}>
                  <span className="flex items-center justify-end gap-1">Investability <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a] cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("riskScore")}>
                  <span className="flex items-center justify-end gap-1">Risk <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a] cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("growthRate")}>
                  <span className="flex items-center justify-end gap-1">Growth <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">Employees</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">Investors</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a]"></th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company, i) => (
                <tr key={company.id} className="border-b border-[#1e1e2e]/50 hover:bg-white/[0.02] transition-colors animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-white">{company.name}</p>
                      <p className="text-[10px] text-[#71717a] mt-0.5">{company.hqCity} &middot; Est. {company.foundedYear}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-[#a1a1aa] bg-white/5 px-2 py-1 rounded-md">{getSectorName(company.sectorId)}</span>
                  </td>
                  <td className="px-5 py-4"><span className="text-xs text-[#a1a1aa]">{company.stage}</span></td>
                  <td className="px-5 py-4 text-right"><span className="text-sm font-medium text-white">{formatCurrency(company.totalFunding)}</span></td>
                  <td className="px-5 py-4 text-right"><span className={cn("text-sm font-semibold", getScoreColor(company.investability))}>{company.investability}</span></td>
                  <td className="px-5 py-4 text-right"><span className={cn("text-sm font-semibold", getScoreColor(company.riskScore, true))}>{company.riskScore}</span></td>
                  <td className="px-5 py-4 text-right"><span className={cn("text-sm font-medium", getScoreColor(company.growthRate))}>+{company.growthRate}%</span></td>
                  <td className="px-5 py-4 text-right"><span className="text-sm text-[#a1a1aa]">{company.employees}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {company.investors.slice(0, 2).map((inv) => (
                        <span key={inv} className="text-[10px] text-[#71717a] bg-white/5 px-1.5 py-0.5 rounded">{inv}</span>
                      ))}
                      {company.investors.length > 2 && <span className="text-[10px] text-[#71717a]">+{company.investors.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/companies/${company.id}`} className="text-[#71717a] hover:text-white transition-colors"><ChevronRight className="w-4 h-4" /></Link>
                  </td>
                </tr>
              ))}
              {companies.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center text-sm text-[#71717a]">
                    No companies found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 border-t border-[#1e1e2e]">
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            baseUrl="/companies"
            searchParams={filterParams}
          />
        </div>
      </div>
    </div>
  );
}
