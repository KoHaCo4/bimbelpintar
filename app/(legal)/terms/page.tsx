import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4">
        <Link href="/" className="text-base font-medium text-gray-900">
          Bimbel<span className="text-blue-600">Pintar</span>
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-medium text-gray-900 mb-2">
          Syarat dan Ketentuan
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          Terakhir diperbarui: 28 Juni 2026
        </p>

        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-base font-medium text-gray-900 mb-2">
              1. Penerimaan Ketentuan
            </h2>
            <p>
              Dengan mendaftar dan menggunakan BimbelPintar, Anda menyetujui
              untuk terikat dengan syarat dan ketentuan ini.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-gray-900 mb-2">
              2. Akun Pengguna
            </h2>
            <p>
              Anda bertanggung jawab untuk menjaga kerahasiaan kata sandi akun
              Anda. Segala aktivitas yang terjadi di bawah akun Anda menjadi
              tanggung jawab Anda.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-gray-900 mb-2">
              3. Pembelian dan Pembayaran
            </h2>
            <p>
              Setiap pembelian soal bersifat final setelah pembayaran berhasil
              dikonfirmasi. Akses soal yang sudah dibeli berlaku selamanya
              kecuali dinyatakan lain.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-gray-900 mb-2">
              4. Aturan Ujian
            </h2>
            <p>
              Setiap soal latihan hanya dapat dikerjakan satu kali. Timer akan
              berjalan otomatis sesuai durasi yang ditentukan. Kami tidak
              bertanggung jawab atas kegagalan submit akibat gangguan koneksi
              internet pengguna.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-gray-900 mb-2">
              5. Kebijakan Pengembalian Dana
            </h2>
            <p>
              Karena sifat produk digital, pembelian soal tidak dapat
              dikembalikan (no refund) setelah transaksi berhasil, kecuali
              terjadi kesalahan teknis dari sistem kami.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-gray-900 mb-2">
              6. Larangan Penggunaan
            </h2>
            <p>
              Anda dilarang membagikan akses akun, menyalin, atau
              mendistribusikan ulang materi soal kepada pihak lain tanpa izin
              tertulis dari kami.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-gray-900 mb-2">
              7. Perubahan Ketentuan
            </h2>
            <p>
              Kami berhak mengubah syarat dan ketentuan ini kapan saja.
              Perubahan akan diberitahukan melalui halaman ini.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-gray-900 mb-2">
              8. Hubungi Kami
            </h2>
            <p>
              Pertanyaan terkait syarat dan ketentuan dapat disampaikan ke
              support@bimbelpintar.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
