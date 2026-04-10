import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ProfessorDashboard() {
  const turmas = await prisma.turma.findMany({
    include: {
      alunos: {
        include: { tentativas: true },
      },
    },
  });

  const totalXpDistribuido = turmas.reduce(
    (sum, t) =>
      sum +
      t.alunos.reduce(
        (s2, a) => s2 + a.tentativas.reduce((s3, ten) => s3 + ten.xpGanho, 0),
        0
      ),
    0
  );

  const totalAlunos = turmas.reduce((sum, t) => sum + t.alunos.length, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">
        🏫 Painel do Professor
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-indigo-500">
          <div className="text-3xl font-bold text-indigo-600">
            {turmas.length}
          </div>
          <div className="text-gray-600 mt-1">Turmas</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-green-500">
          <div className="text-3xl font-bold text-green-600">{totalAlunos}</div>
          <div className="text-gray-600 mt-1">Alunos</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-yellow-500">
          <div className="text-3xl font-bold text-yellow-600">
            {totalXpDistribuido}
          </div>
          <div className="text-gray-600 mt-1">XP Total Distribuído</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {turmas.map((turma) => {
          const xpTurma = turma.alunos.reduce(
            (s, a) =>
              s + a.tentativas.reduce((s2, t) => s2 + t.xpGanho, 0),
            0
          );
          return (
            <div key={turma.id} className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-bold text-indigo-700 mb-4">
                📚 {turma.nome}
              </h2>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Alunos:</span>
                  <span className="font-semibold">{turma.alunos.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>XP da Turma:</span>
                  <span className="font-semibold text-yellow-600">
                    ⭐ {xpTurma}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/professor/alunos"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
        >
          👥 Ver Alunos
        </Link>
        <Link
          href="/professor/turmas"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
        >
          📋 Gerenciar Turmas
        </Link>
        <Link
          href="/professor/trilhas"
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
        >
          🗺️ Gerenciar Trilhas
        </Link>
      </div>
    </div>
  );
}
