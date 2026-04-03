"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import type { Sector } from "@/data/sectors";
import { useState, useMemo } from "react";

const COLORS = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#f43f5e"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass rounded-lg p-3 shadow-xl border border-white/10">
      <p className="text-xs font-semibold text-white mb-2">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[#a1a1aa]">{entry.name}:</span>
          <span className="text-white font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export function SectorChart({ sectors }: { sectors: Sector[] }) {
  const [view, setView] = useState<"bar" | "radar">("bar");

  const barData = useMemo(() => [...sectors]
    .sort((a, b) => b.attractiveness - a.attractiveness)
    .map((s) => ({
      name: s.name,
      attractiveness: s.attractiveness,
      saudiRelevance: s.saudiRelevance,
      fundingMomentum: s.fundingMomentum,
    })), [sectors]);

  const topSectors = useMemo(() => [...sectors]
    .sort((a, b) => b.attractiveness - a.attractiveness)
    .slice(0, 5), [sectors]);

  const radarData = useMemo(() => [
    "attractiveness",
    "saudiRelevance",
    "fundingMomentum",
    "marketGap",
    "competitionIntensity",
  ].map((key) => {
    const point: Record<string, string | number> = {
      metric: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase()),
    };
    topSectors.forEach((s) => {
      point[s.name] = s[key as keyof typeof s] as number;
    });
    return point;
  }), [topSectors]);

  return (
    <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-white">Sector Analysis</h3>
          <p className="text-xs text-[#71717a] mt-1">
            Comparative sector performance metrics
          </p>
        </div>
        <div className="flex gap-1 bg-[#0a0a0f] rounded-lg p-0.5">
          <button
            onClick={() => setView("bar")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              view === "bar"
                ? "bg-emerald-500/20 text-emerald-400"
                : "text-[#71717a] hover:text-white"
            }`}
          >
            Bar
          </button>
          <button
            onClick={() => setView("radar")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              view === "radar"
                ? "bg-emerald-500/20 text-emerald-400"
                : "text-[#71717a] hover:text-white"
            }`}
          >
            Radar
          </button>
        </div>
      </div>

      <div className="h-[340px]">
        {view === "bar" ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#71717a", fontSize: 10 }}
                axisLine={{ stroke: "#1e1e2e" }}
                tickLine={false}
                angle={-30}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fill: "#71717a", fontSize: 10 }}
                axisLine={{ stroke: "#1e1e2e" }}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="attractiveness" fill="#10b981" radius={[4, 4, 0, 0]} name="Attractiveness" />
              <Bar dataKey="saudiRelevance" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Saudi Relevance" />
              <Bar dataKey="fundingMomentum" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Funding Momentum" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e1e2e" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "#71717a", fontSize: 9 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: "#71717a", fontSize: 9 }}
                axisLine={false}
              />
              {topSectors.map((s, i) => (
                <Radar
                  key={s.id}
                  name={s.name}
                  dataKey={s.name}
                  stroke={COLORS[i]}
                  fill={COLORS[i]}
                  fillOpacity={0.1}
                />
              ))}
              <Legend
                wrapperStyle={{ fontSize: 10, color: "#71717a" }}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
