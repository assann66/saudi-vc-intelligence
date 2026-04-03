import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { companiesQuerySchema, companyCreateSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = companiesQuerySchema.safeParse({
      sectorId: searchParams.get("sectorId") ?? undefined,
      stage: searchParams.get("stage") ?? undefined,
      sortBy: searchParams.get("sortBy") ?? undefined,
      order: searchParams.get("order") ?? undefined,
      q: searchParams.get("q") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "معاملات البحث غير صالحة", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { sectorId, stage, sortBy, order, q, page, pageSize } = parsed.data;

    const where: Record<string, unknown> = {};
    if (sectorId) where.sectorId = sectorId;
    if (stage) where.stage = stage;
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { arabicName: { contains: q } },
        { description: { contains: q } },
        { hqCity: { contains: q } },
      ];
    }

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        include: { sector: true },
        orderBy: { [sortBy]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.company.count({ where }),
    ]);

    const result = companies.map((c) => ({
      ...c,
      investors: JSON.parse(c.investors),
    }));

    return NextResponse.json({
      data: result,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("خطأ في جلب الشركات:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم أثناء جلب بيانات الشركات" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = companyCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "بيانات غير صالحة", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { investors, ...data } = parsed.data;
    const company = await prisma.company.create({
      data: { ...data, investors: JSON.stringify(investors) },
      include: { sector: true },
    });

    return NextResponse.json({ ...company, investors }, { status: 201 });
  } catch (error) {
    console.error("خطأ في إنشاء الشركة:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم أثناء إنشاء الشركة" },
      { status: 500 }
    );
  }
}
