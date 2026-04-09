"use client";

import { useRouter } from "next/navigation";

interface NavbarProps {
  name: string;
  role: "teacher" | "student";
  totalXp?: number;
}

export default function Navbar({ name, role, totalXp }: NavbarProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <nav className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🧮</span>
        <span className="font-bold text-xl">Trilhas Matemáticas</span>
      </div>
      <div className="flex items-center gap-4">
        {totalXp !== undefined && (
          <div className="bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-full text-sm">
            ⭐ {totalXp} XP
          </div>
        )}
        <span className="text-indigo-200 text-sm hidden md:block">
          {role === "teacher" ? "👩‍🏫" : "🎒"} {name}
        </span>
        <button
          onClick={handleLogout}
          className="bg-indigo-800 hover:bg-indigo-900 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}
