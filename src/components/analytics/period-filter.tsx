"use client";

import { cn } from "@/lib/utils";

const periods = [
  { value: "7d", label: "7 أيام", labelEn: "7d" },
  { value: "30d", label: "30 يوم", labelEn: "30d" },
  { value: "90d", label: "90 يوم", labelEn: "90d" },
  { value: "all", label: "الكل", labelEn: "All" },
];

export function PeriodFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-1 bg-[#12121a] rounded-lg p-1 border border-[#1e1e2e]">
      {periods.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
            value === p.value
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "text-[#71717a] hover:text-white hover:bg-white/5"
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
