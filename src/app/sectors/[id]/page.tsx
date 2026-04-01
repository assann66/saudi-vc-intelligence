import { sectors } from "@/data/sectors";
import SectorDeepDivePage from "./sector-deep-dive";

export function generateStaticParams() {
  return sectors.map((s) => ({ id: s.id }));
}

export default function Page() {
  return <SectorDeepDivePage />;
}
