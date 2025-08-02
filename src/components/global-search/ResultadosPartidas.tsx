"use client";
import { useResultadosSalvos } from "./ResultadosSalvosContext";
import MatchItem from "@/components/partidas-futebol/MatchItem";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

// --- Definição de Tipos ---
interface Match {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
      long: string;
      elapsed?: number;
      extra?: number;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    season: number;
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
}

async function fetchMatchesFull(ids: (number | string)[]): Promise<Match[]> {
  if (!ids.length) return [];
  try {
    const res = await fetch(`/api/football/partidas-futebol/fixturesByIds?ids=${ids.join(",")}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.response) ? data.response : [];
  } catch (error) {
    console.error("Failed to fetch full match data:", error);
    return [];
  }
}

export default function ResultadosPartidas() {
  const { partidas } = useResultadosSalvos();
  const searchParams = useSearchParams();
  const highlight = searchParams?.get("highlight");
  const blocoRef = useRef<HTMLDivElement | null>(null);

  const [fullMatches, setFullMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let isMounted = true;

    const updateFullMatches = async (isInitial = false) => {
      if (isInitial) setLoading(true);
      const fixtureIds = partidas.map(p => p.fixture?.id).filter(Boolean);
      
      if (!fixtureIds.length) {
        if (isMounted) {
          setFullMatches([]);
          setLoading(false);
        }
        return;
      }
      
      const fixtures = await fetchMatchesFull(fixtureIds);
      if (isMounted) {
        setFullMatches(fixtures);
        setLoading(false);
      }
    };

    updateFullMatches(true);
    interval = setInterval(() => updateFullMatches(false), 30000); // Poll every 30 seconds

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [partidas]);

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
            <div key={match.fixture.id || idx}>
              <MatchItem match={match} showFavoritos />
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
