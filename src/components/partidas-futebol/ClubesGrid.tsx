"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import PinButtonClube from "@/components/pesquisa-clubes/PinButtonClube";
import ShareButtonClube from "@/components/pesquisa-clubes/ShareButtonClube";

interface Club {
  team: {
    id: number;
    name: string;
    logo: string;
    country: string;
  };
}

export default function ClubesGrid() {
  const [clubes, setClubes] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/football/clubes?league=71")
      .then(res => res.json())
      .then(data => setClubes((data.response || []).slice(0, 10)))
      .catch(() => setClubes([]))
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
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-[50px] bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg" />
            ))
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