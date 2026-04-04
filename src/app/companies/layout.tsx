import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشركات — دليل محفظة رأ�� المال الجريء السعودي",
  description:
    "تصفح أكثر من 28 شركة مدعومة برأس المال الجريء عبر منظومة الشركات الناشئة في المملكة العربية السعودية. تصفية حسب القطاع والمرحلة ومؤشر قابلية الاستثمار.",
  openGraph: {
    title: "الشركات — دليل محفظة رأس المال الجريء السعودي",
    description:
      "تصفح أكثر من 28 شركة مدعومة برأس المال الجريء عبر منظومة الشركات الناشئة في المملكة العربية السعودية.",
  },
};

export default function CompaniesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
