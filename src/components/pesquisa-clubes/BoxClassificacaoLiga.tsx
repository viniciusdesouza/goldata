import React from "react";
import Link from "next/link";

interface TeamStanding {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  form?: string;
  group?: string;
}

interface BoxClassificacaoLigaProps {
  classificacao: TeamStanding[];
  clubeId?: number;
}

function renderFormIcons(form?: string) {
  if (!form) return null;
  return (
    <div className="flex gap-1 justify-end min-w-[92px]">
      {form.split("").slice(-5).map((res, i) => {
        let color = "";
        let label = "";
        let translated = res;
        if (res === "W") {
          color = "bg-blue-400 dark:bg-blue-500 border-blue-300 dark:border-blue-500 text-white";
          label = "Vitória";
          translated = "V";
        } else if (res === "D") {
          color = "bg-yellow-400 dark:bg-yellow-500 border-yellow-300 dark:border-yellow-500 text-white";
          label = "Empate";
          translated = "E";
        } else if (res === "L") {
          color = "bg-red-400 dark:bg-red-500 border-red-300 dark:border-red-500 text-white";
          label = "Derrota";
          translated = "D";
        }
        return (
          <span
            key={i}
            className={`w-5 h-5 rounded-full border text-[12px] flex items-center justify-center font-bold ${color}`}
            title={label}
          >
            {translated}
          </span>
        );
      })}
    </div>
  );
}

export default function BoxClassificacaoLiga({ classificacao, clubeId }: BoxClassificacaoLigaProps) {
  // Agrupamento: Se houver grupos, divide em grupos, senão faz um array com um grupo só
  let grupos: TeamStanding[][] = [];
  if (Array.isArray(classificacao) && classificacao.length > 0) {
    // Se todos tiverem campo group, agrupa por group
    if (classificacao.some((c) => c.group)) {
      const groupMap: { [group: string]: TeamStanding[] } = {};
      classificacao.forEach((c) => {
        const group = c.group || "Grupo Único";
        if (!groupMap[group]) groupMap[group] = [];
        groupMap[group].push(c);
      });
      grupos = Object.values(groupMap);
    } else {
      grupos = [classificacao];
    }
  }

  if (!grupos.length || !grupos[0].length) {
    return (
      <div className="text-zinc-700 dark:text-zinc-300 py-8 text-center">
        Nenhuma classificação disponível para esta temporada.
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
      <div className="flex flex-col gap-5 w-full">
        {grupos.map((group, idx) => {
          const groupName = group[0]?.group || (grupos.length > 1 ? `Grupo ${idx + 1}` : null);
          return (
            <div key={groupName ?? idx} className="w-full">
              {grupos.length > 1 && groupName && (
                <div className="mb-2 text-[14px] font-bold text-blue-800 dark:text-blue-100 pl-2">
                  {groupName}
                </div>
              )}
              <ul className="flex flex-col gap-1 w-full">
                {/* Cabeçalho */}
                <li className="flex items-center px-2 py-1 text-[14px] font-semibold text-blue-900 dark:text-blue-100 border-b border-zinc-200 dark:border-zinc-700 bg-blue-50 dark:bg-blue-950 rounded-t-xl select-none">
                  <span className="w-6 text-center">#</span>
                  <span className="flex-[1.5] ml-2 text-left">Clube</span>
                  <span className="w-8 text-center">Pts</span>
                  <span className="w-6 text-center">J</span>
                  <span className="w-6 text-center">V</span>
                  <span className="w-6 text-center">E</span>
                  <span className="w-6 text-center">D</span>
                  <span className="w-8 text-center">GP</span>
                  <span className="w-8 text-center">GC</span>
                  <span className="w-8 text-center">SG</span>
                  <span className="flex-[1.1] text-end">Últ. 5</span>
                </li>
                {group.map((team) => (
                  <li
                    key={team.team.id}
                    className={[
                      "flex items-center px-2 py-1 text-[14px] border border-zinc-200 dark:border-zinc-800 rounded-md w-full transition",
                      clubeId && team.team.id === clubeId
                        ? "bg-blue-100 dark:bg-blue-900 font-bold"
                        : "",
                      team.rank % 2 === 0
                        ? "bg-white dark:bg-zinc-900"
                        : "bg-gray-50 dark:bg-zinc-800"
                    ].join(" ")}
                  >
                    <span className="w-6 text-center font-medium">{team.rank}</span>
                    <span className="flex-[1.5] flex items-center gap-2 ml-2 text-left overflow-hidden">
                      <img
                        src={team.team.logo}
                        alt={team.team.name}
                        className="w-6 h-6 rounded-full border bg-white shrink-0"
                        loading="eager"
                        style={{ background: "#fff" }}
                      />
                      <Link
                        href={`/clubes/${team.team.id}`}
                        className="font-medium text-zinc-700 dark:text-zinc-200 hover:underline transition whitespace-nowrap overflow-hidden text-ellipsis"
                        style={{ fontSize: 14 }}
                      >
                        {team.team.name}
                      </Link>
                    </span>
                    <span className="w-8 text-center font-bold text-blue-800 dark:text-blue-100">{team.points}</span>
                    <span className="w-6 text-center">{team.all.played}</span>
                    <span className="w-6 text-center">{team.all.win}</span>
                    <span className="w-6 text-center">{team.all.draw}</span>
                    <span className="w-6 text-center">{team.all.lose}</span>
                    <span className="w-8 text-center">{team.all.goals.for}</span>
                    <span className="w-8 text-center">{team.all.goals.against}</span>
                    <span className="w-8 text-center">{team.goalsDiff ?? (team.all.goals.for - team.all.goals.against)}</span>
                    <span className="flex-[1.1] flex justify-end">{renderFormIcons(team.form)}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}