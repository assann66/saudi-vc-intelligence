import { getCompaniesPaginated, getSectors } from "@/lib/db";
import CompaniesView from "./companies-view";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CompaniesPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const q = typeof params.q === "string" ? params.q : undefined;
  const sectorId = typeof params.sectorId === "string" ? params.sectorId : undefined;
  const stage = typeof params.stage === "string" ? params.stage : undefined;
  const sortBy = typeof params.sortBy === "string" ? params.sortBy : undefined;
  const order = (params.order === "asc" || params.order === "desc") ? params.order : undefined;

  const [result, sectors] = await Promise.all([
    getCompaniesPaginated({ page, pageSize: 10, q, sectorId, stage, sortBy, order }),
    getSectors(),
  ]);

  return (
    <CompaniesView
      companies={result.data}
      sectors={sectors}
      pagination={result.pagination}
      currentFilters={{ q, sectorId, stage, sortBy, order }}
    />
  );
}
