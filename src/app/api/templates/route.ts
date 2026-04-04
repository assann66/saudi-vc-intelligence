import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q");

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { arabicName: { contains: q } },
      ];
    }

    const templates = await prisma.template.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Templates list error:", error);
    return NextResponse.json({ error: "حدث خطأ في جلب القوالب" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const template = await prisma.template.create({
      data: {
        name: body.name,
        arabicName: body.arabicName,
        category: body.category,
        layout: body.layout || "standard",
        content: typeof body.content === "string" ? body.content : JSON.stringify(body.content),
        colorScheme: typeof body.colorScheme === "string" ? body.colorScheme : JSON.stringify(body.colorScheme),
        fonts: typeof body.fonts === "string" ? body.fonts : JSON.stringify(body.fonts),
        dimensions: body.dimensions || "1080x1350",
        isRTL: body.isRTL !== false,
        thumbnail: body.thumbnail || null,
      },
    });
    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("Template create error:", error);
    return NextResponse.json({ error: "حدث خطأ في إنشاء القالب" }, { status: 500 });
  }
}
