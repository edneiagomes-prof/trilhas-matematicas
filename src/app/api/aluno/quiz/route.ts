import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { SessionData, sessionOptions } from "@/lib/session";

type Respostas = Record<number, "A" | "B" | "C" | "D">;

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.userId || session.role !== "student") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { missaoId, respostas }: { missaoId: number; respostas: Respostas } =
    await req.json();
  const missao = await prisma.missao.findUnique({
    where: { id: Number(missaoId) },
    include: { questoes: true, trilha: true },
  });
  if (!missao)
    return NextResponse.json(
      { error: "Missão não encontrada" },
      { status: 404 }
    );

  if (missao.bloqueada || missao.trilha.bloqueada) {
    return NextResponse.json(
      { error: "Esta missão está bloqueada pelo professor" },
      { status: 403 }
    );
  }

  let acertos = 0;
  for (const q of missao.questoes) {
    if (respostas[q.id] === q.correta) acertos++;
  }
  const total = missao.questoes.length;
  const pontos = Math.round((acertos / total) * 100);
  const xpGanho = Math.round((acertos / total) * missao.xp);

  const tentativa = await prisma.tentativa.create({
    data: {
      userId: session.userId,
      missaoId: missao.id,
      pontos,
      xpGanho,
      respostas: JSON.stringify(respostas),
    },
  });

  return NextResponse.json({
    acertos,
    total,
    pontos,
    xpGanho,
    tentativaId: tentativa.id,
  });
}
