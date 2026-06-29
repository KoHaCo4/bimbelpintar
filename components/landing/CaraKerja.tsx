const steps = [
  {
    nomor: "01",
    judul: "Pilih soal",
    deskripsi:
      "Browse katalog soal berdasarkan mata pelajaran dan kelas yang kamu butuhkan.",
  },
  {
    nomor: "02",
    judul: "Beli akses",
    deskripsi:
      "Bayar sekali dengan berbagai metode pembayaran. Akses soal selamanya tanpa biaya tambahan.",
  },
  {
    nomor: "03",
    judul: "Kerjakan & lihat hasil",
    deskripsi:
      "Kerjakan soal secara interaktif, lihat skor, dan download pembahasan lengkap.",
  },
];

export default function CaraKerja() {
  return (
    <section className="bg-gray-50 py-14 sm:py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-medium text-gray-900 mb-3">
            Cara kerja BimbelPintar
          </h2>
          <p className="text-gray-500 text-sm">Mudah, cepat, dan efektif</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {steps.map((step) => (
            <div
              key={step.nomor}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 flex gap-4 sm:flex-col sm:gap-0"
            >
              <div className="text-3xl font-medium text-blue-100 sm:mb-4 shrink-0">
                {step.nomor}
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-1 sm:mb-2">
                  {step.judul}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.deskripsi}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
