"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CATEGORIA_GRID,
  CATEGORIA_CARD_IMG,
  CATEGORIA_CARD_NOME,
  CATEGORIA_CARD_INFO,
  CATEGORIA_AUX,
} from "../styles-categorias";
import { ContainerPage } from "@/app/Containers-Categorias-Home";

// Subtítulo centralizado padronizado
const CATEGORY_SUBTITLE_CLASS = "text-lg font-semibold text-center w-full mb-2";

interface CountryApi { name: string; code?: string; flag?: string; }
interface LeagueApi {
  league: { id: number; name: string; logo: string; };
  country?: { name: string; flag: string; };
}
interface ClubApi { team: { id: number; name: string; logo: string; country?: string; }; }
interface PlayerApi {
  player: {
    id: number;
    name: string;
    photo: string;
    nationality: string;
    age?: number;
    birth?: { date?: string; country?: string; };
    height?: string;
    weight?: string;
    injured?: boolean;
  };
}

const DEFAULT_CLUB_ID = 121;
const DEFAULT_SEASON = 2024;
const DEFAULT_PLAYERS_LIMIT = 24;
const dataCache: Record<string, any> = {};

function useCachedFetch<T = any>(url: string, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    if (!url) return;
    setLoading(true);
    setError(null);

    if (dataCache[url]) {
      setData(dataCache[url]);
      setLoading(false);
      return;
    }
    fetch(url)
      .then(res => res.json())
      .then(json => {
        if (!ignore) {
          dataCache[url] = json;
          setData(json);
        }
      })
      .catch(() => {
        if (!ignore) setError("Erro ao carregar dados.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => { ignore = true; };
    // eslint-disable-next-line
  }, deps);

  return { data, loading, error };
}

export default function PesquisaJogadoresPage() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  // Estados para aplicar filtros apenas quando clicar no botão
  const [appliedCountry, setAppliedCountry] = useState<string>("");
  const [appliedLeagueId, setAppliedLeagueId] = useState<number | null>(null);
  const [appliedClubId, setAppliedClubId] = useState<number | null>(null);
  const [appliedSeason, setAppliedSeason] = useState<number | null>(null);

  // Estado para grid default (24 jogadores do clube/season padrão)
  const [defaultPlayers, setDefaultPlayers] = useState<PlayerApi[]>([]);
  const [loadingDefaultPlayers, setLoadingDefaultPlayers] = useState(false);
  const [errorDefaultPlayers, setErrorDefaultPlayers] = useState<string | null>(null);

  useEffect(() => {
    if (appliedClubId && appliedSeason) return;
    setLoadingDefaultPlayers(true);
    setErrorDefaultPlayers(null);
    fetch(`/api/football/pesquisa-jogadores/players?club=${DEFAULT_CLUB_ID}&season=${DEFAULT_SEASON}`)
      .then(res => res.json())
      .then(json => setDefaultPlayers((json.response || []).slice(0, DEFAULT_PLAYERS_LIMIT)))
      .catch(() => setErrorDefaultPlayers("Erro ao carregar jogadores padrão."))
      .finally(() => setLoadingDefaultPlayers(false));
  }, [appliedClubId, appliedSeason]);

  const { data: countriesData } =
    useCachedFetch<{ response: CountryApi[] }>("/api/football/pesquisa-jogadores/countries", []);
  const countries = countriesData?.response || [];

  const leagueUrl = selectedCountry
    ? `/api/football/pesquisa-jogadores/leagues?country=${encodeURIComponent(selectedCountry)}`
    : "";
  const { data: leaguesData } =
    useCachedFetch<{ response: LeagueApi[] }>(leagueUrl, [leagueUrl]);
  const leagues = leaguesData?.response?.map((l: any) => l.league ? l.league : l) || [];

  const seasonsUrl = selectedLeagueId
    ? `/api/football/pesquisa-jogadores/seasons?league=${selectedLeagueId}`
    : "";
  const { data: seasonsData } =
    useCachedFetch<{ response: any[] }>(seasonsUrl, [seasonsUrl]);
  const seasons = Array.isArray(seasonsData?.response)
    ? (seasonsData?.response?.[0]?.seasons || [])
    : [];

  const clubUrl = selectedLeagueId
    ? `/api/football/pesquisa-jogadores/clubes?league=${selectedLeagueId}`
    : "";
  const { data: clubsData } =
    useCachedFetch<{ response: ClubApi[] }>(clubUrl, [clubUrl]);
  const clubs = clubsData?.response?.map((c: any) => c.team ? c.team : c) || [];
  const clubSelecionado = clubs.find((c) => c.id === appliedClubId);

  const playerUrl =
    appliedClubId && appliedSeason
      ? `/api/football/pesquisa-jogadores/players?club=${appliedClubId}&season=${appliedSeason}`
      : "";
  const { data: playersData, loading: loadingPlayers, error: errorPlayers } =
    useCachedFetch<{ response: PlayerApi[] }>(playerUrl, [playerUrl]);
  const players: PlayerApi[] = playersData?.response || [];

  // Limpa filtros dependentes ao trocar o anterior
  useEffect(() => {
    setSelectedLeagueId(null);
    setSelectedClubId(null);
    setSelectedSeason(null);
  }, [selectedCountry]);
  useEffect(() => {
    setSelectedClubId(null);
    setSelectedSeason(null);
  }, [selectedLeagueId]);
  useEffect(() => {
    setSelectedSeason(null);
  }, [selectedClubId]);

  function applyFilters(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setAppliedCountry(selectedCountry);
    setAppliedLeagueId(selectedLeagueId);
    setAppliedClubId(selectedClubId);
    setAppliedSeason(selectedSeason);
  }

  const showDefaultGrid = !(appliedClubId && appliedSeason);

  // Renderiza o card do jogador, só o nome é clicável
  function renderPlayerCard(p: PlayerApi) {
    return (
      <div
        key={p.player.id}
        className="flex items-center gap-4 border border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 rounded-lg px-4 py-2 player-preview-grid-item transition-shadow"
        style={{ minHeight: 54, userSelect: "none" }}
      >
        {/* Foto */}
        <img
          src={p.player.photo}
          alt={p.player.name}
          className={CATEGORIA_CARD_IMG}
          loading="lazy"
        />
        {/* Nome do jogador (clicável) e nacionalidade */}
        <div className="flex flex-col flex-1">
          <Link
            href={`/pesquisa-jogadores/${p.player.id}`}
            className={
              CATEGORIA_CARD_NOME +
              " hover:underline focus:underline text-zinc-900 dark:text-zinc-100"
            }
            style={{ width: "fit-content", cursor: "pointer" }}
            tabIndex={0}
          >
            {p.player.name}
          </Link>
          <span className={CATEGORIA_CARD_INFO}>{p.player.nationality}</span>
        </div>
      </div>
    );
  }

  return (
    <ContainerPage>
      <h1 className="text-2xl font-bold text-center mb-6">
        Jogadores {clubSelecionado ? `- ${clubSelecionado.name}` : ""}
      </h1>

      {/* Filtros */}
      <form
        className="flex flex-wrap gap-1 justify-center mb-3"
        onSubmit={applyFilters}
      >
        <select
          className="rounded-xl border border-gray-300 dark:border-gray-700 px-2 py-1 bg-white dark:bg-gray-900 text-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-500 h-9 mr-2"
          value={selectedCountry}
          onChange={e => setSelectedCountry(e.target.value)}
        >
          <option value="">País</option>
          {countries.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
        <select
          className="rounded-xl border border-gray-300 dark:border-gray-700 px-2 py-1 bg-white dark:bg-gray-900 text-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-500 h-9 mr-2"
          value={selectedLeagueId ?? ""}
          onChange={e => setSelectedLeagueId(e.target.value ? Number(e.target.value) : null)}
          disabled={!selectedCountry || leagues.length === 0}
        >
          <option value="">Liga</option>
          {leagues.map((league: any) => (
            <option key={league.id} value={league.id}>{league.name}</option>
          ))}
        </select>
        <select
          className="rounded-xl border border-gray-300 dark:border-gray-700 px-2 py-1 bg-white dark:bg-gray-900 text-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-500 h-9 mr-2"
          value={selectedClubId ?? ""}
          onChange={e => setSelectedClubId(e.target.value ? Number(e.target.value) : null)}
          disabled={!selectedLeagueId || clubs.length === 0}
        >
          <option value="">Clube</option>
          {clubs.map((club: any) => (
            <option key={club.id} value={club.id}>{club.name}</option>
          ))}
        </select>
        <select
          className="rounded-xl border border-gray-300 dark:border-gray-700 px-2 py-1 bg-white dark:bg-gray-900 text-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-500 h-9"
          value={selectedSeason ?? ""}
          onChange={e => setSelectedSeason(e.target.value ? Number(e.target.value) : null)}
          disabled={!selectedLeagueId || seasons.length === 0}
        >
          <option value="">Temporada</option>
          {Array.isArray(seasons) && seasons.length > 0 &&
            seasons
              .filter((s: any) => !!s.year)
              .sort((a: any, b: any) => b.year - a.year)
              .map((season: any) => (
                <option key={season.year} value={season.year}>{season.year}</option>
              ))}
        </select>
        <button
          type="submit"
          className="px-3 py-1 rounded-xl text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:bg-green-50 dark:hover:bg-green-900 transition h-9"
        >
          Filtrar
        </button>
      </form>

      {/* Grid default de jogadores */}
      {showDefaultGrid && (
        <>
          <h2 className={CATEGORY_SUBTITLE_CLASS}>Jogadores em Destaque</h2>
          {loadingDefaultPlayers ? (
            <div className={CATEGORIA_AUX}>
              Carregando jogadores...
            </div>
          ) : errorDefaultPlayers ? (
            <div className="text-red-500 text-center my-10">{errorDefaultPlayers}</div>
          ) : (
            <div className={CATEGORIA_GRID}>
              {defaultPlayers.length === 0 && (
                <div className={CATEGORIA_AUX + " col-span-full"}>
                  Nenhum jogador encontrado.
                </div>
              )}
              {defaultPlayers.map(renderPlayerCard)}
            </div>
          )}
        </>
      )}

      {/* Grid filtrada */}
      {(appliedClubId && appliedSeason) && (
        <div className={"mt-6"}>
          <div className={CATEGORIA_GRID}>
            {loadingPlayers ? (
              <div className={CATEGORIA_AUX + " col-span-full"}>
                Carregando jogadores...
              </div>
            ) : players.length === 0 ? (
              <div className={CATEGORIA_AUX + " col-span-full"}>
                Nenhum jogador encontrado para este clube/temporada.
              </div>
            ) : (
              players.map(renderPlayerCard)
            )}
          </div>
        </div>
      )}

      {(!appliedClubId || !appliedSeason) && (
        <div className={CATEGORIA_AUX + " text-center py-10"}>
          Selecione clube e temporada para visualizar o elenco.
        </div>
      )}
      {(errorPlayers || errorDefaultPlayers) && (
        <div className="text-red-500 text-center my-10">{errorPlayers || errorDefaultPlayers}</div>
      )}
      {/* Sombra igual ao sidebar-preview-item */}
      <style jsx global>{`
        .player-preview-grid-item {
          box-shadow: 0 1px 5px 0 #1c22320a !important;
        }
        .player-preview-grid-item:hover,
        .player-preview-grid-item:focus-visible {
          box-shadow: 0 1px 5px 0 #1c22320a !important;
          border-color: hsl(var(--accent-foreground, 219 89% 64%));
        }
        .dark .player-preview-grid-item {
          box-shadow: 0 1px 5px 0 #0003 !important;
        }
        .dark .player-preview-grid-item:hover,
        .dark .player-preview-grid-item:focus-visible {
          box-shadow: 0 1px 5px 0 #0003 !important;
          border-color: hsl(var(--accent-foreground, 219 89% 64%));
        }
      `}</style>
    </ContainerPage>
  );
}