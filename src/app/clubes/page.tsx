"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PinButtonClube from "@/components/pesquisa-clubes/PinButtonClube";
import ShareButtonClube from "@/components/pesquisa-clubes/ShareButtonClube";
import "@/components/pesquisa-clubes/sharebuttonclube.css";
import {
  CATEGORIA_GRID,
  CATEGORIA_CARD,
  CATEGORIA_CARD_IMG,
  CATEGORIA_CARD_NOME,
  CATEGORIA_CARD_INFO,
  CATEGORIA_AUX,
} from "../styles-categorias";
import { ContainerPage } from "@/app/Containers-Categorias-Home";

interface CountryApi { name: string; flag: string; }
interface LeagueApi {
  league: { id: number; name: string; logo: string; };
  country: { name: string; flag: string; };
}
interface ClubApi {
  team: { id: number; name: string; logo: string; country: string; };
}

export default function ClubesPage() {
  const [principaisClubes, setPrincipaisClubes] = useState<ClubApi[]>([]);
  const [countries, setCountries] = useState<CountryApi[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [leagues, setLeagues] = useState<LeagueApi[]>([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  const [clubs, setClubs] = useState<ClubApi[]>([]);
  const [loadingPrincipais, setLoadingPrincipais] = useState(true);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingLeagues, setLoadingLeagues] = useState(false);
  const [loadingClubs, setLoadingClubs] = useState(false);
  const [error, setError] = useState("");
  const [errorPrincipais, setErrorPrincipais] = useState("");

  useEffect(() => {
    setLoadingPrincipais(true);
    setErrorPrincipais("");
    fetch("/api/football/clubes?league=71")
      .then((res) => res.json())
      .then((data) => setPrincipaisClubes((data.response || []).slice(0, 20)))
      .catch(() => setErrorPrincipais("Erro ao carregar principais clubes reais."))
      .finally(() => setLoadingPrincipais(false));
  }, []);

  useEffect(() => {
    setLoadingCountries(true);
    fetch("/api/football/paises")
      .then((res) => res.json())
      .then((data) => setCountries(data.response || []))
      .catch(() => setError("Erro ao carregar países."))
      .finally(() => setLoadingCountries(false));
  }, []);

  useEffect(() => {
    if (!selectedCountry) {
      setLeagues([]);
      setSelectedLeagueId(null);
      return;
    }
    setLoadingLeagues(true);
    fetch(`/api/football/ligas?country=${encodeURIComponent(selectedCountry)}`)
      .then((res) => res.json())
      .then((data) => setLeagues(data.response || []))
      .catch(() => setError("Erro ao carregar ligas."))
      .finally(() => setLoadingLeagues(false));
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedLeagueId) {
      setClubs([]);
      return;
    }
    setLoadingClubs(true);
    fetch(`/api/football/clubes?league=${selectedLeagueId}`)
      .then((res) => res.json())
      .then((data) => setClubs(data.response || []))
      .catch(() => setError("Erro ao carregar clubes."))
      .finally(() => setLoadingClubs(false));
  }, [selectedLeagueId]);

  // Utilitário para renderizar um clube com Pin e Share
  function renderClubCard(c: ClubApi) {
    return (
      <div
        key={c.team.id}
        className={CATEGORIA_CARD + " club-preview-grid-item"}
        style={{ userSelect: "none" }}
      >
        {c.team.logo && (
          <img
            src={c.team.logo}
            alt={c.team.name}
            className={CATEGORIA_CARD_IMG}
            loading="lazy"
          />
        )}
        <div className="flex flex-col flex-1">
          <Link
            href={`/clubes/${c.team.id}`}
            className={
              CATEGORIA_CARD_NOME +
              " hover:underline focus:underline text-zinc-900 dark:text-zinc-100"
            }
            style={{ width: "fit-content", cursor: "pointer" }}
            tabIndex={0}
          >
            {c.team.name}
          </Link>
          <span className={CATEGORIA_CARD_INFO}>{c.team.country ?? ""}</span>
        </div>
        <div className="flex flex-col items-end gap-1 mb-1 max-w-full ml-2">
          <PinButtonClube id={c.team.id} />
          <ShareButtonClube id={c.team.id} />
        </div>
      </div>
    );
  }

  return (
    <ContainerPage>
      <h1 className="text-2xl font-bold text-center mb-6">Clubes</h1>

      {/* Filtros */}
      <form
        className="flex flex-wrap gap-1 justify-center mb-3"
        onSubmit={e => { e.preventDefault(); }}
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
          disabled={!selectedCountry || loadingLeagues || leagues.length === 0}
        >
          <option value="">Liga</option>
          {leagues.map((league: any) => (
            <option key={league.league.id} value={league.league.id}>{league.league.name}</option>
          ))}
        </select>
        <button
          type="submit"
          className="px-3 py-1 rounded-xl text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:bg-green-50 dark:hover:bg-green-900 transition h-9"
          disabled={loadingCountries || loadingLeagues}
        >
          Filtrar
        </button>
      </form>

      <h2 className="text-lg font-semibold mb-2">Clubes em Destaque</h2>
      <div className={CATEGORIA_GRID}>
        {loadingPrincipais ? (
          Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="h-[44px] bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg" />
          ))
        ) : errorPrincipais ? (
          <div className={CATEGORIA_AUX + " col-span-full"}>{errorPrincipais}</div>
        ) : principaisClubes.length === 0 ? (
          <div className={CATEGORIA_AUX + " col-span-full"}>Nenhum clube encontrado.</div>
        ) : (
          principaisClubes.map(renderClubCard)
        )}
      </div>

      {selectedLeagueId && (
        <div className={CATEGORIA_GRID + " mt-4"}>
          {loadingClubs ? (
            <span>Carregando clubes...</span>
          ) : clubs.length === 0 ? (
            <div className={CATEGORIA_AUX + " col-span-full"}>
              Nenhum clube encontrado para esta liga.
            </div>
          ) : (
            clubs.map(renderClubCard)
          )}
        </div>
      )}

      {error && <div className="text-red-500 text-center my-10">{error}</div>}

      {/* Sombra igual ao sidebar-preview-item */}
      <style jsx global>{`
        .club-preview-grid-item {
          box-shadow: 0 1px 5px 0 #1c22320a !important;
        }
        .club-preview-grid-item:hover,
        .club-preview-grid-item:focus-visible {
          box-shadow: 0 1px 5px 0 #1c22320a !important;
          border-color: hsl(var(--accent-foreground, 219 89% 64%));
        }
        .dark .club-preview-grid-item {
          box-shadow: 0 1px 5px 0 #0003 !important;
        }
        .dark .club-preview-grid-item:hover,
        .dark .club-preview-grid-item:focus-visible {
          box-shadow: 0 1px 5px 0 #0003 !important;
          border-color: hsl(var(--accent-foreground, 219 89% 64%));
        }
      `}</style>
    </ContainerPage>
  );
}