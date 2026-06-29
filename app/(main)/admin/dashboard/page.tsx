"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/ui/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Stats = {
  totalPendapatan: number;
  totalSiswa: number;
  totalSoal: number;
  totalTransaksi: number;
};

type GrafikPendapatan = {
  bulan: string;
  total: number;
};

type SoalTerpopuler = {
  judul: string;
  mapel: string;
  jumlah: number;
};

type TransaksiTerbaru = {
  id: string;
  status: string;
  createdAt: string;
  user: { nama: string };
  soal: { judul: string; harga: number };
};

const mapelLabel: Record<string, string> = {
  MATEMATIKA: "Matematika",
  IPA: "IPA",
  IPS: "IPS",
  BAHASA_INDONESIA: "B. Indonesia",
  BAHASA_INGGRIS: "B. Inggris",
};

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [grafikPendapatan, setGrafikPendapatan] = useState<GrafikPendapatan[]>(
    [],
  );
  const [soalTerpopuler, setSoalTerpopuler] = useState<SoalTerpopuler[]>([]);
  const [transaksiTerbaru, setTransaksiTerbaru] = useState<TransaksiTerbaru[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchDashboard = async () => {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();

      setStats(data.stats ?? null);
      setGrafikPendapatan(
        Array.isArray(data.grafikPendapatan) ? data.grafikPendapatan : [],
      );
      setSoalTerpopuler(
        Array.isArray(data.soalTerpopuler) ? data.soalTerpopuler : [],
      );
      setTransaksiTerbaru(
        Array.isArray(data.transaksiTerbaru) ? data.transaksiTerbaru : [],
      );
      setLoading(false);
    };

    fetchDashboard();
  }, [session?.user?.id]);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-medium text-gray-900 mb-1">
            Dashboard Admin
          </h1>
          <p className="text-sm text-gray-500">
            Ringkasan performa platform BimbelPintar
          </p>
        </div>

        {/* Stats utama */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xl font-medium text-green-600 mb-1">
              Rp {(stats?.totalPendapatan ?? 0).toLocaleString("id-ID")}
            </div>
            <div className="text-xs text-gray-400">Total pendapatan</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xl font-medium text-gray-900 mb-1">
              {stats?.totalSiswa ?? 0}
            </div>
            <div className="text-xs text-gray-400">Total siswa</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xl font-medium text-gray-900 mb-1">
              {stats?.totalSoal ?? 0}
            </div>
            <div className="text-xs text-gray-400">Total soal</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xl font-medium text-gray-900 mb-1">
              {stats?.totalTransaksi ?? 0}
            </div>
            <div className="text-xs text-gray-400">Total transaksi</div>
          </div>
        </div>

        {/* Grafik pendapatan */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">
            Pendapatan 6 bulan terakhir
          </h2>
          {loading ? (
            <div className="text-center text-sm text-gray-400 py-10">
              Memuat grafik...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={grafikPendapatan}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="bulan"
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip
                  formatter={(value) => [
                    `Rp ${Number(value).toLocaleString("id-ID")}`,
                    "Pendapatan",
                  ]}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Bar dataKey="total" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Soal terpopuler */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-900 mb-4">
              Soal terpopuler
            </h2>
            {loading ? (
              <div className="text-center text-sm text-gray-400 py-10">
                Memuat...
              </div>
            ) : soalTerpopuler.length === 0 ? (
              <div className="text-center text-sm text-gray-400 py-10">
                Belum ada data
              </div>
            ) : (
              <div className="space-y-3">
                {soalTerpopuler.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-medium flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900 truncate">
                        {s.judul}
                      </div>
                      <div className="text-xs text-gray-400">
                        {mapelLabel[s.mapel]}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-600 shrink-0">
                      {s.jumlah}x
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transaksi terbaru */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-900 mb-4">
              Transaksi terbaru
            </h2>
            {loading ? (
              <div className="text-center text-sm text-gray-400 py-10">
                Memuat...
              </div>
            ) : transaksiTerbaru.length === 0 ? (
              <div className="text-center text-sm text-gray-400 py-10">
                Belum ada transaksi
              </div>
            ) : (
              <div className="space-y-3">
                {transaksiTerbaru.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm text-gray-900 truncate">
                        {t.user.nama}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {t.soal.judul}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-medium text-gray-900">
                        Rp {t.soal.harga.toLocaleString("id-ID")}
                      </div>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          t.status === "SUKSES"
                            ? "bg-green-50 text-green-700"
                            : t.status === "PENDING"
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-red-50 text-red-700"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
