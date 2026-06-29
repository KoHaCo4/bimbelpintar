"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-gray-200 bg-white px-4 sm:px-6 py-3 flex items-center justify-between">
      <Link href="/" className="text-base font-medium text-gray-900">
        Bimbel<span className="text-blue-600">Pintar</span>
      </Link>

      <div className="flex items-center gap-3 sm:gap-6">
        {session && session.user.role === "ADMIN" ? null : (
          <Link
            href="/soal"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Katalog
          </Link>
        )}

        {session ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
              className="text-sm text-gray-500 hover:text-gray-900 hidden sm:block"
            >
              Dashboard
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm bg-gray-100 px-3 sm:px-4 py-1.5 rounded-lg text-gray-700 hover:bg-gray-200 transition"
            >
              Keluar
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-sm bg-blue-600 text-white px-3 sm:px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
          >
            Masuk
          </Link>
        )}
      </div>
    </nav>
  );
}
