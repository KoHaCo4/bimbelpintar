import LoginForm from "@/components/ui/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">
          Memuat...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
