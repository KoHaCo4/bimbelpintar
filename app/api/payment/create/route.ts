import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { snap } from "../../../../lib/midtrans";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Silakan login untuk melakukan pembelian" },
        { status: 401 },
      );
    }

    const { soalId } = await request.json();

    // pastikan soalId valid
    const soal = await prisma.soal.findUnique({
      where: { id: soalId },
    });

    if (!soal) {
      return NextResponse.json(
        { error: "Soal tidak ditemukan" },
        { status: 404 },
      );
    }

    // cek apakah user sudah membeli soal ini
    const sudahBeli = await prisma.pembelian.findFirst({
      where: {
        userId: session.user.id,
        soalId: soalId,
        status: "SUCCESS", // hanya hitung pembelian yang sukses
      },
    });

    if (sudahBeli) {
      return NextResponse.json(
        { error: "Anda sudah membeli soal ini" },
        { status: 400 },
      );
    }

    // buat transaksi di midtrans
    const pembelian = await prisma.pembelian.create({
      data: {
        userId: session.user.id,
        soalId,
        status: "PENDING",
      },
    });

    // ambil data user untuk dikirim ke midtrans
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    // buat transaksi di midtrans
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: pembelian.id,
        gross_amount: soal.harga ?? 0,
      },
      customer_details: {
        first_name: user.name ?? "Pembeli",
        email: user.email ?? "",
      },
      item_details: [
        {
          id: soal.id,
          price: soal.harga ?? 0,
          quantity: 1,
          name: soal.judul.substring(0, 50), // nama item max 50 karakter
        },
      ],
      callbacks: {
        finish: `${process.env.NEXTAUTH_URL}/dashboard?status=SUCCESS`,
        error: `${process.env.NEXTAUTH_URL}/dashboard?status=ERROR`,
        pending: `${process.env.NEXTAUTH_URL}/dashboard?status=PENDINGS`,
      },
    } as any);

    return NextResponse.json({
      token: transaction.token,
      pembelianId: pembelian.id,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat membuat transaksi" },
      { status: 500 },
    );
  }
}
