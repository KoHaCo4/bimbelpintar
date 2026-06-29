"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/ui/DashboardLayout";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Soal = {
  id: string;
  judul: string;
  mapel: string;
  kelas: number;
  jumlahSoal: number;
  durasi: number;
  hasilUjian: { id: string }[];
};

type Pembelian = {
  id: string;
  createdAt: string;
  soal: Soal;
  hasilUjian?: { id: string }[];
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

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment");

  const [pembelian, setPembelian] = useState<Pembelian[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
    }

    const factDashboard = async () => {
      setLoading(true);
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      setPembelian(data);
      setLoading(false);
    };

    if (status === "authenticated") {
      factDashboard();
    }
  }, [status, session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-lg sm:text-xl font-medium text-gray-900 mb-1">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Halo, {session?.user?.name ?? session?.user?.email} 👋
          </p>
        </div>

        {/* Notifikasi status pembayaran */}
        {paymentStatus === "sukses" && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-6">
            ✅ Pembayaran berhasil! Soal sudah bisa diakses.
          </div>
        )}
        {paymentStatus === "pending" && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm px-4 py-3 rounded-xl mb-6">
            ⏳ Pembayaran sedang diproses. Soal akan muncul setelah pembayaran
            dikonfirmasi.
          </div>
        )}
        {paymentStatus === "gagal" && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
            ❌ Pembayaran gagal. Silakan coba lagi.
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-2xl font-medium text-gray-900 mb-1">
              {pembelian.length}
            </div>
            <div className="text-xs text-gray-400">Soal dimiliki</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-2xl font-medium text-gray-900 mb-1">
              {new Set(pembelian.map((p) => p.soal.mapel)).size}
            </div>
            <div className="text-xs text-gray-400">Mata pelajaran</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 col-span-2 sm:col-span-1">
            <div className="text-2xl font-medium text-gray-900 mb-1">
              {pembelian.reduce((acc, p) => acc + p.soal.jumlahSoal, 0)}
            </div>
            <div className="text-xs text-gray-400">Total soal</div>
          </div>
        </div>

        {/* Daftar soal */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-900">Soal saya</h2>
          <Link href="/soal" className="text-xs text-blue-600 hover:underline">
            + Beli soal lagi
          </Link>
        </div>

        {pembelian.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <p className="text-sm text-gray-400 mb-4">
              Kamu belum memiliki soal apapun
            </p>
            <Link
              href="/soal"
              className="text-sm bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Lihat katalog soal
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {pembelian.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${mapelColor[item.soal.mapel]}`}
                    >
                      {mapelLabel[item.soal.mapel]}
                    </span>
                    <span className="text-xs text-gray-400">
                      Kelas {item.soal.kelas}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {item.soal.judul}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-400">
                    <span>{item.soal.jumlahSoal} soal</span>
                    <span>·</span>
                    <span>{item.soal.durasi} menit</span>
                    <span className="hidden sm:inline">·</span>
                    <span className="w-full sm:w-auto">
                      Dibeli{" "}
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {item.soal.hasilUjian && item.soal.hasilUjian.length > 0 ? (
                  <button
                    onClick={() =>
                      router.push(`/hasil/${item.soal.hasilUjian![0].id}`)
                    }
                    className="w-full sm:w-auto shrink-0 text-xs bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Lihat hasil →
                  </button>
                ) : (
                  <button
                    onClick={() => router.push(`/soal/${item.soal.id}`)}
                    className="w-full sm:w-auto shrink-0 text-xs bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Kerjakan →
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">
          Memuat...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
