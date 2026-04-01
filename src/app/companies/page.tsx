"use client";

import { companies } from "@/data/companies";
import { sectors } from "@/data/sectors";
import { formatCurrency, cn } from "@/lib/utils";
import { useState } from "react";
import { Search, ArrowUpDown } from "lucide-react";

type SortKey = "investability" | "totalFunding" | "growthRate" | "riskScore" | "name";

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("investability");
  const [sortAsc, setSortAsc] = useState(false);

  const stages = Array.from(new Set(companies.map((c) => c.stage)));

  const filtered = companies
    .filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchSector = sectorFilter === "all" || c.sectorId === sectorFilter;
      const matchStage = stageFilter === "all" || c.stage === stageFilter;
      return matchSearch && matchSector && matchStage;
    })
    .sort((a, b) => {
      if (sortKey === "name") {
        return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      const diff = (a[sortKey] as number) - (b[sortKey] as number);
      return sortAsc ? diff : -diff;
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(false);
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

  return (
    <div className="p-8 space-y-6 max-w-[1400px] mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">Companies</h1>
        <p className="text-sm text-[#71717a]">
          {companies.length} companies across {sectors.length} sectors
        </p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#12121a] border border-[#1e1e2e] rounded-lg text-sm text-white placeholder:text-[#71717a] focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        <select
          value={sectorFilter}
          onChange={(e) => setSectorFilter(e.target.value)}
          className="px-4 py-2.5 bg-[#12121a] border border-[#1e1e2e] rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
        >
          <option value="all">All Sectors</option>
          {sectors.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="px-4 py-2.5 bg-[#12121a] border border-[#1e1e2e] rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
        >
          <option value="all">All Stages</option>
          {stages.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div className="text-xs text-[#71717a] ml-auto">
          {filtered.length} results
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e2e]">
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">
                  Company
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">
                  Sector
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">
                  Stage
                </th>
                <th
                  className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a] cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("totalFunding")}
                >
                  <span className="flex items-center justify-end gap-1">
                    Funding <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a] cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("investability")}
                >
                  <span className="flex items-center justify-end gap-1">
                    Investability <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a] cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("riskScore")}
                >
                  <span className="flex items-center justify-end gap-1">
                    Risk <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a] cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("growthRate")}
                >
                  <span className="flex items-center justify-end gap-1">
                    Growth <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">
                  Employees
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">
                  Investors
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((company, i) => (
                <tr
                  key={company.id}
                  className="border-b border-[#1e1e2e]/50 hover:bg-white/[0.02] transition-colors animate-fade-in"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-white">{company.name}</p>
                      <p className="text-[10px] text-[#71717a] mt-0.5">
                        {company.hqCity} &middot; Est. {company.foundedYear}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-[#a1a1aa] bg-white/5 px-2 py-1 rounded-md">
                      {getSectorName(company.sectorId)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-[#a1a1aa]">{company.stage}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm font-medium text-white">
                      {formatCurrency(company.totalFunding)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className={cn("text-sm font-semibold", getScoreColor(company.investability))}>
                      {company.investability}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className={cn("text-sm font-semibold", getScoreColor(company.riskScore, true))}>
                      {company.riskScore}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className={cn("text-sm font-medium", getScoreColor(company.growthRate))}>
                      +{company.growthRate}%
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm text-[#a1a1aa]">{company.employees}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {company.investors.slice(0, 2).map((inv) => (
                        <span
                          key={inv}
                          className="text-[10px] text-[#71717a] bg-white/5 px-1.5 py-0.5 rounded"
                        >
                          {inv}
                        </span>
                      ))}
                      {company.investors.length > 2 && (
                        <span className="text-[10px] text-[#71717a]">
                          +{company.investors.length - 2}
                        </span>
                      )}
                    </div>
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
