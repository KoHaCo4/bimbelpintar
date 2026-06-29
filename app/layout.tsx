import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "../components/providers/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bimbel Pintar",
  description: "Latihan soal lengkap untuk semua jenjang",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
