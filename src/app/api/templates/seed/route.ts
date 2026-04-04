import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { templateSeeds } from "@/data/templates";

export async function POST() {
  try {
    const existing = await prisma.template.count();
    if (existing > 0) {
      return NextResponse.json({ message: "القوالب موجودة بالفعل", count: existing });
    }

    const created = await prisma.template.createMany({
      data: templateSeeds.map((t) => ({
        name: t.name,
        arabicName: t.arabicName,
        category: t.category,
        layout: t.layout,
        content: JSON.stringify(t.content),
        colorScheme: JSON.stringify(t.colorScheme),
        fonts: JSON.stringify(t.fonts),
        dimensions: t.dimensions,
        isRTL: t.isRTL,
      })),
    });

    return NextResponse.json({ message: "تم إنشاء القوالب بنجاح", count: created.count });
  } catch (error) {
    console.error("Template seed error:", error);
    return NextResponse.json({ error: "حدث خطأ في إنشاء القوالب" }, { status: 500 });
  }
}
