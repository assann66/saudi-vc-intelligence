"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ValidatedRow = {
  row: number;
  data: Record<string, string | number>;
  errors: string[];
  warnings: string[];
  isDuplicate: boolean;
};

type PreviewResult = {
  type: string;
  totalRows: number;
  totalErrors: number;
  totalDuplicates: number;
  columns: string[];
  rows: ValidatedRow[];
};

type ImportResult = {
  success: boolean;
  imported: number;
  skipped: number;
  totalErrors: number;
  totalDuplicates: number;
};

export function ImportView() {
  const [type, setType] = useState<"companies" | "sectors">("companies");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(null);
      setResult(null);
      setError("");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      const ext = dropped.name.split(".").pop()?.toLowerCase();
      if (ext === "csv" || ext === "xlsx" || ext === "xls") {
        setFile(dropped);
        setPreview(null);
        setResult(null);
        setError("");
      } else {
        setError("نوع الملف غير مدعوم. يرجى استخدام CSV أو Excel (.xlsx)");
      }
    }
  }

  async function handlePreview() {
    if (!file) return;
    setLoading(true);
    setError("");
    setPreview(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("action", "preview");

      const res = await fetch("/api/import", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "حدث خطأ في معالجة الملف");
        return;
      }

      setPreview(data);
    } catch {
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  async function handleImport() {
    if (!file) return;
    setImporting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("action", "import");
      formData.append("skipDuplicates", String(skipDuplicates));

      const res = await fetch("/api/import", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "حدث خطأ في الاستيراد");
        return;
      }

      setResult(data);
      setPreview(null);
    } catch {
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setImporting(false);
    }
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const validRows = preview?.rows.filter((r) => r.errors.length === 0) || [];
  const errorRows = preview?.rows.filter((r) => r.errors.length > 0) || [];
  const duplicateRows = preview?.rows.filter((r) => r.isDuplicate && r.errors.length === 0) || [];
  const readyToImport = validRows.filter((r) => !skipDuplicates || !r.isDuplicate);

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
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#a1a1aa] hover:text-white hover:bg-white/5"
          >
            القطاعات
          </Link>
          <Link
            href="/admin/import"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          >
            استيراد البيانات
          </Link>
        </div>
      </div>

      {/* Import type selector */}
      <div className="glass rounded-xl border border-[#1e1e2e] p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4" dir="rtl">
          استيراد البيانات من ملف
        </h2>

        <div className="flex gap-3 mb-6" dir="rtl">
          <button
            onClick={() => { setType("companies"); reset(); }}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              type === "companies"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-[#a1a1aa] hover:text-white hover:bg-white/5 border border-transparent"
            )}
          >
            شركات
          </button>
          <button
            onClick={() => { setType("sectors"); reset(); }}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              type === "sectors"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-[#a1a1aa] hover:text-white hover:bg-white/5 border border-transparent"
            )}
          >
            قطاعات
          </button>
        </div>

        {/* Expected columns info */}
        <div className="mb-6 p-4 rounded-lg bg-blue-500/5 border border-blue-500/10" dir="rtl">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <div className="text-sm text-blue-300/80">
              <p className="font-medium mb-1">الأعمدة المطلوبة:</p>
              {type === "companies" ? (
                <p className="text-xs text-[#71717a]">
                  id, name, arabicName, sectorId, stage, foundedYear, totalFunding, lastRoundSize,
                  lastRoundDate, investability, riskScore, growthRate, employees, hqCity, description,
                  investors
                </p>
              ) : (
                <p className="text-xs text-[#71717a]">
                  id, name, arabicName, attractiveness, riskScore, marketGap, fundingMomentum,
                  competitionIntensity, saudiRelevance, totalFunding, companyCount, avgDealSize,
                  yoyGrowth, description
                </p>
              )}
            </div>
          </div>
        </div>

        {/* File upload area */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
            file
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-[#1e1e2e] hover:border-[#2e2e3e] hover:bg-white/[0.01]"
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileSpreadsheet className="w-8 h-8 text-emerald-400" />
              <div className="text-right">
                <p className="text-sm font-medium text-white">{file.name}</p>
                <p className="text-xs text-[#71717a]">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          ) : (
            <div>
              <Upload className="w-10 h-10 text-[#71717a] mx-auto mb-3" />
              <p className="text-sm text-[#a1a1aa] mb-1" dir="rtl">
                اسحب ملف CSV أو Excel هنا
              </p>
              <p className="text-xs text-[#71717a]" dir="rtl">
                أو انقر لاختيار ملف
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4">
          <div>
            {file && !preview && !result && (
              <button onClick={reset} className="text-sm text-[#71717a] hover:text-white">
                إلغاء
              </button>
            )}
          </div>
          <div className="flex gap-3">
            {file && !result && (
              <button
                onClick={handlePreview}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                معاينة البيانات
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm" dir="rtl">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        </div>
      )}

      {/* Import success result */}
      {result && (
        <div className="mb-6 glass rounded-xl border border-[#1e1e2e] p-6" dir="rtl">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">تم الاستيراد بنجاح</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-2xl font-bold text-emerald-400">{result.imported}</p>
              <p className="text-xs text-[#71717a]">تم استيرادها</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-2xl font-bold text-amber-400">{result.skipped}</p>
              <p className="text-xs text-[#71717a]">تم تخطيها</p>
            </div>
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-2xl font-bold text-red-400">{result.totalErrors}</p>
              <p className="text-xs text-[#71717a]">أخطاء</p>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm hover:bg-emerald-500/20"
            >
              <ArrowLeft className="w-4 h-4" />
              استيراد ملف آخر
            </button>
            <Link
              href={type === "companies" ? "/admin/companies" : "/admin/sectors"}
              className="px-4 py-2 rounded-lg text-sm text-[#a1a1aa] hover:text-white hover:bg-white/5"
            >
              عرض البيانات
            </Link>
          </div>
        </div>
      )}

      {/* Preview results */}
      {preview && (
        <div className="space-y-6">
          {/* Summary stats */}
          <div className="glass rounded-xl border border-[#1e1e2e] p-6" dir="rtl">
            <h3 className="text-lg font-bold text-white mb-4">نتائج المعاينة</h3>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="p-3 rounded-lg bg-[#1e1e2e]">
                <p className="text-2xl font-bold text-white">{preview.totalRows}</p>
                <p className="text-xs text-[#71717a]">إجمالي الصفوف</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-2xl font-bold text-emerald-400">{readyToImport.length}</p>
                <p className="text-xs text-[#71717a]">جاهزة للاستيراد</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-2xl font-bold text-amber-400">{preview.totalDuplicates}</p>
                <p className="text-xs text-[#71717a]">مكررة</p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-2xl font-bold text-red-400">{preview.totalErrors}</p>
                <p className="text-xs text-[#71717a]">أخطاء</p>
              </div>
            </div>

            {/* Duplicate handling option */}
            {preview.totalDuplicates > 0 && (
              <label className="flex items-center gap-2 text-sm text-[#a1a1aa] mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={skipDuplicates}
                  onChange={(e) => setSkipDuplicates(e.target.checked)}
                  className="rounded border-[#1e1e2e]"
                />
                تخطي الصفوف المكررة ({duplicateRows.length} صف)
              </label>
            )}

            {/* Import button */}
            <div className="flex gap-3">
              <button
                onClick={handleImport}
                disabled={importing || readyToImport.length === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                {importing && <Loader2 className="w-4 h-4 animate-spin" />}
                استيراد {readyToImport.length} صف
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 rounded-lg text-sm text-[#a1a1aa] hover:text-white hover:bg-white/5"
              >
                إلغاء
              </button>
            </div>
          </div>

          {/* Error rows */}
          {errorRows.length > 0 && (
            <div className="glass rounded-xl border border-red-500/20 p-6" dir="rtl">
              <h4 className="flex items-center gap-2 text-sm font-bold text-red-400 mb-3">
                <XCircle className="w-4 h-4" />
                صفوف بها أخطاء ({errorRows.length})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {errorRows.map((row) => (
                  <div
                    key={row.row}
                    className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-sm"
                  >
                    <span className="text-red-400 font-medium">سطر {row.row}:</span>{" "}
                    <span className="text-[#a1a1aa]">
                      {row.data.name ? `${row.data.name} — ` : ""}
                      {row.errors.join(" | ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Duplicate rows */}
          {duplicateRows.length > 0 && (
            <div className="glass rounded-xl border border-amber-500/20 p-6" dir="rtl">
              <h4 className="flex items-center gap-2 text-sm font-bold text-amber-400 mb-3">
                <AlertTriangle className="w-4 h-4" />
                صفوف مكررة ({duplicateRows.length})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {duplicateRows.map((row) => (
                  <div
                    key={row.row}
                    className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 text-sm"
                  >
                    <span className="text-amber-400 font-medium">سطر {row.row}:</span>{" "}
                    <span className="text-[#a1a1aa]">
                      {row.data.name} — {row.warnings.join(" | ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview table */}
          <div className="glass rounded-xl border border-[#1e1e2e] overflow-hidden">
            <h4 className="px-4 py-3 text-sm font-bold text-white border-b border-[#1e1e2e]" dir="rtl">
              معاينة البيانات
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1e1e2e]">
                    <th className="text-right px-3 py-2 text-xs font-semibold text-[#71717a]">#</th>
                    <th className="text-right px-3 py-2 text-xs font-semibold text-[#71717a]">الحالة</th>
                    {type === "companies" ? (
                      <>
                        <th className="text-right px-3 py-2 text-xs font-semibold text-[#71717a]">المعرف</th>
                        <th className="text-right px-3 py-2 text-xs font-semibold text-[#71717a]">الاسم</th>
                        <th className="text-right px-3 py-2 text-xs font-semibold text-[#71717a]">القطاع</th>
                        <th className="text-right px-3 py-2 text-xs font-semibold text-[#71717a]">المرحلة</th>
                        <th className="text-right px-3 py-2 text-xs font-semibold text-[#71717a]">التمويل</th>
                      </>
                    ) : (
                      <>
                        <th className="text-right px-3 py-2 text-xs font-semibold text-[#71717a]">المعرف</th>
                        <th className="text-right px-3 py-2 text-xs font-semibold text-[#71717a]">الاسم</th>
                        <th className="text-right px-3 py-2 text-xs font-semibold text-[#71717a]">التمويل</th>
                        <th className="text-right px-3 py-2 text-xs font-semibold text-[#71717a]">المخاطر</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.slice(0, 50).map((row) => (
                    <tr
                      key={row.row}
                      className={cn(
                        "border-b border-[#1e1e2e]/50 transition-colors",
                        row.errors.length > 0
                          ? "bg-red-500/[0.03]"
                          : row.isDuplicate
                          ? "bg-amber-500/[0.03]"
                          : "hover:bg-white/[0.02]"
                      )}
                    >
                      <td className="px-3 py-2 text-xs text-[#71717a]">{row.row}</td>
                      <td className="px-3 py-2">
                        {row.errors.length > 0 ? (
                          <XCircle className="w-4 h-4 text-red-400" />
                        ) : row.isDuplicate ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs text-[#a1a1aa]">{row.data.id}</td>
                      <td className="px-3 py-2 text-xs text-white">{row.data.name}</td>
                      {type === "companies" ? (
                        <>
                          <td className="px-3 py-2 text-xs text-[#a1a1aa]">{row.data.sectorId}</td>
                          <td className="px-3 py-2 text-xs text-[#a1a1aa]">{row.data.stage}</td>
                          <td className="px-3 py-2 text-xs text-[#a1a1aa]">${row.data.totalFunding}M</td>
                        </>
                      ) : (
                        <>
                          <td className="px-3 py-2 text-xs text-[#a1a1aa]">${row.data.totalFunding}M</td>
                          <td className="px-3 py-2 text-xs text-[#a1a1aa]">{row.data.riskScore}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.rows.length > 50 && (
                <div className="text-center py-3 text-xs text-[#71717a] border-t border-[#1e1e2e]">
                  عرض أول 50 صف من أصل {preview.rows.length}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
