import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "التصنيفات — أبرز شركات وقطاعات رأس المال الجريء السعودي",
  description:
    "قائمة مصنفة بالذكاء الاصطناعي لأبرز الشركات والقطاعات المدعومة برأس المال الجريء في المملكة العربية السعودية حسب قابلية الاستثمار ومعدل النمو ومؤشر المخاطر وتوافق رؤية 2030.",
  openGraph: {
    title: "التصنيفات — أبرز شركات وقطاعات رأس المال الجريء السعودي",
    description:
      "قائمة مصنفة بالذكاء الاصطناعي لأبرز الشركات والقطاعات المدعومة برأس المال الجريء في المملكة العربية السعودية.",
  },
};

export default function RankingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
