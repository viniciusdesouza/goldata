"use client";
import { useState, useEffect } from "react";
import MatchH2HTab from "./MatchH2HTab";
import MatchTeamStatsTab from "./MatchTeamStatsTab";
import MatchLineupsTab from "./MatchLineupsTab";
import MatchOddsTab from "./MatchOddsTab";
import MatchStandingsTab from "./MatchStandingsTab";
import MatchStatsTab from "./MatchStatsTab";

const TABS = [
  { key: "h2h", label: "Confrontos" },
  { key: "statsHome", label: "Estatísticas Mandante" },
  { key: "statsAway", label: "Estatísticas Visitante" },
  { key: "lineups", label: "Escalações" },
  { key: "odds", label: "Odds" },
  { key: "standings", label: "Classificação" },
  { key: "stats", label: "Estatísticas Partida" },
];

export default function MatchTabs({
  match,
  openTab,
  setOpenTab,
  h2h,
  loadingH2H,
}: any) {
  const fixtureId = match.fixture.id;
  const currentTab = openTab[fixtureId];

  const leagueId = match.league.id;
  const season = match.league.season;
  const leagueIdStr = leagueId?.toString();
  const seasonStr = season?.toString();
  const homeId = match.teams.home.id?.toString();
  const awayId = match.teams.away.id?.toString();

  // Lineups state
  const [lineups, setLineups] = useState<{ [fixtureId: number]: { lineups: any[] } }>({});
  const [loadingLineups, setLoadingLineups] = useState<{ [fixtureId: number]: boolean }>({});

  function fetchLineups() {
    if (!fixtureId) return;
    if (lineups[fixtureId]) return; // Already fetched
    setLoadingLineups((prev) => ({ ...prev, [fixtureId]: true }));
    fetch(`/api/football/lineups?fixture=${fixtureId}`)
      .then((res) => res.json())
      .then((data) => {
        setLineups((prev) => ({ ...prev, [fixtureId]: data }));
      })
      .catch(() => {
        setLineups((prev) => ({ ...prev, [fixtureId]: { lineups: [] } }));
      })
      .finally(() => {
        setLoadingLineups((prev) => ({ ...prev, [fixtureId]: false }));
      });
  }

  useEffect(() => {
    if (currentTab === "lineups") {
      fetchLineups();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, fixtureId]);

  // Stats state
  const [stats, setStats] = useState<{ [fixtureId: number]: { home: any[]; away: any[] } }>({});
  const [loadingStats, setLoadingStats] = useState<{ [fixtureId: number]: boolean }>({});

  function fetchStats() {
    if (!fixtureId) return;
    if (stats[fixtureId]) return; // Already fetched
    setLoadingStats((prev) => ({ ...prev, [fixtureId]: true }));
    fetch(`/api/football/statistics/stats?fixture=${fixtureId}`)
      .then((res) => res.json())
      .then((data) => {
        setStats((prev) => ({ ...prev, [fixtureId]: data }));
      })
      .catch(() => {
        setStats((prev) => ({ ...prev, [fixtureId]: { home: [], away: [] } }));
      })
      .finally(() => {
        setLoadingStats((prev) => ({ ...prev, [fixtureId]: false }));
      });
  }

  useEffect(() => {
    if (currentTab === "stats") {
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, fixtureId]);

  // Standings state
  const [standings, setStandings] = useState<{ [leagueId: number]: any[] }>({});
  const [loadingStandings, setLoadingStandings] = useState<{ [leagueId: number]: boolean }>({});

  function fetchStandings() {
    if (!leagueId || !season) return;
    if (standings[leagueId]) return;
    setLoadingStandings((prev) => ({ ...prev, [leagueId]: true }));
    fetch(`/api/football/standings?league=${leagueId}&season=${season}`)
      .then((res) => res.json())
      .then((data) => {
        setStandings((prev) => ({ ...prev, [leagueId]: data.standings || [] }));
      })
      .catch(() => {
        setStandings((prev) => ({ ...prev, [leagueId]: [] }));
      })
      .finally(() => {
        setLoadingStandings((prev) => ({ ...prev, [leagueId]: false }));
      });
  }

  useEffect(() => {
    if (currentTab === "standings") {
      fetchStandings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, leagueId, season]);

  // Odds state (ajustado para odds pré-jogo e ao vivo)
  const [odds, setOdds] = useState<{ [fixtureId: number]: { preMatch: any; live: any } }>({});
  const [loadingOdds, setLoadingOdds] = useState<{ [fixtureId: number]: boolean }>({});

  function fetchOdds() {
    if (!fixtureId) return;
    if (odds[fixtureId]) return; // Já buscou
    setLoadingOdds((prev) => ({ ...prev, [fixtureId]: true }));
    fetch(`/api/football/odds?fixture=${fixtureId}`)
      .then((res) => res.json())
      .then((data) => {
        setOdds((prev) => ({ ...prev, [fixtureId]: data }));
      })
      .catch(() => {
        setOdds((prev) => ({ ...prev, [fixtureId]: { preMatch: null, live: null } }));
      })
      .finally(() => {
        setLoadingOdds((prev) => ({ ...prev, [fixtureId]: false }));
      });
  }

  useEffect(() => {
    if (currentTab === "odds") {
      fetchOdds();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, fixtureId]);

  return (
    <div className="mt-3">
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`px-2 py-1 text-xs font-semibold rounded-t ${
              currentTab === tab.key
                ? "bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100"
                : "bg-transparent text-gray-700 dark:text-gray-300"
            }`}
            onClick={() =>
              setOpenTab((prev: any) => ({
                ...prev,
                [fixtureId]: tab.key,
              }))
            }
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {!currentTab && (
          <div className="text-center text-xs text-gray-400 py-4">
            Selecione uma aba acima para ver os detalhes.
          </div>
        )}
        {currentTab === "statsHome" && leagueIdStr && seasonStr && homeId && (
          <MatchTeamStatsTab teamId={homeId} league={leagueIdStr} season={seasonStr} />
        )}
        {currentTab === "statsAway" && leagueIdStr && seasonStr && awayId && (
          <MatchTeamStatsTab teamId={awayId} league={leagueIdStr} season={seasonStr} />
        )}
        {currentTab === "h2h" && homeId && awayId && (
          <MatchH2HTab homeId={homeId} awayId={awayId} />
        )}
        {currentTab === "lineups" && (
          <MatchLineupsTab match={match} lineups={lineups} loadingLineups={loadingLineups} />
        )}
        {currentTab === "odds" && (
          <MatchOddsTab match={match} odds={odds} loadingOdds={loadingOdds} />
        )}
        {currentTab === "standings" && (
          <MatchStandingsTab
            match={match}
            standings={standings}
            loadingStandings={loadingStandings}
          />
        )}
        {currentTab === "stats" && (
          <MatchStatsTab match={match} stats={stats} loadingStats={loadingStats} />
        )}
      </div>
    </div>
  );
}