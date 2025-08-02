"use client";

import { useEffect, useState, useMemo } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import MatchItem from "./MatchItem";
import MatchesFiltersBar from "./MatchesFiltersBar";
import { ChevronDown } from "lucide-react";
import { useFavoritos } from "./FavoritosContext";

// --- Definição de Tipos ---
interface Match {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
      long: string; 
      elapsed?: number;
      extra?: number;
    };
    venue?: { name?: string; city?: string };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    season: number;
    round: string;
  };
  teams: {
    home: { name: string; logo: string; id: number };
    away: { name: string; logo: string; id: number };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}

interface MatchesLiveProps {
  selectedDate?: Date;
  onlyLive?: boolean;
  onlyFavorites?: boolean;
  onlyFinished?: boolean;
  onlyScheduled?: boolean;
}

// --- Funções Utilitárias ---
const countryNameToCode: Record<string, string> = {
  Brazil: "BR", England: "GB", Spain: "ES", Italy: "IT", Germany: "DE", France: "FR", World: "🌍",
};

function countryToFlagEmoji(countryName: string): string {
  const code = countryNameToCode[countryName];
  if (!code) return "🏳️";
  if (code.length > 2) return code;
  const codePoints = code.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function getCountryFlagUrl(countryName?: string): string | null {
  if (!countryName) return null;
  const code = countryNameToCode[countryName];
  if (code && code.length === 2) {
    return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
  }
  return null;
}

export default function MatchesLive({
  selectedDate: selectedDateProp,
  onlyLive,
  onlyFavorites,
  onlyFinished,
  onlyScheduled,
}: MatchesLiveProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(selectedDateProp ?? new Date());
  const [matches, setMatches] = useState<Match[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const { favoritos } = useFavoritos();
  const [visibleCount, setVisibleCount] = useState(20);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [league, setLeague] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ search: "", country: "", league: "" });

  function handleApplyFilters() {
    setAppliedFilters({ search, country, league });
    setVisibleCount(20);
  }

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    setLoading(true);
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    fetch(`/api/football/partidas-futebol/fixtures?date=${dateStr}`)
      .then(res => res.json())
      .then(data => setMatches(Array.isArray(data.response) ? data.response : []))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const fetchLive = () => {
      if (!isSameDay(selectedDate, new Date())) {
        setLiveMatches([]);
        return;
      }
      fetch("/api/football/partidas-futebol/live")
        .then(res => res.json())
        .then(data => setLiveMatches(Array.isArray(data.response) ? data.response : []));
    };
    fetchLive();
    if (isSameDay(selectedDate, new Date())) {
      interval = setInterval(fetchLive, 20000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [selectedDate]);

  const baseMatches = useMemo(() => {
    // Adiciona um filtro para garantir que as propriedades obrigatórias existam.
    const allMatchesToday = matches.filter(m => 
      m.league?.logo && 
      m.league?.round &&
      m.league?.season &&
      m.teams?.home?.id &&
      m.teams?.away?.id &&
      isSameDay(toZonedTime(parseISO(m.fixture.date), userTimeZone), selectedDate)
    );
    if (onlyFavorites) return allMatchesToday.filter(m => favoritos.includes(m.fixture.id));
    if (onlyLive) return liveMatches.filter(m => m.league?.logo && m.league?.round && m.league?.season && m.teams?.home?.id && m.teams?.away?.id && isSameDay(toZonedTime(parseISO(m.fixture.date), userTimeZone), selectedDate));
    if (onlyFinished) return allMatchesToday.filter(m => ["FT", "AET", "PEN"].includes(m.fixture.status.short));
    if (onlyScheduled) return allMatchesToday.filter(m => m.fixture.status.short === "NS");
    return allMatchesToday;
  }, [matches, liveMatches, selectedDate, userTimeZone, onlyFavorites, onlyLive, onlyFinished, onlyScheduled, favoritos]);

  const filteredMatches = useMemo(() => {
    return baseMatches.filter(m => {
      const text = (m.league.name + " " + m.league.country + " " + m.teams.home.name + " " + m.teams.away.name).toLowerCase();
      const searchOk = !appliedFilters.search || text.includes(appliedFilters.search.toLowerCase());
      const countryOk = !appliedFilters.country || m.league.country === appliedFilters.country;
      const leagueOk = !appliedFilters.league || String(m.league.id) === String(appliedFilters.league);
      return searchOk && countryOk && leagueOk;
    });
  }, [baseMatches, appliedFilters]);

  const sortedMatches = useMemo(() => {
    return filteredMatches.slice().sort((a, b) => {
      const liveOrder = (a.fixture.status.short === 'NS' ? 1 : 0) - (b.fixture.status.short === 'NS' ? 1 : 0);
      if (liveOrder !== 0) return liveOrder;
      return new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime();
    });
  }, [filteredMatches]);

  const visibleMatches = sortedMatches.slice(0, visibleCount);
  const grouped = visibleMatches.reduce((acc, match) => {
    const country = match.league.country || "Desconhecido";
    if (!acc[country]) acc[country] = [];
    acc[country].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  return (
    <div className="w-full max-w-3xl xl:max-w-4xl mx-auto px-1 md:px-4">
      <MatchesFiltersBar
        matches={baseMatches}
        search={search} setSearch={setSearch}
        country={country} setCountry={setCountry}
        league={league} setLeague={setLeague}
        onApply={handleApplyFilters}
        selectedDate={selectedDate} setSelectedDate={setSelectedDate}
      />
      {loading ? (
        <div className="text-center text-muted-foreground py-10">Carregando...</div>
      ) : sortedMatches.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">Nenhuma partida encontrada.</div>
      ) : (
        <div className="pb-16">
          {Object.entries(grouped).map(([country, matches]) => {
            const flagUrl = getCountryFlagUrl(country);
            return (
              <section
                key={country}
                className="mb-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm overflow-hidden"
                style={{
                  // Garante padding horizontal adequado no mobile
                  paddingLeft: "max(env(safe-area-inset-left),0.5rem)",
                  paddingRight: "max(env(safe-area-inset-right),0.5rem)",
                  paddingTop: "1.2rem",
                  paddingBottom: "1rem",
                }}
              >
                <div className="flex items-center gap-2 mb-3 px-1">
                  {flagUrl ? (
                    <img src={flagUrl} alt={country} className="w-6 h-auto rounded border" />
                  ) : (
                    <span className="text-lg">{countryToFlagEmoji(country)}</span>
                  )}
                  <span className="font-semibold text-zinc-700 dark:text-zinc-200 text-lg">{country}</span>
                </div>
                <ul className="flex flex-col">
                  {matches.map((match, idx) => (
                    <li key={match.fixture.id} className="w-full">
                      <MatchItem match={match} showFavoritos={true} />
                      {idx < matches.length - 1 && (
                        <div className="w-full h-px my-3 bg-zinc-200 dark:bg-zinc-800" />
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
          {visibleCount < sortedMatches.length && (
            <div className="flex justify-center mt-7 mb-10">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-md font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                onClick={() => setVisibleCount(v => v + 10)}
              >
                <ChevronDown size={18} /> Ver mais
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}