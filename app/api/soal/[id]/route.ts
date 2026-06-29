import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    const { id } = await params;

    const soal = await prisma.soal.findUnique({
      where: { id },
    });

    if (!soal) {
      return NextResponse.json({ message: "Soal not found" }, { status: 404 });
    }

    // cek apakah user sudah membeli soal ini
    let sudahBeli = false;
    if (session?.user?.id) {
      const pembelian = await prisma.pembelian.findFirst({
        where: {
          userId: session.user.id,
          soalId: id,
        },
      });
      sudahBeli = !!pembelian;
    }

    // sembunyikan soal jika belum dibeli
    return NextResponse.json({
      ...soal,
      linkPembahasan: sudahBeli ? soal.linkPembahasan : null,
      sudahBeli,
    });
  } catch (error) {
    console.error("Error fetching soal:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
