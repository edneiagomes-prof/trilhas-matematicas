import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { SessionData, sessionOptions } from "@/lib/session";

export async function GET() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.userId || session.role !== "teacher") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const turmas = await prisma.turma.findMany({
    include: { _count: { select: { alunos: true } } },
    orderBy: { nome: "asc" },
  });
  return NextResponse.json(turmas);
}

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.userId || session.role !== "teacher") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const { nome } = await req.json();
    if (!nome || !nome.trim()) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
    }
    const turma = await prisma.turma.create({ data: { nome: nome.trim() } });
    return NextResponse.json(turma, { status: 201 });
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return NextResponse.json({ error: "Já existe uma turma com esse nome" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Erro ao criar turma" }, { status: 500 });
  }
}
