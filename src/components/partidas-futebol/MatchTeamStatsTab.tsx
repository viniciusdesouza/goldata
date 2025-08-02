"use client";

import { useEffect, useState } from "react";

type Team = { id: number; name: string; logo: string };
type Fixtures = {
  played: { home: number; away: number; total: number };
  wins: { home: number; away: number; total: number };
  draws: { home: number; away: number; total: number };
  loses: { home: number; away: number; total: number };
};
type Goals = {
  for: { total: { home: number; away: number; total: number }; average: { home: string; away: string; total: string } };
  against: { total: { home: number; away: number; total: number }; average: { home: string; away: string; total: string } };
};
type CleanSheet = { home: number; away: number; total: number };
type FailedToScore = { home: number; away: number; total: number };
type Penalty = { scored: { total: number; percentage: string }; missed: { total: number; percentage: string }; total: number };
type Lineup = { formation: string; played: number };
type TeamStats = {
  team?: Team;
  fixtures?: Fixtures;
  goals?: Goals;
  clean_sheet?: CleanSheet;
  failed_to_score?: FailedToScore;
  penalty?: Penalty;
  lineups?: Lineup[];
};
type ApiResponse = { response?: TeamStats; error?: string };
interface MatchTeamStatsTabProps {
  teamId: string;
  league: string;
  season: string;
}

function getStatBadgeClass(label: string, value: any) {
  // Vitória — manter com fundo preto, branco e fonte bold
  if (/vit[óo]ria/i.test(label) && Number(value) > 0)
    return "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-sm font-bold border border-black bg-black text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900";

  // Para os demais badges: borda cinza, fundo cinza claro, texto preto, fonte bold (igual seu exemplo)
  return "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-sm font-bold border border-zinc-400 bg-zinc-100 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100";
}

export default function MatchTeamStatsTab({ teamId, league, season }: MatchTeamStatsTabProps) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId || !league || !season) return;
    setLoading(true);
    fetch(`/api/football/partidas-futebol/statistics/team?team=${teamId}&league=${league}&season=${season}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setErr(json.error || null);
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [teamId, league, season]);

  if (loading)
    return (
      <div className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl mt-2 p-4 w-full max-w-[850px] mx-auto">
        <div className="text-center text-[15px] py-10 text-zinc-800 dark:text-zinc-200 font-semibold">
          Carregando estatísticas...
        </div>
      </div>
    );
  if (err)
    return (
      <div className="border border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900 rounded-2xl mt-2 p-4 w-full max-w-[850px] mx-auto">
        <div className="text-center py-10 text-red-700 dark:text-red-200 font-bold text-[15px]">
          Erro ao carregar estatísticas: {err}
        </div>
      </div>
    );
  if (!data?.response)
    return (
      <div className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl mt-2 p-4 w-full max-w-[850px] mx-auto">
        <div className="text-center text-[15px] py-10 text-zinc-800 dark:text-zinc-200 font-semibold">
          Nenhuma estatística encontrada.
        </div>
      </div>
    );

  const stats = data.response;

  const simpleStats = [
    { label: "Jogos disputados", value: stats.fixtures?.played?.total },
    { label: "Vitórias", value: stats.fixtures?.wins?.total },
    { label: "Empates", value: stats.fixtures?.draws?.total },
    { label: "Derrotas", value: stats.fixtures?.loses?.total },
    { label: "Gols marcados", value: stats.goals?.for?.total?.total },
    { label: "Gols sofridos", value: stats.goals?.against?.total?.total },
    { label: "Média gols marcados", value: stats.goals?.for?.average?.total },
    { label: "Média gols sofridos", value: stats.goals?.against?.average?.total },
    { label: "Clean sheets", value: stats.clean_sheet?.total },
    { label: "Jogos sem marcar", value: stats.failed_to_score?.total },
    ...(stats.penalty
      ? [
          {
            label: "Pênaltis convertidos",
            value:
              stats.penalty.scored?.total !== undefined
                ? `${stats.penalty.scored.total} (${stats.penalty.scored.percentage})`
                : "-",
          },
          {
            label: "Pênaltis perdidos",
            value:
              stats.penalty.missed?.total !== undefined
                ? `${stats.penalty.missed.total} (${stats.penalty.missed.percentage})`
                : "-",
          },
        ]
      : []),
  ];

  return (
    <div className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl mt-2 p-4 w-full max-w-[850px] mx-auto">
      <div className="font-bold text-zinc-800 dark:text-zinc-100 mb-3 text-center text-[15px]">
        Estatísticas do time
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-center gap-3 mb-3">
          {stats.team?.logo && (
            <img
              src={stats.team.logo}
              alt={stats.team.name}
              className="w-9 h-9 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
            />
          )}
          <span
            className="mt-1 max-w-[90px] text-center text-[13px] text-zinc-800 dark:text-zinc-100 font-bold whitespace-nowrap overflow-hidden"
            style={{ textOverflow: "ellipsis" }}
          >
            {stats.team?.name ?? "-"}
          </span>
          <span className="text-[12px] text-zinc-600 dark:text-zinc-400 ml-2 font-semibold">
            Temporada {season}
          </span>
        </div>
        {simpleStats.map(
          (stat) =>
            stat.value !== undefined &&
            stat.value !== null && (
              <div
                key={stat.label}
                className="flex items-center justify-between px-2 py-1 bg-white dark:bg-zinc-900 rounded-md border border-zinc-300 dark:border-zinc-700"
              >
                <div className="text-[13px] text-zinc-800 dark:text-zinc-100 font-semibold">{stat.label}</div>
                <div className="flex items-center gap-2">
                  <span className={getStatBadgeClass(stat.label, stat.value)}>{stat.value}</span>
                </div>
              </div>
            )
        )}
        {stats.lineups && stats.lineups.length > 0 && (
          <div className="flex flex-col px-2 py-1 bg-white dark:bg-zinc-900 rounded-md border border-zinc-300 dark:border-zinc-700">
            <div className="mb-1 text-[13px] text-zinc-800 dark:text-zinc-100 font-semibold">Formações mais usadas</div>
            <div className="flex flex-wrap gap-2">
              {stats.lineups
                .sort((a, b) => b.played - a.played)
                .slice(0, 3)
                .map((l) => (
                  <span
                    key={l.formation}
                    className="inline-flex items-center bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-2 py-0.5 rounded-full font-bold text-[0.8rem] border border-zinc-300 dark:border-zinc-700"
                  >
                    {l.formation}
                    <span className="ml-2 bg-zinc-900 dark:bg-zinc-600 text-white rounded-full px-2 py-0.5 text-[0.7rem] font-bold border border-zinc-300 dark:border-zinc-700">
                      {l.played}x
                    </span>
                  </span>
                ))}
              {stats.lineups.length > 3 && (
                <span className="inline-block text-[1.05rem] text-zinc-900 dark:text-zinc-100 ml-2 align-middle font-semibold">
                  +{stats.lineups.length - 3} outras
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
