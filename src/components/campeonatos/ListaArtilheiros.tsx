import React from "react";

interface Artilheiro {
  player: {
    id: number;
    name: string;
    photo: string;
    nationality: string;
    age: number;
  };
  statistics: [
    {
      team: {
        name: string;
        logo: string;
      };
      games: {
        appearences: number;
      };
      goals: {
        total: number;
        assists: number | null;
      };
      penalty: {
        scored: number | null;
      };
    }
  ];
}

interface Props {
  data: any;
}

export default function ListaArtilheiros({ data }: Props) {
  const artilheiros: Artilheiro[] = data?.response ?? [];

  if (!artilheiros.length) {
    return (
      <div className="text-gray-400 text-center text-base py-8">
        Nenhum artilheiro disponível para esta temporada.
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-4">
      <ul className="flex flex-col gap-1 w-full">
        {/* Cabeçalho alinhado às extremidades */}
        <li className="flex items-center px-2 py-1 text-[14px] font-semibold text-blue-900 dark:text-blue-100 border-b border-zinc-200 dark:border-zinc-700 bg-blue-50 dark:bg-blue-950 rounded-t-xl select-none">
          <span className="w-6 text-center">#</span>
          <span className="flex-[0.9] ml-2 text-left">Jogador</span>
          <span className="flex-[0.9] ml-2 text-left">Time</span>
          <span className="w-8 text-center">Gols</span>
          <span className="w-8 text-center">Ass.</span>
          <span className="w-14 text-center">Jogos</span>
          <span className="w-14 text-center">Pênalti</span>
          <span className="w-20 text-center">Nac.</span>
          <span className="w-8 text-center">Idade</span>
        </li>
        {artilheiros.map((a, idx) => {
          const stats = a.statistics[0];
          return (
            <li
              key={a.player.id}
              className={
                "flex items-center px-2 py-1 text-[14px] border border-zinc-200 dark:border-zinc-800 rounded-md w-full " +
                (idx % 2 === 0
                  ? "bg-white dark:bg-zinc-900"
                  : "bg-gray-50 dark:bg-zinc-800")
              }
            >
              <span className="w-6 text-center font-medium">{idx + 1}</span>
              <span className="flex-[0.9] flex items-center gap-2 ml-2 text-left overflow-hidden">
                <img
                  src={a.player.photo}
                  alt={a.player.name}
                  className="w-6 h-6 rounded-full border object-cover aspect-square shrink-0"
                  style={{ minWidth: 24, minHeight: 24 }}
                  loading="eager"
                />
                <span className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-[14px]">{a.player.name}</span>
              </span>
              <span className="flex-[0.9] flex items-center gap-2 ml-2 text-left overflow-hidden">
                <img
                  src={stats.team.logo}
                  alt={stats.team.name}
                  className="w-5 h-5 rounded-full border object-cover aspect-square shrink-0"
                  style={{ minWidth: 20, minHeight: 20 }}
                />
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{stats.team.name}</span>
              </span>
              <span className="w-8 text-center font-bold text-blue-800 dark:text-blue-100">{stats.goals.total}</span>
              <span className="w-8 text-center">{stats.goals.assists !== null ? stats.goals.assists : "-"}</span>
              <span className="w-14 text-center">{stats.games.appearences}</span>
              <span className="w-14 text-center">{stats.penalty.scored !== null ? stats.penalty.scored : "0"}</span>
              <span className="w-20 text-center whitespace-nowrap">{a.player.nationality}</span>
              <span className="w-8 text-center">{a.player.age}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}