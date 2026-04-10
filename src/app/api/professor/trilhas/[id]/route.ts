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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireTeacherSession();
  if (!session)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const trilhaId = Number(id);

  try {
    const { titulo, semana, ordem } = await req.json();
    if (!titulo || semana == null || ordem == null) {
      return NextResponse.json(
        { error: "Título, semana e ordem são obrigatórios" },
        { status: 400 }
      );
    }
    const trilha = await prisma.trilha.update({
      where: { id: trilhaId },
      data: { titulo, semana: Number(semana), ordem: Number(ordem) },
    });
    return NextResponse.json(trilha);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao atualizar trilha" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireTeacherSession();
  if (!session)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const trilhaId = Number(id);

  try {
    // Delete in dependency order: tentativas -> questoes -> missoes -> trilha
    const missoes = await prisma.missao.findMany({
      where: { trilhaId },
      select: { id: true },
    });
    const missaoIds = missoes.map((m) => m.id);

    await prisma.tentativa.deleteMany({ where: { missaoId: { in: missaoIds } } });
    await prisma.questao.deleteMany({ where: { missaoId: { in: missaoIds } } });
    await prisma.missao.deleteMany({ where: { trilhaId } });
    await prisma.trilha.delete({ where: { id: trilhaId } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao excluir trilha" },
      { status: 500 }
    );
  }
}
