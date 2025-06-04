import MatchTabs from "./MatchTabs";
import { statusColors, statusText } from "./utils";

export default function MatchItem({
  match,
  openTab,
  setOpenTab,
  h2h,
  loadingH2H,
  lineups,
  loadingLineups,
  odds,
  loadingOdds,
  probabilities,
  loadingProb,
  standings,
  loadingStandings,
  stats,
  loadingStats,
}: any) {
  const status = match.fixture.status.short;
  const color = statusColors(status);

  return (
    <div className="bg-white dark:bg-gray-950 rounded-xl p-4 mb-4 border border-gray-200 dark:border-gray-800 shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1 flex flex-col items-center">
          <img src={match.teams.home.logo} alt={match.teams.home.name} className="w-8 h-8" />
          <span className="text-xs mt-1">{match.teams.home.name}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className={`text-xs font-bold ${color}`}>{statusText(status)}</span>
          <span className="text-xl font-bold">
            {match.goals.home} - {match.goals.away}
          </span>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <img src={match.teams.away.logo} alt={match.teams.away.name} className="w-8 h-8" />
          <span className="text-xs mt-1">{match.teams.away.name}</span>
        </div>
      </div>
      <MatchTabs
        match={match}
        openTab={openTab}
        setOpenTab={setOpenTab}
        h2h={h2h}
        loadingH2H={loadingH2H}
        lineups={lineups}
        loadingLineups={loadingLineups}
        odds={odds}
        loadingOdds={loadingOdds}
        probabilities={probabilities}
        loadingProb={loadingProb}
        standings={standings}
        loadingStandings={loadingStandings}
        stats={stats}
        loadingStats={loadingStats}
      />
    </div>
  );
}