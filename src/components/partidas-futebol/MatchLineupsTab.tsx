"use client";

import Link from "next/link";

interface Player {
  id: number;
  name: string;
  number: number | null;
  pos: string;
  photo?: string;
}

interface LineupTeam {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  coach: { name: string; photo?: string };
  formation: string;
  startXI: { player: Player }[];
  substitutes: { player: Player }[];
}

interface MatchLineupsTabProps {
  match: any;
  lineups?: { [fixtureId: number]: { lineups: LineupTeam[] } };
  loadingLineups?: { [fixtureId: number]: boolean };
}

function getNumberBadgeClass(isStarter: boolean) {
  if (isStarter) {
    // Titulares: preenchimento preto e texto branco
    return "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-sm font-bold border border-black bg-black text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900";
  }
  // Reservas: borda cinza, fundo claro, texto escuro
  return "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-sm font-bold border border-zinc-400 bg-zinc-100 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100";
}

export default function MatchLineupsTab({
  match,
  lineups = {},
  loadingLineups = {},
}: MatchLineupsTabProps) {
  const fixtureId = match.fixture.id;
  const loading = loadingLineups[fixtureId];
  const lineupsObj = lineups[fixtureId];

  if (loading)
    return (
      <div className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl mt-2 p-4 w-full max-w-[850px] mx-auto">
        <div className="text-center text-[15px] py-10 text-zinc-700 dark:text-zinc-200 font-semibold">
          Carregando escalações...
        </div>
      </div>
    );

  if (!lineupsObj || !lineupsObj.lineups?.length)
    return (
      <div className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl mt-2 p-4 w-full max-w-[850px] mx-auto">
        <div className="text-center text-[15px] py-10 text-zinc-700 dark:text-zinc-200 font-semibold">
          Escalações não disponíveis.
        </div>
      </div>
    );

  const [homeLineup, awayLineup] = lineupsObj.lineups;

  function renderPlayers(players: { player: Player }[], isStarter: boolean) {
    return (
      <ul>
        {players.map(({ player }) => (
          <li key={player.id || player.name} className="flex items-center py-1 gap-2">
            {player.photo && (
              <img
                src={player.photo}
                alt={player.name}
                className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-700"
              />
            )}
            <Link
              href={`/pesquisa-jogadores?query=${encodeURIComponent(player.name)}`}
              className="mt-1 max-w-[120px] text-center text-[13px] text-zinc-900 dark:text-zinc-100 font-semibold whitespace-nowrap overflow-hidden hover:underline focus:underline"
              style={{ textOverflow: "ellipsis" }}
              title={player.name}
            >
              {player.name}
            </Link>
            {player.number != null && (
              <span className={`${getNumberBadgeClass(isStarter)} ml-auto`}>
                {player.number}
              </span>
            )}
            <span className="ml-2 text-[12px] text-zinc-800 dark:text-zinc-400 font-semibold">{player.pos}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl mt-2 p-4 w-full max-w-[850px] mx-auto">
      <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-3 text-center text-[15px]">
        Escalações
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center justify-between mb-3">
          <div className="flex-1 flex flex-row items-center justify-center gap-2">
            <div className="flex flex-col items-center min-w-[76px] max-w-[90px]">
              <img
                src={homeLineup.team.logo}
                alt={homeLineup.team.name}
                className="w-7 h-7 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
              />
              <span
                className="mt-1 max-w-[90px] text-center text-[13px] text-zinc-900 dark:text-zinc-100 font-bold whitespace-nowrap overflow-hidden"
                style={{ textOverflow: "ellipsis" }}
              >
                {homeLineup.team.name}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-[12px] text-zinc-700 dark:text-zinc-400 font-semibold">
                Técnico:
              </span>
              <span className="text-[13px] text-zinc-900 dark:text-zinc-100 font-bold">
                {homeLineup.coach?.name || "-"}
              </span>
              <span className="text-[0.8rem] text-zinc-700 dark:text-zinc-400 font-bold">
                {homeLineup.formation}
              </span>
            </div>
            <span className="mx-2 text-zinc-900 dark:text-zinc-100 font-bold text-[15px]">x</span>
            <div className="flex flex-col items-center justify-center">
              <span className="text-[12px] text-zinc-700 dark:text-zinc-400 font-semibold">
                Técnico:
              </span>
              <span className="text-[13px] text-zinc-900 dark:text-zinc-100 font-bold">
                {awayLineup.coach?.name || "-"}
              </span>
              <span className="text-[0.8rem] text-zinc-700 dark:text-zinc-400 font-bold">
                {awayLineup.formation}
              </span>
            </div>
            <div className="flex flex-col items-center min-w-[76px] max-w-[90px]">
              <img
                src={awayLineup.team.logo}
                alt={awayLineup.team.name}
                className="w-7 h-7 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
              />
              <span
                className="mt-1 max-w-[90px] text-center text-[13px] text-zinc-900 dark:text-zinc-100 font-bold whitespace-nowrap overflow-hidden"
                style={{ textOverflow: "ellipsis" }}
              >
                {awayLineup.team.name}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-3">
          <div className="w-full sm:w-1/2">
            <div className="mb-1 text-[13px] text-zinc-900 dark:text-zinc-100 font-semibold">Titulares</div>
            {renderPlayers(homeLineup.startXI, true)}
            <div className="mt-2 text-[13px] text-zinc-700 dark:text-zinc-400 font-semibold">Reservas</div>
            {renderPlayers(homeLineup.substitutes, false)}
          </div>
          <div className="w-full sm:w-1/2">
            <div className="mb-1 text-[13px] text-zinc-900 dark:text-zinc-100 font-semibold">Titulares</div>
            {renderPlayers(awayLineup.startXI, true)}
            <div className="mt-2 text-[13px] text-zinc-700 dark:text-zinc-400 font-semibold">Reservas</div>
            {renderPlayers(awayLineup.substitutes, false)}
          </div>
        </div>
      </div>
    </div>
  );
}
