import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "القطاعات — تحليل سوق رأس المال الجريء السعودي",
  description:
    "استكشف 10 قطاعات استثمارية رئيسية في المملكة العربية السعودية: التقنية المالية، التجارة الإلكترونية، التقنية الصحية، تقنية التعليم، والمزيد. مؤشرات الجاذبية وبيانات التمويل وتوافق رؤية 2030.",
  openGraph: {
    title: "القطاعات — تحليل سوق رأس المال الجريء السعودي",
    description:
      "استكشف 10 قطاعات استثمارية رئيسية في المملكة العربية السعودية.",
  },
};

export default function SectorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
