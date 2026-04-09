import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import bcrypt from "bcryptjs";
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
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: {
      turma: true,
      tentativas: {
        include: { missao: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!user)
    return NextResponse.json(
      { error: "Aluno não encontrado" },
      { status: 404 }
    );
  return NextResponse.json(user);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.userId || session.role !== "teacher") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = await params;
  const { password } = await req.json();
  if (!password)
    return NextResponse.json({ error: "Senha obrigatória" }, { status: 400 });
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: Number(id) },
    data: { password: hashed },
  });
  return NextResponse.json({ ok: true });
}
