"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ZCOOL_KuaiLe } from "next/font/google";
import DashboardLayout from "@/components/ui/DashboardLayout";

type Soal = {
  id: string;
  judul: string;
  mapel: string;
  kelas: number;
  harga: number;
  jumlahSoal: number;
};

const mapelLabel: Record<string, string> = {
  MATEMATIKA: "Matematika",
  IPA: "IPA",
  IPS: "IPS",
  BAHASA_INDONESIA: "B. Indonesia",
  BAHASA_INGGRIS: "B. Inggris",
};

export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [soalList, setSoalList] = useState<Soal[]>([]);
  const [loading, setLoading] = useState(true);
  const [hapusId, setHapusId] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchSoal = async () => {
      setLoading(true);
      const res = await fetch("/api/soal");
      const data = await res.json();
      setSoalList(Array.isArray(data) ? data : []);
      setLoading(false);
    };

    fetchSoal();
  }, [session?.user?.id]);

  const handleHapus = async (id: string) => {
    if (!confirm("Yakin ingin menghapus soal ini?")) return;

    setHapusId(id);
    const res = await fetch(`/api/admin/soal/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setSoalList((prev) => prev.filter((s) => s.id !== id));
    } else {
      alert("Gagal menghapus soal");
    }
    setHapusId(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-lg sm:text-xl font-medium text-gray-900 mb-1">
              Panel Admin
            </h1>
            <p className="text-sm text-gray-500">
              Kelola soal yang tersedia di katalog
            </p>
          </div>
          <Link
            href="/admin/soal/tambah"
            className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shrink-0"
          >
            + Tambah Mapel
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-2xl font-medium text-gray-900 mb-1">
              {soalList.length}
            </div>
            <div className="text-xs text-gray-400">Total soal</div>
          </div>
          {["MATEMATIKA", "IPA", "BAHASA_INGGRIS"].map((mapel) => (
            <div
              key={mapel}
              className="bg-white border border-gray-200 rounded-xl p-4"
            >
              <div className="text-2xl font-medium text-gray-900 mb-1">
                {soalList.filter((s) => s.mapel === mapel).length}
              </div>
              <div className="text-xs text-gray-400">{mapelLabel[mapel]}</div>
            </div>
          ))}
        </div>

        {/* Tabel soal */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">
                    Judul
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden sm:table-cell">
                    Mapel
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden sm:table-cell">
                    Kelas
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">
                    Harga
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden sm:table-cell">
                    Soal
                  </th>
                  <th className="text-right px-4 py-3 text-xs text-gray-500 font-medium">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 text-sm text-gray-400"
                    >
                      Memuat...
                    </td>
                  </tr>
                ) : soalList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 text-sm text-gray-400"
                    >
                      Belum ada soal
                    </td>
                  </tr>
                ) : (
                  soalList.map((mapel) => (
                    <tr
                      key={mapel.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 text-gray-900 max-w-[140px] sm:max-w-xs truncate">
                        {mapel.judul}
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                        {mapelLabel[mapel.mapel]}
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                        {mapel.kelas}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        Rp {mapel.harga.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                        {mapel.jumlahSoal}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                          <Link
                            href={`/admin/soal/${mapel.id}/pertanyaan`}
                            className="text-xs px-2 sm:px-3 py-1.5 border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          >
                            <span className="hidden sm:inline">
                              + Pertanyaan
                            </span>
                            <span className="sm:hidden">Soal</span>
                          </Link>
                          <Link
                            href={`/admin/soal/edit/${mapel.id}`}
                            className="text-xs px-2 sm:px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleHapus(mapel.id)}
                            disabled={hapusId === mapel.id}
                            className="text-xs px-2 sm:px-3 py-1.5 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
                          >
                            {hapusId === mapel.id ? "..." : "Hapus"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
