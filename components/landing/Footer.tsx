import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 px-6 py-8">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm font-medium text-gray-900">
          Bimbel<span className="text-blue-600">Pintar</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <Link href="/privacy" className="hover:text-gray-600">
            Kebijakan Privasi
          </Link>
          <Link href="/terms" className="hover:text-gray-600">
            Syarat & Ketentuan
          </Link>
        </div>
        <div className="text-xs text-gray-400">
          © 2026 BimbelPintar. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
