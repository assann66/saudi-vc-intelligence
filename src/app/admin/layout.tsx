import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">لوحة التحكم</h1>
          <p className="text-sm text-[#71717a] mt-1">إدارة الشركات والقطاعات</p>
        </div>
        {children}
      </div>
    </div>
  );
}
