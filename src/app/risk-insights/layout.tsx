import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "رؤى المخاطر — تحليل مخاطر رأس المال الجريء السعودي",
  description:
    "لوحة تحليل مخاطر شاملة لرأس المال الجريء في المملكة العربية السعودية. تقييم المخاطر التنظيمية والسوقية والتشغيلية والمالية عبر القطاعات والشركات.",
  openGraph: {
    title: "رؤى المخاطر — تحليل مخاطر رأس المال الجريء السعودي",
    description:
      "لوحة تحليل مخاطر شاملة لرأس المال الجريء في المملكة العربية السعودية.",
  },
};

export default function RiskInsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
