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

    // Semua transaksi sukses
    const transaksiSukses = await prisma.pembelian.findMany({
      where: { status: "SUCCESS" },
      include: {
        soal: { select: { id: true, judul: true, harga: true, mapel: true } },
      },
    });

    // Total pendapatan & statistik umum
    const totalPendapatan = transaksiSukses.reduce(
      (acc, t) => acc + t.soal.harga,
      0,
    );
    const totalSiswa = await prisma.user.count({ where: { role: "SISWA" } });
    const totalSoal = await prisma.soal.count();
    const totalTransaksi = await prisma.pembelian.count();

    // Pendapatan per bulan (6 bulan terakhir)
    const pendapatanPerBulan: Record<string, number> = {};
    const sekarang = new Date();

    for (let i = 5; i >= 0; i--) {
      const bulan = new Date(
        sekarang.getFullYear(),
        sekarang.getMonth() - i,
        1,
      );
      const key = bulan.toLocaleDateString("id-ID", {
        month: "short",
        year: "2-digit",
      });
      pendapatanPerBulan[key] = 0;
    }

    transaksiSukses.forEach((t) => {
      const tanggal = new Date(t.createdAt);
      const key = tanggal.toLocaleDateString("id-ID", {
        month: "short",
        year: "2-digit",
      });
      if (key in pendapatanPerBulan) {
        pendapatanPerBulan[key] += t.soal.harga;
      }
    });

    const grafikPendapatan = Object.entries(pendapatanPerBulan).map(
      ([bulan, total]) => ({ bulan, total }),
    );

    // Soal terpopuler
    const popularitasMap: Record<
      string,
      { judul: string; mapel: string; jumlah: number }
    > = {};
    transaksiSukses.forEach((t) => {
      if (!popularitasMap[t.soal.id]) {
        popularitasMap[t.soal.id] = {
          judul: t.soal.judul,
          mapel: t.soal.mapel,
          jumlah: 0,
        };
      }
      popularitasMap[t.soal.id].jumlah++;
    });

    const soalTerpopuler = Object.values(popularitasMap)
      .sort((a, b) => b.jumlah - a.jumlah)
      .slice(0, 5);

    // Transaksi terbaru
    const transaksiTerbaru = await prisma.pembelian.findMany({
      take: 5,
      include: {
        user: { select: { name: true } },
        soal: { select: { judul: true, harga: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      stats: {
        totalPendapatan,
        totalSiswa,
        totalSoal,
        totalTransaksi,
      },
      grafikPendapatan,
      soalTerpopuler,
      transaksiTerbaru,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal mengambil data dashboard" },
      { status: 500 },
    );
  }
}
