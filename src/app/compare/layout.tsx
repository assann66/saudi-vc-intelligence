import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare — Side-by-Side VC Analysis",
  description:
    "Compare Saudi Arabian companies and sectors side by side. Evaluate investability, risk, funding, and growth metrics to inform investment decisions.",
  openGraph: {
    title: "Compare — Side-by-Side VC Analysis",
    description:
      "Compare Saudi Arabian companies and sectors side by side. Evaluate investability, risk, funding, and growth metrics to inform investment decisions.",
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
