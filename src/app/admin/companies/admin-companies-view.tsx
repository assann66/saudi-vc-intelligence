"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2, X, Loader2, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Sector = {
  id: string;
  name: string;
  arabicName: string;
};

type Company = {
  id: string;
  name: string;
  arabicName: string;
  sectorId: string;
  stage: string;
  foundedYear: number;
  totalFunding: number;
  lastRoundSize: number;
  lastRoundDate: string;
  investability: number;
  riskScore: number;
  growthRate: number;
  employees: number;
  hqCity: string;
  description: string;
  investors: string[];
  sector: Sector;
};

const stages = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C", "Growth"];

const emptyForm = {
  id: "",
  name: "",
  arabicName: "",
  sectorId: "",
  stage: "Seed",
  foundedYear: 2024,
  totalFunding: 0,
  lastRoundSize: 0,
  lastRoundDate: "",
  investability: 50,
  riskScore: 50,
  growthRate: 0,
  employees: 0,
  hqCity: "الرياض",
  description: "",
  investors: [] as string[],
};

export function AdminCompaniesView({
  companies: initial,
  sectors,
}: {
  companies: Company[];
  sectors: Sector[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [investorInput, setInvestorInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setInvestorInput("");
    setError("");
    setShowForm(true);
  }

  function openEdit(c: Company) {
    setEditing(c.id);
    setForm({
      id: c.id,
      name: c.name,
      arabicName: c.arabicName,
      sectorId: c.sectorId,
      stage: c.stage,
      foundedYear: c.foundedYear,
      totalFunding: c.totalFunding,
      lastRoundSize: c.lastRoundSize,
      lastRoundDate: c.lastRoundDate,
      investability: c.investability,
      riskScore: c.riskScore,
      growthRate: c.growthRate,
      employees: c.employees,
      hqCity: c.hqCity,
      description: c.description,
      investors: c.investors,
    });
    setInvestorInput("");
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = editing ? `/api/companies/${editing}` : "/api/companies";
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
      const res = await fetch(`/api/companies/${id}`, { method: "DELETE" });
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

  function addInvestor() {
    const trimmed = investorInput.trim();
    if (trimmed && !form.investors.includes(trimmed)) {
      setForm({ ...form, investors: [...form.investors, trimmed] });
      setInvestorInput("");
    }
  }

  function removeInvestor(inv: string) {
    setForm({ ...form, investors: form.investors.filter((i) => i !== inv) });
  }

  return (
    <div>
      {/* Header with tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <Link
            href="/admin/companies"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          >
            الشركات
          </Link>
          <Link
            href="/admin/sectors"
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#a1a1aa] hover:text-white hover:bg-white/5"
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
          إضافة شركة
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
                {editing ? "تعديل الشركة" : "إضافة شركة جديدة"}
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
                      placeholder="company-id"
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
                <FormField label="القطاع" required>
                  <select
                    value={form.sectorId}
                    onChange={(e) => setForm({ ...form, sectorId: e.target.value })}
                    className="form-input"
                    required
                  >
                    <option value="">اختر القطاع</option>
                    {sectors.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.arabicName} ({s.name})
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="المرحلة" required>
                  <select
                    value={form.stage}
                    onChange={(e) => setForm({ ...form, stage: e.target.value })}
                    className="form-input"
                    required
                  >
                    {stages.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="سنة التأسيس">
                  <input
                    type="number"
                    value={form.foundedYear}
                    onChange={(e) => setForm({ ...form, foundedYear: parseInt(e.target.value) || 0 })}
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
                <FormField label="حجم آخر جولة ($M)">
                  <input
                    type="number"
                    step="0.1"
                    value={form.lastRoundSize}
                    onChange={(e) => setForm({ ...form, lastRoundSize: parseFloat(e.target.value) || 0 })}
                    className="form-input"
                  />
                </FormField>
                <FormField label="تاريخ آخر جولة">
                  <input
                    type="text"
                    value={form.lastRoundDate}
                    onChange={(e) => setForm({ ...form, lastRoundDate: e.target.value })}
                    placeholder="2024-Q1"
                    className="form-input"
                  />
                </FormField>
                <FormField label="قابلية الاستثمار (0-100)">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.investability}
                    onChange={(e) => setForm({ ...form, investability: parseInt(e.target.value) || 0 })}
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
                <FormField label="معدل النمو (%)">
                  <input
                    type="number"
                    value={form.growthRate}
                    onChange={(e) => setForm({ ...form, growthRate: parseInt(e.target.value) || 0 })}
                    className="form-input"
                  />
                </FormField>
                <FormField label="عدد الموظفين">
                  <input
                    type="number"
                    min={0}
                    value={form.employees}
                    onChange={(e) => setForm({ ...form, employees: parseInt(e.target.value) || 0 })}
                    className="form-input"
                  />
                </FormField>
                <FormField label="المدينة">
                  <input
                    type="text"
                    value={form.hqCity}
                    onChange={(e) => setForm({ ...form, hqCity: e.target.value })}
                    className="form-input"
                    dir="rtl"
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

              <FormField label="المستثمرون">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={investorInput}
                    onChange={(e) => setInvestorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addInvestor();
                      }
                    }}
                    placeholder="اسم المستثمر"
                    className="form-input flex-1"
                  />
                  <button
                    type="button"
                    onClick={addInvestor}
                    className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm hover:bg-emerald-500/20"
                  >
                    إضافة
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.investors.map((inv) => (
                    <span
                      key={inv}
                      className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#1e1e2e] text-xs text-[#a1a1aa]"
                    >
                      {inv}
                      <button type="button" onClick={() => removeInvestor(inv)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
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
                  {editing ? "حفظ التعديلات" : "إنشاء الشركة"}
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
            <p className="text-sm text-[#a1a1aa] mb-4">هل أنت متأكد من حذف هذه الشركة؟ لا يمكن التراجع عن هذا الإجراء.</p>
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

      {/* Companies table */}
      <div className="glass rounded-xl border border-[#1e1e2e] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e2e]">
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#71717a] uppercase">الشركة</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#71717a] uppercase">القطاع</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#71717a] uppercase">المرحلة</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#71717a] uppercase">التمويل</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#71717a] uppercase">الاستثمارية</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-[#71717a] uppercase">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {initial.map((company) => (
                <tr key={company.id} className="border-b border-[#1e1e2e]/50 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{company.name}</p>
                        <p className="text-xs text-[#71717a]" dir="rtl">{company.arabicName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#a1a1aa]">{company.sector.arabicName}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-md text-xs bg-[#1e1e2e] text-[#a1a1aa]">
                      {company.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#a1a1aa]">${company.totalFunding}M</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        company.investability >= 70
                          ? "text-emerald-400"
                          : company.investability >= 40
                          ? "text-amber-400"
                          : "text-red-400"
                      )}
                    >
                      {company.investability}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEdit(company)}
                        className="p-1.5 rounded-md hover:bg-white/5 text-[#71717a] hover:text-white transition-colors"
                        title="تعديل"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(company.id)}
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
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>لا توجد شركات بعد</p>
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
