import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();
  if (session.userId) {
    if (session.role === "teacher") redirect("/professor");
    else redirect("/aluno");
  }
  redirect("/login");
}
