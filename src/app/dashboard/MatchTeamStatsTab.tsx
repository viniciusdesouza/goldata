"use client";

import { useEffect, useState } from "react";

// Tipos detalhados da resposta da API-Football para estatísticas do time
type Team = {
  id: number;
  name: string;
  logo: string;
};

type Fixtures = {
  played: { home: number; away: number; total: number };
  wins: { home: number; away: number; total: number };
  draws: { home: number; away: number; total: number };
  loses: { home: number; away: number; total: number };
};

type Goals = {
  for: {
    total: { home: number; away: number; total: number };
    average: { home: string; away: string; total: string };
  };
  against: {
    total: { home: number; away: number; total: number };
    average: { home: string; away: string; total: string };
  };
};

type CleanSheet = {
  home: number;
  away: number;
  total: number;
};

type FailedToScore = {
  home: number;
  away: number;
  total: number;
};

type Penalty = {
  scored: { total: number; percentage: string };
  missed: { total: number; percentage: string };
  total: number;
};

type Lineup = {
  formation: string;
  played: number;
};

type TeamStats = {
  team?: Team;
  fixtures?: Fixtures;
  goals?: Goals;
  clean_sheet?: CleanSheet;
  failed_to_score?: FailedToScore;
  penalty?: Penalty;
  lineups?: Lineup[];
};

type ApiResponse = {
  response?: TeamStats;
  error?: string;
};

interface MatchTeamStatsTabProps {
  teamId: string;
  league: string;
  season: string;
}

// Função para cor dos números, padrão H2H
function getStatColor(label: string, value: any) {
  if (typeof value !== "number" && typeof value !== "string") return "bg-gray-100 text-gray-700";
  if (
    /vit[óo]ria/i.test(label)
  ) return "bg-green-500 text-white";
  if (
    /derrota/i.test(label)
  ) return "bg-red-500 text-white";
  if (
    /empate/i.test(label)
  ) return "bg-yellow-400 text-white";
  if (
    /gol.*marcado/i.test(label)
  ) return "bg-blue-500 text-white";
  if (
    /gol.*sofrido/i.test(label)
  ) return "bg-red-600 text-white";
  if (
    /clean.?sheet/i.test(label)
  ) return "bg-green-400 text-white";
  if (
    /jogos sem marcar/i.test(label)
  ) return "bg-gray-400 text-white";
  if (
    /p[êe]nalti.*convertido/i.test(label)
  ) return "bg-green-600 text-white";
  if (
    /p[êe]nalti.*perdido/i.test(label)
  ) return "bg-red-700 text-white";
  return "bg-blue-100 text-blue-700";
}

export default function MatchTeamStatsTab({ teamId, league, season }: MatchTeamStatsTabProps) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId || !league || !season) return;
    setLoading(true);
    fetch(`/api/football/statistics/team?team=${teamId}&league=${league}&season=${season}`)
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
      <div className="flex justify-center items-center py-8 text-sm text-gray-500">
        Carregando estatísticas...
      </div>
    );
  if (err)
    return (
      <div className="py-6 text-center text-red-600 font-semibold text-sm">
        Erro ao carregar estatísticas: {err}
      </div>
    );
  if (!data?.response)
    return (
      <div className="py-6 text-center text-gray-400 text-sm">
        Nenhuma estatística encontrada.
      </div>
    );

  const stats = data.response;

  // Monta o array de estatísticas simples para layout minimalista (Google style)
  const simpleStats = [
    {
      label: "Jogos disputados",
      value: stats.fixtures?.played?.total,
    },
    {
      label: "Vitórias",
      value: stats.fixtures?.wins?.total,
    },
    {
      label: "Empates",
      value: stats.fixtures?.draws?.total,
    },
    {
      label: "Derrotas",
      value: stats.fixtures?.loses?.total,
    },
    {
      label: "Gols marcados",
      value: stats.goals?.for?.total?.total,
    },
    {
      label: "Gols sofridos",
      value: stats.goals?.against?.total?.total,
    },
    {
      label: "Média gols marcados",
      value: stats.goals?.for?.average?.total,
    },
    {
      label: "Média gols sofridos",
      value: stats.goals?.against?.average?.total,
    },
    {
      label: "Clean sheets",
      value: stats.clean_sheet?.total,
    },
    {
      label: "Jogos sem marcar",
      value: stats.failed_to_score?.total,
    },
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
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow border border-gray-100 px-2 py-2">
      <div className="flex items-center justify-center gap-3 mb-3">
        {stats.team?.logo && (
          <img
            src={stats.team.logo}
            alt={stats.team.name}
            className="w-6 h-6 rounded-full border"
          />
        )}
        <span className="text-base font-bold text-gray-900 truncate">
          {stats.team?.name ?? "-"}
        </span>
        <span className="text-xs text-gray-500 ml-2">
          Temporada {season}
        </span>
      </div>
      <ul className="space-y-1">
        {simpleStats.map(
          (stat) =>
            stat.value !== undefined &&
            stat.value !== null && (
              <li
                key={stat.label}
                className="flex items-center justify-between px-2 py-2 hover:bg-gray-50 rounded text-xs border-b border-gray-50 last:border-none"
              >
                <div className="text-gray-700 font-medium truncate">{stat.label}</div>
                <div className="flex items-center gap-2">
                  {/* Se for número, aplica cor padrão H2H, fonte bold, padding, borda arredondada */}
                  {typeof stat.value === "number" || /^\d+(\.\d+)?( \(.+\))?$/.test(String(stat.value)) ? (
                    <span
                      className={
                        "font-bold px-2 py-1 rounded-lg text-xs " +
                        getStatColor(stat.label, stat.value)
                      }
                    >
                      {stat.value}
                    </span>
                  ) : (
                    <span className="font-bold text-gray-800">{stat.value}</span>
                  )}
                </div>
              </li>
            )
        )}
        {/* Formações mais utilizadas */}
        {stats.lineups && stats.lineups.length > 0 && (
          <li className="flex flex-col px-2 py-2 hover:bg-gray-50 rounded text-xs border-b border-gray-50 last:border-none">
            <div className="text-gray-700 font-medium mb-1">Formações mais usadas</div>
            <div className="flex flex-wrap gap-2">
              {stats.lineups
                .sort((a, b) => b.played - a.played)
                .slice(0, 3)
                .map((l) => (
                  <span
                    key={l.formation}
                    className="inline-flex items-center bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full font-bold text-xs shadow"
                  >
                    {l.formation}
                    <span className="ml-2 bg-blue-800 text-white rounded-full px-2 py-0.5 text-xs font-semibold">
                      {l.played}x
                    </span>
                  </span>
                ))}
              {stats.lineups.length > 3 && (
                <span className="inline-block text-xs text-gray-400 ml-2 align-middle">
                  +{stats.lineups.length - 3} outras
                </span>
              )}
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}