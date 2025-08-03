"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import PinButton from "@/components/campeonatos/PinButton";
import ShareButtonCampeonato from "@/components/campeonatos/ShareButtonCampeonato";

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

export default function CampeonatosGrid() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/football/campeonatos/lista-alguns-campeonatos")
      .then(res => res.json())
      .then(data => setLeagues((data.response || []).slice(0, 10)))
      .catch(() => setLeagues([]))
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
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-[50px] bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg" />
            ))
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