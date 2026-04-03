import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { companiesQuerySchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = companiesQuerySchema.safeParse({
      sectorId: searchParams.get("sectorId") ?? undefined,
      stage: searchParams.get("stage") ?? undefined,
      sortBy: searchParams.get("sortBy") ?? undefined,
      order: searchParams.get("order") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "معاملات البحث غير صالحة", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { sectorId, stage, sortBy, order } = parsed.data;
    const where: Record<string, string> = {};
    if (sectorId) where.sectorId = sectorId;
    if (stage) where.stage = stage;

    const companies = await prisma.company.findMany({
      where,
      include: { sector: true },
      orderBy: { [sortBy]: order },
    });

    const result = companies.map((c) => ({
      ...c,
      investors: JSON.parse(c.investors),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("خطأ في جلب الشركات:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم أثناء جلب بيانات الشركات" },
      { status: 500 }
    );
  }
}
