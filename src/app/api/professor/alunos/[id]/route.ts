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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.userId || session.role !== "teacher") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = await params;
  const userId = Number(id);
  try {
    await prisma.tentativa.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId, role: "student" } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao excluir aluno" }, { status: 500 });
  }
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
  const { password, nivel } = await req.json();
  if (!password && nivel === undefined)
    return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 });
  const data: Record<string, unknown> = {};
  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    data.password = hashed;
  }
  if (nivel !== undefined) {
    data.nivel = Number(nivel);
  }
  await prisma.user.update({
    where: { id: Number(id) },
    data,
  });
  return NextResponse.json({ ok: true });
}
