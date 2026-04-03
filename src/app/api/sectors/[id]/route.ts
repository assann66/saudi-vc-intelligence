import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { idParamSchema, sectorUpdateSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const parsed = idParamSchema.safeParse(params);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "معرّف القطاع غير صالح" },
        { status: 400 }
      );
    }

    const sector = await prisma.sector.findUnique({
      where: { id: parsed.data.id },
      include: { companies: true },
    });

    if (!sector) {
      return NextResponse.json(
        { error: "القطاع غير موجود" },
        { status: 404 }
      );
    }

    const result = {
      ...sector,
      companies: sector.companies.map((c) => ({
        ...c,
        investors: JSON.parse(c.investors),
      })),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("خطأ في جلب بيانات القطاع:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم أثناء جلب بيانات القطاع" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const paramParsed = idParamSchema.safeParse(params);
    if (!paramParsed.success) {
      return NextResponse.json({ error: "معرّف القطاع غير صالح" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = sectorUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "بيانات غير صالحة", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const sector = await prisma.sector.update({
      where: { id: paramParsed.data.id },
      data: parsed.data,
    });

    return NextResponse.json(sector);
  } catch (error) {
    console.error("خطأ في تحديث القطاع:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم أثناء تحديث القطاع" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const paramParsed = idParamSchema.safeParse(params);
    if (!paramParsed.success) {
      return NextResponse.json({ error: "معرّف القطاع غير صالح" }, { status: 400 });
    }

    await prisma.sector.delete({ where: { id: paramParsed.data.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("خطأ في حذف القطاع:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم أثناء حذف القطاع" },
      { status: 500 }
    );
  }
}
