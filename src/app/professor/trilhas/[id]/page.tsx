"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getNivelInfo } from "@/lib/niveis";

interface Questao {
  id?: number;
  enunciado: string;
  opcaoA: string;
  opcaoB: string;
  opcaoC: string;
  opcaoD: string;
  correta: string;
  ordem: number;
  feedbackCorreto: string;
  feedbackErrado: string;
}

interface Missao {
  id: number;
  nivel: number;
  titulo: string;
  descricao: string;
  xp: number;
  questoes: Questao[];
}

interface Trilha {
  id: number;
  titulo: string;
  semana: number;
  ordem: number;
  missoes: Missao[];
}

const emptyQuestao = (): Questao => ({
  enunciado: "",
  opcaoA: "",
  opcaoB: "",
  opcaoC: "",
  opcaoD: "",
  correta: "A",
  ordem: 1,
  feedbackCorreto: "",
  feedbackErrado: "",
});

const emptyMissaoForm = () => ({
  nivel: "1",
  titulo: "",
  descricao: "",
  xp: "10",
  questoes: [emptyQuestao()],
});

export default function TrilhaDetailPage() {
  const params = useParams();
  const trilhaId = params.id as string;

  const [trilha, setTrilha] = useState<Trilha | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingMissao, setEditingMissao] = useState<Missao | null>(null);
  const [form, setForm] = useState(emptyMissaoForm());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTrilha = useCallback(async () => {
    const res = await fetch(`/api/professor/trilhas/${trilhaId}/missoes`);
    if (res.ok) {
      const data = await res.json();
      setTrilha(data);
    }
  }, [trilhaId]);

  useEffect(() => {
    fetchTrilha();
  }, [fetchTrilha]);

  function openCreate() {
    setEditingMissao(null);
    setForm(emptyMissaoForm());
    setError("");
    setShowModal(true);
  }

  function openEdit(m: Missao) {
    setEditingMissao(m);
    setForm({
      nivel: String(m.nivel),
      titulo: m.titulo,
      descricao: m.descricao,
      xp: String(m.xp),
      questoes:
        m.questoes.length > 0
          ? m.questoes.map((q) => ({
              ...q,
              feedbackCorreto: q.feedbackCorreto ?? "",
              feedbackErrado: q.feedbackErrado ?? "",
            }))
          : [emptyQuestao()],
    });
    setError("");
    setShowModal(true);
  }

  function addQuestao() {
    setForm((f) => ({
      ...f,
      questoes: [
        ...f.questoes,
        { ...emptyQuestao(), ordem: f.questoes.length + 1 },
      ],
    }));
  }

  function removeQuestao(idx: number) {
    setForm((f) => ({
      ...f,
      questoes: f.questoes
        .filter((_, i) => i !== idx)
        .map((q, i) => ({ ...q, ordem: i + 1 })),
    }));
  }

  function updateQuestao(idx: number, field: keyof Questao, value: string) {
    setForm((f) => ({
      ...f,
      questoes: f.questoes.map((q, i) =>
        i === idx ? { ...q, [field]: value } : q
      ),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body = {
      nivel: Number(form.nivel),
      titulo: form.titulo,
      descricao: form.descricao,
      xp: Number(form.xp),
      questoes: form.questoes.map((q, i) => ({ ...q, ordem: i + 1 })),
    };

    const res = editingMissao
      ? await fetch(`/api/professor/missoes/${editingMissao.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await fetch(`/api/professor/trilhas/${trilhaId}/missoes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setSuccess(editingMissao ? "Missão atualizada!" : "Missão criada!");
    setShowModal(false);
    fetchTrilha();
    setTimeout(() => setSuccess(""), 3000);
  }

  async function handleDelete(m: Missao) {
    if (!confirm(`Excluir a missão "${m.titulo}"?`)) return;
    const res = await fetch(`/api/professor/missoes/${m.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setSuccess("Missão excluída!");
      fetchTrilha();
      setTimeout(() => setSuccess(""), 3000);
    }
  }

  if (!trilha) {
    return (
      <div className="text-center text-gray-400 py-16 text-lg">
        Carregando...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-4 mb-1">
            <Link
              href="/professor/trilhas"
              className="text-sm text-indigo-600 hover:underline inline-block"
            >
              ← Trilhas
            </Link>
            <Link
              href="/professor"
              className="text-sm text-gray-500 hover:text-indigo-600 hover:underline inline-block"
            >
              🏠 Painel
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-indigo-700">
            🎯 {trilha.titulo}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Semana {trilha.semana} · Ordem {trilha.ordem}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl transition-colors"
        >
          + Nova Missão
        </button>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4">
          {success}
        </div>
      )}

      {trilha.missoes.length === 0 ? (
        <div className="text-center text-gray-400 py-16 text-lg">
          Nenhuma missão cadastrada ainda.
        </div>
      ) : (
        <div className="space-y-4">
          {trilha.missoes.map((m) => {
            const info = getNivelInfo(m.nivel);
            return (
              <div
                key={m.id}
                className={`bg-white rounded-2xl shadow p-5 border-2 ${info.bg} ${info.border}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl mt-0.5">{info.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-bold uppercase ${info.color}`}
                        >
                          Trilha {info.label}
                        </span>
                        <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          ⭐ {m.xp} XP
                        </span>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                          {m.questoes.length} questões
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mt-0.5">
                        {m.titulo}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{m.descricao}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => openEdit(m)}
                      className="px-3 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-xl text-sm font-bold transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(m)}
                      className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-sm font-bold transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl my-8">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">
              {editingMissao ? "✏️ Editar Missão" : "➕ Nova Missão"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nível */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nível
                </label>
                <select
                  value={form.nivel}
                  onChange={(e) => setForm({ ...form, nivel: e.target.value })}
                  className="w-full border-2 border-indigo-200 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
                  required
                >
                  <option value="1">⬜ Branco</option>
                  <option value="2">🔵 Azul</option>
                  <option value="3">🟡 Amarelo</option>
                  <option value="4">🔴 Vermelho</option>
                </select>
              </div>

              {/* Título */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  className="w-full border-2 border-indigo-200 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
                  placeholder="Ex: Primeiros Passos"
                  required
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={form.descricao}
                  onChange={(e) =>
                    setForm({ ...form, descricao: e.target.value })
                  }
                  className="w-full border-2 border-indigo-200 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500 resize-none"
                  rows={2}
                  placeholder="Descrição curta da missão..."
                  required
                />
              </div>

              {/* XP */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  XP da Missão
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.xp}
                  onChange={(e) => setForm({ ...form, xp: e.target.value })}
                  className="w-full border-2 border-indigo-200 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* Questões */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700">
                    Questões ({form.questoes.length})
                  </label>
                  <button
                    type="button"
                    onClick={addQuestao}
                    className="text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold px-3 py-1 rounded-lg transition-colors"
                  >
                    + Questão
                  </button>
                </div>
                <div className="space-y-5">
                  {form.questoes.map((q, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-gray-600">
                          Questão {idx + 1}
                        </span>
                        {form.questoes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestao(idx)}
                            className="text-xs text-red-500 hover:text-red-700 font-bold"
                          >
                            Remover
                          </button>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Enunciado
                        </label>
                        <textarea
                          value={q.enunciado}
                          onChange={(e) =>
                            updateQuestao(idx, "enunciado", e.target.value)
                          }
                          className="w-full border-2 border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 resize-none"
                          rows={2}
                          placeholder="Digite a pergunta..."
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {(["A", "B", "C", "D"] as const).map((letra) => {
                          const field = `opcao${letra}` as keyof Questao;
                          return (
                            <div key={letra}>
                              <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Opção {letra}
                              </label>
                              <input
                                type="text"
                                value={q[field] as string}
                                onChange={(e) =>
                                  updateQuestao(idx, field, e.target.value)
                                }
                                className="w-full border-2 border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                                placeholder={`Opção ${letra}`}
                                required
                              />
                            </div>
                          );
                        })}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Resposta Correta
                        </label>
                        <select
                          value={q.correta}
                          onChange={(e) =>
                            updateQuestao(idx, "correta", e.target.value)
                          }
                          className="border-2 border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                          required
                        >
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        <div>
                          <label className="block text-xs font-semibold text-green-700 mb-1">
                            ✅ Feedback (resposta correta)
                          </label>
                          <input
                            type="text"
                            value={q.feedbackCorreto}
                            onChange={(e) =>
                              updateQuestao(idx, "feedbackCorreto", e.target.value)
                            }
                            className="w-full border-2 border-green-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400"
                            placeholder="Ex: Muito bem! Você acertou!"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-red-700 mb-1">
                            ❌ Feedback (resposta errada)
                          </label>
                          <input
                            type="text"
                            value={q.feedbackErrado}
                            onChange={(e) =>
                              updateQuestao(idx, "feedbackErrado", e.target.value)
                            }
                            className="w-full border-2 border-red-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400"
                            placeholder="Ex: Não foi dessa vez. Tente novamente!"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  {loading ? "Salvando..." : "Salvar Missão"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
