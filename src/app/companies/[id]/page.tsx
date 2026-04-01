import { companies } from "@/data/companies";
import CompanyDeepDivePage from "./company-deep-dive";

export function generateStaticParams() {
  return companies.map((c) => ({ id: c.id }));
}

export default function Page() {
  return <CompanyDeepDivePage />;
}
