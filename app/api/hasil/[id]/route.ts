import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
        soal: true,
        jawaban: {
          include: {
            pertanyaan: {
              include: { pilihan: true },
            },
          },
          orderBy: {
            pertanyaan: { urutan: "asc" },
          },
        },
      },
    });

    if (!hasilUjian || hasilUjian.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Hasil ujian tidak ditemukan" },
        { status: 404 },
      );
    }

    if (!hasilUjian.selesaiAt) {
      return NextResponse.json(
        { error: "Ujian belum selesai" },
        { status: 400 },
      );
    }

    return NextResponse.json(hasilUjian);
  } catch (error) {
    console.error("Error hasil ujian:", error);
    return NextResponse.json(
      { error: "Gagal mengambil hasil ujian" },
      { status: 500 },
    );
  }
}
