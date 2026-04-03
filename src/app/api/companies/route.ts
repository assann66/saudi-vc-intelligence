import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sectorId = searchParams.get("sectorId");
  const stage = searchParams.get("stage");
  const sortBy = searchParams.get("sortBy") || "investability";
  const order = searchParams.get("order") || "desc";

  const where: Record<string, string> = {};
  if (sectorId) where.sectorId = sectorId;
  if (stage) where.stage = stage;

  const companies = await prisma.company.findMany({
    where,
    include: { sector: true },
    orderBy: { [sortBy]: order },
  });

  const parsed = companies.map((c) => ({
    ...c,
    investors: JSON.parse(c.investors),
  }));

  return NextResponse.json(parsed);
}
