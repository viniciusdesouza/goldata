"use client";
import { useState, useEffect, useRef } from "react";
import MatchH2HTab from "./MatchH2HTab";
import MatchTeamStatsTab from "./MatchTeamStatsTab";
import MatchLineupsTab from "./MatchLineupsTab";
import MatchOddsTab from "./MatchOddsTab";
import MatchStandingsTab from "./MatchStandingsTab";
import MatchStatsTab from "./MatchStatsTab";
import "./matchtabs.css";

// --- Definição de Tipos ---
interface Match {
  fixture: { id: number };
  league: { id: number; season: number };
  teams: { home: { id: number }; away: { id: number } };
}

interface TeamStanding {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
}

const TABS = [
  { key: "h2h", label: "Confrontos" },
  { key: "statsHome", label: "Estatísticas Mandante" },
  { key: "statsAway", label: "Estatísticas Visitante" },
  { key: "lineups", label: "Escalações" },
  { key: "odds", label: "Odds" },
  { key: "standings", label: "Classificação" },
  { key: "stats", label: "Estatísticas partida" },
];

export default function MatchTabs({ match }: { match: Match }) {
  const [currentTab, setCurrentTab] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  const isDragging = useRef(false);
  const dragStartX = useRef<number | null>(null);
  const dragScrollLeft = useRef<number>(0);

  function handleMouseDown(e: React.MouseEvent) {
    if (!scrollRef.current) return;
    isDragging.current = true;
    dragStartX.current = e.pageX - scrollRef.current.offsetLeft;
    dragScrollLeft.current = scrollRef.current.scrollLeft;
    document.body.style.userSelect = "none";
  }
  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || !scrollRef.current || dragStartX.current === null) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - dragStartX.current;
    scrollRef.current.scrollLeft = dragScrollLeft.current - walk;
  }
  function handleMouseUp() {
    isDragging.current = false;
    dragStartX.current = null;
    document.body.style.userSelect = "";
  }
  function handleMouseLeave() {
    isDragging.current = false;
    dragStartX.current = null;
    document.body.style.userSelect = "";
  }
  function handleTouchStart(e: React.TouchEvent) {
    if (!scrollRef.current) return;
    isDragging.current = true;
    dragStartX.current = e.touches[0].clientX - scrollRef.current.offsetLeft;
    dragScrollLeft.current = scrollRef.current.scrollLeft;
  }
  function handleTouchMove(e: React.TouchEvent) {
    if (!isDragging.current || !scrollRef.current || dragStartX.current === null) return;
    const x = e.touches[0].clientX - scrollRef.current.offsetLeft;
    const walk = x - dragStartX.current;
    scrollRef.current.scrollLeft = dragScrollLeft.current - walk;
  }
  function handleTouchEnd() {
    isDragging.current = false;
    dragStartX.current = null;
  }

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  function checkArrows() {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 8);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 8);
  }

  useEffect(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    checkArrows();
    el.addEventListener("scroll", checkArrows);
    window.addEventListener("resize", checkArrows);
    return () => {
      el.removeEventListener("scroll", checkArrows);
      window.removeEventListener("resize", checkArrows);
    };
  }, []);

  useEffect(() => {
    if (!currentTab) return setIndicator({ left: 0, width: 0 });
    const idx = TABS.findIndex(t => t.key === currentTab);
    const tab = tabRefs.current[idx];
    const scroll = scrollRef.current;
    if (tab && scroll) {
      const tabRect = tab.getBoundingClientRect();
      const scrollRect = scroll.getBoundingClientRect();
      setIndicator({
        left: tabRect.left - scrollRect.left + scroll.scrollLeft,
        width: tabRect.width,
      });
    }
  }, [currentTab]);

  useEffect(() => {
    if (!currentTab) return;
    const idx = TABS.findIndex(t => t.key === currentTab);
    const tab = tabRefs.current[idx];
    const scroll = scrollRef.current;
    if (tab && scroll) {
      const tabLeft = tab.offsetLeft;
      const tabWidth = tab.offsetWidth;
      const scrollWidth = scroll.offsetWidth;
      const scrollTo = tabLeft - (scrollWidth - tabWidth) / 2;
      scroll.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  }, [currentTab]);

  const scrollByAmount = (dx: number) => {
    scrollRef.current?.scrollBy({ left: dx, behavior: "smooth" });
  };

  const { fixture, league, teams } = match;
  const fixtureId = fixture.id;
  const leagueId = league.id;
  const season = league.season;
  const homeId = teams.home.id.toString();
  const awayId = teams.away.id.toString();

  const [lineups, setLineups] = useState<{ [fixtureId: number]: any }>({});
  const [loadingLineups, setLoadingLineups] = useState<{ [fixtureId: number]: boolean }>({});
  function fetchLineups() {
    if (lineups[fixtureId]) return;
    setLoadingLineups(prev => ({ ...prev, [fixtureId]: true }));
    fetch(`/api/football/partidas-futebol/lineups?fixture=${fixtureId}`)
      .then(res => res.json())
      .then(data => setLineups(prev => ({ ...prev, [fixtureId]: data })))
      .finally(() => setLoadingLineups(prev => ({ ...prev, [fixtureId]: false })));
  }
  useEffect(() => { if (currentTab === "lineups") fetchLineups(); }, [currentTab, fixtureId]);

  const [stats, setStats] = useState<{ [fixtureId: number]: any }>({});
  const [loadingStats, setLoadingStats] = useState<{ [fixtureId: number]: boolean }>({});
  function fetchStats() {
    if (stats[fixtureId]) return;
    setLoadingStats(prev => ({ ...prev, [fixtureId]: true }));
    fetch(`/api/football/partidas-futebol/statistics/stats?fixture=${fixtureId}`)
      .then(res => res.json())
      .then(data => setStats(prev => ({ ...prev, [fixtureId]: data })))
      .finally(() => setLoadingStats(prev => ({ ...prev, [fixtureId]: false })));
  }
  useEffect(() => { if (currentTab === "stats") fetchStats(); }, [currentTab, fixtureId]);

  const [standings, setStandings] = useState<{ [leagueId: number]: TeamStanding[][] }>({});
  const [loadingStandings, setLoadingStandings] = useState<{ [leagueId: number]: boolean }>({});
  function fetchStandings() {
    if (standings[leagueId]) return;
    setLoadingStandings(prev => ({ ...prev, [leagueId]: true }));
    fetch(`/api/football/partidas-futebol/standings?league=${leagueId}&season=${season}`)
      .then(res => res.json())
      .then(data => {
        const arr = data?.response?.[0]?.league?.standings ?? [];
        setStandings(prev => ({ ...prev, [leagueId]: arr }));
      })
      .finally(() => setLoadingStandings(prev => ({ ...prev, [leagueId]: false })));
  }
  useEffect(() => { if (currentTab === "standings") fetchStandings(); }, [currentTab, leagueId, season]);

  const [odds, setOdds] = useState<{ [fixtureId: number]: any }>({});
  const [loadingOdds, setLoadingOdds] = useState<{ [fixtureId: number]: boolean }>({});
  function fetchOdds() {
    if (odds[fixtureId]) return;
    setLoadingOdds(prev => ({ ...prev, [fixtureId]: true }));
    fetch(`/api/football/partidas-futebol/odds?fixture=${fixtureId}`)
      .then(res => res.json())
      .then(data => setOdds(prev => ({ ...prev, [fixtureId]: data })))
      .finally(() => setLoadingOdds(prev => ({ ...prev, [fixtureId]: false })));
  }
  useEffect(() => { if (currentTab === "odds") fetchOdds(); }, [currentTab, fixtureId]);

  const arrowCircleClass = "rounded-full shadow-md flex items-center justify-center transition-colors bg-white/90 dark:bg-[#23272f]/80 hover:bg-zinc-100 dark:hover:bg-[#323943] border border-zinc-200 dark:border-zinc-800";

  return (
    <div className="text-[15px]">
      <div className="w-full max-w-3xl mx-auto relative flex items-center select-none" style={{ marginBottom: 8 }}>
        {showLeft && (
          <button className="absolute left-0 z-10 h-full flex items-center pl-1" onClick={() => scrollByAmount(-200)} aria-label="Anterior">
            <span className={arrowCircleClass} style={{ width: 38, height: 38, minWidth: 38, minHeight: 38, backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}>
              <svg width={24} height={24} stroke="currentColor" fill="none" viewBox="0 0 24 24" className="w-6 h-6 text-zinc-400 dark:text-zinc-300">
                <polyline points="15 18 9 12 15 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
        )}
        <div
          ref={scrollRef}
          className="flex flex-row flex-nowrap relative bg-transparent overflow-x-auto overflow-y-hidden scrollbar-hide"
          style={{ WebkitOverflowScrolling: "touch", scrollSnapType: "x mandatory", paddingBottom: 2, width: "100%", maxWidth: "100%" }}
          onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
        >
          {TABS.map((tab, idx) => (
            <button
              // CORREÇÃO: A função ref agora tem um corpo e não retorna um valor.
              ref={el => { tabRefs.current[idx] = el; }}
              key={tab.key}
              className={`tab-btn-yt${currentTab === tab.key ? " active" : ""}`}
              aria-selected={currentTab === tab.key}
              onClick={() => setCurrentTab(tab.key)}
              type="button"
              style={{ flex: "0 0 auto" }}
            >
              {tab.label}
            </button>
          ))}
          {currentTab && (
            <span
              className="absolute bottom-0 h-1 rounded-full bg-blue-600 dark:bg-blue-400 transition-all duration-200"
              style={{ left: indicator.left, width: indicator.width, opacity: indicator.width ? 1 : 0, height: 3, transition: "left 0.2s, width 0.2s" }}
            />
          )}
        </div>
        {showRight && (
          <button className="absolute right-0 z-10 h-full flex items-center pr-1" onClick={() => scrollByAmount(200)} aria-label="Próximo">
            <span className={arrowCircleClass} style={{ width: 38, height: 38, minWidth: 38, minHeight: 38, backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}>
              <svg width={24} height={24} stroke="currentColor" fill="none" viewBox="0 0 24 24" className="w-6 h-6 text-zinc-400 dark:text-zinc-300">
                <polyline points="9 18 15 12 9 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
        )}
        <style jsx global>{`
          .scrollbar-hide { scrollbar-width: none !important; }
          .scrollbar-hide::-webkit-scrollbar { display: none !important; }
        `}</style>
      </div>
      <div className="py-2 w-full">
        {currentTab === "statsHome" && <MatchTeamStatsTab teamId={homeId} league={String(leagueId)} season={String(season)} />}
        {currentTab === "statsAway" && <MatchTeamStatsTab teamId={awayId} league={String(leagueId)} season={String(season)} />}
        {currentTab === "h2h" && <MatchH2HTab homeId={homeId} awayId={awayId} />}
        {currentTab === "lineups" && <MatchLineupsTab match={match} lineups={lineups} loadingLineups={loadingLineups} />}
        {currentTab === "odds" && <MatchOddsTab match={match} odds={odds} loadingOdds={loadingOdds} />}
        {currentTab === "standings" && <MatchStandingsTab match={match} standings={standings} loadingStandings={loadingStandings} />}
        {currentTab === "stats" && <MatchStatsTab match={match} stats={stats} loadingStats={loadingStats} />}
      </div>
    </div>
  );
}
