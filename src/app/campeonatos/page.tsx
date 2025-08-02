"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PinButton from "@/components/campeonatos/PinButton";
import ShareButtonCampeonato from "@/components/campeonatos/ShareButtonCampeonato";
import { useFixedChampionships } from "@/components/campeonatos/FixedChampionshipsContext";
import {
  CATEGORIA_FILTROS,
  CATEGORIA_INPUT,
  CATEGORIA_BOTAO,
  CATEGORIA_GRID,
  CATEGORIA_CARD,
  CATEGORIA_CARD_IMG,
  CATEGORIA_CARD_NOME,
  CATEGORIA_CARD_INFO,
  CATEGORIA_AUX,
} from "../styles-categorias";
import { ContainerPage } from "@/app/Containers-Categorias-Home";
import "@/components/campeonatos/sharebuttoncampeonato.css";

interface LeagueApi {
  league: { id: number; name: string; logo: string; };
  country: { name: string; flag: string; };
}
interface CountryApi { name: string; flag: string; }

export default function CampeonatosPage() {
  const [principais, setPrincipais] = useState<LeagueApi[]>([]);
  const [countries, setCountries] = useState<CountryApi[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [leagues, setLeagues] = useState<LeagueApi[]>([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  const [loadingPrincipais, setLoadingPrincipais] = useState(true);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingLeagues, setLoadingLeagues] = useState(false);
  const [error, setError] = useState("");

  // Contexto dos campeonatos fixos
  const { isFixed } = useFixedChampionships();

  useEffect(() => {
    setLoadingPrincipais(true);
    fetch("/api/football/campeonatos/lista-alguns-campeonatos")
      .then((res) => res.json())
      .then((data) => setPrincipais(data.response || []))
      .catch(() => setError("Erro ao carregar principais campeonatos."))
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
      .catch(() => setError("Erro ao carregar campeonatos do país."))
      .finally(() => setLoadingLeagues(false));
  }, [selectedCountry]);

  // Função utilitária para renderizar um campeonato com Pin e Share
  function renderLeagueCard(c: LeagueApi) {
    return (
      <div
        key={c.league.id}
        className={CATEGORIA_CARD + " league-preview-grid-item"}
        style={{ userSelect: "none" }}
      >
        {c.league.logo && (
          <img
            src={c.league.logo}
            alt={c.league.name}
            className={CATEGORIA_CARD_IMG}
            loading="lazy"
          />
        )}
        <div className="flex flex-col flex-1">
          <Link
            href={`/campeonatos/${c.league.id}`}
            className={CATEGORIA_CARD_NOME + " hover:underline focus:underline text-zinc-900 dark:text-zinc-100"}
            style={{ width: "fit-content", cursor: "pointer" }}
            tabIndex={0}
          >
            {c.league.name}
          </Link>
          <span className={CATEGORIA_CARD_INFO}>{c.country.name}</span>
        </div>
        <div className="flex flex-col items-end gap-1 mb-1 max-w-full ml-2">
          <PinButton id={c.league.id} />
          <ShareButtonCampeonato id={c.league.id} showText={true} />
        </div>
      </div>
    );
  }

  return (
    <ContainerPage>
      <h1 className="text-2xl font-bold text-center mb-6">Campeonatos</h1>

      {/* Filtros */}
      <form
        className={CATEGORIA_FILTROS}
        onSubmit={e => { e.preventDefault(); }}
      >
        <select
          className={CATEGORIA_INPUT + " mr-2"}
          value={selectedCountry}
          onChange={e => setSelectedCountry(e.target.value)}
        >
          <option value="">País</option>
          {countries.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
        <select
          className={CATEGORIA_INPUT + " mr-2"}
          value={selectedLeagueId ?? ""}
          onChange={e => setSelectedLeagueId(e.target.value ? Number(e.target.value) : null)}
          disabled={!selectedCountry || loadingLeagues || leagues.length === 0}
        >
          <option value="">Campeonato</option>
          {leagues.map((league: any) => (
            <option key={league.league.id} value={league.league.id}>{league.league.name}</option>
          ))}
        </select>
        <button
          type="submit"
          className={CATEGORIA_BOTAO}
          disabled={loadingCountries || loadingLeagues}
        >
          Filtrar
        </button>
      </form>

      <h2 className="text-lg font-semibold mb-2">Principais Campeonatos</h2>
      <div className={CATEGORIA_GRID}>
        {loadingPrincipais ? (
          Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="h-[46px] bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg" />
          ))
        ) : principais.length === 0 ? (
          <div className={CATEGORIA_AUX + " col-span-full"}>Nenhum campeonato encontrado.</div>
        ) : (
          principais.map(renderLeagueCard)
        )}
      </div>

      {selectedLeagueId && (
        <div className={CATEGORIA_GRID + " mt-4"}>
          {loadingLeagues ? (
            <span>Carregando campeonatos...</span>
          ) : leagues
              .filter((l) => l.league.id === selectedLeagueId)
              .length === 0 ? (
            <div className={CATEGORIA_AUX + " col-span-full"}>
              Nenhum campeonato encontrado para este país.
            </div>
          ) : (
            leagues
              .filter((l) => l.league.id === selectedLeagueId)
              .map(renderLeagueCard)
          )}
        </div>
      )}

      {error && <div className="text-red-500 text-center my-10">{error}</div>}

      {/* Sombra igual ao sidebar-preview-item */}
      <style jsx global>{`
        .league-preview-grid-item {
          box-shadow: 0 1px 5px 0 #1c22320a !important;
        }
        .league-preview-grid-item:hover,
        .league-preview-grid-item:focus-visible {
          box-shadow: 0 1px 5px 0 #1c22320a !important;
          border-color: hsl(var(--accent-foreground, 219 89% 64%));
        }
        .dark .league-preview-grid-item {
          box-shadow: 0 1px 5px 0 #0003 !important;
        }
        .dark .league-preview-grid-item:hover,
        .dark .league-preview-grid-item:focus-visible {
          box-shadow: 0 1px 5px 0 #0003 !important;
          border-color: hsl(var(--accent-foreground, 219 89% 64%));
        }
      `}</style>
    </ContainerPage>
  );
}