"use client";
import { useResultadosSalvos } from "./ResultadosSalvosContext";
import MatchItem from "@/components/partidas-futebol/MatchItem";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

// --- Definição de Tipos ---
// CORREÇÃO: Usando a mesma interface 'Match' detalhada que o componente MatchItem espera.
interface Match {
  fixture: {
    id: number;
    status: { short: string; };
    date: string;
  };
  league: {
    id: number;
    name: string;
    logo: string;
    round: string;
  };
  teams: {
    home: { id: number; name: string; logo: string };
    away: { id: number; name: string; logo: string };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  id?: number; // Fallback
}

// Idealmente, esta interface deveria ser exportada do arquivo MatchItem.tsx
interface MatchItemProps {
  match: Match;
  showFavoritos?: boolean;
}

// Criando uma versão tipada do MatchItem para uso local
const TypedMatchItem = MatchItem as React.FC<MatchItemProps>;


async function fetchMatchesFull(ids: (number | string)[]): Promise<Match[]> {
  if (!ids.length) return [];
  const res = await fetch(`/api/football/partidas-futebol/fixturesByIds?ids=${ids.join(",")}`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data.response) ? data.response : [];
}

async function fetchAllLive(): Promise<Match[]> {
  const res = await fetch(`/api/football/partidas-futebol/live`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data.response) ? data.response : [];
}

function mergeLiveMatches(fixtures: Match[], liveMatches: Match[]): Match[] {
  const liveMap = new Map<number, Match>();
  for (const live of liveMatches) {
    if (live?.fixture?.id) liveMap.set(live.fixture.id, live);
  }
  return fixtures.map(fix => {
    const id = fix.fixture?.id;
    if (id && liveMap.has(id)) return liveMap.get(id)!;
    return fix;
  });
}

export default function ResultadosPartidas() {
  const { partidas } = useResultadosSalvos();
  const searchParams = useSearchParams();
  const highlight = searchParams?.get("highlight");
  const blocoRef = useRef<HTMLDivElement | null>(null);

  const [fullMatches, setFullMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function updateFullMatches(isInitial = false) {
      if (isInitial) setLoading(true);
      const fixtureIds = partidas.map(p => p.fixture?.id || p.id).filter(Boolean);
      if (!fixtureIds.length) {
        setFullMatches([]);
        setLoading(false);
        return;
      }
      const [fixtures, liveMatches] = await Promise.all([
        fetchMatchesFull(fixtureIds),
        fetchAllLive()
      ]);
      const merged = mergeLiveMatches(fixtures, liveMatches);
      setFullMatches(merged);
      setLoading(false);
    }

    let interval: NodeJS.Timeout | null = null;
    let unsubscribed = false;

    async function initialAndPoll() {
      await updateFullMatches(true);
      interval = setInterval(async () => {
        if (!unsubscribed) {
          await updateFullMatches(false);
        }
      }, 20000);
    }

    initialAndPoll();

    return () => {
      unsubscribed = true;
      if (interval) clearInterval(interval);
    };
  }, [JSON.stringify(partidas.map(p => p.fixture?.id || p.id))]);
  
  useEffect(() => {
    if (highlight === "novo" && blocoRef.current && !loading) {
      const element = blocoRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset;
      const offset = (typeof window !== "undefined" && window.innerWidth >= 768) ? 80 : 112;
      window.scrollTo({ top: y - offset, behavior: "smooth" });
    }
  }, [highlight, loading]);


  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl mt-2 p-4 w-full max-w-[850px] mx-auto">
      <div
        className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-200"
        id="bloco-partidas-salvas"
        ref={blocoRef}
      >
        Resultados de Partidas Salvas
      </div>
      {loading ? (
        <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">Carregando partidas...</div>
      ) : fullMatches.length === 0 ? (
        <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">Nenhuma partida salva.</div>
      ) : (
        <div>
          {fullMatches.map((match, idx) => (
            <div key={match.fixture?.id || match.id || idx}>
              {/* O erro é resolvido aqui pois 'match' agora tem o tipo correto 'Match' */}
              <TypedMatchItem match={match} showFavoritos />
              {idx < fullMatches.length - 1 && (
                <hr className="my-6 border-zinc-200 dark:border-zinc-700" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
