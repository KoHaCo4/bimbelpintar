"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

type Pilihan = {
  id: string;
  huruf: string;
  teks: string;
};

type Pertanyaan = {
  id: string;
  urutan: number;
  tipe: "PILIHAN_GANDA" | "ESSAY";
  pertanyaan: string;
  pilihan: Pilihan[];
};

type Soal = {
  id: string;
  judul: string;
  durasi: number;
};

export default function ujianPage() {
  const { id: hasilId } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [soal, setSoal] = useState<Soal | null>(null);
  const [pertanyaanList, setPertanyaanList] = useState<Pertanyaan[]>([]);
  const [jawaban, setJawaban] = useState<Record<string, string>>({});
  const [aktif, setAktif] = useState(0);
  const [sisaWaktu, setSisaWaktu] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [sudahSelesai, setSudahSelesai] = useState(false);

  // Fetch data ujian
  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchUjian = async () => {
      const res = await fetch(`/api/ujian/${hasilId}`);
      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        router.push("/dashboard");
        return;
      }

      if (data.hasilUjian.selesaiAt) {
        setSudahSelesai(true);
        router.push(`/hasil/${hasilId}`);
        return;
      }

      setSoal(data.soal);
      setPertanyaanList(data.pertanyaan);
      setSisaWaktu(data.sisaWaktu);
      // Isi Jawaban yang sudah ada
      const jawabanAwal: Record<string, string> = {};
      data.jawabanSudahDiisi.forEach(
        (j: { pertanyaanId: string; jawaban: string }) => {
          jawabanAwal[j.pertanyaanId] = j.jawaban;
        },
        setJawaban(jawabanAwal),
        setLoading(false),
      );
    };
    fetchUjian();
  }, [session?.user?.id]);

  // Blokir Refresh browser / Tutup Tab
  useEffect(() => {
    if (loading || sudahSelesai) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [loading, sudahSelesai]);

  // Blokir tombol back brwoser
  useEffect(() => {
    if (loading || sudahSelesai) return;

    // Push state dummy supaya button tidak langsung keluar
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      alert("⚠️ Kamu tidak bisa keluar sebelum menyelesaikan ujian!");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [loading, sudahSelesai]);

  // Submit jawaban
  const handleSubmit = useCallback(
    async (otomatis = false) => {
      if (loadingSubmit || sudahSelesai) return;

      if (!otomatis) {
        const belumDijawab = pertanyaanList.filter(
          (p) => !jawaban[p.id],
        ).length;
        if (belumDijawab > 0) {
          const konfirmasi = confirm(
            `Masih ada ${belumDijawab} yang belum dijawab. Yakin ingin mengumpulkan?`,
          );
          if (!konfirmasi) return;
        }
      }

      setLoadingSubmit(true);
      setSudahSelesai(true);

      const jawabanArray = pertanyaanList.map((p) => ({
        pertanyaanId: p.id,
        jawaban: jawaban[p.id] ?? "",
      }));

      const res = await fetch(`/api/ujian/${hasilId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jawaban: jawabanArray }),
      });

      const data = await res.json();
      console.log("hasil submit:", data);

      if (res.ok) {
        router.push(`/hasil/${hasilId}`);
      } else if (data.error === "Ujian sudah diselesaikan") {
        // Kalau sudah selesai, langsung ke hasil
        router.push(`/hasil/${hasilId}`);
      } else {
        alert(data.error);
        setLoadingSubmit(false);
        setSudahSelesai(false);
      }
    },
    [jawaban, pertanyaanList, loadingSubmit, sudahSelesai, hasilId],
  );

  // Timer
  useEffect(() => {
    if (loading || sudahSelesai || sisaWaktu <= 0) return;

    const inteval = setInterval(() => {
      setSisaWaktu((prev) => {
        if (prev <= 1) {
          clearInterval(inteval);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(inteval);
  }, [loading, sudahSelesai, handleSubmit, sisaWaktu]);

  const autoSave = async (pertanyaanId: string, jawaban: string) => {
    await fetch(`/api/ujian/${hasilId}/jawaban`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pertanyaanId, jawaban }),
    });
  };

  const formatWaktu = (detik: number) => {
    const m = Math.floor(detik / 60)
      .toString()
      .padStart(2, "0");
    const s = (detik % 60).toString().padStart(2, "0");
    return `${m} : ${s}`;
  };

  const sudahDijawab = pertanyaanList.filter((p) => jawaban[p.id]).length;

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm text-gray-400">
        Memuat ujian...
      </div>
    );
  }

  if (!soal) return null;

  const pertanyaanAktif = pertanyaanList[aktif];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Banner peringatan */}
      {!sudahSelesai && (
        <div className="bg-yellow-50 border-b border-yellow-100 px-4 py-2 text-center sticky top-0 z-20">
          <p className="text-xs text-yellow-700">
            ⚠️ Jangan tutup atau refresh halaman sebelum selesai
          </p>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="min-w-0 mr-3">
          <div className="text-xs text-gray-400 mb-0.5">Sedang mengerjakan</div>
          <div className="text-sm font-medium text-gray-900 truncate max-w-[140px] sm:max-w-xs">
            {soal.judul}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="text-center hidden sm:block">
            <div className="text-xs text-gray-400 mb-0.5">Dijawab</div>
            <div className="text-sm font-medium text-gray-900">
              {sudahDijawab}/{pertanyaanList.length}
            </div>
          </div>
          <div
            className={`text-center px-2.5 sm:px-3 py-1.5 rounded-lg ${
              sisaWaktu < 300 ? "bg-red-50" : "bg-gray-50"
            }`}
          >
            <div className="text-xs text-gray-400 mb-0.5">Waktu</div>
            <div
              className={`text-sm font-medium tabular-nums ${
                sisaWaktu < 300 ? "text-red-600" : "text-gray-900"
              }`}
            >
              {formatWaktu(sisaWaktu)}
            </div>
          </div>
          <button
            onClick={() => handleSubmit(false)}
            disabled={loadingSubmit}
            className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loadingSubmit ? "..." : "Kumpulkan"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 max-w-5xl mx-auto w-full px-4 py-6 gap-6">
        {/* Navigasi soal — hidden di mobile */}
        <div className="w-48 shrink-0 hidden sm:block">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sticky top-24">
            <div className="text-xs text-gray-500 font-medium mb-3">
              Navigasi soal
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {pertanyaanList.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setAktif(i)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition ${
                    i === aktif
                      ? "bg-blue-600 text-white"
                      : jawaban[p.id]
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-3 h-3 rounded bg-green-100" />
                Sudah dijawab
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-3 h-3 rounded bg-gray-100" />
                Belum dijawab
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-3 h-3 rounded bg-blue-600" />
                Sedang dilihat
              </div>
            </div>
          </div>
        </div>

        {/* Area soal */}
        <div className="flex-1 min-w-0">
          {/* Navigasi soal mobile — grid kecil di atas soal */}
          <div className="sm:hidden bg-white border border-gray-200 rounded-xl p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-medium">
                Navigasi soal
              </span>
              <span className="text-xs text-gray-400">
                {sudahDijawab}/{pertanyaanList.length} dijawab
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {pertanyaanList.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setAktif(i)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition ${
                    i === aktif
                      ? "bg-blue-600 text-white"
                      : jawaban[p.id]
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {pertanyaanAktif && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
              {/* Nomor & tipe */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-gray-400">
                  Soal {aktif + 1} dari {pertanyaanList.length}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    pertanyaanAktif.tipe === "PILIHAN_GANDA"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-orange-50 text-orange-700"
                  }`}
                >
                  {pertanyaanAktif.tipe === "PILIHAN_GANDA"
                    ? "Pilihan ganda"
                    : "Essay"}
                </span>
              </div>

              {/* Pertanyaan */}
              <p className="text-gray-900 mb-6 leading-relaxed text-sm sm:text-base break-words">
                {pertanyaanAktif.pertanyaan}
              </p>

              {/* Pilihan ganda */}
              {pertanyaanAktif.tipe === "PILIHAN_GANDA" && (
                <div className="space-y-2">
                  {pertanyaanAktif.pilihan.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setJawaban((prev) => ({
                          ...prev,
                          [pertanyaanAktif.id]: p.huruf,
                        }));
                        autoSave(pertanyaanAktif.id, p.huruf);
                      }}
                      className={`w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl border text-left transition ${
                        jawaban[pertanyaanAktif.id] === p.huruf
                          ? "border-blue-500 bg-blue-50 text-blue-900"
                          : "border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                          jawaban[pertanyaanAktif.id] === p.huruf
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.huruf}
                      </span>
                      <span className="text-sm break-words">{p.teks}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Essay */}
              {pertanyaanAktif.tipe === "ESSAY" && (
                <div>
                  <textarea
                    value={jawaban[pertanyaanAktif.id] ?? ""}
                    onChange={(e) =>
                      setJawaban((prev) => ({
                        ...prev,
                        [pertanyaanAktif.id]: e.target.value,
                      }))
                    }
                    onBlur={(e) => autoSave(pertanyaanAktif.id, e.target.value)}
                    rows={6}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 resize-none"
                    placeholder="Tulis jawaban kamu di sini..."
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Essay akan dinilai secara manual oleh pengajar.
                  </p>
                </div>
              )}

              {/* Navigasi prev/next */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setAktif((prev) => Math.max(0, prev - 1))}
                  disabled={aktif === 0}
                  className="text-sm px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition"
                >
                  ← Sebelumnya
                </button>
                <button
                  onClick={() =>
                    setAktif((prev) =>
                      Math.min(pertanyaanList.length - 1, prev + 1),
                    )
                  }
                  disabled={aktif === pertanyaanList.length - 1}
                  className="text-sm px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition"
                >
                  Selanjutnya →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
