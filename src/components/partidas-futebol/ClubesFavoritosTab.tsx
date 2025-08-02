"use client";
import { useEffect, useState } from "react";
import { useFixedClubes } from "@/components/pesquisa-clubes/FixedClubesContext";
import MatchItem from "@/components/partidas-futebol/MatchItem";
import EmptySeguindoMessage from "./EmptySeguindoMessage";

const POLLING_INTERVAL = 120000; // 2 minutos

// --- Definição de Tipos ---
interface ClubInfo {
  id: number;
  name: string;
  logo: string;
  founded?: number;
}

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
    logo: string;
    season: number;
    round: string;
    country: string; // CORREÇÃO FINAL: Adicionando a propriedade 'country' que estava faltando.
  };
  teams: {
    home: ClubInfo;
    away: ClubInfo;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}

const PAGE_SIZE = 3;

function ClubMatchesPaginated({ clubId }: { clubId: number }) {
  const [clubInfo, setClubInfo] = useState<ClubInfo | null>(null);
  const [tab, setTab] = useState<"anteriores" | "proximas">("proximas");
  const [matches, setMatches] = useState<Match[]>([]);
  const [offset, setOffset] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async (newOffset: number, replace = false) => {
    setLoading(true);
    setFinished(false);
    const season = new Date().getFullYear();
    const params = new URLSearchParams({
      team: String(clubId),
      season: String(season),
      offset: String(newOffset),
      limit: String(PAGE_SIZE),
    });
    if (tab === "anteriores") params.append("last", String(PAGE_SIZE));
    else params.append("next", String(PAGE_SIZE));
    
    const res = await fetch(`/api/football/pesquisa-clubes/fixtures?${params.toString()}`);
    const data = await res.json();
    const novos: Match[] = data.response || [];
    
    setMatches((prev) => (replace ? novos : [...prev, ...novos]));
    setOffset(newOffset + novos.length);
    setFinished(novos.length < PAGE_SIZE);
    setLoading(false);
  };

  const fetchClubInfo = async () => {
    const res = await fetch(`/api/football/pesquisa-clubes/teams?id=${clubId}`);
    const data = await res.json();
    setClubInfo(data.response?.[0]?.team || null);
  };

  useEffect(() => {
    setMatches([]);
    setOffset(0);
    setFinished(false);
    setLoading(true);
    fetchClubInfo();
    fetchMatches(0, true);
    // eslint-disable-next-line
  }, [clubId, tab]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMatches(0, true);
    }, POLLING_INTERVAL);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [clubId, tab]);

  function handleTabChange(newTab: "anteriores" | "proximas") {
    if (tab !== newTab) {
      setTab(newTab);
    }
  }

  function handleVerMais() {
    if (!finished && !loading) fetchMatches(offset, false);
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 mb-6 w-full p-4">
      <div className="flex items-center gap-3 mb-4">
        {clubInfo?.logo && (
          <img src={clubInfo.logo} alt={clubInfo.name} className="w-8 h-8 rounded-full border bg-white" />
        )}
        <span className="text-xl font-bold text-zinc-800 dark:text-zinc-100 truncate">
          {clubInfo?.name || `Clube ${clubId}`}
        </span>
      </div>
      
      <div className="flex items-center justify-end gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded-md text-sm font-semibold border transition ${
            tab === "anteriores"
              ? "bg-zinc-800 text-white border-zinc-800 shadow"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
          onClick={() => handleTabChange("anteriores")}
          disabled={loading}
        >
          Anteriores
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm font-semibold border transition ${
            tab === "proximas"
              ? "bg-zinc-800 text-white border-zinc-800 shadow"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
          onClick={() => handleTabChange("proximas")}
          disabled={loading}
        >
          Próximas
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {matches.length === 0 && !loading && (
          <div className="text-zinc-500 text-center py-8">Nenhuma partida encontrada.</div>
        )}
        {matches.map((match, idx) => (
          <div key={match.fixture.id}>
            <MatchItem match={match} />
            {idx < matches.length - 1 && (
              <div className="w-full h-px mt-4 mb-2 bg-zinc-200 dark:bg-zinc-800" />
            )}
          </div>
        ))}
        {matches.length > 0 && !finished && (
          <button
            className="self-center mt-2 px-4 py-2 rounded-lg bg-zinc-800 text-white font-semibold shadow transition hover:bg-zinc-700 disabled:opacity-60"
            onClick={handleVerMais}
            disabled={loading}
          >
            {loading ? "Carregando..." : "Ver mais"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ClubesFavoritosTab({
  EmptyComponent,
}: {
  EmptyComponent?: React.ReactNode;
} = {}) {
  const { fixed } = useFixedClubes();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  }, [fixed]);

  if (loading) {
    return <div className="py-8 text-center text-zinc-500">Carregando clubes...</div>;
  }
  if (!fixed.length) {
    return EmptyComponent || (
      <EmptySeguindoMessage title="Nenhum clube favorito.">
        Siga clubes para acompanhar aqui!
      </EmptySeguindoMessage>
    );
  }

  return (
    <div className="space-y-6 w-full pb-16">
      {fixed.map((clubId) => (
        <ClubMatchesPaginated key={clubId} clubId={clubId} />
      ))}
    </div>
  );
}
