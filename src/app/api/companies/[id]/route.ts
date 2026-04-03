import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { idParamSchema } from "@/lib/validation";

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
