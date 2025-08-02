import React from "react";
import Link from "next/link";

export default function PlayerClubsTab({ player }: { player: any }) {
  // Pegando o clube atual pelo primeiro item de statistics com team válido
  const clubeAtual = player.statistics?.find((stat: any) => stat.team?.id && stat.team?.name);

  if (!clubeAtual) {
    return <div className="text-center text-zinc-500">Sem clube atual encontrado.</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 text-base">
        {clubeAtual.team.logo && (
          <img src={clubeAtual.team.logo} alt={clubeAtual.team.name} className="w-7 h-7 rounded-full border" />
        )}
        <span>Clube atual:</span>
        <Link
          href={`/clubes/${clubeAtual.team.id}`}
          className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
          prefetch={false}
        >
          {clubeAtual.team.name}
        </Link>
      </div>
      {/* Se quiser mostrar histórico de clubes, pode fazer abaixo */}
    </div>
  );
}