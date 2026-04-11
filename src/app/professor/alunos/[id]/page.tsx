"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { getNivelInfo } from "@/lib/niveis";

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
  nivel: number;
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
  const [novoNivel, setNovoNivel] = useState("");
  const [nivelMsg, setNivelMsg] = useState("");
  const [nivelLoading, setNivelLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/professor/alunos/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setAluno(data);
        setNovoNivel(String(data.nivel ?? 1));
      });
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

  async function handleAlterarNivel(e: React.FormEvent) {
    e.preventDefault();
    setNivelLoading(true);
    const res = await fetch(`/api/professor/alunos/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nivel: Number(novoNivel) }),
    });
    setNivelLoading(false);
    if (res.ok) {
      setNivelMsg("Trilha atualizada com sucesso! ✅");
      setAluno((prev) => prev ? { ...prev, nivel: Number(novoNivel) } : prev);
    } else {
      setNivelMsg("Erro ao atualizar trilha.");
    }
    setTimeout(() => setNivelMsg(""), 3000);
  }

  async function handleDelete() {
    if (!aluno) return;
    if (!confirm(`Excluir o aluno "${aluno.name}"? Esta ação não pode ser desfeita.`)) return;
    setDeleteLoading(true);
    const res = await fetch(`/api/professor/alunos/${params.id}`, {
      method: "DELETE",
    });
    setDeleteLoading(false);
    if (res.ok) {
      router.push("/professor/alunos");
    } else {
      alert("Erro ao excluir aluno.");
    }
  }

  if (!aluno)
    return (
      <div className="text-center py-12 text-gray-400">Carregando...</div>
    );

  const totalXp = aluno.tentativas.reduce((s, t) => s + t.xpGanho, 0);
  const nivelInfo = getNivelInfo(aluno.nivel);
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
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => router.back()}
          className="text-indigo-600 hover:underline flex items-center gap-1"
        >
          ← Voltar
        </button>
        <Link
          href="/professor"
          className="text-gray-500 hover:text-indigo-600 hover:underline flex items-center gap-1 text-sm"
        >
          🏠 Painel
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleteLoading}
          className="ml-auto bg-red-100 hover:bg-red-200 text-red-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          {deleteLoading ? "Excluindo..." : "🗑️ Excluir Aluno"}
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="text-center">
              <div className={`w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-4xl mx-auto mb-3 border-2 ${nivelInfo.border}`}>
                🎒
              </div>
              <h1 className="text-2xl font-bold text-gray-800">{aluno.name}</h1>
              <p className="text-gray-500">@{aluno.username}</p>
              <p className="text-purple-600 font-semibold mt-1">
                {aluno.turma?.nome || "Sem turma"}
              </p>
              <div className={`mt-3 inline-flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full ${nivelInfo.badgeBg} ${nivelInfo.badgeText}`}>
                {nivelInfo.emoji} Trilha {nivelInfo.label}
              </div>
              <div className="mt-4 bg-yellow-100 rounded-xl p-3">
                <div className="text-2xl font-bold text-yellow-600">
                  ⭐ {totalXp} XP
                </div>
                <div className="text-xs text-yellow-700">Total conquistado</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-gray-700 mb-3">🎯 Alterar Trilha</h2>
            <form onSubmit={handleAlterarNivel} className="space-y-3">
              <select
                value={novoNivel}
                onChange={(e) => setNovoNivel(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400 text-sm"
              >
                <option value="1">⬜ Branco</option>
                <option value="2">🔵 Azul</option>
                <option value="3">🟡 Amarelo</option>
                <option value="4">🔴 Vermelho</option>
              </select>
              {nivelMsg && (
                <p className="text-sm text-green-600">{nivelMsg}</p>
              )}
              <button
                type="submit"
                disabled={nivelLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-sm transition-colors"
              >
                {nivelLoading ? "Salvando..." : "Alterar Trilha"}
              </button>
            </form>
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
                {Object.values(melhorasPorMissao).map((t) => {
                  const mNivelInfo = getNivelInfo(t.missao.nivel);
                  return (
                    <div
                      key={t.id}
                      className="border-2 border-gray-100 rounded-xl p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-semibold text-gray-800">
                            {t.missao.titulo}
                          </span>
                          <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${mNivelInfo.badgeBg} ${mNivelInfo.badgeText}`}>
                            {mNivelInfo.emoji} {mNivelInfo.label}
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
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
