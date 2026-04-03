"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2, X, Loader2, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

type Sector = {
  id: string;
  name: string;
  arabicName: string;
  attractiveness: number;
  riskScore: number;
  marketGap: number;
  fundingMomentum: number;
  competitionIntensity: number;
  saudiRelevance: number;
  totalFunding: number;
  companyCount: number;
  avgDealSize: number;
  yoyGrowth: number;
  description: string;
  _count: { companies: number };
};

const emptyForm = {
  id: "",
  name: "",
  arabicName: "",
  attractiveness: 50,
  riskScore: 50,
  marketGap: 50,
  fundingMomentum: 50,
  competitionIntensity: 50,
  saudiRelevance: 50,
  totalFunding: 0,
  companyCount: 0,
  avgDealSize: 0,
  yoyGrowth: 0,
  description: "",
};

export function AdminSectorsView({ sectors: initial }: { sectors: Sector[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  }

  function openEdit(s: Sector) {
    setEditing(s.id);
    setForm({
      id: s.id,
      name: s.name,
      arabicName: s.arabicName,
      attractiveness: s.attractiveness,
      riskScore: s.riskScore,
      marketGap: s.marketGap,
      fundingMomentum: s.fundingMomentum,
      competitionIntensity: s.competitionIntensity,
      saudiRelevance: s.saudiRelevance,
      totalFunding: s.totalFunding,
      companyCount: s.companyCount,
      avgDealSize: s.avgDealSize,
      yoyGrowth: s.yoyGrowth,
      description: s.description,
    });
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = editing ? `/api/sectors/${editing}` : "/api/sectors";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "حدث خطأ");
        return;
      }

      setShowForm(false);
      router.refresh();
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/sectors/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "حدث خطأ في الحذف");
        return;
      }
      setDeleteConfirm(null);
      router.refresh();
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Header with tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <Link
            href="/admin/companies"
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#a1a1aa] hover:text-white hover:bg-white/5"
          >
            الشركات
          </Link>
          <Link
            href="/admin/sectors"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          >
            القطاعات
          </Link>
          <Link
            href="/admin/import"
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#a1a1aa] hover:text-white hover:bg-white/5"
          >
            استيراد البيانات
          </Link>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          إضافة قطاع
        </button>
      </div>

      {error && !showForm && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="glass rounded-xl border border-[#1e1e2e] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">
                {editing ? "تعديل القطاع" : "إضافة قطاع جديد"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-[#71717a] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {!editing && (
                  <FormField label="المعرف" required>
                    <input
                      type="text"
                      value={form.id}
                      onChange={(e) => setForm({ ...form, id: e.target.value })}
                      placeholder="sector-id"
                      className="form-input"
                      required
                    />
                  </FormField>
                )}
                <FormField label="الاسم (English)" required>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="form-input"
                    required
                  />
                </FormField>
                <FormField label="الاسم العربي" required>
                  <input
                    type="text"
                    value={form.arabicName}
                    onChange={(e) => setForm({ ...form, arabicName: e.target.value })}
                    className="form-input"
                    dir="rtl"
                    required
                  />
                </FormField>
                <FormField label="الجاذبية (0-100)">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.attractiveness}
                    onChange={(e) => setForm({ ...form, attractiveness: parseInt(e.target.value) || 0 })}
                    className="form-input"
                  />
                </FormField>
                <FormField label="مؤشر المخاطر (0-100)">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.riskScore}
                    onChange={(e) => setForm({ ...form, riskScore: parseInt(e.target.value) || 0 })}
                    className="form-input"
                  />
                </FormField>
                <FormField label="فجوة السوق (0-100)">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.marketGap}
                    onChange={(e) => setForm({ ...form, marketGap: parseInt(e.target.value) || 0 })}
                    className="form-input"
                  />
                </FormField>
                <FormField label="زخم التمويل (0-100)">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.fundingMomentum}
                    onChange={(e) => setForm({ ...form, fundingMomentum: parseInt(e.target.value) || 0 })}
                    className="form-input"
                  />
                </FormField>
                <FormField label="شدة المنافسة (0-100)">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.competitionIntensity}
                    onChange={(e) => setForm({ ...form, competitionIntensity: parseInt(e.target.value) || 0 })}
                    className="form-input"
                  />
                </FormField>
                <FormField label="الصلة بالسعودية (0-100)">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.saudiRelevance}
                    onChange={(e) => setForm({ ...form, saudiRelevance: parseInt(e.target.value) || 0 })}
                    className="form-input"
                  />
                </FormField>
                <FormField label="إجمالي التمويل ($M)">
                  <input
                    type="number"
                    step="0.1"
                    value={form.totalFunding}
                    onChange={(e) => setForm({ ...form, totalFunding: parseFloat(e.target.value) || 0 })}
                    className="form-input"
                  />
                </FormField>
                <FormField label="عدد الشركات">
                  <input
                    type="number"
                    min={0}
                    value={form.companyCount}
                    onChange={(e) => setForm({ ...form, companyCount: parseInt(e.target.value) || 0 })}
                    className="form-input"
                  />
                </FormField>
                <FormField label="متوسط حجم الصفقة ($M)">
                  <input
                    type="number"
                    step="0.1"
                    value={form.avgDealSize}
                    onChange={(e) => setForm({ ...form, avgDealSize: parseFloat(e.target.value) || 0 })}
                    className="form-input"
                  />
                </FormField>
                <FormField label="النمو السنوي (%)">
                  <input
                    type="number"
                    value={form.yoyGrowth}
                    onChange={(e) => setForm({ ...form, yoyGrowth: parseInt(e.target.value) || 0 })}
                    className="form-input"
                  />
                </FormField>
              </div>

              <FormField label="الوصف" required>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="form-input min-h-[80px]"
                  dir="rtl"
                  required
                />
              </FormField>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1e1e2e]">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg text-sm text-[#a1a1aa] hover:text-white hover:bg-white/5"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editing ? "حفظ التعديلات" : "إنشاء القطاع"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="glass rounded-xl border border-[#1e1e2e] p-6 max-w-sm w-full">
            <h3 className="text-white font-bold mb-2">تأكيد الحذف</h3>
            <p className="text-sm text-[#a1a1aa] mb-4">
              هل أنت متأكد من حذف هذا القطاع؟ سيؤثر ذلك على جميع الشركات المرتبطة به.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg text-sm text-[#a1a1aa] hover:text-white hover:bg-white/5"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sectors table */}
      <div className="glass rounded-xl border border-[#1e1e2e] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e2e]">
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#71717a] uppercase">القطاع</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#71717a] uppercase">الجاذبية</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#71717a] uppercase">المخاطر</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#71717a] uppercase">التمويل</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#71717a] uppercase">الشركات</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-[#71717a] uppercase">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {initial.map((sector) => (
                <tr key={sector.id} className="border-b border-[#1e1e2e]/50 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                        <PieChart className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{sector.name}</p>
                        <p className="text-xs text-[#71717a]" dir="rtl">{sector.arabicName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        sector.attractiveness >= 70
                          ? "text-emerald-400"
                          : sector.attractiveness >= 40
                          ? "text-amber-400"
                          : "text-red-400"
                      )}
                    >
                      {sector.attractiveness}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        sector.riskScore <= 30
                          ? "text-emerald-400"
                          : sector.riskScore <= 60
                          ? "text-amber-400"
                          : "text-red-400"
                      )}
                    >
                      {sector.riskScore}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#a1a1aa]">${sector.totalFunding}M</td>
                  <td className="px-4 py-3 text-sm text-[#a1a1aa]">{sector._count.companies}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEdit(sector)}
                        className="p-1.5 rounded-md hover:bg-white/5 text-[#71717a] hover:text-white transition-colors"
                        title="تعديل"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(sector.id)}
                        className="p-1.5 rounded-md hover:bg-red-500/10 text-[#71717a] hover:text-red-400 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {initial.length === 0 && (
          <div className="text-center py-12 text-[#71717a]">
            <PieChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>لا توجد قطاعات بعد</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-[#a1a1aa] mb-1 block" dir="rtl">
        {label}
        {required && <span className="text-red-400 mr-1">*</span>}
      </span>
      {children}
    </label>
  );
}
