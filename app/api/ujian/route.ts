import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { error } from "console";
import { stat } from "fs";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Silahkan login terlebih dahulu" },
        { status: 401 },
      );
    }

    const { soalId } = await request.json();

    // Cek sudah beli soal apa belum
    const sudahBeli = await prisma.pembelian.findFirst({
      where: {
        userId: session.user.id,
        soalId,
        status: "SUCCESS",
      },
    });

    if (!sudahBeli) {
      return NextResponse.json(
        { error: "Anda belum memiliki akses ke soal ini" },
        { status: 403 },
      );
    }

    // Cek sudah pernah mengerjakan atau belum
    const sudahMengerjakan = await prisma.hasilUjian.findFirst({
      where: {
        userId: session.user.id,
        soalId,
        selesaiAt: { not: null },
      },
    });

    if (sudahMengerjakan) {
      return NextResponse.json(
        {
          error: "Kamu sudah pernah mengerjakan soal ini",
          hasilId: sudahMengerjakan.id,
        },
        { status: 400 },
      );
    }

    // Cek ada sesi yang belum aktif
    const sesiAktif = await prisma.hasilUjian.findFirst({
      where: {
        userId: session.user.id,
        soalId,
        selesaiAt: null,
      },
    });

    if (sesiAktif) {
      return NextResponse.json({ hasilId: sesiAktif.id });
    }

    //Buat sesi ujian baru
    const hasilUjian = await prisma.hasilUjian.create({
      data: {
        userId: session.user.id,
        soalId,
        mulaiAt: new Date(new Date().toUTCString()),
      },
    });

    return NextResponse.json({ hasilUjian: hasilUjian.id });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Gagal memulai ujian" }, { status: 500 });
  }
}
