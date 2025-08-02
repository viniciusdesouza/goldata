"use client";
import { useState, useEffect, useMemo } from "react";
import MatchItem from "@/components/partidas-futebol/MatchItem";

interface RodadasCampeonatoProps {
  leagueId: string | number;
  temporada: number;
  leagueName?: string;
}

export default function RodadasCampeonato({
  leagueId,
  temporada,
  leagueName,
}: RodadasCampeonatoProps) {
  const [tab, setTab] = useState<"anteriores" | "proximas">("proximas");
  const [partidas, setPartidas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(
      `/api/football/campeonatos/fixtures?league=${leagueId}&season=${temporada}`
    )
      .then((res) => res.json())
      .then((data) => {
        setPartidas(data.response ?? []);
      })
      .catch(() => setError("Erro ao carregar jogos do campeonato."))
      .finally(() => setLoading(false));
  }, [leagueId, temporada]);

  const now = useMemo(() => new Date(), []);

  // Próximas partidas: datas futuras e ordem crescente
  const proximas = useMemo(
    () =>
      partidas
        .filter((m) => new Date(m.fixture.date) >= now)
        .sort((a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime()),
    [partidas, now]
  );

  // Últimas partidas: datas passadas e ordem decrescente
  const anteriores = useMemo(
    () =>
      partidas
        .filter((m) => new Date(m.fixture.date) < now)
        .sort((a, b) => new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime()),
    [partidas, now]
  );

  const mostrar = tab === "proximas" ? proximas : anteriores;

  function handleTabChange(newTab: "anteriores" | "proximas") {
    setTab(newTab);
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-4">
      {/* Header com tabs */}
      <div className="flex items-center justify-between px-2 py-2 bg-slate-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800 rounded-t-2xl">
        <span className="font-bold text-base text-[hsl(220_7%_38%)] dark:text-white">
          {leagueName}
        </span>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-md text-sm font-semibold border transition ${
              tab === "anteriores"
                ? "bg-[hsl(220_7%_38%)] text-white border-[hsl(220_7%_38%)] shadow"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            }`}
            onClick={() => handleTabChange("anteriores")}
            disabled={tab === "anteriores"}
            type="button"
          >
            Últimos Jogos
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-semibold border transition ${
              tab === "proximas"
                ? "bg-[hsl(220_7%_38%)] text-white border-[hsl(220_7%_38%)] shadow"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            }`}
            onClick={() => handleTabChange("proximas")}
            disabled={tab === "proximas"}
            type="button"
          >
            Próximos Jogos
          </button>
        </div>
      </div>
      {/* Lista de jogos */}
      <div className="flex flex-col gap-4 pt-4">
        {mostrar.length === 0 && !loading && (
          <div className="text-zinc-400 dark:text-zinc-500 text-center py-8">
            Nenhuma partida {tab === "proximas" ? "futura" : "anterior"} encontrada.
          </div>
        )}
        {error && !loading && (
          <div className="py-8 text-center text-red-500">{error}</div>
        )}
        {mostrar.map((match: any, idx: number) => (
          <div key={match.fixture.id}>
            <MatchItem match={match} showFavoritos={true} />
            {idx < mostrar.length - 1 && (
              <div className="w-full h-px mt-2 mb-1 bg-zinc-200 dark:bg-zinc-800" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}