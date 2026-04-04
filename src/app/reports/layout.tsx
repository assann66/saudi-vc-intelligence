import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "التقارير — تقارير استثمار رأس المال الجريء السعودي",
  description:
    "إعداد وعرض تقارير استثمارية تفصيلية للشركات والقطاعات في المملكة العربية السعودية. تحليل مدعوم بالذكاء الاصطناعي يشمل البيانات المالية والمخاطر والموقع السوقي.",
  openGraph: {
    title: "التقارير — تقارير استثمار رأس المال الجريء السعودي",
    description:
      "إعداد وعرض تقارير استثمارية تفصيلية للشركات والقطاعات في المملكة العربية السعودية.",
  },
};

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
