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
  if (!session.userId || session.role !== "teacher") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = await params;
  const tentativas = await prisma.tentativa.findMany({
    where: { userId: Number(id) },
    include: { missao: { include: { trilha: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tentativas);
}
