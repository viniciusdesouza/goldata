"use client";

import { useEffect, useState } from "react";

type Team = {
  id: number;
  name: string;
  logo: string;
};

type Fixture = {
  fixture: { id: number; date: string };
  league: { name: string; logo: string; season: number };
  teams: { home: Team; away: Team };
  goals: { home: number; away: number };
};

type H2HApiResponse = {
  response?: Fixture[];
  error?: string;
};

interface MatchH2HTabProps {
  homeId: string;
  awayId: string;
  last?: number;
}

// Função para cor do placar, padrão novo (verde vitória, vermelho derrota, amarelo empate)
function getScoreColor(home: number, away: number, type: "home" | "away") {
  if (home === away) return "bg-yellow-400 text-white";
  if (type === "home") return home > away ? "bg-green-500 text-white" : "bg-red-500 text-white";
  return away > home ? "bg-green-500 text-white" : "bg-red-500 text-white";
}

export default function MatchH2HTab({ homeId, awayId, last = 5 }: MatchH2HTabProps) {
  const [data, setData] = useState<H2HApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!homeId || !awayId) return;
    setLoading(true);
    fetch(`/api/football/statistics/h2h?home=${homeId}&away=${awayId}&last=${last}`)
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
      <div className="flex justify-center items-center py-8 text-sm text-gray-500">
        Carregando confrontos...
      </div>
    );
  if (err)
    return (
      <div className="py-6 text-center text-red-600 font-semibold text-sm">
        Erro ao carregar confrontos: {err}
      </div>
    );
  if (!data?.response || data.response.length === 0)
    return (
      <div className="py-6 text-center text-gray-400 text-sm">
        Nenhum confronto encontrado.
      </div>
    );

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow border border-gray-100 px-2 py-2">
      <div className="text-base font-bold text-gray-900 mb-3 text-center">
        Confrontos recentes
      </div>
      <ul className="space-y-1">
        {data.response.map((match) => {
          const { home, away } = match.goals;
          const date = new Date(match.fixture.date).toLocaleDateString("pt-BR");
          return (
            <li
              key={match.fixture.id}
              className="flex items-center justify-between px-2 py-2 hover:bg-gray-50 rounded text-xs border-b border-gray-50 last:border-none"
            >
              {/* Data */}
              <div className="w-[55px] font-medium text-gray-700 text-xs">
                {date}
              </div>
              {/* Mandante */}
              <div className="flex items-center gap-1 max-w-[90px] truncate">
                <img
                  src={match.teams.home.logo}
                  alt={match.teams.home.name}
                  className="w-5 h-5 rounded-full border"
                />
                <span className="truncate font-medium text-gray-700 text-xs">
                  {match.teams.home.name}
                </span>
              </div>
              {/* Placar */}
              <div className="flex items-center gap-0.5 font-bold">
                <span
                  className={
                    "font-bold px-2 py-1 rounded-lg text-xs " +
                    getScoreColor(home, away, "home")
                  }
                >
                  {home}
                </span>
                <span className="mx-0.5 text-gray-400 font-normal">x</span>
                <span
                  className={
                    "font-bold px-2 py-1 rounded-lg text-xs " +
                    getScoreColor(home, away, "away")
                  }
                >
                  {away}
                </span>
              </div>
              {/* Visitante */}
              <div className="flex items-center gap-1 max-w-[90px] truncate">
                <img
                  src={match.teams.away.logo}
                  alt={match.teams.away.name}
                  className="w-5 h-5 rounded-full border"
                />
                <span className="truncate font-medium text-gray-700 text-xs">
                  {match.teams.away.name}
                </span>
              </div>
              {/* Campeonato */}
              <div className="flex items-center gap-1 min-w-[50px] max-w-[80px] truncate justify-end">
                {match.league.logo && (
                  <img
                    src={match.league.logo}
                    alt={match.league.name || "Liga"}
                    className="w-4 h-4 rounded"
                  />
                )}
                <span
                  className="truncate font-medium text-gray-700 text-xs"
                  title={match.league.name || "Desconhecido"}
                >
                  {match.league.name
                    ? match.league.name.length > 12
                      ? match.league.name.slice(0, 11) + "…"
                      : match.league.name
                    : ""}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}