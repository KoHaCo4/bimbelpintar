import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { Status } from "@prisma/client";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = body;

    // Verifikasi signature dari Midtrans
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const payload = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const hash = crypto.createHash("sha512").update(payload).digest("hex");

    if (hash !== signature_key) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Update status pembelian berdasarkan order_id
    const pembelian = await prisma.pembelian.findUnique({
      where: { id: order_id },
    });

    if (!pembelian) {
      return NextResponse.json(
        { error: "Pembelian not found" },
        { status: 404 },
      );
    }

    let status: Status = Status.PENDING;
    if (transaction_status === "capture") {
      status = fraud_status === "challenge" ? Status.CHALLENGE : Status.SUCCESS;
    } else if (transaction_status === "settlement") {
      status = Status.SUCCESS;
    } else if (transaction_status === "deny") {
      status = Status.FAILED;
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "expire"
    ) {
      status = Status.CANCEL;
    }

    try {
      const updated = await prisma.pembelian.update({
        where: { id: order_id },
        data: { status },
      });
    } catch (err) {
      console.error("Gagal update prisma:", err);
    }

    return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error("Error processing payment callback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
