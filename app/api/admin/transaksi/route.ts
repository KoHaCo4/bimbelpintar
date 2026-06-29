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
    const status = searchParams.get("status");

    const transaksi = await prisma.pembelian.findMany({
      where: {
        ...(status && status !== "SEMUA" && { status: status as any }),
      },
      include: {
        user: { select: { name: true, email: true } },
        soal: { select: { judul: true, harga: true, mapel: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalPendapatan = transaksi
      .filter((t) => t.status === "SUCCESS")
      .reduce((acc, t) => acc + t.soal.harga, 0);

    return NextResponse.json({
      transaksi,
      stats: {
        total: transaksi.length,
        sukses: transaksi.filter((t) => t.status === "SUCCESS").length,
        pending: transaksi.filter((t) => t.status === "PENDING").length,
        gagal: transaksi.filter((t) => t.status === "FAILED").length,
        totalPendapatan,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal mengambil data transaksi" },
      { status: 500 },
    );
  }
}
