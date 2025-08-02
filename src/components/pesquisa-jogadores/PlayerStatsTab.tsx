import React from "react";

function show(val: number | string | null | undefined) {
  return val !== null && val !== undefined ? val : "—";
}

export default function PlayerStatsTab({ player }: { player: any }) {
  const statsArr = player.statistics || [];
  if (!statsArr.length) return <div className="text-center text-zinc-500">Sem estatísticas disponíveis.</div>;

  return (
    <div className="flex flex-col gap-4 mt-2">
      {statsArr.map((stat: any, idx: number) => (
        <div key={idx} className="border rounded-xl p-3 shadow-sm bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-2 mb-2">
            {stat.league?.logo && (
              <img src={stat.league.logo} alt={stat.league.name} className="w-6 h-6 rounded-sm" />
            )}
            <span className="font-semibold">{stat.league?.name} {stat.league?.season && `(${stat.league.season})`}</span>
            {stat.team?.logo && (
              <>
                <span className="mx-2 text-xs text-zinc-400">|</span>
                <img src={stat.team.logo} alt={stat.team.name} className="w-6 h-6 rounded-full" />
                <span className="font-medium">{stat.team?.name}</span>
              </>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <span>Jogos: <b>{show(stat.games?.appearences)}</b></span>
            <span>Posição: <b>{show(stat.games?.position)}</b></span>
            <span>Gols: <b>{show(stat.goals?.total)}</b></span>
            <span>Assistências: <b>{show(stat.goals?.assists)}</b></span>
            <span>Amarelos: <b>{show(stat.cards?.yellow)}</b></span>
            <span>Vermelhos: <b>{show(stat.cards?.red)}</b></span>
          </div>
        </div>
      ))}
    </div>
  );
}