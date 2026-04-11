import Link from "next/link";
import { requireStudent } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getNivelInfo } from "@/lib/niveis";

const SEMANA_INFO = [
  {
    emoji: "🔢",
    cor: "from-blue-400 to-blue-600",
    bgCard: "bg-blue-50",
    border: "border-blue-300",
  },
  {
    emoji: "🏰",
    cor: "from-purple-400 to-purple-600",
    bgCard: "bg-purple-50",
    border: "border-purple-300",
  },
  {
    emoji: "🛒",
    cor: "from-green-400 to-green-600",
    bgCard: "bg-green-50",
    border: "border-green-300",
  },
  {
    emoji: "⚔️",
    cor: "from-red-400 to-red-600",
    bgCard: "bg-red-50",
    border: "border-red-300",
  },
];

export default async function AlunoDashboard() {
  const session = await requireStudent();
  if (!session) redirect("/login");

  const alunoNivel = session.nivel ?? 1;
  const nivelInfo = getNivelInfo(alunoNivel);

  const trilhas = await prisma.trilha.findMany({
    include: {
      missoes: {
        where: { nivel: alunoNivel },
        include: {
          tentativas: {
            where: { userId: session.userId },
            orderBy: { pontos: "desc" },
            take: 1,
          },
        },
        orderBy: { id: "asc" },
      },
    },
    orderBy: { semana: "asc" },
  });

  const allTentativas = await prisma.tentativa.findMany({
    where: { userId: session.userId },
  });
  const totalXp = allTentativas.reduce((s, t) => s + t.xpGanho, 0);

  const turma = session.turmaId
    ? await prisma.turma.findUnique({ where: { id: session.turmaId } })
    : null;

  return (
    <div>
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl p-6 mb-8 shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Olá, {session.name}! 👋</h1>
            {turma && <p className="text-indigo-200">Turma: {turma.nome}</p>}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-3xl">{nivelInfo.emoji}</span>
              <div>
                <div className="font-bold text-lg">Trilha {nivelInfo.label}</div>
                <div className="text-indigo-200 text-sm">⭐ {totalXp} XP total</div>
              </div>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-2xl p-4 min-w-48">
            <div className="text-sm text-indigo-100 mb-1">
              XP acumulado
            </div>
            <div className="text-2xl font-bold text-yellow-300">⭐ {totalXp}</div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-700 mb-6">
        🗺️ Trilhas de Aventura
      </h2>
      <div className="space-y-8">
        {trilhas.filter((t) => t.missoes.length > 0).map((trilha, idx) => {
          const info = SEMANA_INFO[idx % 4];
          const missoesCompletas = trilha.missoes.filter(
            (m) => m.tentativas.length > 0
          ).length;
          const trilhaBloqueada = trilha.bloqueada;
          return (
            <div
              key={trilha.id}
              className={`bg-white rounded-3xl shadow-lg overflow-hidden border-2 ${info.border} ${
                trilhaBloqueada ? "opacity-60" : ""
              }`}
            >
              <div
                className={`bg-gradient-to-r ${info.cor} text-white p-5`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-3xl mr-2">{info.emoji}</span>
                    <span className="text-xl font-bold">{trilha.titulo}</span>
                    <span className="ml-3 text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      Semana {trilha.semana}
                    </span>
                    {trilhaBloqueada && (
                      <span className="ml-3 text-sm bg-white bg-opacity-30 px-3 py-1 rounded-full font-bold">
                        🔒 Bloqueada
                      </span>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-bold">
                      {missoesCompletas}/{trilha.missoes.length} missões
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                {trilha.missoes.map((missao) => {
                  const tentativa = missao.tentativas[0];
                  const feita = !!tentativa;
                  const mNivelInfo = getNivelInfo(missao.nivel);
                  const bloqueada = trilhaBloqueada || missao.bloqueada;
                  if (bloqueada) {
                    return (
                      <div
                        key={missao.id}
                        className="rounded-2xl p-4 text-center border-2 bg-gray-100 border-gray-300 cursor-not-allowed select-none"
                        title="Missão bloqueada pelo professor"
                      >
                        <div className="text-2xl mb-1">🔒</div>
                        <div className="text-xs font-bold mb-1 text-gray-400">
                          Bloqueada
                        </div>
                        <div className="text-sm font-semibold text-gray-400 leading-tight">
                          {missao.titulo}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {missao.xp} XP
                        </div>
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={missao.id}
                      href={`/aluno/missao/${missao.id}`}
                      className={`rounded-2xl p-4 text-center transition-all hover:scale-105 border-2 ${
                        feita
                          ? `${info.bgCard} ${info.border} shadow`
                          : "bg-gray-50 border-gray-200 hover:border-indigo-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">
                        {mNivelInfo.emoji}
                      </div>
                      <div className={`text-xs font-bold mb-1 ${mNivelInfo.color}`}>
                        {mNivelInfo.label}
                      </div>
                      <div className="text-sm font-semibold text-gray-700 leading-tight">
                        {missao.titulo}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {missao.xp} XP
                      </div>
                      {feita && (
                        <div className="mt-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                          ✅ {tentativa.pontos}pts
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
