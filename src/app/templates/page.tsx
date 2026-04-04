"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { TemplatePreview } from "@/components/templates/template-preview";
import { FileImage, Loader2, Sparkles } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Template {
  id: string;
  name: string;
  arabicName: string;
  category: string;
  layout: string;
  content: string;
  colorScheme: string;
  fonts: string;
  dimensions: string;
  isRTL: boolean;
}

const categoryLabels: Record<string, string> = {
  "ai-insight": "ذكاء اصطناعي",
  transformation: "تحول رقمي",
  vision: "رؤية تكاملية",
  sector: "تحليل قطاعي",
  company: "تحليل شركات",
  funding: "جولات تمويلية",
  comparison: "مقارنات",
  thesis: "أطروحات استثمارية",
  risk: "تقييم مخاطر",
  v2030: "رؤية 2030",
};

export default function TemplatesPage() {
  const { data: templates, isLoading, mutate } = useSWR<Template[]>("/api/templates", fetcher);
  const [seeding, setSeeding] = useState(false);

  async function seedTemplates() {
    setSeeding(true);
    await fetch("/api/templates/seed", { method: "POST" });
    await mutate();
    setSeeding(false);
  }

  const hasTemplates = templates && templates.length > 0;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <FileImage className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-heading">نظام القوالب</h1>
            <p className="text-sm text-[#71717a]">نظام القوالب — {templates?.length || 0} قالب</p>
          </div>
        </div>
        {!hasTemplates && (
          <button
            onClick={seedTemplates}
            disabled={seeding}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all disabled:opacity-50"
          >
            {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            تحميل 10 قوالب جاهزة
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        </div>
      )}

      {!isLoading && !hasTemplates && (
        <div className="glass rounded-xl p-12 text-center" dir="rtl">
          <FileImage className="w-16 h-16 text-[#71717a] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">لا توجد قوالب بعد</h2>
          <p className="text-[#71717a] mb-6">اضغط على زر تحميل القوالب لإنشاء 10 قوالب جاهزة</p>
        </div>
      )}

      {hasTemplates && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t) => {
            const content = JSON.parse(t.content);
            const colorScheme = JSON.parse(t.colorScheme);
            const fonts = JSON.parse(t.fonts);
            return (
              <Link
                key={t.id}
                href={`/templates/${t.id}/edit`}
                className="group glass rounded-xl overflow-hidden hover:border-emerald-500/30 border border-transparent transition-all"
              >
                <div className="flex items-center justify-center p-4 bg-[#0a0a0f]">
                  <TemplatePreview
                    content={content}
                    colorScheme={colorScheme}
                    fonts={fonts}
                    layout={t.layout}
                    isRTL={t.isRTL}
                    scale={0.25}
                  />
                </div>
                <div className="p-4" dir="rtl">
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {t.arabicName}
                  </h3>
                  <p className="text-xs text-[#71717a] mt-1">{t.name}</p>
                  <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400">
                    {categoryLabels[t.category] || t.category}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
