"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Player {
  player: {
    id: number;
    name: string;
    photo: string;
    nationality: string;
  };
}

export default function JogadoresGrid() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/football/pesquisa-jogadores/players?club=121&season=2024")
      .then(res => res.json())
      .then(json => setPlayers((json.response || []).slice(0, 10)))
      .catch(() => setPlayers([]))
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
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-[50px] bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg" />
            ))
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