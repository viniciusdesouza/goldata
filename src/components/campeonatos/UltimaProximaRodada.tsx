"use client";
import { useEffect, useState } from "react";
import MatchItem from "@/components/partidas-futebol/MatchItem";

type Props = {
  leagueId: string | number;
  temporada: number;
};

export default function UltimaProximaRodada({ leagueId, temporada }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [ultima, setUltima] = useState<{ round: string; matches: any[] } | null>(null);
  const [proxima, setProxima] = useState<{ round: string; matches: any[] } | null>(null);
  const [tab, setTab] = useState<"passada" | "proxima">("proxima");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`/api/football/campeonatos/rodadas-atual-proxima?league=${leagueId}&season=${temporada}`)
      .then(res => res.json())
      .then(data => {
        setUltima(data.ultimaRodada ?? null);
        setProxima(data.proximaRodada ?? null);
      })
      .catch(() => setError("Erro ao carregar rodadas."))
      .finally(() => setLoading(false));
  }, [leagueId, temporada]);

  const rodadaSelecionada = tab === "passada" ? ultima : proxima;

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-4">
      {/* Tabs de Rodada */}
      <div className="flex items-center justify-between px-2 py-2 bg-slate-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800 rounded-t-2xl mb-4">
        <span className="font-bold text-base text-[hsl(220_7%_38%)] dark:text-white">
          {tab === "passada"
            ? `Rodada Passada${ultima?.round ? ` (${ultima.round})` : ""}`
            : `Próxima Rodada${proxima?.round ? ` (${proxima.round})` : ""}`}
        </span>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-md text-sm font-semibold border transition ${
              tab === "passada"
                ? "bg-[hsl(220_7%_38%)] text-white border-[hsl(220_7%_38%)] shadow"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            }`}
            onClick={() => setTab("passada")}
            disabled={tab === "passada"}
            type="button"
          >
            Rodada Passada
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-semibold border transition ${
              tab === "proxima"
                ? "bg-[hsl(220_7%_38%)] text-white border-[hsl(220_7%_38%)] shadow"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            }`}
            onClick={() => setTab("proxima")}
            disabled={tab === "proxima"}
            type="button"
          >
            Próxima Rodada
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      {loading && (
        <div className="text-gray-500 text-center py-6">Carregando...</div>
      )}
      {!loading && error && (
        <div className="text-red-500 text-center py-6">{error}</div>
      )}

      {!loading && rodadaSelecionada && (
        <div>
          <div className="flex flex-col gap-4">
            {rodadaSelecionada.matches.length === 0 && (
              <div className="text-gray-500 text-sm text-center py-8">
                Nenhuma partida encontrada.
              </div>
            )}
            {rodadaSelecionada.matches.map((match: any, idx: number) => (
              <div key={match.fixture.id}>
                <MatchItem match={match} showFavoritos />
                {idx < rodadaSelecionada.matches.length - 1 && (
                  <div className="w-full h-px mt-2 mb-1 bg-zinc-200 dark:bg-zinc-800" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}