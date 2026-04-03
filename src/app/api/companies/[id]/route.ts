import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { idParamSchema, companyUpdateSchema } from "@/lib/validation";
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
        { error: "معرّف الشركة غير صالح" },
        { status: 400 }
      );
    }

    const company = await prisma.company.findUnique({
      where: { id: parsed.data.id },
      include: { sector: true },
    });

    if (!company) {
      return NextResponse.json(
        { error: "الشركة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...company,
      investors: JSON.parse(company.investors),
    });
  } catch (error) {
    console.error("خطأ في جلب بيانات الشركة:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم أثناء جلب بيانات الشركة" },
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
      return NextResponse.json({ error: "معرّف الشركة غير صالح" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = companyUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "بيانات غير صالحة", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { investors, ...rest } = parsed.data;
    const data: Record<string, unknown> = { ...rest };
    if (investors !== undefined) {
      data.investors = JSON.stringify(investors);
    }

    const company = await prisma.company.update({
      where: { id: paramParsed.data.id },
      data,
      include: { sector: true },
    });

    return NextResponse.json({
      ...company,
      investors: JSON.parse(company.investors),
    });
  } catch (error) {
    console.error("خطأ في تحديث الشركة:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم أثناء تحديث الشركة" },
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
      return NextResponse.json({ error: "معرّف الشركة غير صالح" }, { status: 400 });
    }

    await prisma.company.delete({ where: { id: paramParsed.data.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("خطأ في حذف الشركة:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم أثناء حذف الشركة" },
      { status: 500 }
    );
  }
}
