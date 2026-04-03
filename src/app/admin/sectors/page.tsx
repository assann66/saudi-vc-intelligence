import { prisma } from "@/lib/prisma";
import { AdminSectorsView } from "./admin-sectors-view";

export const dynamic = "force-dynamic";

export default async function AdminSectorsPage() {
  const sectors = await prisma.sector.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { companies: true } } },
  });

  return <AdminSectorsView sectors={sectors} />;
}
