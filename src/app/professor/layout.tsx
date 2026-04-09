import { redirect } from "next/navigation";
import { requireTeacher } from "@/lib/auth";
import Navbar from "@/components/Navbar";

export default async function ProfessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireTeacher();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar name={session.name!} role="teacher" />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
