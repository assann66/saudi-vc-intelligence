import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sectorsQuerySchema, sectorCreateSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = sectorsQuerySchema.safeParse({
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

    const { sortBy, order, q, page, pageSize } = parsed.data;

    const where: Record<string, unknown> = {};
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { arabicName: { contains: q } },
        { description: { contains: q } },
      ];
    }

    const [sectors, total] = await Promise.all([
      prisma.sector.findMany({
        where,
        orderBy: { [sortBy]: order },
        include: {
          _count: { select: { companies: true } },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.sector.count({ where }),
    ]);

    return NextResponse.json({
      data: sectors,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("خطأ في جلب القطاعات:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم أثناء جلب بيانات القطاعات" },
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
    const parsed = sectorCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "بيانات غير صالحة", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const sector = await prisma.sector.create({ data: parsed.data });
    return NextResponse.json(sector, { status: 201 });
  } catch (error) {
    console.error("خطأ في إنشاء القطاع:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم أثناء إنشاء القطاع" },
      { status: 500 }
    );
  }
}
