import { prisma } from "@/lib/prisma";

export default async function TurmasPage() {
  const turmas = await prisma.turma.findMany({
    include: {
      alunos: {
        include: { tentativas: true },
        orderBy: { name: "asc" },
      },
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">📋 Turmas</h1>
      <div className="space-y-6">
        {turmas.map((turma) => {
          const xpTotal = turma.alunos.reduce(
            (totalXp, aluno) =>
              totalXp +
              aluno.tentativas.reduce(
                (studentXp, t) => studentXp + t.xpGanho,
                0
              ),
            0
          );
          return (
            <div key={turma.id} className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-indigo-700">
                  📚 {turma.nome}
                </h2>
                <div className="flex gap-3">
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold text-sm">
                    {turma.alunos.length} alunos
                  </span>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold text-sm">
                    ⭐ {xpTotal} XP
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {turma.alunos.map((aluno) => {
                  const xp = aluno.tentativas.reduce(
                    (s, t) => s + t.xpGanho,
                    0
                  );
                  return (
                    <div
                      key={aluno.id}
                      className="bg-gray-50 rounded-xl p-3 text-center"
                    >
                      <div className="text-lg">🎒</div>
                      <div className="text-sm font-semibold text-gray-800 truncate">
                        {aluno.name}
                      </div>
                      <div className="text-xs text-yellow-600 font-bold">
                        ⭐ {xp} XP
                      </div>
                    </div>
                  );
                })}
                {turma.alunos.length === 0 && (
                  <div className="col-span-full text-center text-gray-400 py-4">
                    Nenhum aluno nesta turma.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
