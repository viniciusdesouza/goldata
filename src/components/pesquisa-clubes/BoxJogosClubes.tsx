"use client";
import { useState, useEffect, useMemo } from "react";
import MatchItem from "@/components/partidas-futebol/MatchItem";

interface BoxJogosClubesProps {
  clubId: string | number;
  temporada: string | number;
  leagueId?: string | number;
  titulo?: string;
  pageSize?: number;
  partidasTodas?: any[]; // NOVO: lista de todas partidas da temporada, se fornecida
  mostrarTodas?: boolean; // NOVO: se true, exibe todas as partidas independente do campeonato
}

type Match = any; // Use seu tipo real se desejar

export default function BoxJogosClubes({
  clubId,
  temporada,
  leagueId,
  titulo,
  pageSize = 5,
  partidasTodas,
  mostrarTodas = false,
}: BoxJogosClubesProps) {
  const [tab, setTab] = useState<"anteriores" | "proximas">("proximas");

  // Para paginação local
  const [offset, setOffset] = useState(0);

  // Removido o state matches/acabou/loading se for mostrarTodas
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [acabou, setAcabou] = useState(false);

  // Filtragem e ordenação local, se mostrarTodas
  const partidasFiltradas = useMemo(() => {
    if (!mostrarTodas || !Array.isArray(partidasTodas)) return [];
    const now = new Date();
    // Filtra e ordena conforme tab
    if (tab === "proximas") {
      return partidasTodas
        .filter(m => new Date(m.fixture.date) >= now)
        .sort((a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime());
    } else {
      return partidasTodas
        .filter(m => new Date(m.fixture.date) < now)
        .sort((a, b) => new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime());
    }
  }, [mostrarTodas, partidasTodas, tab]);

  // Paginação local, se mostrarTodas
  const paginadas = useMemo(() => {
    return partidasFiltradas.slice(0, offset + pageSize);
  }, [partidasFiltradas, offset, pageSize]);

  // Reseta paginação ao trocar tab ou partidasTodas
  useEffect(() => {
    setOffset(0);
  }, [tab, partidasTodas, mostrarTodas]);

  // Fetch normal se NÃO estiver mostrando todas
  useEffect(() => {
    if (mostrarTodas) return;
    setMatches([]);
    setOffset(0);
    setAcabou(false);
    fetchMatches(0, true);
    // eslint-disable-next-line
  }, [clubId, temporada, leagueId, tab, mostrarTodas]);

  async function fetchMatches(newOffset: number, replace = false) {
    if (mostrarTodas) return;
    setLoading(true);
    const params = new URLSearchParams({
      team: String(clubId),
      season: String(temporada),
      league: String(leagueId),
      offset: String(newOffset),
      limit: String(pageSize),
    });
    if (tab === "anteriores") params.append("last", String(pageSize));
    else params.append("next", String(pageSize));
    const res = await fetch(`/api/football/pesquisa-clubes/fixtures?${params.toString()}`);
    const data = await res.json();
    const novos = data.response || [];
    setMatches((prev) => replace ? novos : [...prev, ...novos]);
    setOffset((prev) => prev + novos.length);
    setAcabou(novos.length < pageSize);
    setLoading(false);
  }

  function handleTabChange(newTab: "anteriores" | "proximas") {
    if (tab !== newTab) {
      setTab(newTab);
    }
  }

  function handleVerMais() {
    if (mostrarTodas) {
      setOffset(o => o + pageSize);
    } else if (!acabou && !loading) {
      fetchMatches(offset);
    }
  }

  // Decide lista a mostrar
  const listaMostrar = mostrarTodas ? paginadas : matches;
  const acabouMostrar = mostrarTodas
    ? paginadas.length >= partidasFiltradas.length
    : acabou;

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm overflow-hidden">
      {/* Header com tabs */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
        <span className="font-bold text-base text-[hsl(220_7%_38%)] dark:text-white">{titulo || "Partidas do Clube"}</span>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-md text-sm font-semibold border transition ${
              tab === "anteriores"
                ? "bg-[hsl(220_7%_38%)] text-white border-[hsl(220_7%_38%)] shadow"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            }`}
            onClick={() => handleTabChange("anteriores")}
            disabled={tab === "anteriores" || loading}
            type="button"
          >
            Partidas anteriores
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-semibold border transition ${
              tab === "proximas"
                ? "bg-[hsl(220_7%_38%)] text-white border-[hsl(220_7%_38%)] shadow"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            }`}
            onClick={() => handleTabChange("proximas")}
            disabled={tab === "proximas" || loading}
            type="button"
          >
            Próximas partidas
          </button>
        </div>
      </div>
      {/* Lista de jogos */}
      <div className="flex flex-col gap-4 p-4">
        {listaMostrar.length === 0 && !loading && (
          <div className="text-zinc-400 dark:text-zinc-500 text-center py-8">
            Nenhuma partida encontrada.
          </div>
        )}
        {listaMostrar.map((match: Match, idx: number) => (
          <div key={match.fixture.id}>
            <MatchItem match={match} showFavoritos={true} />
            {idx < listaMostrar.length - 1 && (
              <div className="w-full h-px mt-2 mb-1 bg-zinc-200 dark:bg-zinc-800" />
            )}
          </div>
        ))}
        {listaMostrar.length > 0 && !acabouMostrar && (
          <button
            className="self-center mt-2 px-4 py-2 rounded-lg bg-[hsl(220_7%_38%)] text-white font-semibold shadow transition hover:bg-[hsl(220_7%_28%)] disabled:opacity-60"
            onClick={handleVerMais}
            disabled={loading}
            type="button"
          >
            {loading ? "Carregando..." : (
              tab === "anteriores" ? "Ver mais partidas anteriores" : "Ver mais próximas partidas"
            )}
          </button>
        )}
        {acabouMostrar && listaMostrar.length > 0 && (
          <div className="text-xs text-center text-zinc-400 dark:text-zinc-600 mt-2">
            {tab === "anteriores" ? "Não há mais partidas anteriores." : "Não há mais próximas partidas."}
          </div>
        )}
      </div>
    </div>
  );
}