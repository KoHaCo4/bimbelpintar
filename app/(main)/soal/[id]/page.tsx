"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "../../../../components/ui/NavbarDashboard";
import Link from "next/link";

type Soal = {
  id: string;
  judul: string;
  mapel: string;
  kelas: number;
  deskripsi: string;
  harga: number;
  jumlahSoal: number;
  durasi: number;
  linkPembahasan: string | null;
  sudahBeli: boolean;
};

const mapelLabel: Record<string, string> = {
  MATEMATIKA: "Matematika",
  IPA: "IPA",
  IPS: "IPS",
  BAHASA_INDONESIA: "B. Indonesia",
  BAHASA_INGGRIS: "B. Inggris",
};

const mapelColor: Record<string, string> = {
  MATEMATIKA: "bg-blue-50 text-blue-700",
  IPA: "bg-green-50 text-green-700",
  IPS: "bg-purple-50 text-purple-700",
  BAHASA_INDONESIA: "bg-pink-50 text-pink-700",
  BAHASA_INGGRIS: "bg-orange-50 text-orange-700",
};
export default function DetailSoalPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [soal, setSoal] = useState<Soal | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingBeli, setLoadingBeli] = useState(false);

  useEffect(() => {
    const fetchSoal = async () => {
      setLoading(true);
      const res = await fetch(`/api/soal/${id}`);
      if (res.status === 404) {
        router.push("/soal");
        return;
      }
      const data = await res.json();
      setSoal(data);
      setLoading(false);
    };

    fetchSoal();
  }, [id]);

  const handleBeli = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    setLoadingBeli(true);
    // kiata kerjakan nanti
    router.push(`/payment/${id}`);
  };

  const handleKerjakan = async () => {
    setLoadingBeli(true);

    // Tampilkan peringatan
    const konfirmasi = confirm(
      "⚠️ Perhatian!\n\n" +
        "Setelah memulai ujian:\n" +
        "• Timer akan berjalan otomatis\n" +
        "• Kamu tidak bisa keluar sebelum selesai\n" +
        "• Soal hanya bisa dikerjakan 1 kali\n\n" +
        "Apakah kamu siap memulai ujian?",
    );

    if (!konfirmasi) return;

    const res = await fetch("/api/ujian", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ soalId: soal!.id }),
    });

    const data = await res.json();

    if (!data.hasilId) {
      alert("Gagal memulai ujian, coba lagi");
      setLoadingBeli(false);
      return;
    }

    if (!res.ok) {
      if (data.hasilId) {
        router.push(`/hasil/${data.hasilId}`);
      } else {
        alert(data.error);
      }
      setLoadingBeli(false);
      return;
    }

    router.push(`/ujian/${data.hasilId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Memuat...</p>
      </div>
    );
  }

  if (!soal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Soal tidak ditemukan</p>
      </div>
    );
  }

  const harga = soal.harga ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 min-w-0">
          <Link href="/soal" className="hover:text-gray-600 shrink-0">
            Katalog
          </Link>
          <span className="shrink-0">/</span>
          <span className="text-gray-600 truncate">{soal.judul}</span>
        </div>

        {/* Card utama */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 mb-4">
          {/* Badge & kelas */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${mapelColor[soal.mapel]}`}
            >
              {mapelLabel[soal.mapel]}
            </span>
            <span className="text-xs text-gray-400">Kelas {soal.kelas}</span>
          </div>

          <h1 className="text-lg sm:text-xl font-medium text-gray-900 mb-3">
            {soal.judul}
          </h1>

          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            {soal.deskripsi}
          </p>

          {/* Info */}
          <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-100 mb-6">
            <div className="text-center">
              <div className="text-base sm:text-lg font-medium text-gray-900">
                {soal.jumlahSoal}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">Jumlah soal</div>
            </div>
            <div className="text-center border-x border-gray-100">
              <div className="text-base sm:text-lg font-medium text-gray-900">
                {soal.durasi}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">Menit</div>
            </div>
            <div className="text-center">
              <div className="text-base sm:text-lg font-medium text-gray-900">
                {soal.kelas}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">Kelas</div>
            </div>
          </div>

          {/* Harga & tombol */}
          {soal.sudahBeli ? (
            <div className="space-y-3">
              <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg text-center">
                ✅ Kamu sudah memiliki akses soal ini
              </div>
              <button
                onClick={handleKerjakan}
                disabled={loadingBeli}
                className="block w-full text-center bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                {loadingBeli ? "Memproses..." : "Kerjakan soal →"}
              </button>
              {soal.linkPembahasan && (
                <a
                  href={soal.linkPembahasan}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  Download pembahasan (PDF)
                </a>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Harga</div>
                <div className="text-lg sm:text-xl font-medium text-blue-600">
                  Rp {harga.toLocaleString("id-ID")}
                </div>
              </div>
              <button
                onClick={handleBeli}
                disabled={loadingBeli}
                className="shrink-0 bg-blue-600 text-white px-5 sm:px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loadingBeli ? "Memproses..." : "Beli akses"}
              </button>
            </div>
          )}
        </div>

        {/* Info akses permanen */}
        {!soal.sudahBeli && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-sm text-blue-700">
              💡 Beli sekali, akses selamanya. Link soal akan tersimpan di
              dashboard kamu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
