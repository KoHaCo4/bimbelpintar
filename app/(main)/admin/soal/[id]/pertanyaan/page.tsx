"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { domainToUnicode } from "url";
import { json } from "stream/consumers";
import DashboardLayout from "@/components/ui/DashboardLayout";

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

const emptyPilihan = [
  { huruf: "A", teks: "", isBenar: false },
  { huruf: "B", teks: "", isBenar: false },
  { huruf: "C", teks: "", isBenar: false },
  { huruf: "D", teks: "", isBenar: false },
];

export default function KelolaPertanyaanPage() {
  const { id: soalId } = useParams();

  const [pertanyaanList, setPertanyaanList] = useState<Pertanyaan[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSimpan, setLoadingSimpan] = useState(false);
  const [hapusId, setHapusId] = useState<string | null>(null);

  // Form state
  const [tipe, setTipe] = useState<"PILIHAN_GANDA" | "ESSAY">("PILIHAN_GANDA");
  const [pertanyaan, setPertanyaan] = useState("");
  const [pilihan, setPilihan] = useState(emptyPilihan);
  const [showForm, setShowForm] = useState(false);

  const fetchPertanyaan = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/pertanyaan?soalId=${soalId}`);
    const data = await res.json();
    setPertanyaanList(data);
    setLoading(false);
  };

  const [uploading, setUploading] = useState(false);
  const [hasilUpload, setHasilUpload] = useState<{
    berhasil: number;
    gagal: { baris: number; alasan: string }[];
    totalBaris: number;
  } | null>(null);

  useEffect(() => {
    fetchPertanyaan();
  }, [soalId]);

  const handlePilihanChange = (
    index: number,
    field: "teks" | "isBenar",
    value: string | boolean,
  ) => {
    setPilihan((prev) => {
      return prev.map((p, i) => {
        if (field === "isBenar") {
          // Hanya satu yang benar
          return { ...p, isBenar: i === index };
        }
        return i === index ? { ...p, [field]: value as string } : p;
      });
    });
  };

  const handleSimpan = async () => {
    if (!pertanyaan.trim()) {
      alert("Pertanyaan tidak boleh kosong");
      return;
    }

    if (tipe === "PILIHAN_GANDA") {
      const adabenar = pilihan.some((p) => p.isBenar);
      const semuaIsi = pilihan.every((p) => p.teks.trim());
      if (!adabenar) {
        alert("Pilih salah satu jawaban yang benar");
        return;
      }
      if (!semuaIsi) {
        alert("Semua jawaban harus diisi");
        return;
      }
    }
    setLoadingSimpan(true);

    const res = await fetch("/api/admin/pertanyaan", {
      method: "POST",
      headers: { "Content-Type": "aplication/json" },
      body: JSON.stringify({
        soalId,
        tipe,
        pertanyaan,
        urutan: pertanyaanList.length + 1,
        pilihan: tipe === "PILIHAN_GANDA" ? pilihan : [],
      }),
    });

    if (res.ok) {
      (setPertanyaan(""),
        setPilihan(emptyPilihan),
        setTipe("PILIHAN_GANDA"),
        setShowForm(false),
        fetchPertanyaan());
    } else {
      alert("Gagal menyimpan petanyaan");
    }

    setLoadingSimpan(false);
  };

  const handleDownloadTemplate = () => {
    window.open("/api/admin/pertanyaan/template", "_blank");
  };

  const handleUploadExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setHasilUpload(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("soalId", soalId as string);

    const res = await fetch("/api/admin/pertanyaan/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setHasilUpload(data);
      fetchPertanyaan();
    } else {
      alert(data.error);
    }

    setUploading(false);
    e.target.value = ""; // reset input file
  };

  const handleHapus = async (id: string) => {
    if (!confirm("Yakin ingin menghapus pertanyaan ini?")) return;
    setHapusId(id);

    const res = await fetch(`/api/admin/pertanyaan/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setPertanyaanList((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert("Gagal menghapus pertanyaan");
    }

    setHapusId(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/admin/soal"
              className="text-sm text-gray-400 hover:text-gray-600 mb-1 block"
            >
              ← Kembali ke admin
            </Link>
            <h1 className="text-xl font-medium text-gray-900">
              Kelola Pertanyaan
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {pertanyaanList.length} pertanyaan
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="text-sm border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              📥 Download template
            </button>
            <label className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer">
              {uploading ? "Mengupload..." : "📤 Upload Excel"}
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleUploadExcel}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              {showForm ? "Batal" : "+ Tambah manual"}
            </button>
          </div>
        </div>

        {/* Hasil upload */}
        {hasilUpload && (
          <div
            className={`border rounded-xl p-4 mb-6 ${
              hasilUpload.gagal.length > 0
                ? "bg-yellow-50 border-yellow-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <p className="text-sm font-medium mb-2">
              {hasilUpload.berhasil} dari {hasilUpload.totalBaris} pertanyaan
              berhasil ditambahkan
            </p>
            {hasilUpload.gagal.length > 0 && (
              <div className="space-y-1">
                {hasilUpload.gagal.map((g, i) => (
                  <p key={i} className="text-xs text-red-600">
                    Baris {g.baris}: {g.alasan}
                  </p>
                ))}
              </div>
            )}
            <button
              onClick={() => setHasilUpload(null)}
              className="text-xs text-gray-500 hover:underline mt-2"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Form tambah pertanyaan */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-6">
            <h2 className="text-sm font-medium text-gray-900 mb-4">
              Pertanyaan baru
            </h2>

            {/* Pilih tipe */}
            <div className="flex gap-2 sm:gap-3 mb-4">
              <button
                onClick={() => setTipe("PILIHAN_GANDA")}
                className={`flex-1 sm:flex-none text-sm px-3 sm:px-4 py-1.5 rounded-lg border transition ${
                  tipe === "PILIHAN_GANDA"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200"
                }`}
              >
                Pilihan ganda
              </button>
              <button
                onClick={() => setTipe("ESSAY")}
                className={`flex-1 sm:flex-none text-sm px-3 sm:px-4 py-1.5 rounded-lg border transition ${
                  tipe === "ESSAY"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200"
                }`}
              >
                Essay
              </button>
            </div>

            {/* Input pertanyaan */}
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">
                Teks pertanyaan
              </label>
              <textarea
                value={pertanyaan}
                onChange={(e) => setPertanyaan(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                placeholder="Tulis pertanyaan di sini..."
              />
            </div>

            {/* Pilihan jawaban (hanya untuk PG) */}
            {tipe === "PILIHAN_GANDA" && (
              <div className="space-y-2 mb-4">
                <label className="block text-sm text-gray-700">
                  Pilihan jawaban{" "}
                  <span className="text-gray-400">(centang yang benar)</span>
                </label>
                {pilihan.map((p, i) => (
                  <div
                    key={p.huruf}
                    className="flex items-center gap-2 sm:gap-3"
                  >
                    <input
                      type="radio"
                      name="jawaban_benar"
                      checked={p.isBenar}
                      onChange={() => handlePilihanChange(i, "isBenar", true)}
                      className="accent-blue-600 shrink-0"
                    />
                    <span className="text-sm font-medium text-gray-500 w-4 shrink-0">
                      {p.huruf}
                    </span>
                    <input
                      type="text"
                      value={p.teks}
                      onChange={(e) =>
                        handlePilihanChange(i, "teks", e.target.value)
                      }
                      className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-400"
                      placeholder={`Pilihan ${p.huruf}`}
                    />
                  </div>
                ))}
              </div>
            )}

            {tipe === "ESSAY" && (
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-4">
                <p className="text-xs text-yellow-700">
                  💡 Jawaban essay dinilai secara manual oleh admin setelah
                  siswa mengumpulkan.
                </p>
              </div>
            )}

            <button
              onClick={handleSimpan}
              disabled={loadingSimpan}
              className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loadingSimpan ? "Menyimpan..." : "Simpan pertanyaan"}
            </button>
          </div>
        )}

        {/* Daftar pertanyaan */}
        {loading ? (
          <div className="text-center text-sm text-gray-400 py-20">
            Memuat...
          </div>
        ) : pertanyaanList.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <p className="text-sm text-gray-400">
              Belum ada pertanyaan. Klik "+ Tambah" untuk mulai.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {pertanyaanList.map((p, index) => (
              <div
                key={p.id}
                className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                    <span className="text-sm font-medium text-gray-400 mt-0.5 shrink-0">
                      {index + 1}.
                    </span>
                    <div className="min-w-0">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium mb-2 inline-block ${
                          p.tipe === "PILIHAN_GANDA"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {p.tipe === "PILIHAN_GANDA" ? "Pilihan ganda" : "Essay"}
                      </span>
                      <p className="text-sm text-gray-900 break-words">
                        {p.pertanyaan}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleHapus(p.id)}
                    disabled={hapusId === p.id}
                    className="shrink-0 text-xs px-2.5 sm:px-3 py-1.5 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
                  >
                    {hapusId === p.id ? "..." : "Hapus"}
                  </button>
                </div>

                {/* Tampilkan pilihan kalau PG */}
                {p.tipe === "PILIHAN_GANDA" && p.pilihan.length > 0 && (
                  <div className="ml-5 sm:ml-6 space-y-1.5">
                    {p.pilihan.map((pl) => (
                      <div
                        key={pl.id}
                        className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg ${
                          pl.isBenar
                            ? "bg-green-50 text-green-700"
                            : "text-gray-600"
                        }`}
                      >
                        <span className="font-medium shrink-0">
                          {pl.huruf}.
                        </span>
                        <span className="break-words">{pl.teks}</span>
                        {pl.isBenar && (
                          <span className="text-xs ml-auto shrink-0">
                            ✓ Benar
                          </span>
                        )}
                      </div>
                    ))}
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
