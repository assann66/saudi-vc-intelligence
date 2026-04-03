import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="glass rounded-2xl p-10 max-w-lg w-full text-center space-y-6 animate-fade-in">
        <div className="text-7xl font-bold gradient-text">404</div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">الصفحة غير موجودة</h2>
          <p className="text-zinc-400">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          </p>
        </div>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors font-medium"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
