"use client";
import { useEffect, useState } from "react";
import MatchItem from "@/components/partidas-futebol/MatchItem";

type Props = {
  leagueId: string | number;
  temporada: number;
};

export default function UltimasProximasPartidas({ leagueId, temporada }: Props) {
  const [tab, setTab] = useState<"proximas" | "anteriores">("proximas");
  const [proximos, setProximos] = useState<any[]>([]);
  const [ultimos, setUltimos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`/api/football/campeonatos/ultimas-proximas-partidas?league=${leagueId}&season=${temporada}`)
      .then(res => res.json())
      .then(data => {
        setProximos(data.proximos ?? []);
        setUltimos(data.ultimos ?? []);
      })
      .catch(() => setError("Erro ao carregar jogos."))
      .finally(() => setLoading(false));
  }, [leagueId, temporada]);

  const mostrar = tab === "proximas" ? proximos : ultimos;

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-4">
      {/* Header com abas (copiado da tab "Rodadas") */}
      <div className="flex items-center justify-between px-2 py-2 bg-slate-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800 rounded-t-2xl mb-4">
        <span className="font-bold text-base text-[hsl(220_7%_38%)] dark:text-white">
          Últimos/Próximos jogos
        </span>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-md text-sm font-semibold border transition ${
              tab === "anteriores"
                ? "bg-[hsl(220_7%_38%)] text-white border-[hsl(220_7%_38%)] shadow"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            }`}
            onClick={() => setTab("anteriores")}
            disabled={tab === "anteriores"}
            type="button"
          >
            Últimos 5 Jogos
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-semibold border transition ${
              tab === "proximas"
                ? "bg-[hsl(220_7%_38%)] text-white border-[hsl(220_7%_38%)] shadow"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            }`}
            onClick={() => setTab("proximas")}
            disabled={tab === "proximas"}
            type="button"
          >
            Próximos 5 Jogos
          </button>
        </div>
      </div>

      {/* Lista de jogos */}
      {loading && (
        <div className="text-gray-500 text-center py-6">Carregando...</div>
      )}
      {!loading && error && (
        <div className="text-red-500 text-center py-6">{error}</div>
      )}
      {!loading && mostrar.length === 0 && (
        <div className="text-gray-500 text-sm text-center py-8">
          Nenhuma partida {tab === "proximas" ? "próxima" : "anterior"} encontrada.
        </div>
      )}
      <div className="flex flex-col gap-4">
        {mostrar.map((match: any, idx: number) => (
          <div key={match.fixture.id}>
            <MatchItem match={match} showFavoritos />
            {idx < mostrar.length - 1 && (
              <div className="w-full h-px mt-2 mb-1 bg-zinc-200 dark:bg-zinc-800" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}