"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/ui/DashboardLayout";

type Transaksi = {
  id: string;
  status: "SUKSES" | "PENDING" | "GAGAL";
  createdAt: string;
  user: { nama: string; email: string };
  soal: { judul: string; harga: number; mapel: string };
};

type Stats = {
  total: number;
  sukses: number;
  pending: number;
  gagal: number;
  totalPendapatan: number;
};

const mapelLabel: Record<string, string> = {
  MATEMATIKA: "Matematika",
  IPA: "IPA",
  IPS: "IPS",
  BAHASA_INDONESIA: "B. Indonesia",
  BAHASA_INGGRIS: "B. Inggris",
};

const filterStatus = [
  { label: "Semua", value: "SEMUA" },
  { label: "Sukses", value: "SUKSES" },
  { label: "Pending", value: "PENDING" },
  { label: "Gagal", value: "GAGAL" },
];

export default function AdminTransaksiPage() {
  const { data: session } = useSession();
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("SEMUA");

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchTransaksi = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeStatus !== "SEMUA") params.set("status", activeStatus);

      const res = await fetch(`/api/admin/transaksi?${params.toString()}`);
      const data = await res.json();
      setTransaksiList(Array.isArray(data.transaksi) ? data.transaksi : []);
      setStats(data.stats ?? null);
      setLoading(false);
    };

    fetchTransaksi();
  }, [session?.user?.id, activeStatus]);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      SUKSES: "bg-green-50 text-green-700",
      PENDING: "bg-yellow-50 text-yellow-700",
      GAGAL: "bg-red-50 text-red-700",
    };
    return map[status] ?? "bg-gray-50 text-gray-700";
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-medium text-gray-900 mb-1">
            Laporan Transaksi
          </h1>
          <p className="text-sm text-gray-500">
            Riwayat semua transaksi pembelian soal
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xl font-medium text-green-600 mb-1">
              Rp {(stats?.totalPendapatan ?? 0).toLocaleString("id-ID")}
            </div>
            <div className="text-xs text-gray-400">Total pendapatan</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xl font-medium text-gray-900 mb-1">
              {stats?.total ?? 0}
            </div>
            <div className="text-xs text-gray-400">Total transaksi</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xl font-medium text-yellow-600 mb-1">
              {stats?.pending ?? 0}
            </div>
            <div className="text-xs text-gray-400">Pending</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xl font-medium text-red-600 mb-1">
              {stats?.gagal ?? 0}
            </div>
            <div className="text-xs text-gray-400">Gagal</div>
          </div>
        </div>

        {/* Filter status */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {filterStatus.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveStatus(f.value)}
              className={`text-sm px-4 py-1.5 rounded-full border transition ${
                activeStatus === f.value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Tabel transaksi */}
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
                  Harga
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">
                  Tanggal
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
              ) : transaksiList.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-sm text-gray-400"
                  >
                    Tidak ada transaksi
                  </td>
                </tr>
              ) : (
                transaksiList.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-gray-900 font-medium">
                        {t.user.nama}
                      </div>
                      <div className="text-xs text-gray-400">
                        {t.user.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                      {t.soal.judul}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {mapelLabel[t.soal.mapel]}
                    </td>
                    <td className="px-4 py-3 text-gray-900 whitespace-nowrap">
                      Rp {t.soal.harga.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge(t.status)}`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                      {new Date(t.createdAt).toLocaleDateString("id-ID", {
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
