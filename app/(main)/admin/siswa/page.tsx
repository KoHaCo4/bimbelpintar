"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/ui/DashboardLayout";

type Siswa = {
  id: string;
  nama: string;
  email: string;
  createdAt: string;
  totalSoalDibeli: number;
  totalUjianSelesai: number;
  rataRataSkor: number | null;
};

export default function AdminSiswaPage() {
  const { data: session } = useSession();
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchSiswa = async () => {
      const res = await fetch("/api/admin/siswa");
      const data = await res.json();
      setSiswaList(Array.isArray(data) ? data : []);
      setLoading(false);
    };

    fetchSiswa();
  }, [session?.user?.id]);

  const filteredSiswa = siswaList.filter(
    (s) =>
      s.nama.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-medium text-gray-900 mb-1">
            Manajemen Siswa
          </h1>
          <p className="text-sm text-gray-500">
            Daftar siswa yang terdaftar di platform
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-2xl font-medium text-gray-900 mb-1">
              {siswaList.length}
            </div>
            <div className="text-xs text-gray-400">Total siswa</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-2xl font-medium text-gray-900 mb-1">
              {siswaList.filter((s) => s.totalSoalDibeli > 0).length}
            </div>
            <div className="text-xs text-gray-400">Sudah beli soal</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-2xl font-medium text-gray-900 mb-1">
              {siswaList.reduce((acc, s) => acc + s.totalSoalDibeli, 0)}
            </div>
            <div className="text-xs text-gray-400">Total soal terjual</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-2xl font-medium text-gray-900 mb-1">
              {siswaList.reduce((acc, s) => acc + s.totalUjianSelesai, 0)}
            </div>
            <div className="text-xs text-gray-400">Ujian diselesaikan</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau email siswa..."
            className="w-full sm:w-80 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
        </div>

        {/* Tabel siswa */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">
                  Nama
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">
                  Soal dibeli
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">
                  Ujian selesai
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">
                  Rata-rata skor
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">
                  Bergabung
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
              ) : filteredSiswa.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-sm text-gray-400"
                  >
                    Tidak ada siswa ditemukan
                  </td>
                </tr>
              ) : (
                filteredSiswa.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 text-gray-900 font-medium whitespace-nowrap">
                      {s.nama}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {s.email}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {s.totalSoalDibeli}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {s.totalUjianSelesai}
                    </td>
                    <td className="px-4 py-3">
                      {s.rataRataSkor !== null ? (
                        <span
                          className={`font-medium ${
                            s.rataRataSkor >= 80
                              ? "text-green-600"
                              : s.rataRataSkor >= 60
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {s.rataRataSkor}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                      {new Date(s.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
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
