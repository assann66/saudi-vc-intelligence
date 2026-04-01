"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  PieChart,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Sectors", href: "/sectors", icon: PieChart },
  { name: "Companies", href: "/companies", icon: Building2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-[#1e1e2e] bg-[#0d0d14] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#1e1e2e]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">Saudi VC</h1>
            <p className="text-[10px] text-[#71717a] uppercase tracking-widest">Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">
          Overview
        </p>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-[#a1a1aa] hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive && "text-emerald-400")} />
              {item.name}
            </Link>
          );
        })}

        <div className="pt-6">
          <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">
            Analytics
          </p>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#a1a1aa] hover:text-white hover:bg-white/5 transition-all cursor-pointer">
            <TrendingUp className="w-4 h-4" />
            Trends
            <span className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">Soon</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#a1a1aa] hover:text-white hover:bg-white/5 transition-all cursor-pointer">
            <Shield className="w-4 h-4" />
            Risk Monitor
            <span className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">Soon</span>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#1e1e2e]">
        <div className="glass rounded-lg p-3">
          <p className="text-[10px] text-[#71717a] uppercase tracking-widest mb-1">Data Updated</p>
          <p className="text-xs text-white font-medium">April 1, 2026</p>
          <p className="text-[10px] text-emerald-400 mt-1">28 companies tracked</p>
        </div>
      </div>
    </aside>
  );
}
