import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mapel = searchParams.get("mapel");
    const search = searchParams.get("search") || "";

    const soal = await prisma.soal.findMany({
      where: {
        ...(mapel && mapel !== "SEMUA" && { mapel: mapel as any }),
        ...(search && {
          judul: {
            contains: search,
          },
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(soal);
  } catch (error) {
    console.error("Error fetching soal:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
