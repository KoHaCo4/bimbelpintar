"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SoalFormProps = {
  initialData?: {
    id?: string;
    judul: string;
    mapel: string;
    kelas: number;
    deskripsi: string;
    harga: number;
    jumlahSoal: number;
    durasi: number;
    linkPembahasan: string;
  };
  mode: "tambah" | "edit";
};

const mapelOptions = [
  { label: "Matematika", value: "MATEMATIKA" },
  { label: "IPA", value: "IPA" },
  { label: "IPS", value: "IPS" },
  { label: "Bahasa Indonesia", value: "BAHASA_INDONESIA" },
  { label: "Bahasa Inggris", value: "BAHASA_INGGRIS" },
];

export default function MapelForm({ initialData, mode }: SoalFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    judul: initialData?.judul ?? "",
    mapel: initialData?.mapel ?? "MATEMATIKA",
    kelas: initialData?.kelas ?? 10,
    deskripsi: initialData?.deskripsi ?? "",
    harga: initialData?.harga ?? 0,
    jumlahSoal: initialData?.jumlahSoal ?? 0,
    durasi: initialData?.durasi ?? 0,
    linkPembahasan: initialData?.linkPembahasan ?? "",
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const url =
      mode === "tambah"
        ? "/api/admin/soal"
        : `/api/admin/soal/${initialData?.id}`;

    const method = mode === "tambah" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Terjadi kesalahan");
      setLoading(false);
      return;
    }

    router.push("/admin/soal");
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-700 mb-1">Judul Soal</label>
        <input
          type="text"
          value={form.judul}
          onChange={(e) => setForm({ ...form, judul: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm outline-none focus:border-blue-400"
          placeholder="Contoh: Latihan soal persamaan kuadrat"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Mata pelajaran
          </label>
          <select
            value={form.mapel}
            onChange={(e) => setForm({ ...form, mapel: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm outline-none focus:border-blue-400"
          >
            {mapelOptions.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Kelas</label>
          <input
            type="number"
            value={form.kelas}
            onChange={(e) =>
              setForm({ ...form, kelas: parseInt(e.target.value) })
            }
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm outline-none focus:border-blue-400"
            min={1}
            max={12}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">Deskripsi</label>
        <textarea
          value={form.deskripsi}
          onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm outline-none focus:border-blue-400"
          rows={3}
          placeholder="Deskripsi singkat tentang soal ini"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Harga (Rp)</label>
          <input
            placeholder="0"
            type="number"
            value={form.harga === 0 ? "" : form.harga}
            onChange={(e) =>
              setForm({ ...form, harga: parseInt(e.target.value) || 0 })
            }
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm outline-none focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Jumlah soal
          </label>
          <input
            placeholder="0"
            type="number"
            value={form.jumlahSoal === 0 ? "" : form.jumlahSoal}
            onChange={(e) =>
              setForm({ ...form, jumlahSoal: parseInt(e.target.value) })
            }
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm outline-none focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Durasi (menit)
          </label>
          <input
            placeholder="0"
            type="number"
            value={form.durasi === 0 ? "" : form.durasi}
            onChange={(e) =>
              setForm({ ...form, durasi: parseInt(e.target.value) })
            }
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm outline-none focus:border-blue-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">
          Link pembahasan (PDF)
        </label>
        <input
          type="text"
          value={form.linkPembahasan}
          onChange={(e) => setForm({ ...form, linkPembahasan: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm outline-none focus:border-blue-400"
          placeholder="https://drive.google.com/..."
        />
      </div>
      {/* <div>
        <label className="block text-sm text-gray-700 mb-1">Link soal</label>
        <input
          type="text"
          value={form.linkPembahasan}
          onChange={(e) => setForm({ ...form, linkPembahasan: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm outline-none focus:border-blue-400"
          placeholder="https://drive.google.com/..."
        />
      </div> */}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading
            ? "Menyimpan..."
            : mode === "tambah"
              ? "Tambah soal"
              : "Simpan perubahan"}
        </button>
        <button
          onClick={() => router.push("/admin/soal")}
          className="w-full sm:w-auto px-6 py-2 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
