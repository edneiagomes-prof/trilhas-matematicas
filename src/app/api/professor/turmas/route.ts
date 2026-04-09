import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { SessionData, sessionOptions } from "@/lib/session";

export async function GET() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.userId || session.role !== "teacher") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const turmas = await prisma.turma.findMany({ orderBy: { nome: "asc" } });
  return NextResponse.json(turmas);
}
