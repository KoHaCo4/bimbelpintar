import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Silakan login untuk melihat dashboard" },
        { status: 401 },
      );
    }

    const pembelian = await prisma.pembelian.findMany({
      where: {
        userId: session.user.id,
        status: "SUCCESS",
      },
      include: {
        soal: {
          include: {
            hasilUjian: {
              where: {
                userId: session.user.id,
                selesaiAt: { not: null },
              },
              select: { id: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(pembelian);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
