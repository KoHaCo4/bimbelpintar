"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/ui/DashboardLayout";

type Jawaban = {
  id: string;
  jawaban: string;
  isBenar: boolean | null;
  pertanyaan: { pertanyaan: string; soalId: string };
  hasilUjian: {
    user: { nama: string; email: string };
    soal: { judul: string; mapel: string };
  };
};

const mapelLabel: Record<string, string> = {
  MATEMATIKA: "Matematika",
  IPA: "IPA",
  IPS: "IPS",
  BAHASA_INDONESIA: "B. Indonesia",
  BAHASA_INGGRIS: "B. Inggris",
};

const filterOptions = [
  { label: "Belum dinilai", value: "BELUM_DINILAI" },
  { label: "Sudah dinilai", value: "SUDAH_DINILAI" },
];

export default function AdminEssayPage() {
  const { data: session } = useSession();
  const [jawabanList, setJawabanList] = useState<Jawaban[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("BELUM_DINILAI");
  const [menilaiId, setMenilaiId] = useState<string | null>(null);

  const fetchEssay = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/essay?filter=${filter}`);
    const data = await res.json();
    setJawabanList(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    if (!session?.user?.id) return;
    fetchEssay();
  }, [session?.user?.id, filter]);

  const handleNilai = async (id: string, isBenar: boolean) => {
    setMenilaiId(id);

    const res = await fetch(`/api/admin/essay/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBenar }),
    });

    if (res.ok) {
      // Hapus dari list kalau sedang di filter "belum dinilai"
      if (filter === "BELUM_DINILAI") {
        setJawabanList((prev) => prev.filter((j) => j.id !== id));
      } else {
        fetchEssay();
      }
    } else {
      alert("Gagal menilai jawaban");
    }

    setMenilaiId(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-medium text-gray-900 mb-1">
            Penilaian Essay
          </h1>
          <p className="text-sm text-gray-500">
            Nilai jawaban essay siswa secara manual
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {filterOptions.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`text-sm px-4 py-1.5 rounded-full border transition ${
                filter === f.value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Daftar jawaban essay */}
        {loading ? (
          <div className="text-center text-sm text-gray-400 py-20">
            Memuat...
          </div>
        ) : jawabanList.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <p className="text-sm text-gray-400">
              {filter === "BELUM_DINILAI"
                ? "Semua essay sudah dinilai 🎉"
                : "Belum ada essay yang dinilai"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {jawabanList.map((j) => (
              <div
                key={j.id}
                className="bg-white border border-gray-200 rounded-xl p-5"
              >
                {/* Info siswa & soal */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {j.hasilUjian.user.nama}
                    </div>
                    <div className="text-xs text-gray-400">
                      {j.hasilUjian.user.email}
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                    {mapelLabel[j.hasilUjian.soal.mapel]}
                  </span>
                </div>

                <div className="text-xs text-gray-400 mb-3">
                  {j.hasilUjian.soal.judul}
                </div>

                {/* Pertanyaan */}
                <div className="bg-gray-50 rounded-lg px-4 py-3 mb-3">
                  <div className="text-xs text-gray-400 mb-1">Pertanyaan</div>
                  <p className="text-sm text-gray-900">
                    {j.pertanyaan.pertanyaan}
                  </p>
                </div>

                {/* Jawaban siswa */}
                <div className="bg-blue-50 rounded-lg px-4 py-3 mb-4">
                  <div className="text-xs text-blue-600 mb-1">
                    Jawaban siswa
                  </div>
                  <p className="text-sm text-blue-900">
                    {j.jawaban || (
                      <span className="italic text-blue-400">
                        Tidak dijawab
                      </span>
                    )}
                  </p>
                </div>

                {/* Aksi nilai */}
                {filter === "BELUM_DINILAI" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleNilai(j.id, true)}
                      disabled={menilaiId === j.id}
                      className="flex-1 bg-green-50 text-green-700 text-sm font-medium py-2 rounded-lg hover:bg-green-100 disabled:opacity-50 transition"
                    >
                      ✓ Benar
                    </button>
                    <button
                      onClick={() => handleNilai(j.id, false)}
                      disabled={menilaiId === j.id}
                      className="flex-1 bg-red-50 text-red-700 text-sm font-medium py-2 rounded-lg hover:bg-red-100 disabled:opacity-50 transition"
                    >
                      ✗ Salah
                    </button>
                  </div>
                ) : (
                  <div
                    className={`text-center text-sm font-medium py-2 rounded-lg ${
                      j.isBenar
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {j.isBenar ? "✓ Dinilai benar" : "✗ Dinilai salah"}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
