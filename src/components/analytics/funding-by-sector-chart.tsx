"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface SectorFunding {
  name: string;
  arabicName: string;
  totalFunding: number;
  companyCount: number;
  attractiveness: number;
  riskScore: number;
  marketGap: number;
  fundingMomentum: number;
  saudiRelevance: number;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: SectorFunding }> }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="glass rounded-lg p-3 border border-[#1e1e2e] shadow-xl" dir="rtl">
      <p className="text-sm font-bold text-white">{d.arabicName}</p>
      <div className="mt-2 space-y-1 text-xs">
        <p className="text-emerald-400">التمويل: ${(d.totalFunding / 1_000_000_000).toFixed(2)}B</p>
        <p className="text-cyan-400">الجاذبية: {d.attractiveness}/100</p>
        <p className="text-violet-400">فجوة السوق: {d.marketGap}/100</p>
        <p className="text-amber-400">زخم التمويل: {d.fundingMomentum}/100</p>
        <p className="text-rose-400">المخاطر: {d.riskScore}/100</p>
      </div>
    </div>
  );
}

export function FundingBySectorChart({ data }: { data: SectorFunding[] }) {
  const chartData = data.map((d) => ({
    ...d,
    fundingB: +(d.totalFunding / 1_000_000_000).toFixed(2),
  }));

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-1">التمويل حسب القطاع</h3>
      <p className="text-xs text-[#71717a] mb-4">Sector Funding & Metrics Comparison</p>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
          <XAxis dataKey="arabicName" tick={{ fill: "#71717a", fontSize: 10 }} stroke="#1e1e2e" />
          <YAxis tick={{ fill: "#71717a", fontSize: 10 }} stroke="#1e1e2e" />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, color: "#a1a1aa" }} />
          <Bar dataKey="attractiveness" name="الجاذبية" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="fundingMomentum" name="زخم التمويل" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          <Bar dataKey="marketGap" name="فجوة السوق" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="saudiRelevance" name="التوافق مع رؤية 2030" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
