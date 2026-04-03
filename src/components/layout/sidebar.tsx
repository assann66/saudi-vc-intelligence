"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  PieChart,
  Shield,
  Zap,
  Trophy,
  FileText,
  ArrowLeftRight,
  Menu,
  X,
  Settings,
} from "lucide-react";
import { GlobalSearch } from "./global-search";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Sectors", href: "/sectors", icon: PieChart },
  { name: "Companies", href: "/companies", icon: Building2 },
];

const analyticsNav = [
  { name: "Rankings", href: "/rankings", icon: Trophy },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Risk Insights", href: "/risk-insights", icon: Shield },
  { name: "Compare", href: "/compare", icon: ArrowLeftRight },
];

const adminNav = [
  { name: "إدارة الشركات", href: "/admin/companies", icon: Building2 },
  { name: "إدارة القطاعات", href: "/admin/sectors", icon: PieChart },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-[#12121a] border border-[#1e1e2e] text-white"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "w-64 border-r border-[#1e1e2e] bg-[#0d0d14] flex flex-col shrink-0",
          "fixed md:relative inset-y-0 left-0 z-50 transition-transform duration-300 md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
      {/* Logo */}
      <div className="p-6 border-b border-[#1e1e2e] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center animate-pulse-glow">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">Saudi VC</h1>
            <p className="text-[10px] text-[#71717a] uppercase tracking-widest">Intelligence</p>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-[#71717a] hover:text-white transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Global Search */}
      <GlobalSearch />

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
              onClick={() => setMobileOpen(false)}
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
          {analyticsNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
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
        </div>

        {isAdmin && (
          <div className="pt-6">
            <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">
              <Settings className="w-3 h-3 inline-block ml-1" />
              Admin
            </p>
            {adminNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
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
          </div>
        )}
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
    </>
  );
}
