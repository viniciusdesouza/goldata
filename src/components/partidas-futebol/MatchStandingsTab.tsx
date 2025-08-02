"use client";

import React, { useRef, useEffect } from "react";

// --- Definição de Tipos ---
interface TeamStanding {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  goalsDiff?: number;
  group?: string;
  all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
}

interface Match {
  league: { id: number };
  teams: { home: { id: number }; away: { id: number } };
}

interface MatchStandingsTabProps {
  match: Match;
  standings?: { [leagueId: number]: TeamStanding[][] };
  loadingStandings?: { [leagueId: number]: boolean };
}

function highlightStandingsRow(teamId: number, homeId: number, awayId: number) {
  return teamId === homeId || teamId === awayId
    ? "border-zinc-600 bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800"
    : "";
}

const numberStatClass = "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-sm border font-bold border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-[15px]";
const numberStatClassNeutral = "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-sm font-semibold bg-transparent text-zinc-700 dark:text-zinc-300 text-[15px]";

export default function MatchStandingsTab({
  match,
  standings = {},
  loadingStandings = {},
}: MatchStandingsTabProps) {
  const leagueId = match.league.id;
  const homeId = match.teams.home.id;
  const awayId = match.teams.away.id;
  const loading = loadingStandings[leagueId];
  const groups: TeamStanding[][] = standings[leagueId] || [];

  const groupRefs = useRef<{ [groupName: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (loading || !groups.length) return;

    let foundGroupName: string | null = null;
    for (const group of groups) {
      if (group.some(row => row.team.id === homeId || row.team.id === awayId)) {
        foundGroupName = group[0]?.group || `Grupo ${groups.indexOf(group) + 1}`;
        break;
      }
    }
    
    if (foundGroupName && groupRefs.current[foundGroupName]) {
      groupRefs.current[foundGroupName]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [groups, homeId, awayId, loading]);

  function renderStandingsList(groups: TeamStanding[][]) {
    if (!groups || groups.length === 0 || !Array.isArray(groups[0])) {
      return (
        <div className="text-[14px] text-zinc-600 dark:text-zinc-300 italic text-center py-4">
          Classificação não disponível para esta liga.
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-6 mt-2">
        {groups.map((group, idx) => {
          const groupName = group[0]?.group || `Grupo ${idx + 1}`;
          return (
            <div
              key={groupName}
              // CORREÇÃO: A função ref agora tem um corpo e não retorna um valor.
              ref={el => { groupRefs.current[groupName] = el; }}
              className="overflow-x-auto"
            >
              {groupName && (
                <div className="mb-2 text-[14px] font-bold text-zinc-800 dark:text-zinc-100 pl-2">
                  {groupName}
                </div>
              )}
              <ul className="flex flex-col gap-1 w-full min-w-[400px]">
                <li className="flex items-center px-3 py-1 text-[14px] font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 rounded-t-md select-none">
                  <span className="w-5 text-center">#</span>
                  <span className="flex-1 ml-2 text-left">Equipe</span>
                  <span className="w-7 text-center">Pts</span>
                  <span className="w-5 text-center">PJ</span>
                  <span className="w-5 text-center">V</span>
                  <span className="w-5 text-center">E</span>
                  <span className="w-5 text-center">D</span>
                  <span className="w-7 text-center">GP</span>
                  <span className="w-7 text-center">GC</span>
                  <span className="w-7 text-center">SG</span>
                </li>
                {group.map((row) => (
                  <li
                    key={row.team.id}
                    className={
                      "flex items-center px-3 py-1 border bg-white dark:bg-zinc-900 rounded-md border-zinc-300 dark:border-zinc-700 text-[14px] " +
                      highlightStandingsRow(row.team.id, homeId, awayId)
                    }
                  >
                    <span className={numberStatClassNeutral + " w-5 text-center"}>{row.rank}</span>
                    <span className="flex-1 flex items-center gap-2 ml-2 text-left">
                      <img
                        src={row.team.logo}
                        alt={row.team.name}
                        className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                        loading="eager"
                      />
                      <span className="mt-0.5 max-w-[100px] truncate text-[14px] text-zinc-900 dark:text-zinc-100 font-semibold">
                        {row.team.name}
                      </span>
                    </span>
                    <span className={numberStatClass + " w-7 text-center"}>{row.points}</span>
                    <span className={numberStatClassNeutral + " w-5 text-center"}>{row.all.played}</span>
                    <span className={numberStatClassNeutral + " w-5 text-center"}>{row.all.win}</span>
                    <span className={numberStatClassNeutral + " w-5 text-center"}>{row.all.draw}</span>
                    <span className={numberStatClassNeutral + " w-5 text-center"}>{row.all.lose}</span>
                    <span className={numberStatClassNeutral + " w-7 text-center"}>{row.all.goals.for}</span>
                    <span className={numberStatClassNeutral + " w-7 text-center"}>{row.all.goals.against}</span>
                    <span className={numberStatClassNeutral + " w-7 text-center"}>{row.goalsDiff ?? (row.all.goals.for - row.all.goals.against)}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl mt-2 p-4 w-full max-w-[850px] mx-auto">
      <div className="font-bold text-zinc-800 dark:text-zinc-100 mb-3 text-center text-[16px]">
        Classificação
      </div>
      {loading ? (
        <div className="text-[14px] text-zinc-600 dark:text-zinc-300 text-center py-3">Carregando classificação...</div>
      ) : (
        renderStandingsList(groups)
      )}
    </div>
  );
}
