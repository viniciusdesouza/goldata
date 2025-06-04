"use client";

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
      <div className="mt-2 border border-gray-200 bg-gray-50 rounded-xl p-3">
        <div className="text-center py-3 text-gray-500 text-sm">Carregando escalações...</div>
      </div>
    );

  if (!lineupsObj || !lineupsObj.lineups?.length)
    return (
      <div className="mt-2 border border-gray-200 bg-gray-50 rounded-xl p-3">
        <div className="text-center py-3 text-gray-400 text-sm">Escalações não disponíveis.</div>
      </div>
    );

  const [homeLineup, awayLineup] = lineupsObj.lineups;

  function renderPlayers(players: { player: Player }[]) {
    return (
      <ul className="divide-y divide-gray-100">
        {players.map(({ player }) => (
          <li key={player.id || player.name} className="flex items-center py-1 gap-2">
            {player.photo && (
              <img
                src={player.photo}
                alt={player.name}
                className="w-5 h-5 rounded-full border"
              />
            )}
            <span className="truncate font-medium text-gray-700 text-xs max-w-[90px]">{player.name}</span>
            {player.number != null && (
              <span className="font-bold px-2 py-1 rounded-lg text-xs bg-blue-100 text-blue-700 ml-auto">
                {player.number}
              </span>
            )}
            <span className="ml-2 text-[10px] text-blue-400">{player.pos}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow border border-gray-100 px-2 py-2">
      <div className="flex items-center justify-center gap-3 mb-3">
        <img src={homeLineup.team.logo} alt={homeLineup.team.name} className="w-6 h-6 rounded-full border" />
        <span className="text-base font-bold text-gray-900 truncate">{homeLineup.team.name}</span>
        <span className="text-xs text-gray-500">x</span>
        <span className="text-base font-bold text-gray-900 truncate">{awayLineup.team.name}</span>
        <img src={awayLineup.team.logo} alt={awayLineup.team.name} className="w-6 h-6 rounded-full border" />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Home Team */}
        <div className="w-full sm:w-1/2">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700">Técnico:</span>
            <span className="text-xs text-gray-700">{homeLineup.coach?.name || "-"}</span>
          </div>
          <div className="mb-1 text-xs text-blue-500 font-semibold">Formação: {homeLineup.formation}</div>
          <div className="mb-1 text-[11px] font-bold text-gray-500">Titulares</div>
          {renderPlayers(homeLineup.startXI)}
          <div className="mt-2 mb-1 text-[11px] font-bold text-gray-500">Reservas</div>
          {renderPlayers(homeLineup.substitutes)}
        </div>
        {/* Away Team */}
        <div className="w-full sm:w-1/2">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700">Técnico:</span>
            <span className="text-xs text-gray-700">{awayLineup.coach?.name || "-"}</span>
          </div>
          <div className="mb-1 text-xs text-blue-500 font-semibold">Formação: {awayLineup.formation}</div>
          <div className="mb-1 text-[11px] font-bold text-gray-500">Titulares</div>
          {renderPlayers(awayLineup.startXI)}
          <div className="mt-2 mb-1 text-[11px] font-bold text-gray-500">Reservas</div>
          {renderPlayers(awayLineup.substitutes)}
        </div>
      </div>
    </div>
  );
}