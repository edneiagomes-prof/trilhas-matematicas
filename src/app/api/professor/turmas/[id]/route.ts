import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { SessionData, sessionOptions } from "@/lib/session";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.userId || session.role !== "teacher") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const { nome } = await req.json();
    if (!nome || !nome.trim()) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
    }
    const turma = await prisma.turma.update({
      where: { id: Number(id) },
      data: { nome: nome.trim() },
    });
    return NextResponse.json(turma);
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
    return NextResponse.json({ error: "Erro ao atualizar turma" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.userId || session.role !== "teacher") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await prisma.turma.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2003"
    ) {
      return NextResponse.json(
        { error: "Não é possível excluir: turma possui alunos. Remova os alunos primeiro." },
        { status: 400 }
      );
    }
    console.error(err);
    return NextResponse.json({ error: "Erro ao excluir turma" }, { status: 500 });
  }
}
