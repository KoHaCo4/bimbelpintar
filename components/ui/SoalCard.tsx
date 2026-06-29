import Link from "next/link";
import { useSession } from "next-auth/react";

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

const mapelColor: Record<string, string> = {
  MATEMATIKA: "bg-blue-50 text-blue-700",
  IPA: "bg-green-50 text-green-700",
  IPS: "bg-purple-50 text-purple-700",
  BAHASA_INDONESIA: "bg-pink-50 text-pink-700",
  BAHASA_INGGRIS: "bg-orange-50 text-orange-700",
};

const mapelLabel: Record<string, string> = {
  MATEMATIKA: "Matematika",
  IPA: "IPA",
  IPS: "IPS",
  BAHASA_INDONESIA: "B. Indonesia",
  BAHASA_INGGRIS: "B. Inggris",
};

export default function SoalCard({ soal }: { soal: Soal }) {
  const { data: session } = useSession();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-sm transition h-full">
      <div className="flex items-center justify-between">
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${mapelColor[soal.mapel]}`}
        >
          {mapelLabel[soal.mapel]}
        </span>
        <span className="text-xs text-gray-400">Kelas {soal.kelas}</span>
      </div>

      <h3 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">
        {soal.judul}
      </h3>

      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span>{soal.jumlahSoal} soal</span>
        <span>·</span>
        <span>{soal.durasi} menit</span>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <span className="text-sm font-medium text-blue-600">
          Rp {soal.harga.toLocaleString("id-ID")}
        </span>
        {session && session.user.role === "ADMIN" ? (
          <div className="flex gap-2">
            <Link
              href={`/soal/${soal.id}`}
              className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
            >
              Detail
            </Link>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              href={`/soal/${soal.id}`}
              className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
            >
              Detail
            </Link>
            <Link
              href={`/soal/${soal.id}`}
              className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Beli
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
