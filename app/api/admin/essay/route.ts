import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") ?? "BELUM_DINILAI";

    const jawaban = await prisma.jawaban.findMany({
      where: {
        pertanyaan: { tipe: "ESSAY" },
        ...(filter === "BELUM_DINILAI" && { isBenar: null }),
        ...(filter === "SUDAH_DINILAI" && { isBenar: { not: null } }),
        hasilUjian: { selesaiAt: { not: null } },
      },
      include: {
        pertanyaan: { select: { pertanyaan: true, soalId: true } },
        hasilUjian: {
          include: {
            user: { select: { name: true, email: true } },
            soal: { select: { judul: true, mapel: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(jawaban);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal mengambil data essay" },
      { status: 500 },
    );
  }
}
