import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const siswa = await prisma.user.findMany({
      where: { role: "SISWA" },
      include: {
        pembelian: {
          where: { status: "SUCCESS" },
          select: { id: true },
        },
        hasilUjian: {
          where: { selesaiAt: { not: null } },
          select: { id: true, skor: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    console.log("siswa ditemukan:", siswa.length);

    const result = siswa.map((s) => ({
      id: s.id,
      nama: s.name,
      email: s.email,
      createdAt: s.createdAt,
      totalSoalDibeli: s.pembelian.length,
      totalUjianSelesai: s.hasilUjian.length,
      rataRataSkor:
        s.hasilUjian.filter((h) => h.skor !== null).length > 0
          ? Math.round(
              s.hasilUjian.reduce((acc, h) => acc + (h.skor ?? 0), 0) /
                s.hasilUjian.filter((h) => h.skor !== null).length,
            )
          : null,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal mengambil data siswa" },
      { status: 500 },
    );
  }
}
