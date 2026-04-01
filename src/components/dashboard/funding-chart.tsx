"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const fundingData = [
  { quarter: "Q1 2024", fintech: 180, ecommerce: 120, healthtech: 55, cleantech: 65, ai: 95 },
  { quarter: "Q2 2024", fintech: 220, ecommerce: 145, healthtech: 68, cleantech: 85, ai: 130 },
  { quarter: "Q3 2024", fintech: 280, ecommerce: 165, healthtech: 82, cleantech: 110, ai: 170 },
  { quarter: "Q4 2024", fintech: 340, ecommerce: 195, healthtech: 95, cleantech: 145, ai: 210 },
  { quarter: "Q1 2025", fintech: 410, ecommerce: 230, healthtech: 115, cleantech: 190, ai: 280 },
  { quarter: "Q2 2025", fintech: 480, ecommerce: 265, healthtech: 140, cleantech: 240, ai: 350 },
  { quarter: "Q3 2025", fintech: 520, ecommerce: 310, healthtech: 165, cleantech: 285, ai: 420 },
  { quarter: "Q4 2025", fintech: 580, ecommerce: 350, healthtech: 195, cleantech: 330, ai: 490 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass rounded-lg p-3 shadow-xl border border-white/10">
      <p className="text-xs font-semibold text-white mb-2">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[#a1a1aa] capitalize">{entry.name}:</span>
          <span className="text-white font-medium">${entry.value}M</span>
        </div>
      ))}
    </div>
  );
};

export function FundingChart() {
  return (
    <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: "450ms" }}>
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-white">Cumulative Funding Trends</h3>
        <p className="text-xs text-[#71717a] mt-1">Top 5 sectors quarterly funding ($M)</p>
      </div>

      <div className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={fundingData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorFintech" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCleantech" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
            <XAxis
              dataKey="quarter"
              tick={{ fill: "#71717a", fontSize: 10 }}
              axisLine={{ stroke: "#1e1e2e" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#71717a", fontSize: 10 }}
              axisLine={{ stroke: "#1e1e2e" }}
              tickLine={false}
              tickFormatter={(v) => `$${v}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="fintech"
              stroke="#10b981"
              fill="url(#colorFintech)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="ai"
              stroke="#8b5cf6"
              fill="url(#colorAi)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="cleantech"
              stroke="#06b6d4"
              fill="url(#colorCleantech)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="ecommerce"
              stroke="#f59e0b"
              fill="transparent"
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            <Area
              type="monotone"
              dataKey="healthtech"
              stroke="#f43f5e"
              fill="transparent"
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        {[
          { label: "FinTech", color: "bg-emerald-500" },
          { label: "AI & Data", color: "bg-violet-500" },
          { label: "CleanTech", color: "bg-cyan-500" },
          { label: "E-Commerce", color: "bg-amber-500" },
          { label: "HealthTech", color: "bg-rose-500" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={cn("w-2 h-2 rounded-full", item.color)} />
            <span className="text-[10px] text-[#71717a]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
