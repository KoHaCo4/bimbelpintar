import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { error } from "console";
import { stat } from "fs";
import { create } from "domain";

// Ambil semua pertanyaan berdasarkan soalId
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const soalId = searchParams.get("soalId");

    if (!soalId) {
      return NextResponse.json({ error: "soalId diperlukan" }, { status: 400 });
    }

    const pertanyaan = await prisma.pertanyaan.findMany({
      where: { soalId },
      include: { pilihan: true },
      orderBy: { urutan: "asc" },
    });

    return NextResponse.json(pertanyaan);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil pertanyaa" },
      { status: 500 },
    );
  }
}

// Tambah pertanyaan baru
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const { soalId, tipe, pertanyaan, urutan, pilihan } = await request.json();

    // Buat pertanyaan dulu
    const newPertanyaan = await prisma.pertanyaan.create({
      data: {
        soalId,
        tipe,
        pertanyaan,
        urutan,
      },
    });

    // Kalau PG, buat pilihan secara terpisah
    if (tipe === "PILIHAN_GANDA" && pilihan?.length > 0) {
      await prisma.pilihan.createMany({
        data: pilihan.map((p: any) => ({
          pertanyaanId: newPertanyaan.id,
          huruf: p.huruf,
          teks: p.teks,
          isBenar: p.isBenar,
        })),
      });
    }

    // Ambil ulang dengan pilihan
    const result = await prisma.pertanyaan.findUnique({
      where: { id: newPertanyaan.id },
      include: { pilihan: true },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal menambah pertanyaan" },
      { status: 500 },
    );
  }
}
