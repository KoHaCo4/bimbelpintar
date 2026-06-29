"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../../../components/ui/NavbarDashboard";

declare global {
  interface Window {
    snap: any;
  }
}

type Soal = {
  id: string;
  judul: string;
  mapel: string;
  harga: number;
};

const mapelLabel: Record<string, string> = {
  MATEMATIKA: "Matematika",
  IPA: "IPA",
  IPS: "IPS",
  BAHASA_INDONESIA: "B. Indonesia",
  BAHASA_INGGRIS: "B. Inggris",
};

export default function PaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [soal, setSoal] = useState<Soal | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(false);

  // Redirect kalu belum login
  useEffect(() => {
    if (session === null) {
      router.push("/login");
    }
  }, [session]);

  // load Midtrans Snap script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
    );
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Fetch data soal
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

  // Handle proses pembayaran
  const handlePayment = async () => {
    setLoadingPayment(true);
    try {
      // Buat transaksi dan dapatkan token
      const res = await fetch(`/api/payment/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ soalId: id }),
      });
      const data = await res.json();
      const token = data.token;

      if (!res.ok) {
        alert(data.error || "Gagal membuat transaksi");
        setLoadingPayment(false);
        return;
      }

      // Panggil Midtrans Snap
      window.snap.pay(token, {
        onSuccess: function (result: any) {
          alert("Pembayaran berhasil!");
          router.push("/soal");
        },
        onPending: function (result: any) {
          alert("Pembayaran pending. Silakan selesaikan pembayaran.");
          router.push("/soal");
        },
        onError: function (result: any) {
          alert("Terjadi kesalahan pada pembayaran.");
          setLoadingPayment(false);
        },
        onClose: function () {
          alert("Anda menutup popup pembayaran.");
          setLoadingPayment(false);
        },
      });
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Terjadi kesalahan saat memproses pembayaran.");
      setLoadingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-40 text-sm text-gray-400">
          Memuat...
        </div>
      </div>
    );
  }

  if (!soal)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-40 text-sm text-gray-400">
          Soal tidak ditemukan
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-md mx-auto px-4 py-8 sm:py-10">
        <h1 className="text-lg sm:text-xl font-medium text-gray-900 mb-6">
          Konfirmasi Pembelian
        </h1>

        {/* Detail soal */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
          <div className="text-xs text-gray-400 mb-1">
            {mapelLabel[soal.mapel]}
          </div>
          <h2 className="text-sm font-medium text-gray-900 mb-4 leading-snug">
            {soal.judul}
          </h2>

          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <span className="text-sm text-gray-500">Harga</span>
            <span className="text-sm font-medium text-gray-900">
              Rp {(soal.harga ?? 0).toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <span className="text-sm text-gray-500">Akses</span>
            <span className="text-sm text-gray-900">Selamanya</span>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-900">Total</span>
            <span className="text-base font-medium text-blue-600">
              Rp {(soal.harga ?? 0).toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-700">
            💳 Pembayaran diproses secara aman melalui Midtrans. Mendukung
            transfer bank, e-wallet, dan kartu kredit.
          </p>
        </div>

        <button
          onClick={handlePayment}
          disabled={loadingPayment}
          className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loadingPayment ? "Memproses..." : "Bayar sekarang"}
        </button>
      </div>
    </div>
  );
}
