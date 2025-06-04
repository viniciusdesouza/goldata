interface TeamStanding {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  goalsDiff?: number;
  all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
}

interface MatchStandingsTabProps {
  match: any;
  standings?: { [leagueId: number]: TeamStanding[] };
  loadingStandings?: { [leagueId: number]: boolean };
}

export default function MatchStandingsTab({
  match,
  standings = {},
  loadingStandings = {},
}: MatchStandingsTabProps) {
  const leagueId = match.league.id;
  const homeId = match.teams.home.id;
  const awayId = match.teams.away.id;
  const loading = loadingStandings[leagueId];
  const table: TeamStanding[] = standings[leagueId] || [];

  function highlightRow(teamId: number) {
    if (teamId === homeId) return "bg-blue-100 dark:bg-blue-900";
    if (teamId === awayId) return "bg-violet-100 dark:bg-violet-900";
    return "";
  }

  function renderStandings(table: TeamStanding[]) {
    if (!table || table.length === 0) {
      return (
        <div className="text-xs italic text-gray-500">
          Classificação não disponível para esta liga.
        </div>
      );
    }
    return (
      <div className="overflow-x-auto mt-2">
        <table className="min-w-[420px] w-full text-xs border border-gray-200 dark:border-gray-700 rounded">
          <thead>
            <tr className="bg-blue-100 dark:bg-blue-800">
              <th className="py-2 px-2 text-left text-blue-900 dark:text-blue-200">#</th>
              <th className="py-2 px-2 text-left text-blue-900 dark:text-blue-200">Equipe</th>
              <th className="py-2 px-2 text-blue-900 dark:text-blue-200">Pts</th>
              <th className="py-2 px-2 text-blue-900 dark:text-blue-200">PJ</th>
              <th className="py-2 px-2 text-blue-900 dark:text-blue-200">V</th>
              <th className="py-2 px-2 text-blue-900 dark:text-blue-200">E</th>
              <th className="py-2 px-2 text-blue-900 dark:text-blue-200">D</th>
              <th className="py-2 px-2 text-blue-900 dark:text-blue-200">GP</th>
              <th className="py-2 px-2 text-blue-900 dark:text-blue-200">GC</th>
              <th className="py-2 px-2 text-blue-900 dark:text-blue-200">SG</th>
            </tr>
          </thead>
          <tbody>
            {table.map((row) => (
              <tr key={row.team.id} className={highlightRow(row.team.id)}>
                <td className="py-1.5 px-2 font-semibold">{row.rank}</td>
                <td className="py-1.5 px-2 flex items-center gap-2">
                  <img
                    src={row.team.logo}
                    alt={row.team.name}
                    className="w-4 h-4"
                    loading="eager"
                    style={{ background: "#fff", borderRadius: 2 }}
                  />
                  <span className="truncate">{row.team.name}</span>
                </td>
                <td className="py-1.5 px-2 font-bold">{row.points}</td>
                <td className="py-1.5 px-2">{row.all.played}</td>
                <td className="py-1.5 px-2">{row.all.win}</td>
                <td className="py-1.5 px-2">{row.all.draw}</td>
                <td className="py-1.5 px-2">{row.all.lose}</td>
                <td className="py-1.5 px-2">{row.all.goals.for}</td>
                <td className="py-1.5 px-2">{row.all.goals.against}</td>
                <td className="py-1.5 px-2">{row.goalsDiff ?? (row.all.goals.for - row.all.goals.against)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn mt-2 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 rounded-xl p-3">
      {loading ? (
        <div className="text-center py-3 text-gray-500">Carregando classificação...</div>
      ) : (
        renderStandings(table)
      )}
    </div>
  );
}