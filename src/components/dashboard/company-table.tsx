"use client";

import type { Company } from "@/data/companies";
import type { Sector } from "@/data/sectors";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

type SortKey = "investability" | "totalFunding" | "growthRate" | "riskScore";

const sortKeyLabels: Record<SortKey, string> = {
  investability: "قابلية الاستثمار",
  totalFunding: "التمويل",
  growthRate: "معدل النمو",
  riskScore: "المخاطر",
};

export function CompanyTable({ companies, sectors }: { companies: Company[]; sectors: Sector[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("investability");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = [...companies].sort((a, b) => {
    const diff = (a[sortKey] as number) - (b[sortKey] as number);
    return sortAsc ? diff : -diff;
  });

  const topCompanies = sorted.slice(0, 12);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const getSectorName = (sectorId: string) => {
    const sector = sectors.find((s) => s.id === sectorId);
    return sector?.arabicName ?? sector?.name ?? sectorId;
  };

  const getScoreColor = (score: number, inverse = false) => {
    const effective = inverse ? 100 - score : score;
    if (effective >= 80) return "text-emerald-400";
    if (effective >= 60) return "text-cyan-400";
    if (effective >= 40) return "text-amber-400";
    return "text-rose-400";
  };

  const getScoreBg = (score: number, inverse = false) => {
    const effective = inverse ? 100 - score : score;
    if (effective >= 80) return "bg-emerald-500/10";
    if (effective >= 60) return "bg-cyan-500/10";
    if (effective >= 40) return "bg-amber-500/10";
    return "bg-rose-500/10";
  };

  return (
    <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: "500ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-white font-heading">أبرز الشركات</h3>
          <p className="text-xs text-[#71717a] mt-1">
            مرتبة حسب {sortKeyLabels[sortKey]}
          </p>
        </div>
        <Link
          href="/companies"
          className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
        >
          عرض الكل <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e1e2e]">
              <th className="text-right text-[10px] font-semibold tracking-widest text-[#71717a] pb-3 pl-4">
                الشركة
              </th>
              <th className="text-right text-[10px] font-semibold tracking-widest text-[#71717a] pb-3 pl-4">
                القطاع
              </th>
              <th className="text-right text-[10px] font-semibold tracking-widest text-[#71717a] pb-3 pl-4">
                المرحلة
              </th>
              <th
                className="text-left text-[10px] font-semibold tracking-widest text-[#71717a] pb-3 pl-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort("totalFunding")}
              >
                <span className="flex items-center justify-start gap-1">
                  التمويل <ArrowUpDown className="w-3 h-3" />
                </span>
              </th>
              <th
                className="text-left text-[10px] font-semibold tracking-widest text-[#71717a] pb-3 pl-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort("investability")}
              >
                <span className="flex items-center justify-start gap-1">
                  الاستثمار <ArrowUpDown className="w-3 h-3" />
                </span>
              </th>
              <th
                className="text-left text-[10px] font-semibold tracking-widest text-[#71717a] pb-3 pl-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort("riskScore")}
              >
                <span className="flex items-center justify-start gap-1">
                  المخاطر <ArrowUpDown className="w-3 h-3" />
                </span>
              </th>
              <th
                className="text-left text-[10px] font-semibold tracking-widest text-[#71717a] pb-3 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort("growthRate")}
              >
                <span className="flex items-center justify-start gap-1">
                  النمو <ArrowUpDown className="w-3 h-3" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {topCompanies.map((company) => (
              <tr
                key={company.id}
                className="border-b border-[#1e1e2e]/50 hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-3 pl-4">
                  <div>
                    <p className="text-sm font-medium text-white">{company.name}</p>
                    <p className="text-[10px] text-[#71717a]">{company.hqCity}</p>
                  </div>
                </td>
                <td className="py-3 pl-4">
                  <span className="text-xs text-[#a1a1aa] bg-white/5 px-2 py-1 rounded-md">
                    {getSectorName(company.sectorId)}
                  </span>
                </td>
                <td className="py-3 pl-4">
                  <span className="text-xs text-[#a1a1aa]">{company.stage}</span>
                </td>
                <td className="py-3 pl-4 text-left">
                  <span className="text-sm font-medium text-white">
                    {formatCurrency(company.totalFunding)}
                  </span>
                </td>
                <td className="py-3 pl-4 text-left">
                  <span
                    className={cn(
                      "text-sm font-semibold px-2 py-0.5 rounded",
                      getScoreColor(company.investability),
                      getScoreBg(company.investability)
                    )}
                  >
                    {company.investability}
                  </span>
                </td>
                <td className="py-3 pl-4 text-left">
                  <span
                    className={cn(
                      "text-sm font-semibold px-2 py-0.5 rounded",
                      getScoreColor(company.riskScore, true),
                      getScoreBg(company.riskScore, true)
                    )}
                  >
                    {company.riskScore}
                  </span>
                </td>
                <td className="py-3 text-left">
                  <span className={cn("text-sm font-medium", getScoreColor(company.growthRate))}>
                    +{company.growthRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
