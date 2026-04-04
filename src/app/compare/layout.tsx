import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المقارنة — تحليل جنبًا إلى جنب لرأس المال الجريء",
  description:
    "قارن بين الشركات والقطاعات السعودية جنبًا إلى جنب. قيّم قابلية الاستثمار والمخاطر والتمويل ومؤشرات النمو لاتخاذ قرارات استثمارية مدروسة.",
  openGraph: {
    title: "المقارنة — تحليل جنبًا إلى جنب لرأس المال الجريء",
    description:
      "قارن بين الشركات والقطاعات السعودية جنبًا إلى جنب.",
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
