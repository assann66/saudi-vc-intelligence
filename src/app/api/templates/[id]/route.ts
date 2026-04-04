import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await prisma.template.findUnique({ where: { id } });
    if (!template) {
      return NextResponse.json({ error: "القالب غير موجود" }, { status: 404 });
    }
    return NextResponse.json(template);
  } catch (error) {
    console.error("Template get error:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data: Record<string, unknown> = {};

    if (body.name !== undefined) data.name = body.name;
    if (body.arabicName !== undefined) data.arabicName = body.arabicName;
    if (body.category !== undefined) data.category = body.category;
    if (body.layout !== undefined) data.layout = body.layout;
    if (body.content !== undefined) data.content = typeof body.content === "string" ? body.content : JSON.stringify(body.content);
    if (body.colorScheme !== undefined) data.colorScheme = typeof body.colorScheme === "string" ? body.colorScheme : JSON.stringify(body.colorScheme);
    if (body.fonts !== undefined) data.fonts = typeof body.fonts === "string" ? body.fonts : JSON.stringify(body.fonts);
    if (body.dimensions !== undefined) data.dimensions = body.dimensions;
    if (body.isRTL !== undefined) data.isRTL = body.isRTL;

    const template = await prisma.template.update({
      where: { id },
      data,
    });
    return NextResponse.json(template);
  } catch (error) {
    console.error("Template update error:", error);
    return NextResponse.json({ error: "حدث خطأ في تحديث القالب" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.template.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Template delete error:", error);
    return NextResponse.json({ error: "حدث خطأ في حذف القالب" }, { status: 500 });
  }
}
