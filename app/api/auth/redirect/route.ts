import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "ADMIN") {
    return NextResponse.redirect(
      new URL("/admin/dashboard", process.env.NEXTAUTH_URL),
    );
  }
  return NextResponse.redirect(new URL("/soal", process.env.NEXTAUTH_URL!));
}
