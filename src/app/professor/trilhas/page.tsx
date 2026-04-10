"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Trilha {
  id: number;
  titulo: string;
  semana: number;
  ordem: number;
  _count: { missoes: number };
}

const emptyForm = { titulo: "", semana: "", ordem: "" };

export default function TrilhasPage() {
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTrilha, setEditingTrilha] = useState<Trilha | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTrilhas = useCallback(async () => {
    const res = await fetch("/api/professor/trilhas");
    const data = await res.json();
    setTrilhas(data);
  }, []);

  useEffect(() => {
    fetchTrilhas();
  }, [fetchTrilhas]);

  function openCreate() {
    setEditingTrilha(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  }

  function openEdit(t: Trilha) {
    setEditingTrilha(t);
    setForm({ titulo: t.titulo, semana: String(t.semana), ordem: String(t.ordem) });
    setError("");
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body = {
      titulo: form.titulo,
      semana: Number(form.semana),
      ordem: Number(form.ordem),
    };

    const res = editingTrilha
      ? await fetch(`/api/professor/trilhas/${editingTrilha.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await fetch("/api/professor/trilhas", {
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

    setSuccess(editingTrilha ? "Trilha atualizada!" : "Trilha criada!");
    setShowModal(false);
    fetchTrilhas();
    setTimeout(() => setSuccess(""), 3000);
  }

  async function handleDelete(t: Trilha) {
    if (
      !confirm(
        `Excluir a trilha "${t.titulo}"? Todas as missões e questões serão removidas.`
      )
    )
      return;

    const res = await fetch(`/api/professor/trilhas/${t.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setSuccess("Trilha excluída!");
      fetchTrilhas();
      setTimeout(() => setSuccess(""), 3000);
    }
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
          <h1 className="text-3xl font-bold text-indigo-700">🗺️ Trilhas</h1>
        </div>
        <button
          onClick={openCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl transition-colors"
        >
          + Nova Trilha
        </button>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4">
          {success}
        </div>
      )}

      {trilhas.length === 0 ? (
        <div className="text-center text-gray-400 py-16 text-lg">
          Nenhuma trilha cadastrada ainda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trilhas.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl shadow p-5 border-2 border-transparent hover:border-indigo-200 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{t.titulo}</h2>
                  <div className="text-sm text-gray-500 mt-0.5">
                    Semana {t.semana} · Ordem {t.ordem}
                  </div>
                </div>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">
                  {t._count.missoes} missões
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <Link
                  href={`/professor/trilhas/${t.id}`}
                  className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-2 rounded-xl transition-colors"
                >
                  🎯 Ver Missões
                </Link>
                <button
                  onClick={() => openEdit(t)}
                  className="px-3 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-xl text-sm font-bold transition-colors"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(t)}
                  className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-sm font-bold transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">
              {editingTrilha ? "✏️ Editar Trilha" : "➕ Nova Trilha"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  className="w-full border-2 border-indigo-200 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
                  placeholder="Ex: Sequências e Padrões"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Semana
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.semana}
                    onChange={(e) =>
                      setForm({ ...form, semana: e.target.value })
                    }
                    className="w-full border-2 border-indigo-200 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Ordem
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.ordem}
                    onChange={(e) =>
                      setForm({ ...form, ordem: e.target.value })
                    }
                    className="w-full border-2 border-indigo-200 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
                    required
                  />
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
