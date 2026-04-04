"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";

interface ScatterPoint {
  name: string;
  arabicName: string;
  investability: number;
  riskScore: number;
  totalFunding: number;
  stage: string;
}

const stageColors: Record<string, string> = {
  Growth: "#10b981",
  "Series C": "#06b6d4",
  "Series B": "#8b5cf6",
  "Series A": "#f59e0b",
  Seed: "#ef4444",
  "Pre-Seed": "#ec4899",
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: ScatterPoint }> }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="glass rounded-lg p-3 border border-[#1e1e2e] shadow-xl" dir="rtl">
      <p className="text-sm font-bold text-white">{d.arabicName}</p>
      <p className="text-xs text-[#71717a]">{d.name}</p>
      <div className="mt-2 space-y-1 text-xs">
        <p className="text-emerald-400">الاستثمارية: {d.investability}/100</p>
        <p className="text-rose-400">المخاطر: {d.riskScore}/100</p>
        <p className="text-cyan-400">التمويل: ${(d.totalFunding / 1_000_000).toFixed(0)}M</p>
        <p className="text-violet-400">المرحلة: {d.stage}</p>
      </div>
    </div>
  );
}

export function InvestabilityScatter({ data }: { data: ScatterPoint[] }) {
  const grouped = data.reduce<Record<string, ScatterPoint[]>>((acc, d) => {
    (acc[d.stage] ||= []).push(d);
    return acc;
  }, {});

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-1">المخاطر مقابل الاستثمارية</h3>
      <p className="text-xs text-[#71717a] mb-4">Risk vs Investability — bubble size = funding</p>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
          <XAxis
            dataKey="riskScore"
            type="number"
            domain={[0, 100]}
            name="Risk"
            label={{ value: "Risk Score", position: "bottom", fill: "#71717a", fontSize: 11 }}
            tick={{ fill: "#71717a", fontSize: 10 }}
            stroke="#1e1e2e"
          />
          <YAxis
            dataKey="investability"
            type="number"
            domain={[0, 100]}
            name="Investability"
            label={{ value: "Investability", angle: -90, position: "insideLeft", fill: "#71717a", fontSize: 11 }}
            tick={{ fill: "#71717a", fontSize: 10 }}
            stroke="#1e1e2e"
          />
          <ZAxis dataKey="totalFunding" range={[40, 400]} />
          <Tooltip content={<CustomTooltip />} />
          {Object.entries(grouped).map(([stage, points]) => (
            <Scatter
              key={stage}
              name={stage}
              data={points}
              fill={stageColors[stage] || "#71717a"}
              fillOpacity={0.7}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-3 mt-3 justify-center">
        {Object.entries(stageColors).map(([stage, color]) => (
          <div key={stage} className="flex items-center gap-1.5 text-xs text-[#a1a1aa]">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            {stage}
          </div>
        ))}
      </div>
    </div>
  );
}
