import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { SessionData, sessionOptions } from "@/lib/session";

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.userId || session.role !== "student") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const trilhas = await prisma.trilha.findMany({
    include: {
      missoes: {
        include: {
          tentativas: {
            where: { userId: session.userId },
            orderBy: { pontos: "desc" },
            take: 1,
          },
        },
        orderBy: { nivel: "asc" },
      },
    },
    orderBy: { semana: "asc" },
  });
  return NextResponse.json(trilhas);
}
