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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireTeacherSession();
  if (!session)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const trilhaId = Number(id);

  const trilha = await prisma.trilha.findUnique({
    where: { id: trilhaId },
    include: {
      missoes: {
        include: { questoes: { orderBy: { ordem: "asc" } } },
        orderBy: { nivel: "asc" },
      },
    },
  });

  if (!trilha)
    return NextResponse.json({ error: "Trilha não encontrada" }, { status: 404 });

  return NextResponse.json(trilha);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireTeacherSession();
  if (!session)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const trilhaId = Number(id);

  try {
    const { nivel, titulo, descricao, xp, questoes } = await req.json();

    if (!nivel || !titulo || !descricao || xp == null) {
      return NextResponse.json(
        { error: "Nível, título, descrição e XP são obrigatórios" },
        { status: 400 }
      );
    }

    if (!Array.isArray(questoes) || questoes.length === 0) {
      return NextResponse.json(
        { error: "A missão deve ter pelo menos uma questão" },
        { status: 400 }
      );
    }

    const missao = await prisma.missao.create({
      data: {
        trilhaId,
        nivel: Number(nivel),
        titulo,
        descricao,
        xp: Number(xp),
        questoes: {
          create: questoes.map(
            (
              q: {
                enunciado: string;
                opcaoA: string;
                opcaoB: string;
                opcaoC: string;
                opcaoD: string;
                correta: string;
                ordem: number;
              },
              i: number
            ) => ({
              enunciado: q.enunciado,
              opcaoA: q.opcaoA,
              opcaoB: q.opcaoB,
              opcaoC: q.opcaoC,
              opcaoD: q.opcaoD,
              correta: q.correta,
              ordem: q.ordem ?? i + 1,
            })
          ),
        },
      },
      include: { questoes: true },
    });

    return NextResponse.json(missao, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao criar missão" },
      { status: 500 }
    );
  }
}
