"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { TemplatePreview } from "@/components/templates/template-preview";
import { ArrowRight, Download, FileImage, Loader2, Save } from "lucide-react";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface TemplateContent {
  title: string;
  subtitle: string;
  body: string;
  bullets: string[];
  footer: string;
}

interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export default function TemplateEditorPage() {
  const params = useParams();
  const id = params.id as string;
  const previewRef = useRef<HTMLDivElement>(null);

  const { data: template, isLoading } = useSWR(`/api/templates/${id}`, fetcher);

  const [content, setContent] = useState<TemplateContent>({
    title: "",
    subtitle: "",
    body: "",
    bullets: [],
    footer: "",
  });
  const [colorScheme, setColorScheme] = useState<TemplateColors>({
    primary: "#1E3A5F",
    secondary: "#2ECC71",
    accent: "#F39C12",
    background: "#0A1628",
    text: "#FFFFFF",
  });
  const [fonts, setFonts] = useState({ heading: "Cairo Bold", body: "Tajawal" });
  const [layout, setLayout] = useState("standard");
  const [isRTL, setIsRTL] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (template && template.content) {
      setContent(JSON.parse(template.content));
      setColorScheme(JSON.parse(template.colorScheme));
      setFonts(JSON.parse(template.fonts));
      setLayout(template.layout);
      setIsRTL(template.isRTL);
    }
  }, [template]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    await fetch(`/api/templates/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: JSON.stringify(content),
        colorScheme: JSON.stringify(colorScheme),
        fonts: JSON.stringify(fonts),
        layout,
        isRTL,
      }),
    });
    setSaving(false);
  }, [id, content, colorScheme, fonts, layout, isRTL]);

  const handleExportPNG = useCallback(async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        width: 1080,
        height: 1350,
      });
      const link = document.createElement("a");
      link.download = `${template?.name || "template"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Export failed:", e);
    }
    setExporting(false);
  }, [template?.name]);

  const handleExportPDF = useCallback(async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        width: 1080,
        height: 1350,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [1080, 1350],
      });
      pdf.addImage(imgData, "PNG", 0, 0, 1080, 1350);
      pdf.save(`${template?.name || "template"}.pdf`);
    } catch (e) {
      console.error("PDF export failed:", e);
    }
    setExporting(false);
  }, [template?.name]);

  const updateBullet = (index: number, value: string) => {
    const newBullets = [...content.bullets];
    newBullets[index] = value;
    setContent({ ...content, bullets: newBullets });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/templates"
            className="p-2 rounded-lg hover:bg-white/5 text-[#71717a] hover:text-white transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <FileImage className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{template?.arabicName}</h1>
            <p className="text-xs text-[#71717a]">{template?.name} — Template Editor</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPNG}
            disabled={exporting}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all text-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            PNG
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/20 text-violet-400 border border-violet-500/30 hover:bg-violet-500/30 transition-all text-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all text-sm disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            حفظ
          </button>
        </div>
      </div>

      {/* Editor + Preview split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="glass rounded-xl p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-150px)]" dir="rtl">
          <h2 className="text-base font-bold text-white border-b border-[#1e1e2e] pb-3">تحرير المحتوى</h2>

          <div>
            <label className="text-xs text-[#71717a] block mb-1">العنوان الرئيسي</label>
            <input
              value={content.title}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div>
            <label className="text-xs text-[#71717a] block mb-1">العنوان الفرعي</label>
            <input
              value={content.subtitle}
              onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
              className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div>
            <label className="text-xs text-[#71717a] block mb-1">النص الرئيسي</label>
            <textarea
              value={content.body}
              onChange={(e) => setContent({ ...content, body: e.target.value })}
              rows={3}
              className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 resize-none"
            />
          </div>

          <div>
            <label className="text-xs text-[#71717a] block mb-2">النقاط</label>
            {content.bullets.map((b, i) => (
              <input
                key={i}
                value={b}
                onChange={(e) => updateBullet(i, e.target.value)}
                className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 mb-2"
                placeholder={`نقطة ${i + 1}`}
              />
            ))}
          </div>

          <div>
            <label className="text-xs text-[#71717a] block mb-1">التذييل</label>
            <input
              value={content.footer}
              onChange={(e) => setContent({ ...content, footer: e.target.value })}
              className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <h2 className="text-base font-bold text-white border-b border-[#1e1e2e] pb-3 pt-2">الألوان</h2>

          <div className="grid grid-cols-2 gap-3">
            {(["primary", "secondary", "accent", "background", "text"] as const).map((key) => (
              <div key={key} className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorScheme[key]}
                  onChange={(e) => setColorScheme({ ...colorScheme, [key]: e.target.value })}
                  className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                />
                <span className="text-xs text-[#a1a1aa] capitalize">{key}</span>
              </div>
            ))}
          </div>

          <h2 className="text-base font-bold text-white border-b border-[#1e1e2e] pb-3 pt-2">الإعدادات</h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#71717a] block mb-1">التخطيط</label>
              <select
                value={layout}
                onChange={(e) => setLayout(e.target.value)}
                className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option value="standard">قياسي</option>
                <option value="split">مقسم</option>
                <option value="centered">مركزي</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#71717a] block mb-1">الاتجاه</label>
              <select
                value={isRTL ? "rtl" : "ltr"}
                onChange={(e) => setIsRTL(e.target.value === "rtl")}
                className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option value="rtl">يمين لليسار (RTL)</option>
                <option value="ltr">يسار لليمين (LTR)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex flex-col items-center gap-4">
          <div className="glass rounded-xl p-6">
            <h2 className="text-sm font-bold text-white mb-4 text-center">معاينة مباشرة — Live Preview</h2>
            <TemplatePreview
              ref={previewRef}
              content={content}
              colorScheme={colorScheme}
              fonts={fonts}
              layout={layout}
              isRTL={isRTL}
              scale={0.45}
            />
          </div>
          <p className="text-xs text-[#71717a]">1080 x 1350px — LinkedIn Infographic</p>
        </div>
      </div>
    </div>
  );
}
