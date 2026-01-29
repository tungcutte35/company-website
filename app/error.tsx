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
    // Log client-side errors with minimal leakage
    console.error("App error:", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <html lang="vi">
      <body className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900/80 border border-white/10 rounded-2xl p-6">
          <h1 className="text-xl font-bold mb-2">Có lỗi xảy ra</h1>
          <p className="text-slate-300 mb-6">
            Vui lòng thử tải lại trang. Nếu lỗi tiếp tục, hãy liên hệ với chúng tôi.
          </p>
          <button
            type="button"
            onClick={reset}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold"
          >
            Thử lại
          </button>
        </div>
      </body>
    </html>
  );
}

