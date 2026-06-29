"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SoalForm from "@/components/ui/SoalForm";
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
  linkPembahasan: string;
};

export default function EditSoalPage() {
  const { id } = useParams();
  const [soal, setSoal] = useState<Soal | null>(null);

  useEffect(() => {
    const fetchSoal = async () => {
      const res = await fetch(`/api/admin/soal/${id}`);
      const data = await res.json();
      setSoal(data);
    };
    fetchSoal();
  }, [id]);
  if (!soal) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-40 text-sm text-gray-400">
          Memuat...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-xl font-medium text-gray-900 mb-6">Edit soal</h1>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <SoalForm mode="edit" initialData={soal} />
        </div>
      </div>
    </DashboardLayout>
  );
}
