import { useState } from "react";
import MatchItem from "./MatchItem";
import { countryToFlagEmoji } from "./utils";

export default function DashboardMatchList({
  groupedMatches,
  sortedCountries,
  sortedLeagues,
  favoriteLeagues,
  setFavoriteLeagues,
  goalAnim,
  goalAnimLive,
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
  loading,
}: any) {
  // Estado para partida expandida
  const [openFixtureId, setOpenFixtureId] = useState<number | null>(null);

  if (loading) {
    return <div className="text-center text-gray-500">Carregando partidas...</div>;
  }
  if (!sortedCountries.length) {
    return (
      <div className="text-center text-gray-600 mt-10">
        Nenhuma partida para a data selecionada.
      </div>
    );
  }
  return (
    <div>
      {sortedCountries.map((country: string) => (
        <div key={country} className="mb-8">
          <h2 className="text-lg font-semibold mb-2 flex gap-2 items-center">
            <span>{countryToFlagEmoji(country)}</span>
            <span>{country}</span>
          </h2>
          {(sortedLeagues[country] || []).map((leagueId: number) => {
            const leagueObj = groupedMatches[country]?.[leagueId];
            if (!leagueObj) return null;
            return (
              <div key={leagueId} className="mb-4">
                <div className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                  <img src={leagueObj.league.logo} alt={leagueObj.league.name} className="w-5 h-5" />
                  <span>{leagueObj.league.name}</span>
                </div>
                <div>
                  {leagueObj.matches.map((match: any) => (
                    <MatchItem
                      key={match.fixture.id}
                      match={match}
                      openFixtureId={openFixtureId}
                      setOpenFixtureId={setOpenFixtureId}
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
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}