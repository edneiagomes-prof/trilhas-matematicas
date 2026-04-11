"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getNivelInfo } from "@/lib/niveis";

interface Turma {
  id: number;
  nome: string;
}
interface Aluno {
  id: number;
  name: string;
  username: string;
  nivel: number;
  turma: Turma | null;
  totalXp: number;
}

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [filtroTurma, setFiltroTurma] = useState<string>("all");
  const [filtroNivel, setFiltroNivel] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [showProfModal, setShowProfModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    turmaId: "",
    nivel: "1",
  });
  const [profForm, setProfForm] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [profLoading, setProfLoading] = useState(false);
  const [error, setError] = useState("");
  const [profError, setProfError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchAlunos() {
    const res = await fetch("/api/professor/alunos");
    const data = await res.json();
    setAlunos(data);
  }

  async function fetchTurmas() {
    const res = await fetch("/api/professor/turmas");
    const data = await res.json();
    setTurmas(data);
  }

  useEffect(() => {
    fetchAlunos();
    fetchTurmas();
  }, []);

  const filtered = alunos
    .filter((a) => filtroTurma === "all" || a.turma?.id === Number(filtroTurma))
    .filter((a) => filtroNivel === "all" || a.nivel === Number(filtroNivel));

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/professor/alunos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        turmaId: Number(form.turmaId),
        nivel: Number(form.nivel),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setSuccess("Aluno criado com sucesso!");
    setShowModal(false);
    setForm({ name: "", username: "", password: "", turmaId: "", nivel: "1" });
    fetchAlunos();
    fetchTurmas();
    setTimeout(() => setSuccess(""), 3000);
  }

  async function handleCreateProfessor(e: React.FormEvent) {
    e.preventDefault();
    setProfLoading(true);
    setProfError("");
    const res = await fetch("/api/professor/professores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profForm),
    });
    const data = await res.json();
    setProfLoading(false);
    if (!res.ok) {
      setProfError(data.error);
      return;
    }
    setSuccess("Professor criado com sucesso!");
    setShowProfModal(false);
    setProfForm({ name: "", username: "", password: "" });
    setTimeout(() => setSuccess(""), 3000);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/professor"
            className="text-sm text-indigo-600 hover:underline mb-1 inline-block"
          >
            ← Painel
          </Link>
          <h1 className="text-3xl font-bold text-indigo-700">👥 Alunos</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowProfModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-xl transition-colors"
          >
            + Novo Professor
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2 rounded-xl transition-colors"
          >
            + Novo Aluno
          </button>
        </div>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4">
          {success}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-wrap gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 mr-3">
            Filtrar por turma:
          </label>
          <select
            value={filtroTurma}
            onChange={(e) => setFiltroTurma(e.target.value)}
            className="border-2 border-indigo-200 rounded-lg px-3 py-1 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Todas as turmas</option>
            {turmas.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 mr-3">
            Filtrar por nível:
          </label>
          <select
            value={filtroNivel}
            onChange={(e) => setFiltroNivel(e.target.value)}
            className="border-2 border-indigo-200 rounded-lg px-3 py-1 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Todos os níveis</option>
            <option value="1">⬜ Branco</option>
            <option value="2">🔵 Azul</option>
            <option value="3">🟡 Amarelo</option>
            <option value="4">🔴 Vermelho</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((aluno) => {
          const nivelInfo = getNivelInfo(aluno.nivel);
          return (
            <Link
              key={aluno.id}
              href={`/professor/alunos/${aluno.id}`}
              className={`bg-white rounded-2xl shadow p-5 hover:shadow-lg transition-shadow border-2 ${nivelInfo.border}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 ${nivelInfo.bg} rounded-full flex items-center justify-center text-2xl border-2 ${nivelInfo.border}`}>
                  <span style={{ filter: "grayscale(100%)" }}>🎒</span>
                </div>
                <div>
                  <div className="font-bold text-gray-800">{aluno.name}</div>
                  <div className="text-xs text-gray-500">@{aluno.username}</div>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  {aluno.turma?.nome || "Sem turma"}
                </span>
                <span className="text-yellow-600 font-bold">
                  ⭐ {aluno.totalXp} XP
                </span>
              </div>
              <div className={`mt-2 inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${nivelInfo.badgeBg} ${nivelInfo.badgeText}`}>
                {nivelInfo.emoji} Trilha {nivelInfo.label}
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-gray-400 py-12 text-lg">
          Nenhum aluno encontrado.
        </div>
      )}

      {/* Modal: Novo Aluno */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">
              ➕ Criar Novo Aluno
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border-2 border-indigo-200 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Usuário
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  className="w-full border-2 border-indigo-200 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Senha Inicial
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full border-2 border-indigo-200 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Turma
                </label>
                <select
                  value={form.turmaId}
                  onChange={(e) =>
                    setForm({ ...form, turmaId: e.target.value })
                  }
                  className="w-full border-2 border-indigo-200 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
                  required
                >
                  <option value="">Selecione...</option>
                  {turmas.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Trilha (Nível)
                </label>
                <select
                  value={form.nivel}
                  onChange={(e) =>
                    setForm({ ...form, nivel: e.target.value })
                  }
                  className="w-full border-2 border-indigo-200 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
                  required
                >
                  <option value="1">⬜ Branco</option>
                  <option value="2">🔵 Azul</option>
                  <option value="3">🟡 Amarelo</option>
                  <option value="4">🔴 Vermelho</option>
                </select>
              </div>
              {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm">
                  {error}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                  }}
                  className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  {loading ? "Criando..." : "Criar Aluno"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Novo Professor */}
      {showProfModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-purple-700 mb-6">
              🧑‍🏫 Criar Novo Professor
            </h2>
            <form onSubmit={handleCreateProfessor} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={profForm.name}
                  onChange={(e) => setProfForm({ ...profForm, name: e.target.value })}
                  className="w-full border-2 border-purple-200 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Usuário
                </label>
                <input
                  type="text"
                  value={profForm.username}
                  onChange={(e) =>
                    setProfForm({ ...profForm, username: e.target.value })
                  }
                  className="w-full border-2 border-purple-200 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Senha Inicial
                </label>
                <input
                  type="password"
                  value={profForm.password}
                  onChange={(e) =>
                    setProfForm({ ...profForm, password: e.target.value })
                  }
                  className="w-full border-2 border-purple-200 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              {profError && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm">
                  {profError}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfModal(false);
                    setProfError("");
                  }}
                  className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={profLoading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  {profLoading ? "Criando..." : "Criar Professor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
