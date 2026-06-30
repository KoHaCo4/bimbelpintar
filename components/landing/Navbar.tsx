"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function LandingNavbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-gray-100 sticky top-0 bg-white z-10">
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="text-base font-medium text-gray-900">
          Bimbel<span className="text-blue-600">Pintar</span>
        </div>

        {/* Desktop menu */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/soal"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Katalog soal
          </Link>
          {session ? (
            <Link
              href={
                session.user.role === "ADMIN"
                  ? "/admin/dashboard"
                  : "/dashboard"
              }
              className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
            >
              Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm text-gray-600 px-4 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
              >
                Daftar gratis
              </Link>
            </div>
          )}
        </div>

        {/* Hamburger button — mobile only */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-50 transition"
        >
          {menuOpen ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 px-4 py-3 flex flex-col gap-2 bg-white">
          <Link
            href="/soal"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-gray-600 py-2 hover:text-gray-900"
          >
            Katalog soal
          </Link>
          {session ? (
            <Link
              href={
                session.user.role === "ADMIN"
                  ? "/admin/dashboard"
                  : "/dashboard"
              }
              onClick={() => setMenuOpen(false)}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-gray-600 py-2 hover:text-gray-900"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center"
              >
                Daftar gratis
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
