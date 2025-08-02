import React from "react";

export default function PlayerOverviewTab({ player }: { player: any }) {
  const p = player.player;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-sm text-zinc-500">
        {p.age && <>Idade: {p.age} &nbsp;|&nbsp;</>}
        {p.height && <>Altura: {p.height} &nbsp;|&nbsp;</>}
        {p.weight && <>Peso: {p.weight}</>}
      </div>
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        {player.statistics?.[0]?.games?.position && (
          <span>Posição: <b>{player.statistics[0].games.position}</b></span>
        )}
        {p.injured ? (
          <span className="text-red-500">Lesionado</span>
        ) : (
          <span className="text-green-600">Apto</span>
        )}
      </div>
    </div>
  );
}