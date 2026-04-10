import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { SessionData, sessionOptions } from "@/lib/session";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.userId || session.role !== "student") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = await params;
  const missao = await prisma.missao.findUnique({
    where: { id: Number(id) },
    include: {
      questoes: { orderBy: { ordem: "asc" } },
      trilha: true,
    },
  });
  if (!missao)
    return NextResponse.json(
      { error: "Missão não encontrada" },
      { status: 404 }
    );
  return NextResponse.json(missao);
}
