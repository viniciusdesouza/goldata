"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MatchesLive from "./MatchesLive";
import PinButtonClube from "@/components/pesquisa-clubes/PinButtonClube";
import ShareButtonClube from "@/components/pesquisa-clubes/ShareButtonClube";
import PinButton from "@/components/campeonatos/PinButton";
import ShareButtonCampeonato from "@/components/campeonatos/ShareButtonCampeonato";

// --- Definição de Tipos ---
interface Club {
  team: {
    id: number;
    name: string;
    logo: string;
    country: string;
  };
}

interface League {
  league: {
    id: number;
    name: string;
    logo: string;
  };
  country: {
    name: string;
  };
}

interface Player {
  player: {
    id: number;
    name: string;
    photo: string;
    nationality: string;
  };
}

type MainTab = "clubes" | "campeonatos" | "jogadores";
type PartidasTab = "aoVivo" | "programada" | "terminados";

// ---- Tabs ----
const PARTIDAS_TABS: { key: PartidasTab; label: string }[] = [
  { key: "aoVivo", label: "Ao Vivo" },
  { key: "programada", label: "Programada" },
  { key: "terminados", label: "Terminados" },
];

const GRID_TABS: { key: MainTab; label: string }[] = [
  { key: "clubes", label: "Clubes" },
  { key: "campeonatos", label: "Campeonatos" },
  { key: "jogadores", label: "Jogadores" },
];

// ---- Clubes Grid ----
function ClubesGrid() {
  const [clubes, setClubes] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/football/clubes?league=71")
      .then(res => res.json())
      .then(data => setClubes((data.response || []).slice(0, 10)))
      .catch(() => console.error("Erro ao carregar clubes."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Descobrir Clubes</h2>
        <Link href="/clubes" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
          Pesquisar mais
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-[50px] bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg" />)
          : clubes.map(c => (
              <div key={c.team.id} className="flex items-center p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <img src={c.team.logo} alt={c.team.name} className="w-8 h-8 mr-3 object-contain" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <Link href={`/clubes/${c.team.id}`} className="font-semibold text-sm truncate hover:underline">{c.team.name}</Link>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">{c.team.country}</div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <PinButtonClube id={c.team.id} />
                  <ShareButtonClube id={c.team.id} />
                </div>
              </div>
            ))}
      </div>
    </section>
  );
}

// ---- Campeonatos Grid ----
function CampeonatosGrid() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/football/campeonatos/lista-alguns-campeonatos")
      .then(res => res.json())
      .then(data => setLeagues((data.response || []).slice(0, 10)))
      .catch(() => console.error("Erro ao carregar campeonatos."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Descobrir Campeonatos</h2>
        <Link href="/campeonatos" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
          Pesquisar mais
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-[50px] bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg" />)
          : leagues.map(l => (
              <div key={l.league.id} className="flex items-center p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <img src={l.league.logo} alt={l.league.name} className="w-8 h-8 mr-3 object-contain" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <Link href={`/campeonatos/${l.league.id}`} className="font-semibold text-sm truncate hover:underline">{l.league.name}</Link>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">{l.country.name}</div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <PinButton id={l.league.id} />
                  <ShareButtonCampeonato id={l.league.id} showText={false} />
                </div>
              </div>
            ))}
      </div>
    </section>
  );
}

// ---- Jogadores Grid ----
function JogadoresGrid() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/football/pesquisa-jogadores/players?club=121&season=2024`)
      .then(res => res.json())
      .then(json => setPlayers((json.response || []).slice(0, 10)))
      .catch(() => console.error("Erro ao carregar jogadores."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Descobrir Jogadores</h2>
        <Link href="/pesquisa-jogadores" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
          Pesquisar mais
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-[50px] bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg" />)
          : players.map(p => (
              <Link href={`/pesquisa-jogadores/${p.player.id}`} key={p.player.id} className="flex items-center p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-400">
                <img src={p.player.photo} alt={p.player.name} className="w-8 h-8 mr-3 rounded-full object-cover" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{p.player.name}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">{p.player.nationality}</div>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}

// ---- Main ----
// CORREÇÃO: Adicionando a prop 'expandirPesquisaGlobal' para resolver o erro.
export default function ParaVoceHomeGrids({ expandirPesquisaGlobal, selectedDate }: { expandirPesquisaGlobal?: () => void; selectedDate: Date; }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mainTab, setMainTab] = useState<MainTab>("clubes");

  const tabQuery = searchParams?.get("partidasTab");
  const [tabPartidas, setTabPartidas] = useState<PartidasTab>(() => {
    if (tabQuery === "programada" || tabQuery === "terminados") {
      return tabQuery;
    }
    return "aoVivo";
  });

  useEffect(() => {
    const newTab = tabQuery === "programada" || tabQuery === "terminados" ? tabQuery : "aoVivo";
    if (newTab !== tabPartidas) {
      setTabPartidas(newTab);
    }
  }, [tabQuery, tabPartidas]);

  const tabIndex = GRID_TABS.findIndex(t => t.key === mainTab);
  function goToTab(idx: number) {
    if (idx < 0 || idx >= GRID_TABS.length) return;
    setMainTab(GRID_TABS[idx].key);
  }

  function handleTabClick(key: PartidasTab) {
    setTabPartidas(key);
    const params = new URLSearchParams(searchParams?.toString());
    params.set("partidasTab", key);
    router.replace(`?${params.toString()}#partidas-tabs`, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {GRID_TABS.map(t => (
              <button
                key={t.key}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                  mainTab === t.key
                    ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-black dark:border-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
                onClick={() => setMainTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            <button aria-label="Anterior" onClick={() => goToTab(tabIndex - 1)} disabled={tabIndex === 0} className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 transition hover:bg-zinc-200 dark:hover:bg-zinc-700">
              <ChevronLeft size={20} />
            </button>
            <button aria-label="Próxima" onClick={() => goToTab(tabIndex + 1)} disabled={tabIndex === GRID_TABS.length - 1} className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 transition hover:bg-zinc-200 dark:hover:bg-zinc-700">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div>
          {mainTab === "clubes" && <ClubesGrid />}
          {mainTab === "campeonatos" && <CampeonatosGrid />}
          {mainTab === "jogadores" && <JogadoresGrid />}
        </div>
      </div>

      <div id="partidas">
        <h2 className="text-xl font-bold mb-4">Partidas de Futebol</h2>
        <div id="partidas-tabs" className="flex gap-2 mb-4 scroll-mt-[80px]">
          {PARTIDAS_TABS.map(tab => (
            <button
              key={tab.key}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                tabPartidas === tab.key
                  ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-black dark:border-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
              onClick={() => handleTabClick(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {tabPartidas === "aoVivo" && <MatchesLive onlyLive selectedDate={selectedDate} />}
        {tabPartidas === "programada" && <MatchesLive onlyScheduled selectedDate={selectedDate} />}
        {tabPartidas === "terminados" && <MatchesLive onlyFinished selectedDate={selectedDate} />}
      </div>
    </div>
  );
}
