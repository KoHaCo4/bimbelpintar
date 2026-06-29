import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const soalId = formData.get("soalId") as string;

    if (!file || !soalId) {
      return NextResponse.json(
        { error: "File dan soalId diperlukan" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "File Excel kosong atau format salah" },
        { status: 400 },
      );
    }

    // Ambil urutan terakhir yang sudah ada
    const existingCount = await prisma.pertanyaan.count({ where: { soalId } });

    let berhasil = 0;
    let gagal: { baris: number; alasan: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const baris = i + 2; // +2 karena baris 1 adalah header

      const tipe = String(row.Tipe ?? "")
        .trim()
        .toUpperCase();
      const pertanyaanText = String(row.Pertanyaan ?? "").trim();

      if (!pertanyaanText) {
        gagal.push({ baris, alasan: "Pertanyaan kosong" });
        continue;
      }

      if (tipe !== "PG" && tipe !== "ESSAY") {
        gagal.push({ baris, alasan: "Tipe harus PG atau ESSAY" });
        continue;
      }

      try {
        if (tipe === "PG") {
          const pilihanRaw = [
            { huruf: "A", teks: String(row.PilihanA ?? "").trim() },
            { huruf: "B", teks: String(row.PilihanB ?? "").trim() },
            { huruf: "C", teks: String(row.PilihanC ?? "").trim() },
            { huruf: "D", teks: String(row.PilihanD ?? "").trim() },
          ];

          const jawabanBenar = String(row.JawabanBenar ?? "")
            .trim()
            .toUpperCase();

          if (pilihanRaw.some((p) => !p.teks)) {
            gagal.push({ baris, alasan: "Semua pilihan A-D harus diisi" });
            continue;
          }

          if (!["A", "B", "C", "D"].includes(jawabanBenar)) {
            gagal.push({ baris, alasan: "JawabanBenar harus A/B/C/D" });
            continue;
          }

          const newPertanyaan = await prisma.pertanyaan.create({
            data: {
              soalId,
              tipe: "PILIHAN_GANDA",
              pertanyaan: pertanyaanText,
              urutan: existingCount + berhasil + 1,
            },
          });

          await prisma.pilihan.createMany({
            data: pilihanRaw.map((p) => ({
              pertanyaanId: newPertanyaan.id,
              huruf: p.huruf,
              teks: p.teks,
              isBenar: p.huruf === jawabanBenar,
            })),
          });
        } else {
          await prisma.pertanyaan.create({
            data: {
              soalId,
              tipe: "ESSAY",
              pertanyaan: pertanyaanText,
              urutan: existingCount + berhasil + 1,
            },
          });
        }

        berhasil++;
      } catch (err) {
        gagal.push({ baris, alasan: "Gagal menyimpan ke database" });
      }
    }

    return NextResponse.json({
      berhasil,
      gagal,
      totalBaris: rows.length,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal memproses file Excel" },
      { status: 500 },
    );
  }
}
