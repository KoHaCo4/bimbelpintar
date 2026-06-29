import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { patchFetch } from "next/dist/server/app-render/entry-base";
import { error } from "console";

// Hapus pertanyaan
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    await prisma.pertanyaan.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Pertanyaan berhasil dihapus" });
  } catch (error) {
    console.error("Error hapus pertanyaan:", error); // tambah ini
    return NextResponse.json(
      { error: "Gagal menghapus pertanyaan" },
      { status: 500 },
    );
  }
}
