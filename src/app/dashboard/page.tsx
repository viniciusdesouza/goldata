"use client";

import { useEffect, useState } from "react";
import DashboardMatchList from "./DashboardMatchList";
import CalendarCustom from "./CalendarCustom";
import { format, isSameDay } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export default function DashboardPage() {
  // Estados para dados vindos da API
  const [groupedMatches, setGroupedMatches] = useState<any>({});
  const [sortedCountries, setSortedCountries] = useState<string[]>([]);
  const [sortedLeagues, setSortedLeagues] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Estados para abas, favoritos e animações
  const [favoriteLeagues, setFavoriteLeagues] = useState<number[]>([]);
  const [goalAnim, setGoalAnim] = useState<{ [fixtureId: number]: boolean }>({});
  const [goalAnimLive, setGoalAnimLive] = useState<{ [fixtureId: number]: boolean }>({});
  const [openTab, setOpenTab] = useState<{ [fixtureId: number]: string }>({});

  // Estados para os dados das abas
  const [h2h, setH2H] = useState<any>({});
  const [loadingH2H, setLoadingH2H] = useState<any>({});
  const [lineups, setLineups] = useState<any>({});
  const [loadingLineups, setLoadingLineups] = useState<any>({});
  const [odds, setOdds] = useState<any>({});
  const [loadingOdds, setLoadingOdds] = useState<any>({});
  const [probabilities, setProbabilities] = useState<any>({});
  const [loadingProb, setLoadingProb] = useState<any>({});
  const [standings, setStandings] = useState<any>({});
  const [loadingStandings, setLoadingStandings] = useState<any>({});
  const [stats, setStats] = useState<any>({});
  const [loadingStats, setLoadingStats] = useState<any>({});

  // Estados para data selecionada e animação de gol
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const prevScores = useState<{ [fixtureId: number]: { home: number; away: number } }>({})[0];

  // Função para buscar partidas de determinada data
  async function fetchMatches(date: Date) {
    setLoading(true);
    // NÃO converta para UTC! Apenas formate a data local do calendário.
    const dateString = format(date, "yyyy-MM-dd");
    const res = await fetch(`/api/football/fixtures?date=${dateString}`);
    const data = await res.json();

    // NÃO FILTRE MAIS: a API já retorna só do dia correto!
    const matches = data.response;

    // Agrupa por país e liga usando apenas jogos recebidos
    const byCountry: any = {};
    const leagueOrder: { [country: string]: Set<number> } = {};
    matches.forEach((match: any) => {
      const country = match.league.country;
      if (!byCountry[country]) {
        byCountry[country] = {};
        leagueOrder[country] = new Set();
      }
      const leagueId = match.league.id;
      if (!byCountry[country][leagueId]) {
        byCountry[country][leagueId] = {
          league: match.league,
          matches: [],
        };
      }
      byCountry[country][leagueId].matches.push(match);
      leagueOrder[country].add(leagueId);
    });

    // Ordenar as partidas de cada liga por horário
    Object.values(byCountry).forEach((leagues: any) => {
      Object.values(leagues).forEach((league: any) => {
        league.matches.sort((a: any, b: any) =>
          new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime()
        );
      });
    });

    setGroupedMatches(byCountry);
    setSortedCountries(Object.keys(byCountry));
    setSortedLeagues(
      Object.fromEntries(
        Object.entries(leagueOrder).map(([country, leagues]) => [
          country,
          Array.from(leagues),
        ])
      )
    );
    setLoading(false);

    // Animação de GOL
    let newGoalAnim: { [fixtureId: number]: boolean } = {};
    matches.forEach((match: any) => {
      const fixtureId = match.fixture.id;
      const home = match.goals.home ?? 0;
      const away = match.goals.away ?? 0;
      const before = prevScores[fixtureId] || { home: 0, away: 0 };
      if (
        (home > before.home || away > before.away) &&
        (home !== 0 || away !== 0)
      ) {
        newGoalAnim[fixtureId] = true;
        setTimeout(() => {
          setGoalAnim((prev) => ({ ...prev, [fixtureId]: false }));
        }, 3000);
      }
      prevScores[fixtureId] = { home, away };
    });
    setGoalAnim((prev) => ({ ...prev, ...newGoalAnim }));
  }

  // Atualiza ao trocar de data
  useEffect(() => {
    fetchMatches(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // Atualiza automaticamente a cada minuto, SOMENTE para o dia de hoje
  useEffect(() => {
    if (!isSameDay(selectedDate, new Date())) return;
    const interval = setInterval(() => {
      fetchMatches(selectedDate);
    }, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  return (
    <div className="container mx-auto max-w-3xl py-6">
      <h1 className="font-bold text-2xl mb-6 text-center">Partidas de Futebol</h1>
      
      {/* Calendário visual elaborado */}
      <div className="flex flex-col items-center mb-6">
        <CalendarCustom
          selected={selectedDate}
          onSelect={date => date && setSelectedDate(date)}
        />
      </div>

      <DashboardMatchList
        groupedMatches={groupedMatches}
        sortedCountries={sortedCountries}
        sortedLeagues={sortedLeagues}
        favoriteLeagues={favoriteLeagues}
        setFavoriteLeagues={setFavoriteLeagues}
        goalAnim={goalAnim}
        goalAnimLive={goalAnimLive}
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
        loading={loading}
        selectedDate={selectedDate}
      />
    </div>
  );
}