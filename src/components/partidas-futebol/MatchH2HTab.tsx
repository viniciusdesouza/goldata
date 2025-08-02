"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface Fixture {
  fixture: { id: number; date: string };
  league: { name: string; logo: string; season: number; id?: number };
  teams: { home: Team; away: Team };
  goals: { home: number; away: number };
}

interface H2HApiResponse {
  response?: Fixture[];
  error?: string;
}

interface MatchH2HTabProps {
  homeId: string;
  awayId: string;
  last?: number;
}

function getScoreClass(home: number, away: number, type: "home" | "away") {
  const base =
    "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-sm border font-bold";

  if (home === away)
    return `${base} border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100`;

  const isWinner = (type === "home" && home > away) || (type === "away" && away > home);

  if (isWinner) {
    return `${base} border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900`;
  }

  return `${base} border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100`;
}

export default function MatchH2HTab({ homeId, awayId, last = 5 }: MatchH2HTabProps) {
  const [data, setData] = useState<H2HApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!homeId || !awayId) return;
    setLoading(true);
    fetch(`/api/football/partidas-futebol/statistics/h2h?home=${homeId}&away=${awayId}&last=${last}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setErr(json.error || null);
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [homeId, awayId, last]);

  if (loading)
    return (
      <div className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl mt-2 p-4 w-full max-w-[850px] mx-auto">
        <div className="text-[13px] text-zinc-900 dark:text-zinc-100 text-center py-10 font-semibold">
          Carregando confrontos...
        </div>
      </div>
    );

  if (err)
    return (
      <div className="border border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900 rounded-2xl mt-2 p-4 w-full max-w-[850px] mx-auto">
        <div className="text-[13px] text-red-800 dark:text-red-200 text-center py-10 font-bold">
          Erro ao carregar confrontos: {err}
        </div>
      </div>
    );

  if (!data?.response || data.response.length === 0)
    return (
      <div className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl mt-2 p-4 w-full max-w-[850px] mx-auto">
        <div className="text-[13px] text-zinc-900 dark:text-zinc-100 text-center py-10 font-semibold">
          Nenhum confronto encontrado.
        </div>
      </div>
    );

  return (
    <div className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl mt-2 p-4 w-full max-w-[850px] mx-auto">
      <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-3 text-center text-[15px]">
        Confrontos recentes
      </div>
      <div className="flex flex-col gap-1">
        {data.response.map((match) => {
          const { home, away } = match.goals;
          const date = new Date(match.fixture.date).toLocaleDateString("pt-BR");
          const leagueUrl = match.league.id
            ? `/campeonatos/${match.league.id}?season=${match.league.season}`
            : undefined;

          return (
            <div
              key={match.fixture.id}
              className="flex flex-row items-center justify-between bg-white dark:bg-zinc-900 rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-2"
            >
              <div className="flex flex-col min-w-[78px]">
                <span className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">{date}</span>
                <div className="flex items-center gap-1 mt-1">
                  {match.league.logo && (
                    <img
                      src={match.league.logo}
                      alt={match.league.name || "Liga"}
                      className="w-5 h-5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                    />
                  )}
                  {leagueUrl ? (
                    <Link
                      href={leagueUrl}
                      className="text-zinc-800 dark:text-zinc-300 text-[13px] font-semibold max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap hover:underline focus:underline"
                      title={match.league.name || "Desconhecido"}
                    >
                      {match.league.name?.length > 18 ? match.league.name.slice(0, 17) + "…" : match.league.name}
                    </Link>
                  ) : (
                    <span
                      className="text-zinc-800 dark:text-zinc-300 text-[13px] font-semibold max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap"
                      title={match.league.name || "Desconhecido"}
                    >
                      {match.league.name?.length > 18 ? match.league.name.slice(0, 17) + "…" : match.league.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-row items-center justify-center gap-3">
                <div className="flex flex-col items-center min-w-[76px] max-w-[90px]">
                  <img
                    src={match.teams.home.logo}
                    alt={match.teams.home.name}
                    className="w-7 h-7 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                  <span
                    className="mt-1 max-w-[90px] text-center text-[13px] text-zinc-900 dark:text-zinc-100 font-bold whitespace-nowrap overflow-hidden"
                    style={{ textOverflow: "ellipsis" }}
                  >
                    {match.teams.home.name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={getScoreClass(home, away, "home")}>{home}</span>
                  <span className="mx-1 text-zinc-900 dark:text-zinc-100 font-bold text-[15px]">x</span>
                  <span className={getScoreClass(home, away, "away")}>{away}</span>
                </div>

                <div className="flex flex-col items-center min-w-[76px] max-w-[90px]">
                  <img
                    src={match.teams.away.logo}
                    alt={match.teams.away.name}
                    className="w-7 h-7 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                  <span
                    className="mt-1 max-w-[90px] text-center text-[13px] text-zinc-900 dark:text-zinc-100 font-bold whitespace-nowrap overflow-hidden"
                    style={{ textOverflow: "ellipsis" }}
                  >
                    {match.teams.away.name}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
