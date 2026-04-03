"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="glass rounded-2xl p-10 max-w-lg w-full text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">حدث خطأ غير متوقع</h2>
          <p className="text-zinc-400">
            عذراً، حدث خطأ أثناء تحميل هذا القسم. يرجى المحاولة مرة أخرى.
          </p>
        </div>
        {error.digest && (
          <p className="text-xs text-zinc-600 font-mono">
            رمز الخطأ: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="px-6 py-3 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors font-medium"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}
