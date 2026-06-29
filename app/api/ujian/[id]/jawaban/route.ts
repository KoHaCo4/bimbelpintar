import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { error } from "console";

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

    const { pertanyaanId, jawaban } = await request.json();
    const hasilUjian = await prisma.hasilUjian.findUnique({
      where: { id },
    });

    if (!hasilUjian || hasilUjian.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Hasil ujian tidak ditemukan" },
        { status: 404 },
      );
    }

    // Upsert jawaban — update kalau sudah ada, insert kalau belum
    await prisma.jawaban.upsert({
      where: {
        hasilUjianId_pertanyaanId: {
          hasilUjianId: id,
          pertanyaanId,
        },
      },
      update: { jawaban },
      create: { hasilUjianId: id, pertanyaanId, jawaban },
    });
    return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menyimpan" }, { status: 500 });
  }
}
