"use client";
import { useState, Dispatch, SetStateAction } from "react";
import MatchItem from "./MatchItem";

// --- Definição de Tipos ---
interface Match {
  fixture: { id: number };
  // Adicione outras propriedades da partida conforme necessário
}

interface GroupedMatches {
  [country: string]: {
    [leagueId: string]: {
      league: { id: number; name: string; logo: string };
      matches: Match[];
    };
  };
}

// CORREÇÃO: Definindo as props esperadas pelo componente MatchItem.
// Idealmente, esta interface deveria ser exportada do arquivo MatchItem.tsx.
interface MatchItemProps {
  match: Match;
  openFixtureId: number | null;
  setOpenFixtureId: Dispatch<SetStateAction<number | null>>;
  openTab: string;
  setOpenTab: (tab: string) => void;
  h2h: any;
  loadingH2H: boolean;
  lineups: any;
  loadingLineups: boolean;
  odds: any;
  loadingOdds: boolean;
  probabilities: any;
  loadingProb: boolean;
  standings: any;
  loadingStandings: boolean;
  stats: any;
  loadingStats: boolean;
}

// Criando uma versão tipada do MatchItem para resolver o erro no lado do chamador.
const TypedMatchItem = MatchItem as React.FC<MatchItemProps>;


interface DashboardMatchListProps {
  groupedMatches: GroupedMatches;
  sortedCountries: string[];
  sortedLeagues: { [country: string]: number[] };
  favoriteLeagues: number[];
  setFavoriteLeagues: (ids: number[]) => void;
  goalAnim: any;
  goalAnimLive: any;
  openTab: string;
  setOpenTab: (tab: string) => void;
  h2h: any;
  loadingH2H: boolean;
  lineups: any;
  loadingLineups: boolean;
  odds: any;
  loadingOdds: boolean;
  probabilities: any;
  loadingProb: boolean;
  standings: any;
  loadingStandings: boolean;
  stats: any;
  loadingStats: boolean;
  loading: boolean;
}

const countryNameToCode: Record<string, string> = {
  Brazil: "BR",
  England: "GB",
  Spain: "ES",
  Italy: "IT",
  Germany: "DE",
  France: "FR",
  World: "🌍",
};

function countryToFlagEmoji(countryName: string): string {
  const code = countryNameToCode[countryName];
  if (!code) return "🏳️";
  if (code.length > 2) return code;

  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}


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
}: DashboardMatchListProps) {
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
          <h2 className="text-lg font-semibold mb-2 flex gap-2 items-center text-zinc-800 dark:text-zinc-200">
            <span>{countryToFlagEmoji(country)}</span>
            <span>{country}</span>
          </h2>
          {(sortedLeagues[country] || []).map((leagueId: number) => {
            const leagueObj = groupedMatches[country]?.[leagueId];
            if (!leagueObj) return null;
            return (
              <div key={leagueId} className="mb-4">
                <div className="font-bold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-2">
                  <img src={leagueObj.league.logo} alt={leagueObj.league.name} className="w-5 h-5" />
                  <span>{leagueObj.league.name}</span>
                </div>
                <div>
                  {leagueObj.matches.map((match: Match) => (
                    <TypedMatchItem
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
