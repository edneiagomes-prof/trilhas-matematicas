import { redirect } from "next/navigation";
import { requireStudent } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";

export default async function AlunoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireStudent();
  if (!session) redirect("/login");

  const tentativas = await prisma.tentativa.findMany({
    where: { userId: session.userId },
  });
  const totalXp = tentativas.reduce((s, t) => s + t.xpGanho, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar name={session.name!} role="student" totalXp={totalXp} />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
