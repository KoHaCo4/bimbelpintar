import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { error } from "console";
import { stat } from "fs";
import { json } from "stream/consumers";
import { constants } from "buffer";

// Ambil data ujian + pertanyaan
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasilUjian = await prisma.hasilUjian.findUnique({
      where: { id },
      include: {
        soal: {
          include: {
            pertanyaan: {
              include: {
                pilihan: true,
              },
              orderBy: { urutan: "asc" },
            },
          },
        },
        jawaban: true,
      },
    });

    if (!hasilUjian || hasilUjian.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Ujian tidak ditemukan" },
        { status: 404 },
      );
    }

    // Sembunyikan jawaban benar dari peserta
    const pertanyaan = hasilUjian.soal.pertanyaan.map((p) => ({
      ...p,
      pilihan: p.pilihan
        .sort((a, b) => a.huruf.localeCompare(b.huruf))
        .map((pl) => ({
          id: pl.id,
          huruf: pl.huruf,
          teks: pl.teks,
        })),
    }));
    const durasiDetik = hasilUjian.soal.durasi * 60;

    // Hitung sisa waktu
    const mulaiAt = hasilUjian.mulaiAt.getTime();
    const sekarang = Date.now();
    const terpakai = Math.floor((sekarang - mulaiAt) / 1000);
    const sisaWaktu = Math.max(0, durasiDetik - terpakai);

    return NextResponse.json({
      hasilUjian: {
        id: hasilUjian.id,
        mulaiAt: hasilUjian.mulaiAt,
        selesaiAt: hasilUjian.selesaiAt,
      },
      soal: {
        id: hasilUjian.soal.id,
        judul: hasilUjian.soal.judul,
        durasi: hasilUjian.soal.durasi,
      },
      sisaWaktu,
      pertanyaan,
      jawabanSudahDiisi: hasilUjian.jawaban.map((j) => ({
        pertanyaanId: j.pertanyaanId,
        jawaban: j.jawaban,
      })),
    });
  } catch (error) {
    console.log("ERROR: ", error);
    return NextResponse.json(
      { error: "Gagal mengambil data ujian" },
      { status: 500 },
    );
  }
}

// Submit semua jawaban dan selesaikan ujian
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jawaban } = await request.json();
    // jawaban = [{ PertanyaanId, jawaban }]

    const hasilUjian = await prisma.hasilUjian.findUnique({
      where: { id },
      include: {
        soal: {
          include: {
            pertanyaan: {
              include: { pilihan: true },
            },
          },
        },
      },
    });

    console.log("hasilUjian ditemukan:", hasilUjian?.id);
    console.log("selesaiAt:", hasilUjian?.selesaiAt);
    console.log("userId match:", hasilUjian?.userId === session.user.id);
    console.log("jawaban diterima:", jawaban); // tambah ini
    console.log("jawaban length:", jawaban?.length); // tambah ini

    if (!hasilUjian || hasilUjian.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Ujian tidak ditemukan" },
        { status: 404 },
      );
    }

    if (hasilUjian.selesaiAt) {
      return NextResponse.json(
        { error: "Ujian sudah diselesaikan" },
        { status: 400 },
      );
    }

    // Hitung skor Pilihan ganda
    let benar = 0;
    let totalPG = 0;

    const jawabanData = jawaban.map(
      (j: { pertanyaanId: string; jawaban: string }) => {
        const pertanyaan = hasilUjian.soal.pertanyaan.find(
          (p) => p.id === j.pertanyaanId,
        );

        let isBenar = null;

        if (pertanyaan?.tipe === "PILIHAN_GANDA") {
          totalPG++;
          const pilihanBenar = pertanyaan.pilihan.find((p) => p.isBenar);
          isBenar = pilihanBenar?.huruf === j.jawaban;
          if (isBenar) benar++;
        }

        return {
          hasilUjianId: id,
          pertanyaanId: j.pertanyaanId,
          jawaban: j.jawaban,
          isBenar,
        };
      },
    );

    // Simpan jawaban
    await prisma.jawaban.createMany({
      data: jawabanData,
      skipDuplicates: true,
    });

    // Hitung skor (hanya PG, essay tidak dihitung otomatis)
    const skor = totalPG > 0 ? (benar / totalPG) * 100 : null;

    // Update hasil ujian
    await prisma.hasilUjian.update({
      where: { id },
      data: {
        skor,
        selesaiAt: new Date(),
      },
    });

    return NextResponse.json({ skor, hasilId: id });
  } catch (error) {
    console.log("ERROR: ", error);
    return NextResponse.json(
      { error: "Gagal menyimpan jawaban" },
      { status: 500 },
    );
  }
}
