import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-medium text-gray-900 mb-2">
          Halaman tidak ditemukan
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Halaman yang kamu cari mungkin sudah dipindahkan atau tidak ada.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Kembali ke beranda
          </Link>
          <Link
            href="/soal"
            className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            Lihat katalog soal
          </Link>
        </div>
      </div>
    </div>
  );
}
