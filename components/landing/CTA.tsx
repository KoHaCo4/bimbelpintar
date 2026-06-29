import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-xl sm:text-2xl font-medium text-gray-900 mb-4">
          Siap mulai belajar?
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Daftar sekarang dan akses ratusan soal latihan untuk meningkatkan
          nilaimu.
        </p>
        <Link
          href="/register"
          className="inline-block w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
        >
          Daftar gratis sekarang →
        </Link>
      </div>
    </section>
  );
}
