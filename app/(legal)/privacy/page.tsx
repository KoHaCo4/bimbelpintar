import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4">
        <Link href="/" className="text-base font-medium text-gray-900">
          Bimbel<span className="text-blue-600">Pintar</span>
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-medium text-gray-900 mb-2">
          Kebijakan Privasi
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          Terakhir diperbarui: 28 Juni 2026
        </p>

        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-base font-medium text-gray-900 mb-2">
              1. Informasi yang Kami Kumpulkan
            </h2>
            <p>
              Kami mengumpulkan informasi yang Anda berikan secara langsung,
              seperti nama, alamat email, dan kata sandi saat Anda mendaftar.
              Jika Anda masuk menggunakan Google, kami menerima nama dan email
              dari akun Google Anda.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-gray-900 mb-2">
              2. Bagaimana Kami Menggunakan Informasi Anda
            </h2>
            <p>
              Informasi yang dikumpulkan digunakan untuk: menyediakan dan
              memelihara layanan kami, memproses transaksi pembelian soal,
              mengirimkan notifikasi terkait akun dan transaksi, serta
              meningkatkan kualitas layanan.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-gray-900 mb-2">
              3. Pembagian Informasi
            </h2>
            <p>
              Kami tidak menjual atau membagikan data pribadi Anda kepada pihak
              ketiga, kecuali kepada penyedia layanan pembayaran (Midtrans)
              untuk memproses transaksi Anda.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-gray-900 mb-2">
              4. Keamanan Data
            </h2>
            <p>
              Kami menggunakan enkripsi standar industri untuk melindungi kata
              sandi dan informasi sensitif Anda. Namun, tidak ada metode
              transmisi data melalui internet yang 100% aman.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-gray-900 mb-2">
              5. Hak Anda
            </h2>
            <p>
              Anda dapat mengakses, memperbarui, atau menghapus informasi akun
              Anda kapan saja dengan menghubungi kami melalui email yang
              tercantum di bawah.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-gray-900 mb-2">
              6. Hubungi Kami
            </h2>
            <p>
              Jika ada pertanyaan mengenai kebijakan privasi ini, silakan
              hubungi kami di support@bimbelpintar.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
