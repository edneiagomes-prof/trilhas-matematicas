"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getNivelInfo } from "@/lib/niveis";

interface Questao {
  id: number;
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
  titulo: string;
  descricao: string;
  nivel: number;
  xp: number;
  questoes: Questao[];
  trilha: { titulo: string; semana: number };
}

interface Resultado {
  acertos: number;
  total: number;
  pontos: number;
  xpGanho: number;
}

const OPCOES = ["A", "B", "C", "D"] as const;

export default function MissaoPage() {
  const params = useParams();
  const router = useRouter();
  const [missao, setMissao] = useState<Missao | null>(null);
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch(`/api/aluno/missao/${params.id}`)
      .then((r) => r.json())
      .then(setMissao);
  }, [params.id]);

  function handleResposta(questaoId: number, opcao: string) {
    if (resultado) return;
    setRespostas((prev) => ({ ...prev, [questaoId]: opcao }));
  }

  async function handleSubmit() {
    if (!missao) return;
    const totalQ = missao.questoes.length;
    if (Object.keys(respostas).length < totalQ) {
      setErro(`Responda todas as ${totalQ} questões antes de enviar!`);
      return;
    }
    setErro("");
    setEnviando(true);
    const res = await fetch("/api/aluno/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ missaoId: missao.id, respostas }),
    });
    const data = await res.json();
    setEnviando(false);
    if (!res.ok) {
      setErro(data.error);
      return;
    }
    setResultado(data);
  }

  if (!missao)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🧮</div>
          <p className="text-gray-500">Carregando missão...</p>
        </div>
      </div>
    );

  const nivelInfo = getNivelInfo(missao.nivel);

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => router.push("/aluno")}
        className="text-indigo-600 hover:underline mb-4 flex items-center gap-1"
      >
        ← Voltar às trilhas
      </button>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-3xl p-6 mb-6 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{nivelInfo.emoji}</span>
          <div>
            <div className="text-sm text-indigo-200">
              {missao.trilha.titulo} • Trilha {nivelInfo.label}
            </div>
            <h1 className="text-2xl font-bold">{missao.titulo}</h1>
          </div>
        </div>
        <p className="text-indigo-100 mt-2">{missao.descricao}</p>
        <div className="mt-3 bg-white bg-opacity-20 inline-block px-3 py-1 rounded-full text-sm font-bold">
          ⭐ {missao.xp} XP disponíveis
        </div>
      </div>

      {resultado ? (
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">
            {resultado.acertos === resultado.total
              ? "🎉"
              : resultado.acertos >= resultado.total / 2
              ? "👍"
              : "💪"}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {resultado.acertos === resultado.total
              ? "Perfeito!"
              : resultado.acertos >= resultado.total / 2
              ? "Muito bem!"
              : "Continue tentando!"}
          </h2>
          <p className="text-gray-500 mb-6">
            {resultado.acertos} de {resultado.total} questões corretas
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-indigo-50 rounded-2xl p-4">
              <div className="text-3xl font-bold text-indigo-600">
                {resultado.pontos}
              </div>
              <div className="text-gray-500 text-sm">Pontos</div>
            </div>
            <div className="bg-yellow-50 rounded-2xl p-4">
              <div className="text-3xl font-bold text-yellow-600">
                +{resultado.xpGanho}
              </div>
              <div className="text-gray-500 text-sm">XP Ganho</div>
            </div>
          </div>
          <div className="space-y-3 text-left mb-6">
            {missao.questoes.map((q, i) => {
              const resposta = respostas[q.id];
              const acertou = resposta === q.correta;
              return (
                <div
                  key={q.id}
                  className={`rounded-xl p-3 ${
                    acertou
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="text-sm font-semibold text-gray-700">
                    {i + 1}. {q.enunciado}
                  </div>
                  <div className="text-xs mt-1">
                    {acertou ? (
                      <>
                        <span className="text-green-600">
                          ✅ Sua resposta: {resposta} (Correta!)
                        </span>
                        {q.feedbackCorreto && (
                          <p className="mt-1 text-green-700 bg-green-100 rounded-lg px-2 py-1">
                            {q.feedbackCorreto}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-red-600">
                          ❌ Sua resposta: {resposta || "—"} | Correta:{" "}
                          {q.correta}
                        </span>
                        {q.feedbackErrado && (
                          <p className="mt-1 text-red-700 bg-red-100 rounded-lg px-2 py-1">
                            {q.feedbackErrado}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => router.push("/aluno")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-2xl transition-colors"
          >
            Voltar às Trilhas 🗺️
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {missao.questoes.map((q, i) => (
            <div key={q.id} className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">
                <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full inline-flex items-center justify-center mr-2 text-sm font-bold">
                  {i + 1}
                </span>
                {q.enunciado}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {OPCOES.map((opcao) => {
                  const texto = q[`opcao${opcao}` as keyof Questao] as string;
                  const selecionada = respostas[q.id] === opcao;
                  return (
                    <button
                      key={opcao}
                      onClick={() => handleResposta(q.id, opcao)}
                      className={`text-left p-4 rounded-xl border-2 transition-all font-medium ${
                        selecionada
                          ? "border-indigo-500 bg-indigo-50 text-indigo-800"
                          : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700"
                      }`}
                    >
                      <span
                        className={`inline-block w-7 h-7 rounded-full text-center text-sm font-bold mr-2 ${
                          selecionada
                            ? "bg-indigo-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {opcao}
                      </span>
                      {texto}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {erro && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold">
              {erro}
            </div>
          )}

          <div className="pb-8">
            <div className="text-sm text-gray-500 mb-3 text-center">
              {Object.keys(respostas).length}/{missao.questoes.length} questões
              respondidas
            </div>
            <button
              onClick={handleSubmit}
              disabled={enviando}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-2xl text-xl transition-all disabled:opacity-50 shadow-lg"
            >
              {enviando ? "Enviando... ⏳" : "Enviar Respostas! 🚀"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
