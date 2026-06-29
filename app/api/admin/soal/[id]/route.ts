import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { authOptions } from "../../../../../lib/auth";
import { getServerSession } from "next-auth";

// Handler untuk mengedit soal berdasarkan ID

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const soal = await prisma.soal.findUnique({
      where: { id },
    });

    if (!soal) {
      return NextResponse.json(
        { error: "Soal tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(soal);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data soal" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

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

    const soal = await prisma.soal.update({
      where: { id },
      data: {
        judul,
        mapel,
        kelas: parseInt(kelas),
        deskripsi,
        harga: parseInt(harga),
        jumlahSoal: parseInt(jumlahSoal),
        durasi: parseInt(durasi),
        linkPembahasan,
      },
    });
    return NextResponse.json(
      { message: "Soal berhasil diperbarui", soal },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error memperbarui soal:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui soal" },
      { status: 500 },
    );
  }
}

// Handler untuk menghapus soal berdasarkan ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 401 });
    }

    await prisma.soal.delete({
      where: { id },
    });
    return NextResponse.json(
      { message: "Soal berhasil dihapus" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error menghapus soal:", error);
    return NextResponse.json(
      { message: "Gagal menghapus soal" },
      { status: 500 },
    );
  }
}
