import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    // Data contoh di template
    const data = [
      {
        No: 1,
        Tipe: "PG",
        Pertanyaan: "Berapa hasil dari 2 + 2?",
        PilihanA: "3",
        PilihanB: "4",
        PilihanC: "5",
        PilihanD: "6",
        JawabanBenar: "B",
      },
      {
        No: 2,
        Tipe: "ESSAY",
        Pertanyaan: "Jelaskan proses fotosintesis pada tumbuhan!",
        PilihanA: "",
        PilihanB: "",
        PilihanC: "",
        PilihanD: "",
        JawabanBenar: "",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);

    // Atur lebar kolom
    worksheet["!cols"] = [
      { wch: 5 },
      { wch: 10 },
      { wch: 50 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Soal");

    // Tambah sheet petunjuk
    const petunjuk = [
      {
        Kolom: "Tipe",
        Keterangan: "Isi 'PG' untuk pilihan ganda atau 'ESSAY' untuk essay",
      },
      { Kolom: "Pertanyaan", Keterangan: "Tulis teks pertanyaan" },
      {
        Kolom: "PilihanA-D",
        Keterangan: "Isi pilihan jawaban (kosongkan jika tipe ESSAY)",
      },
      {
        Kolom: "JawabanBenar",
        Keterangan:
          "Isi A/B/C/D untuk jawaban yang benar (kosongkan jika ESSAY)",
      },
    ];
    const petunjukSheet = XLSX.utils.json_to_sheet(petunjuk);
    petunjukSheet["!cols"] = [{ wch: 15 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(workbook, petunjukSheet, "Petunjuk");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=template_soal.xlsx",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal membuat template" },
      { status: 500 },
    );
  }
}
