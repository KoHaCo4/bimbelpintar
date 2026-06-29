"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/ui/DashboardLayout";

type HasilUjian = {
  id: string;
  skor: number | null;
  selesaiAt: string;
  user: { nama: string; email: string };
  soal: { id: string; judul: string; mapel: string };
};

type DaftarSoal = {
  id: string;
  judul: string;
};

const mapelLabel: Record<string, string> = {
  MATEMATIKA: "Matematika",
  IPA: "IPA",
  IPS: "IPS",
  BAHASA_INDONESIA: "B. Indonesia",
  BAHASA_INGGRIS: "B. Inggris",
};

export default function AdminNilaiPage() {
  const { data: session } = useSession();
  const [hasilList, setHasilList] = useState<HasilUjian[]>([]);
  const [daftarSoal, setDaftarSoal] = useState<DaftarSoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSoal, setFilterSoal] = useState("SEMUA");

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchNilai = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterSoal !== "SEMUA") params.set("soalId", filterSoal);

      const res = await fetch(`/api/admin/nilai?${params.toString()}`);
      const data = await res.json();
      setHasilList(Array.isArray(data.hasilUjian) ? data.hasilUjian : []);
      setDaftarSoal(Array.isArray(data.daftarSoal) ? data.daftarSoal : []);
      setLoading(false);
    };

    fetchNilai();
  }, [session?.user?.id, filterSoal]);

  const rataRata =
    hasilList.filter((h) => h.skor !== null).length > 0
      ? Math.round(
          hasilList.reduce((acc, h) => acc + (h.skor ?? 0), 0) /
            hasilList.filter((h) => h.skor !== null).length,
        )
      : null;

  const skorTertinggi = hasilList
    .filter((h) => h.skor !== null)
    .reduce((max, h) => Math.max(max, h.skor ?? 0), 0);

  const skorTerendah =
    hasilList.filter((h) => h.skor !== null).length > 0
      ? hasilList
          .filter((h) => h.skor !== null)
          .reduce((min, h) => Math.min(min, h.skor ?? 100), 100)
      : null;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-medium text-gray-900 mb-1">
            Nilai Siswa
          </h1>
          <p className="text-sm text-gray-500">Rekap hasil ujian semua siswa</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-2xl font-medium text-gray-900 mb-1">
              {hasilList.length}
            </div>
            <div className="text-xs text-gray-400">Total ujian</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-2xl font-medium text-blue-600 mb-1">
              {rataRata ?? "—"}
            </div>
            <div className="text-xs text-gray-400">Rata-rata skor</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-2xl font-medium text-green-600 mb-1">
              {skorTertinggi || "—"}
            </div>
            <div className="text-xs text-gray-400">Skor tertinggi</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-2xl font-medium text-red-500 mb-1">
              {skorTerendah ?? "—"}
            </div>
            <div className="text-xs text-gray-400">Skor terendah</div>
          </div>
        </div>

        {/* Filter soal */}
        <div className="mb-4">
          <select
            value={filterSoal}
            onChange={(e) => setFilterSoal(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white"
          >
            <option value="SEMUA">Semua soal</option>
            {daftarSoal.map((s) => (
              <option key={s.id} value={s.id}>
                {s.judul}
              </option>
            ))}
          </select>
        </div>

        {/* Tabel nilai */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">
                  Siswa
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">
                  Soal
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">
                  Mapel
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">
                  Skor
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">
                  Selesai pada
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-sm text-gray-400"
                  >
                    Memuat...
                  </td>
                </tr>
              ) : hasilList.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-sm text-gray-400"
                  >
                    Belum ada hasil ujian
                  </td>
                </tr>
              ) : (
                hasilList.map((h) => (
                  <tr
                    key={h.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-gray-900 font-medium">
                        {h.user.nama}
                      </div>
                      <div className="text-xs text-gray-400">
                        {h.user.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                      {h.soal.judul}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {mapelLabel[h.soal.mapel]}
                    </td>
                    <td className="px-4 py-3">
                      {h.skor !== null ? (
                        <span
                          className={`font-medium ${
                            h.skor >= 80
                              ? "text-green-600"
                              : h.skor >= 60
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {Math.round(h.skor)}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                      {new Date(h.selesaiAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
