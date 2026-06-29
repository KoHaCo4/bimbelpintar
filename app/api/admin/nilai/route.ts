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
    const soalId = searchParams.get("soalId");

    const hasilUjian = await prisma.hasilUjian.findMany({
      where: {
        selesaiAt: { not: null },
        ...(soalId && soalId !== "SEMUA" && { soalId }),
      },
      include: {
        user: { select: { name: true, email: true } },
        soal: { select: { id: true, judul: true, mapel: true } },
      },
      orderBy: { selesaiAt: "desc" },
    });

    // Untuk dropdown filter soal
    const daftarSoal = await prisma.soal.findMany({
      select: { id: true, judul: true },
      orderBy: { judul: "asc" },
    });

    return NextResponse.json({ hasilUjian, daftarSoal });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal mengambil data nilai" },
      { status: 500 },
    );
  }
}
