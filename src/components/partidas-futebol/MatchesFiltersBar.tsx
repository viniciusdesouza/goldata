"use client";
import { useEffect } from "react";
import CalendarCustom from "./CalendarCustom";
import "./tabs-partidas.css";

// --- Definição de Tipos ---
interface Match {
  league: {
    id: number;
    name: string;
    country: string;
  };
}

interface Props {
  matches: Match[];
  search: string;
  setSearch: (s: string) => void;
  country: string;
  setCountry: (c: string) => void;
  league: string;
  setLeague: (l: string) => void;
  onApply: () => void;
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
}

export default function MatchesFiltersBar({
  matches, country, setCountry, league, setLeague, onApply, search, setSearch,
  selectedDate, setSelectedDate
}: Props) {
  // Países e ligas únicos
  const countries = Array.from(new Set(matches.map(m => m.league.country).filter(Boolean))).sort();
  const leaguesArr = matches
    .filter(m => !country || m.league.country === country)
    .map(m => ({ id: m.league.id, name: m.league.name }));
  const leagues = Array.from(
    new Map(leaguesArr.map(l => [`${l.id}-${l.name}`, l])).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => { setLeague(""); }, [country, setLeague]);

  const iconSearch = (
    <svg className="w-4 h-4 text-[hsl(220_7%_38%)]" fill="none" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
      <line x1="15" y1="15" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
  const iconArrow = (
    <svg className="ml-1 w-3 h-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M4 4.5l2 2 2-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const iconApply = (
    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 10l4 4 6-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const selectBase = "block w-full h-9 px-3 pr-7 rounded-lg border text-[15px] font-semibold bg-white dark:bg-zinc-900 transition-colors appearance-none";
  const selectActive = "border-[hsl(220_6%_82%)] text-[hsl(220_7%_38%)] dark:border-[hsl(220_4%_32%)] dark:text-[hsl(220_11%_75%)] focus:border-blue-400 focus:outline-none";
  const selectInactive = "border-[hsl(220_8%_93%)] text-[hsl(220_10%_70%)] dark:border-[hsl(220_5%_18%)] dark:text-[hsl(220_11%_50%)] cursor-not-allowed opacity-60";
  const selectArrow = "pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[hsl(220_8%_60%)] dark:text-[hsl(220_11%_60%)]";

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className={`
          border border-zinc-200 dark:border-zinc-700
          bg-white dark:bg-zinc-900
          rounded-2xl
          shadow-sm
          max-w-[800px] w-full mt-2
        `}
        style={{
          marginBottom: "2.5rem",
          paddingLeft: "1rem",
          paddingRight: "1rem"
        }}
      >
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-between py-2 w-full">
          {/* CORREÇÃO: O calendário foi envolvido por uma div para aplicar o estilo de largura. */}
          <div className="w-full sm:w-[340px] max-w-[420px] sm:pl-0 pl-0 sm:mr-auto">
            <CalendarCustom
              selected={selectedDate}
              onSelect={setSelectedDate}
            />
          </div>
          <div className="relative w-full sm:w-[230px] max-w-[340px] flex items-center mt-2 sm:mt-0 sm:ml-auto">
            <span className="absolute left-2 top-1/2 -translate-y-1/2">{iconSearch}</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por time"
              className="pl-8 pr-2 py-2 w-full rounded-lg border border-[hsl(220_6%_82%)] dark:border-[hsl(220_4%_32%)]
                bg-white dark:bg-zinc-900 text-[hsl(220_7%_38%)] dark:text-[hsl(220_11%_75%)] text-[15px] font-medium
                focus:border-blue-400 focus:outline-none transition-colors"
              style={{ height: 38 }}
            />
          </div>
        </div>
        <div className="flex flex-row flex-wrap gap-1 sm:gap-2 md:gap-3 items-center justify-between pb-3 pt-1 w-full">
          <div className="relative w-[110px] sm:w-[140px]">
            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
              className={`${selectBase} ${selectActive} pr-7`}
              style={{ height: 36 }}
            >
              <option value="">País</option>
              {countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <span className={selectArrow}>{iconArrow}</span>
          </div>
          <div className="relative w-[120px] sm:w-[160px]">
            <select
              value={league}
              onChange={e => setLeague(e.target.value)}
              className={`${selectBase} ${country ? selectActive : selectInactive} pr-7`}
              disabled={!country}
              style={{ height: 36 }}
            >
              <option value="">Campeonato</option>
              {leagues.map(l => (
                <option key={`${l.id}-${l.name}`} value={l.id}>{l.name}</option>
              ))}
            </select>
            <span className={selectArrow}>{iconArrow}</span>
          </div>
          <button
            onClick={onApply}
            className="
              flex items-center font-bold px-2 py-1 rounded-lg border
              border-[hsl(220_6%_82%)] text-[hsl(220_7%_38%)] dark:border-[hsl(220_4%_32%)] dark:text-[hsl(220_11%_75%)]
              bg-white dark:bg-zinc-900 hover:bg-[hsl(220_11%_95%)] dark:hover:bg-zinc-800 transition-colors
              text-[14px]
              ml-auto
              min-w-[80px] max-h-[34px]
            "
            style={{ height: 34 }}
            type="button"
          >
            {iconApply}
            Filtrar
          </button>
        </div>
      </div>
    </div>
  );
}
