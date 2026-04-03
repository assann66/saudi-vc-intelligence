import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get("sortBy") || "attractiveness";
  const order = searchParams.get("order") || "desc";

  const sectors = await prisma.sector.findMany({
    orderBy: { [sortBy]: order },
    include: {
      _count: { select: { companies: true } },
    },
  });

  return NextResponse.json(sectors);
}
