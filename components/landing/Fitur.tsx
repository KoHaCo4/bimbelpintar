const fiturList = [
  {
    icon: "⚡",
    judul: "Soal interaktif",
    deskripsi:
      "Kerjakan soal langsung di website, tidak perlu download aplikasi apapun.",
  },
  {
    icon: "⏱️",
    judul: "Timer otomatis",
    deskripsi:
      "Latih manajemen waktu dengan timer yang berjalan otomatis saat mengerjakan soal.",
  },
  {
    icon: "📊",
    judul: "Lihat hasil langsung",
    deskripsi:
      "Skor dan rekap jawaban muncul langsung setelah selesai mengerjakan.",
  },
  {
    icon: "📄",
    judul: "Pembahasan lengkap",
    deskripsi:
      "Download PDF pembahasan untuk review dan belajar dari kesalahan.",
  },
  {
    icon: "🔒",
    judul: "Akses selamanya",
    deskripsi:
      "Bayar sekali, akses soal selamanya tanpa biaya langganan bulanan.",
  },
  {
    icon: "💳",
    judul: "Pembayaran mudah",
    deskripsi:
      "Mendukung transfer bank, e-wallet, dan kartu kredit via Midtrans.",
  },
];

export default function Fitur() {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-medium text-gray-900 mb-3">
            Kenapa pilih BimbelPintar?
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {fiturList.map((fitur) => (
            <div
              key={fitur.judul}
              className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 flex gap-3 sm:gap-4"
            >
              <div className="text-xl sm:text-2xl shrink-0">{fitur.icon}</div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  {fitur.judul}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {fitur.deskripsi}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
