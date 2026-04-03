"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/companies?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="px-3 pb-2">
      {open ? (
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#71717a]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => { if (!query) setOpen(false); }}
              placeholder="Search companies..."
              className="w-full pl-9 pr-3 py-2 bg-[#12121a] border border-[#1e1e2e] rounded-lg text-xs text-white placeholder:text-[#71717a] focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
        </form>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#71717a] hover:text-white hover:bg-white/5 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search...</span>
          <kbd className="ml-auto text-[9px] px-1.5 py-0.5 rounded border border-[#1e1e2e] text-[#71717a]">/</kbd>
        </button>
      )}
    </div>
  );
}
