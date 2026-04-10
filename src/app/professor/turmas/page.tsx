"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Turma {
  id: number;
  nome: string;
  _count: { alunos: number };
}

export default function TurmasPage() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null);
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTurmas = useCallback(async () => {
    const res = await fetch("/api/professor/turmas");
    const data = await res.json();
    setTurmas(data);
  }, []);

  useEffect(() => {
    fetchTurmas();
  }, [fetchTurmas]);

  function openCreate() {
    setEditingTurma(null);
    setNome("");
    setError("");
    setShowModal(true);
  }

  function openEdit(t: Turma) {
    setEditingTurma(t);
    setNome(t.nome);
    setError("");
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = editingTurma
      ? await fetch(`/api/professor/turmas/${editingTurma.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome }),
        })
      : await fetch("/api/professor/turmas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome }),
        });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setSuccess(editingTurma ? "Turma atualizada!" : "Turma criada!");
    setShowModal(false);
    fetchTurmas();
    setTimeout(() => setSuccess(""), 3000);
  }

  async function handleDelete(t: Turma) {
    if (
      !confirm(
        `Excluir a turma "${t.nome}"? Esta ação não pode ser desfeita.`
      )
    )
      return;

    const res = await fetch(`/api/professor/turmas/${t.id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      setSuccess("");
      setError(data.error);
      setTimeout(() => setError(""), 5000);
      return;
    }
    setSuccess("Turma excluída!");
    fetchTurmas();
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
          <h1 className="text-3xl font-bold text-indigo-700">📋 Turmas</h1>
        </div>
        <button
          onClick={openCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl transition-colors"
        >
          + Nova Turma
        </button>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {turmas.length === 0 ? (
        <div className="text-center text-gray-400 py-16 text-lg">
          Nenhuma turma cadastrada ainda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {turmas.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl shadow p-6 border-2 border-transparent hover:border-indigo-200 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-indigo-700">
                    📚 {t.nome}
                  </h2>
                  <span className="inline-block mt-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold text-sm">
                    {t._count.alunos} aluno{t._count.alunos !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(t)}
                    className="px-3 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-xl text-sm font-bold transition-colors"
                    title="Editar turma"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(t)}
                    className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-sm font-bold transition-colors"
                    title="Excluir turma"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <Link
                href="/professor/alunos"
                className="block text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold py-2 rounded-xl transition-colors"
              >
                👥 Ver alunos
              </Link>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">
              {editingTurma ? "✏️ Editar Turma" : "➕ Nova Turma"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nome da Turma
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full border-2 border-indigo-200 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
                  placeholder="Ex: 9º A"
                  required
                  autoFocus
                />
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
                  {loading ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
