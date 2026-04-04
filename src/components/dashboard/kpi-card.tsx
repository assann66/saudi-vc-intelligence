"use client";

import { cn } from "@/lib/utils";
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  icon: LucideIcon;
  color: "emerald" | "cyan" | "violet" | "amber" | "rose" | "blue" | "indigo";
  delay?: number;
}

const colorMap = {
  emerald: {
    bg: "from-emerald-500/10 to-emerald-600/5",
    border: "border-emerald-500/20",
    icon: "text-emerald-400",
    glow: "shadow-emerald-500/5",
  },
  cyan: {
    bg: "from-cyan-500/10 to-cyan-600/5",
    border: "border-cyan-500/20",
    icon: "text-cyan-400",
    glow: "shadow-cyan-500/5",
  },
  violet: {
    bg: "from-violet-500/10 to-violet-600/5",
    border: "border-violet-500/20",
    icon: "text-violet-400",
    glow: "shadow-violet-500/5",
  },
  amber: {
    bg: "from-amber-500/10 to-amber-600/5",
    border: "border-amber-500/20",
    icon: "text-amber-400",
    glow: "shadow-amber-500/5",
  },
  rose: {
    bg: "from-rose-500/10 to-rose-600/5",
    border: "border-rose-500/20",
    icon: "text-rose-400",
    glow: "shadow-rose-500/5",
  },
  blue: {
    bg: "from-blue-500/10 to-blue-600/5",
    border: "border-blue-500/20",
    icon: "text-blue-400",
    glow: "shadow-blue-500/5",
  },
  indigo: {
    bg: "from-indigo-500/10 to-indigo-600/5",
    border: "border-indigo-500/20",
    icon: "text-indigo-400",
    glow: "shadow-indigo-500/5",
  },
};

export function KpiCard({ title, value, subtitle, change, icon: Icon, color, delay = 0 }: KpiCardProps) {
  const colors = colorMap[color];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-gradient-to-br p-5 transition-all duration-300 hover:scale-[1.02] animate-fade-in",
        colors.bg,
        colors.border,
        colors.glow,
        "shadow-lg"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#71717a]">
            {title}
          </p>
          <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-[#a1a1aa]">{subtitle}</p>
          )}
        </div>
        <div className={cn("p-2 rounded-lg bg-white/5", colors.icon)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1.5">
          {change >= 0 ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
          )}
          <span
            className={cn(
              "text-xs font-medium",
              change >= 0 ? "text-emerald-400" : "text-rose-400"
            )}
          >
            {change >= 0 ? "+" : ""}{change}%
          </span>
          <span className="text-[10px] text-[#71717a]">مقارنة بالربع السابق</span>
        </div>
      )}

      {/* Decorative gradient orb */}
      <div
        className={cn(
          "absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 blur-2xl",
          color === "emerald" && "bg-emerald-500",
          color === "cyan" && "bg-cyan-500",
          color === "violet" && "bg-violet-500",
          color === "amber" && "bg-amber-500",
          color === "rose" && "bg-rose-500",
          color === "blue" && "bg-blue-500",
          color === "indigo" && "bg-indigo-500"
        )}
      />
    </div>
  );
}
