import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { SessionData, sessionOptions } from "@/lib/session";

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.userId || session.role !== "teacher") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const { name, username, password } = await req.json();
    if (!name || !username || !password) {
      return NextResponse.json(
        { error: "Nome, usuário e senha são obrigatórios" },
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
        role: "teacher",
      },
    });
    return NextResponse.json({ id: user.id, name: user.name, username: user.username });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao criar professor" }, { status: 500 });
  }
}
