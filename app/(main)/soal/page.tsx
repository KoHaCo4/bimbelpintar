"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/NavbarDashboard";
import SoalCard from "@/components/ui/SoalCard";
import DashboardLayout from "@/components/ui/DashboardLayout";

type Soal = {
  id: string;
  judul: string;
  mapel: string;
  kelas: number;
  deskripsi: string;
  harga: number;
  jumlahSoal: number;
  durasi: number;
};

const filterMapel = [
  { label: "Semua", value: "SEMUA" },
  { label: "Matematika", value: "MATEMATIKA" },
  { label: "IPA", value: "IPA" },
  { label: "IPS", value: "IPS" },
  { label: "B. Indonesia", value: "BAHASA_INDONESIA" },
  { label: "B. Inggris", value: "BAHASA_INGGRIS" },
];

export default function KatalogPage() {
  const [soalList, setSoalList] = useState<Soal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeMapel, setActiveMapel] = useState("SEMUA");

  const fetchSoal = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (activeMapel !== "SEMUA") params.set("mapel", activeMapel);

    const res = await fetch(`/api/soal?${params.toString()}`);
    const data = await res.json();
    setSoalList(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSoal();
  }, [activeMapel]);

  return (
    <DashboardLayout>
      {/* Hero */}
      <div className="text-center py-8 sm:py-10 px-4">
        <h1 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2">
          Katalog Soal
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Beli akses sekali, belajar selamanya
        </p>

        {/* Search */}
        <div className="flex items-center gap-2 max-w-md mx-auto bg-white border border-gray-200 rounded-xl px-4 py-2">
          <svg
            className="w-4 h-4 text-gray-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchSoal()}
            placeholder="Cari soal..."
            className="flex-1 min-w-0 text-sm outline-none bg-transparent text-gray-700"
          />
          <button
            onClick={fetchSoal}
            className="shrink-0 text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
          >
            Cari
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 px-4 sm:px-6 flex-wrap mb-6">
        {filterMapel.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveMapel(f.value)}
            className={`text-sm px-3 sm:px-4 py-1.5 rounded-full border transition ${
              activeMapel === f.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid soal */}
      <div className="px-4 sm:px-6 pb-12">
        {loading ? (
          <div className="text-center text-sm text-gray-400 py-20">
            Memuat soal...
          </div>
        ) : soalList.length === 0 ? (
          <div className="text-center text-sm text-gray-400 py-20">
            Belum ada soal tersedia
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {soalList.map((soal) => (
              <SoalCard key={soal.id} soal={soal} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
