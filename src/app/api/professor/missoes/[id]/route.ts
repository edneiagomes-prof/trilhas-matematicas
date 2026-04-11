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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireTeacherSession();
  if (!session)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const missaoId = Number(id);

  try {
    const { bloqueada } = await req.json();
    if (typeof bloqueada !== "boolean") {
      return NextResponse.json(
        { error: "Campo 'bloqueada' deve ser boolean" },
        { status: 400 }
      );
    }
    const missao = await prisma.missao.update({
      where: { id: missaoId },
      data: { bloqueada },
    });
    return NextResponse.json(missao);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao atualizar missão" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireTeacherSession();
  if (!session)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const missaoId = Number(id);

  try {
    const { nivel, titulo, descricao, xp, questoes } = await req.json();

    if (!nivel || !titulo || !descricao || xp == null) {
      return NextResponse.json(
        { error: "Nível, título, descrição e XP são obrigatórios" },
        { status: 400 }
      );
    }

    // Update mission fields
    await prisma.missao.update({
      where: { id: missaoId },
      data: {
        nivel: Number(nivel),
        titulo,
        descricao,
        xp: Number(xp),
      },
    });

    // Replace all questions if provided
    if (Array.isArray(questoes) && questoes.length > 0) {
      await prisma.questao.deleteMany({ where: { missaoId } });
      await prisma.questao.createMany({
        data: questoes.map(
          (
            q: {
              enunciado: string;
              opcaoA: string;
              opcaoB: string;
              opcaoC: string;
              opcaoD: string;
              correta: string;
              ordem: number;
              feedbackCorreto?: string;
              feedbackErrado?: string;
            },
            i: number
          ) => ({
            missaoId,
            enunciado: q.enunciado,
            opcaoA: q.opcaoA,
            opcaoB: q.opcaoB,
            opcaoC: q.opcaoC,
            opcaoD: q.opcaoD,
            correta: q.correta,
            ordem: q.ordem ?? i + 1,
            feedbackCorreto: q.feedbackCorreto ?? "",
            feedbackErrado: q.feedbackErrado ?? "",
          })
        ),
      });
    }

    const updated = await prisma.missao.findUnique({
      where: { id: missaoId },
      include: { questoes: { orderBy: { ordem: "asc" } } },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao atualizar missão" },
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
  const missaoId = Number(id);

  try {
    await prisma.tentativa.deleteMany({ where: { missaoId } });
    await prisma.questao.deleteMany({ where: { missaoId } });
    await prisma.missao.delete({ where: { id: missaoId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao excluir missão" },
      { status: 500 }
    );
  }
}
