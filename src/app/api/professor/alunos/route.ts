import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { SessionData, sessionOptions } from "@/lib/session";

export async function GET() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.userId || session.role !== "teacher") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const alunos = await prisma.user.findMany({
    where: { role: "student" },
    include: {
      turma: true,
      tentativas: true,
    },
    orderBy: { name: "asc" },
  });
  const result = alunos.map((a) => ({
    id: a.id,
    username: a.username,
    name: a.name,
    turma: a.turma,
    totalXp: a.tentativas.reduce((sum, t) => sum + t.xpGanho, 0),
  }));
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.userId || session.role !== "teacher") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const { name, username, password, turmaId } = await req.json();
    if (!name || !username || !password || !turmaId) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }
    const exists = await prisma.user.findUnique({ where: { username } });
    if (exists) {
      return NextResponse.json({ error: "Usuário já existe" }, { status: 400 });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        username,
        password: hashed,
        role: "student",
        turmaId: Number(turmaId),
      },
    });
    return NextResponse.json({
      id: user.id,
      name: user.name,
      username: user.username,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao criar aluno" }, { status: 500 });
  }
}
