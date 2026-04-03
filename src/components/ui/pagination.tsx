"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
}

export function Pagination({ page, totalPages, total, baseUrl, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (p: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(p));
    return `${baseUrl}?${params.toString()}`;
  };

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-xs text-[#71717a]">{total} results</p>
      <div className="flex items-center gap-1">
        {page > 1 ? (
          <Link
            href={buildHref(page - 1)}
            className="p-2 rounded-lg text-[#71717a] hover:text-white hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
        ) : (
          <span className="p-2 rounded-lg text-[#1e1e2e]">
            <ChevronLeft className="w-4 h-4" />
          </span>
        )}

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-2 text-xs text-[#71717a]">...</span>
          ) : (
            <Link
              key={p}
              href={buildHref(p)}
              className={cn(
                "min-w-[32px] h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors",
                p === page
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-[#a1a1aa] hover:text-white hover:bg-white/5"
              )}
            >
              {p}
            </Link>
          )
        )}

        {page < totalPages ? (
          <Link
            href={buildHref(page + 1)}
            className="p-2 rounded-lg text-[#71717a] hover:text-white hover:bg-white/5 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <span className="p-2 rounded-lg text-[#1e1e2e]">
            <ChevronRight className="w-4 h-4" />
          </span>
        )}
      </div>
    </div>
  );
}
