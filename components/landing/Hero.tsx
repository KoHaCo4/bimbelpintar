import Link from "next/link";

export default function Hero() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16 sm:py-24 text-center">
      <div className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-6">
        Platform latihan soal online terpercaya
      </div>
      <h1 className="text-3xl sm:text-5xl font-medium text-gray-900 leading-tight mb-4 sm:mb-6">
        Belajar lebih cerdas,
        <br />
        <span className="text-blue-600">raih nilai terbaik</span>
      </h1>
      <p className="text-base sm:text-lg text-gray-500 mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed">
        Latihan soal interaktif untuk semua jenjang dan mata pelajaran. Beli
        sekali, akses selamanya.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/register"
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
        >
          Mulai belajar gratis →
        </Link>
        <Link
          href="/soal"
          className="w-full sm:w-auto border border-gray-200 text-gray-600 px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
        >
          Lihat katalog soal
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-16 pt-12 sm:pt-16 border-t border-gray-100">
        {[
          { angka: "500+", label: "Soal tersedia" },
          { angka: "5", label: "Mata pelajaran" },
          { angka: "1.000+", label: "Siswa aktif" },
        ].map((stat) => (
          <div key={stat.label}>
            <div className="text-2xl sm:text-3xl font-medium text-gray-900 mb-1">
              {stat.angka}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
