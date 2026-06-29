import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { authOptions } from "../../../../lib/auth";
import { getServerSession } from "next-auth";

// Handler untuk membuat soal baru
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    console.log(`ISI SESSION: `, JSON.stringify(session?.user));

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 401 });
    }

    const {
      judul,
      mapel,
      kelas,
      deskripsi,
      harga,
      jumlahSoal,
      durasi,
      linkPembahasan,
    } = await request.json();

    if (!judul || !mapel || !kelas || !harga || !linkPembahasan) {
      return NextResponse.json(
        { message: "Data tidak lengkap" },
        { status: 400 },
      );
    }

    const soal = await prisma.soal.create({
      data: {
        judul,
        mapel,
        kelas: parseInt(kelas),
        deskripsi,
        harga: parseInt(harga),
        jumlahSoal: parseInt(jumlahSoal),
        durasi: parseInt(durasi),
        linkPembahasan: linkPembahasan ?? null,
      },
    });
    return NextResponse.json(
      { message: "Soal berhasil dibuat", soal },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error membuat soal:", error);
    return NextResponse.json(
      { message: "Gagal membuat soal" },
      { status: 500 },
    );
  }
}
