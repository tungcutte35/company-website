import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900/80 border border-white/10 rounded-2xl p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">404</h1>
        <p className="text-slate-300 mb-6">Trang bạn tìm không tồn tại.</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}

