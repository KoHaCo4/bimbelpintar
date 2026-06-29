"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/ui/NavbarDashboard";
import Link from "next/link";

type Pilihan = {
  id: string;
  huruf: string;
  teks: string;
  isBenar: boolean;
};

type Pertanyaan = {
  id: string;
  urutan: number;
  tipe: "PILIHAN_GANDA" | "ESSAY";
  pertanyaan: string;
  pilihan: Pilihan[];
};

type Jawaban = {
  id: string;
  pertanyaanId: string;
  jawaban: string;
  isBenar: boolean | null;
  pertanyaan: Pertanyaan;
};

type Soal = {
  id: string;
  judul: string;
  mapel: string;
  linkPembahasan: string | null;
};

type HasilUjian = {
  id: string;
  skor: number | null;
  selesaiAt: string;
  soal: Soal;
  jawaban: Jawaban[];
};

const mapelLabel: Record<string, string> = {
  MATEMATIKA: "Matematika",
  IPA: "IPA",
  IPS: "IPS",
  BAHASA_INDONESIA: "B. Indonesia",
  BAHASA_INGGRIS: "B. Inggris",
};

export default function HasilUjianPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [hasil, setHasil] = useState<HasilUjian | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchHasil = async () => {
      const res = await fetch(`/api/hasil/${id}`);
      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        router.push("/dashboard");
        return;
      }

      setHasil(data);
      setLoading(false);
    };

    fetchHasil();
  }, [session?.user?.id]);

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-40 text-sm text-gray-400">
          Memuat hasil...
        </div>
      </div>
    );
  }

  if (!hasil) return null;

  const totalPG = hasil.jawaban.filter(
    (j) => j.pertanyaan.tipe === "PILIHAN_GANDA",
  ).length;
  const totalEssay = hasil.jawaban.filter(
    (j) => j.pertanyaan.tipe === "ESSAY",
  ).length;
  const benar = hasil.jawaban.filter((j) => j.isBenar === true).length;
  const salah = hasil.jawaban.filter((j) => j.isBenar === false).length;

  const skorBulat = hasil.skor !== null ? Math.round(hasil.skor) : null;
  const skorWarna =
    skorBulat === null
      ? "text-gray-600"
      : skorBulat >= 80
        ? "text-green-600"
        : skorBulat >= 60
          ? "text-yellow-600"
          : "text-red-600";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
        {/* Header hasil */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 mb-6 text-center">
          <div className="text-xs text-gray-400 mb-1">
            {mapelLabel[hasil.soal.mapel]}
          </div>
          <h1 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
            {hasil.soal.judul}
          </h1>

          {/* Skor */}
          {skorBulat !== null ? (
            <div className="mb-4">
              <div
                className={`text-5xl sm:text-6xl font-medium mb-1 ${skorWarna}`}
              >
                {skorBulat}
              </div>
              <div className="text-sm text-gray-400">Skor kamu</div>
            </div>
          ) : (
            <div className="mb-4">
              <div className="text-4xl font-medium text-gray-400 mb-1">—</div>
              <div className="text-sm text-gray-400">
                Tidak ada soal pilihan ganda
              </div>
            </div>
          )}

          {/* Statistik */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
            <div>
              <div className="text-lg sm:text-xl font-medium text-green-600">
                {benar}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">Benar</div>
            </div>
            <div className="border-x border-gray-100">
              <div className="text-lg sm:text-xl font-medium text-red-500">
                {salah}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">Salah</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-medium text-gray-500">
                {totalEssay}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">Essay</div>
            </div>
          </div>
        </div>

        {/* Download pembahasan */}
        {hasil.soal.linkPembahasan && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-blue-900 mb-0.5">
                Pembahasan tersedia
              </div>
              <div className="text-xs text-blue-600">
                Download PDF pembahasan untuk review jawaban
              </div>
            </div>
            <a
              href={hasil.soal.linkPembahasan}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto shrink-0 text-center bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Download PDF
            </a>
          </div>
        )}

        {/* Review jawaban */}
        <div className="mb-4">
          <h2 className="text-sm font-medium text-gray-900">Review jawaban</h2>
          {totalEssay > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              * Essay dinilai secara manual oleh pengajar
            </p>
          )}
        </div>

        <div className="space-y-3 sm:space-y-4">
          {hasil.jawaban.map((j, index) => (
            <div
              key={j.id}
              className={`bg-white border rounded-xl p-4 sm:p-5 ${
                j.pertanyaan.tipe === "ESSAY"
                  ? "border-gray-200"
                  : j.isBenar
                    ? "border-green-200"
                    : "border-red-200"
              }`}
            >
              {/* Nomor & status */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-400 font-medium">
                    {index + 1}.
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      j.pertanyaan.tipe === "PILIHAN_GANDA"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-orange-50 text-orange-700"
                    }`}
                  >
                    {j.pertanyaan.tipe === "PILIHAN_GANDA"
                      ? "Pilihan ganda"
                      : "Essay"}
                  </span>
                </div>
                {j.pertanyaan.tipe === "PILIHAN_GANDA" && (
                  <span
                    className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
                      j.isBenar
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {j.isBenar ? "✓ Benar" : "✗ Salah"}
                  </span>
                )}
                {j.pertanyaan.tipe === "ESSAY" && (
                  <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700">
                    Menunggu
                  </span>
                )}
              </div>

              {/* Pertanyaan */}
              <p className="text-sm text-gray-900 mb-4 break-words">
                {j.pertanyaan.pertanyaan}
              </p>

              {/* Pilihan ganda */}
              {j.pertanyaan.tipe === "PILIHAN_GANDA" && (
                <div className="space-y-1.5">
                  {j.pertanyaan.pilihan
                    .sort((a, b) => a.huruf.localeCompare(b.huruf))
                    .map((p) => (
                      <div
                        key={p.id}
                        className={`flex items-start gap-2 px-3 py-2 rounded-lg text-sm ${
                          p.isBenar
                            ? "bg-green-50 text-green-800"
                            : p.huruf === j.jawaban && !p.isBenar
                              ? "bg-red-50 text-red-800"
                              : "text-gray-600"
                        }`}
                      >
                        <span className="font-medium w-4 shrink-0">
                          {p.huruf}.
                        </span>
                        <span className="flex-1 break-words">{p.teks}</span>
                        {p.isBenar && (
                          <span className="text-xs text-green-600 shrink-0">
                            ✓ Benar
                          </span>
                        )}
                        {p.huruf === j.jawaban && !p.isBenar && (
                          <span className="text-xs text-red-600 shrink-0">
                            Jawabanmu
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {/* Essay */}
              {j.pertanyaan.tipe === "ESSAY" && (
                <div className="bg-gray-50 rounded-lg px-4 py-3">
                  <div className="text-xs text-gray-400 mb-1">Jawaban kamu</div>
                  <p className="text-sm text-gray-700 break-words">
                    {j.jawaban || (
                      <span className="text-gray-400 italic">
                        Tidak dijawab
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tombol aksi */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
          <Link
            href="/dashboard"
            className="flex-1 text-center bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
          >
            Kembali ke dashboard
          </Link>
          <Link
            href="/soal"
            className="flex-1 text-center border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
          >
            Lihat katalog soal
          </Link>
        </div>
      </div>
    </div>
  );
}
