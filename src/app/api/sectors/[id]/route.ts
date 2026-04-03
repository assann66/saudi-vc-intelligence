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
