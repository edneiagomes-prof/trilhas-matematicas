import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { SessionData, sessionOptions } from "@/lib/session";

async function requireTeacherSession() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  if (!session.userId || session.role !== "teacher") return null;
  return session;
}

export async function GET() {
  const session = await requireTeacherSession();
  if (!session)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const trilhas = await prisma.trilha.findMany({
    include: { _count: { select: { missoes: true } } },
    orderBy: [{ semana: "asc" }, { ordem: "asc" }],
  });

  return NextResponse.json(trilhas);
}

export async function POST(req: NextRequest) {
  const session = await requireTeacherSession();
  if (!session)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const { titulo, semana, ordem } = await req.json();
    if (!titulo || semana == null || ordem == null) {
      return NextResponse.json(
        { error: "Título, semana e ordem são obrigatórios" },
        { status: 400 }
      );
    }
    const trilha = await prisma.trilha.create({
      data: { titulo, semana: Number(semana), ordem: Number(ordem) },
    });
    return NextResponse.json(trilha, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao criar trilha" }, { status: 500 });
  }
}
