import { getSectorsPaginated } from "@/lib/db";
import SectorsView from "./sectors-view";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SectorsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const q = typeof params.q === "string" ? params.q : undefined;

  const result = await getSectorsPaginated({ page, pageSize: 12, q });

  return (
    <SectorsView
      sectors={result.data}
      pagination={result.pagination}
      currentQ={q}
    />
  );
}
