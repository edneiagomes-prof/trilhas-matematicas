"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";

interface Missao {
  id: number;
  titulo: string;
  nivel: number;
  xp: number;
}
interface Tentativa {
  id: number;
  pontos: number;
  xpGanho: number;
  createdAt: string;
  missao: Missao;
}
interface Aluno {
  id: number;
  name: string;
  username: string;
  turma: { id: number; nome: string } | null;
  tentativas: Tentativa[];
}

export default function AlunoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [novaSenha, setNovaSenha] = useState("");
  const [senhaMsg, setSenhaMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/professor/alunos/${params.id}`)
      .then((r) => r.json())
      .then(setAluno);
  }, [params.id]);

  async function handleResetSenha(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/professor/alunos/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: novaSenha }),
    });
    setLoading(false);
    if (res.ok) {
      setSenhaMsg("Senha redefinida com sucesso! ✅");
      setNovaSenha("");
    } else {
      setSenhaMsg("Erro ao redefinir senha.");
    }
    setTimeout(() => setSenhaMsg(""), 3000);
  }

  if (!aluno)
    return (
      <div className="text-center py-12 text-gray-400">Carregando...</div>
    );

  const totalXp = aluno.tentativas.reduce((s, t) => s + t.xpGanho, 0);
  const melhorasPorMissao = aluno.tentativas.reduce(
    (acc, t) => {
      if (!acc[t.missao.id] || acc[t.missao.id].pontos < t.pontos)
        acc[t.missao.id] = t;
      return acc;
    },
    {} as Record<number, Tentativa>
  );

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="text-indigo-600 hover:underline mb-4 flex items-center gap-1"
      >
        ← Voltar
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-3">
                🎒
              </div>
              <h1 className="text-2xl font-bold text-gray-800">{aluno.name}</h1>
              <p className="text-gray-500">@{aluno.username}</p>
              <p className="text-purple-600 font-semibold mt-1">
                {aluno.turma?.nome || "Sem turma"}
              </p>
              <div className="mt-4 bg-yellow-100 rounded-xl p-3">
                <div className="text-2xl font-bold text-yellow-600">
                  ⭐ {totalXp} XP
                </div>
                <div className="text-xs text-yellow-700">Total conquistado</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-gray-700 mb-3">🔐 Redefinir Senha</h2>
            <form onSubmit={handleResetSenha} className="space-y-3">
              <input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Nova senha"
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400 text-sm"
                required
                minLength={4}
              />
              {senhaMsg && (
                <p className="text-sm text-green-600">{senhaMsg}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-sm transition-colors"
              >
                {loading ? "Salvando..." : "Redefinir Senha"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📊 Progresso nas Missões
            </h2>
            {Object.values(melhorasPorMissao).length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                Nenhuma missão concluída ainda.
              </p>
            ) : (
              <div className="space-y-4">
                {Object.values(melhorasPorMissao).map((t) => (
                  <div
                    key={t.id}
                    className="border-2 border-gray-100 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="font-semibold text-gray-800">
                          {t.missao.titulo}
                        </span>
                        <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                          Nível {t.missao.nivel}
                        </span>
                      </div>
                      <span className="text-yellow-600 font-bold text-sm">
                        ⭐ {t.xpGanho} XP
                      </span>
                    </div>
                    <ProgressBar
                      value={t.pontos}
                      max={100}
                      label="Pontuação"
                      color={
                        t.pontos >= 75
                          ? "bg-green-500"
                          : t.pontos >= 50
                          ? "bg-yellow-500"
                          : "bg-red-400"
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
