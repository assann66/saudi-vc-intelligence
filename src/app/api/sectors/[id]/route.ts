import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const sector = await prisma.sector.findUnique({
    where: { id: params.id },
    include: { companies: true },
  });

  if (!sector) {
    return NextResponse.json({ error: "Sector not found" }, { status: 404 });
  }

  const parsed = {
    ...sector,
    companies: sector.companies.map((c) => ({
      ...c,
      investors: JSON.parse(c.investors),
    })),
  };

  return NextResponse.json(parsed);
}
