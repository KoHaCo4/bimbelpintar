import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const { isBenar } = await request.json();

    const jawaban = await prisma.jawaban.update({
      where: { id },
      data: { isBenar },
    });

    // Hitung ulang skor hasil ujian (gabungan PG + essay yang sudah dinilai)
    const hasilUjian = await prisma.hasilUjian.findUnique({
      where: { id: jawaban.hasilUjianId },
      include: {
        jawaban: {
          include: { pertanyaan: true },
        },
      },
    });

    if (hasilUjian) {
      const semuaDinilai = hasilUjian.jawaban.every(
        (j) => j.pertanyaan.tipe !== "ESSAY" || j.isBenar !== null,
      );

      if (semuaDinilai) {
        const totalSoal = hasilUjian.jawaban.length;
        const totalBenar = hasilUjian.jawaban.filter(
          (j) => j.isBenar === true,
        ).length;
        const skorBaru = totalSoal > 0 ? (totalBenar / totalSoal) * 100 : null;

        await prisma.hasilUjian.update({
          where: { id: hasilUjian.id },
          data: { skor: skorBaru },
        });
      }
    }

    return NextResponse.json(jawaban);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menilai essay" }, { status: 500 });
  }
}
