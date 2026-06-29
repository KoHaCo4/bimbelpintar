"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const adminMenus = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "📈" },
  { label: "Mapel", href: "/admin/soal", icon: "📚" },
  { label: "Siswa", href: "/admin/siswa", icon: "👥" },
  { label: "Transaksi", href: "/admin/transaksi", icon: "💳" },
  { label: "Nilai", href: "/admin/nilai", icon: "📊" },
  { label: "Essay", href: "/admin/essay", icon: "📝" },
];

const siswaMenus = [
  { label: "Dashboard", href: "/dashboard", icon: "🏠" },
  { label: "Katalog soal", href: "/soal", icon: "📚" },
];

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";
  const menus = isAdmin ? adminMenus : siswaMenus;

  return (
    <>
      {/* Mobile topbar */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Link
          href={isAdmin ? "/admin" : "/dashboard"}
          className="text-sm font-medium text-gray-900"
        >
          Bimbel<span className="text-blue-600">Pintar</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 transition"
        >
          {mobileOpen ? (
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
      {mobileOpen && (
        <div className="sm:hidden fixed top-14 left-0 right-0 z-20 bg-white border-b border-gray-200 shadow-md px-4 py-3 flex flex-col gap-1">
          {/* Badge role */}
          <div className="pb-2 mb-1 border-b border-gray-100">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                isAdmin
                  ? "bg-blue-50 text-blue-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {isAdmin ? "Admin" : "Siswa"}
            </span>
          </div>

          {menus.map((menu) => {
            const aktif = pathname === menu.href;
            return (
              <Link
                key={menu.href}
                href={menu.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  aktif
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="text-base">{menu.icon}</span>
                <span>{menu.label}</span>
              </Link>
            );
          })}

          {/* User info + logout */}
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="px-3 mb-1">
              <div className="text-xs text-gray-400 truncate">
                {session?.user?.email}
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition w-full"
            >
              <span className="text-base">🚪</span>
              <span>Keluar</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop sidebar — hidden di mobile */}
      <aside
        className={`hidden sm:flex h-screen bg-white border-r border-gray-200 flex-col transition-all duration-200 ${
          collapsed ? "w-16" : "w-56"
        }`}
      >
        {/* Logo + toggle */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          {!collapsed && (
            <Link
              href={isAdmin ? "/admin" : "/dashboard"}
              className="text-sm font-medium text-gray-900 truncate"
            >
              Bimbel<span className="text-blue-600">Pintar</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-gray-700 transition shrink-0"
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* Badge role */}
        {!collapsed && (
          <div className="px-4 pt-3">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                isAdmin
                  ? "bg-blue-50 text-blue-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {isAdmin ? "Admin" : "Siswa"}
            </span>
          </div>
        )}

        {/* Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menus.map((menu) => {
            const aktif = pathname === menu.href;
            return (
              <Link
                key={menu.href}
                href={menu.href}
                title={collapsed ? menu.label : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  aktif
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <span className="text-base shrink-0">{menu.icon}</span>
                {!collapsed && <span className="truncate">{menu.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="border-t border-gray-100 px-3 py-3">
          {!collapsed && (
            <div className="px-3 mb-2">
              <div className="text-xs text-gray-400 truncate">
                {session?.user?.email}
              </div>
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title={collapsed ? "Keluar" : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition w-full ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <span className="text-base shrink-0">🚪</span>
            {!collapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
