import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sectorsQuerySchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = sectorsQuerySchema.safeParse({
      sortBy: searchParams.get("sortBy") ?? undefined,
      order: searchParams.get("order") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "معاملات البحث غير صالحة", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { sortBy, order } = parsed.data;

    const sectors = await prisma.sector.findMany({
      orderBy: { [sortBy]: order },
      include: {
        _count: { select: { companies: true } },
      },
    });

    return NextResponse.json(sectors);
  } catch (error) {
    console.error("خطأ في جلب القطاعات:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم أثناء جلب بيانات القطاعات" },
      { status: 500 }
    );
  }
}
