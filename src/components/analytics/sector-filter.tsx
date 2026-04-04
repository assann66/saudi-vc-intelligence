"use client";

interface SectorOption {
  id: string;
  name: string;
  arabicName: string;
}

export function SectorFilter({
  sectors,
  value,
  onChange,
}: {
  sectors: SectorOption[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"
      dir="rtl"
    >
      <option value="">جميع القطاعات</option>
      {sectors.map((s) => (
        <option key={s.id} value={s.id}>
          {s.arabicName}
        </option>
      ))}
    </select>
  );
}
