"use client";

import { useEffect, useState } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import ptBR from "date-fns/locale/pt-BR";

// Tipos simplificados
type Team = { name: string; logo: string };
type Fixture = { id: number; date: string; status: { short: string; elapsed?: number } };
type League = { id: number; name: string; country: string };
type Match = {
  fixture: Fixture;
  league: League;
  teams: { home: Team; away: Team };
  goals: { home: number; away: number };
};

type MatchesLiveProps = {
  selectedDate?: Date; // Se quiser permitir mudar a data, senão sempre hoje
};

export default function MatchesLive({ selectedDate }: MatchesLiveProps) {
  const today = selectedDate ?? new Date();
  const [matches, setMatches] = useState<Match[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Busca todas as partidas do dia
  useEffect(() => {
    setLoading(true);
    const dateStr = format(today, "yyyy-MM-dd");
    fetch(`/api/football/fixtures?date=${dateStr}`)
      .then(res => res.json())
      .then(data => setMatches(Array.isArray(data.response) ? data.response : []))
      .finally(() => setLoading(false));
  }, [today]);

  // 2. Busca partidas ao vivo e as atualiza a cada 20s APENAS para hoje
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const fetchLive = () => {
      if (!isSameDay(today, new Date())) {
        setLiveMatches([]);
        return;
      }
      fetch("/api/football/live")
        .then(res => res.json())
        .then(data => setLiveMatches(Array.isArray(data.response) ? data.response : []));
    };
    fetchLive();
    if (isSameDay(today, new Date())) {
      interval = setInterval(fetchLive, 20000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [today]);

  // 3. Junta ao vivo + restantes do dia (sem duplicar)
  const fixtureIdsLive = new Set(liveMatches.map(m => m.fixture.id));
  // Timezone do usuário
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Partidas futuras (NS ou programadas para hoje e depois do agora no horário local)
  const futureMatches = matches.filter(m => {
    if (fixtureIdsLive.has(m.fixture.id)) return false;
    const fixtureUtc = parseISO(m.fixture.date);
    const fixtureLocal = utcToZonedTime(fixtureUtc, userTimeZone);
    const isNS = m.fixture.status.short === "NS";
    return (
      isNS &&
      isSameDay(fixtureLocal, today) &&
      fixtureLocal.getTime() > new Date().getTime()
    );
  });

  // Filtra as que são do dia selecionado no horário LOCAL
  function isMatchOnDay(match: Match, day: Date) {
    const fixtureUtc = parseISO(match.fixture.date);
    const fixtureLocal = utcToZonedTime(fixtureUtc, userTimeZone);
    return isSameDay(fixtureLocal, day);
  }

  // Ao vivo do dia local do usuário
  const liveMatchesToday = liveMatches.filter(m => isMatchOnDay(m, today));

  // 4. Ordena: ao vivo primeiro, depois por horário do fixture.date (ambos em localtime)
  const orderedMatches = [
    ...liveMatchesToday.sort((a, b) => {
      const aLocal = utcToZonedTime(parseISO(a.fixture.date), userTimeZone);
      const bLocal = utcToZonedTime(parseISO(b.fixture.date), userTimeZone);
      return aLocal.getTime() - bLocal.getTime();
    }),
    ...futureMatches.sort((a, b) => {
      const aLocal = utcToZonedTime(parseISO(a.fixture.date), userTimeZone);
      const bLocal = utcToZonedTime(parseISO(b.fixture.date), userTimeZone);
      return aLocal.getTime() - bLocal.getTime();
    }),
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-3 text-blue-700">
        {format(today, "EEEE, dd 'de' MMMM yyyy", { locale: ptBR })}
      </h2>
      {loading ? (
        <div className="text-center text-gray-400 py-10">Carregando partidas...</div>
      ) : orderedMatches.length === 0 ? (
        <div className="text-center text-gray-400 py-10">Nenhuma partida encontrada para esta data.</div>
      ) : (
        <ul className="space-y-4">
          {orderedMatches.map(match => {
            const isLive = ["1H","2H","ET","P","LIVE"].includes(match.fixture.status.short);
            const isNS = match.fixture.status.short === "NS";
            const fixtureUtc = parseISO(match.fixture.date);
            const fixtureLocal = utcToZonedTime(fixtureUtc, userTimeZone);
            return (
              <li key={match.fixture.id}
                  className={`rounded-xl border shadow p-4 bg-white flex items-center justify-between
                    ${isLive ? "ring-2 ring-green-500/40" : isNS ? "opacity-90" : ""}
                  `}>
                <div className="flex items-center gap-4">
                  <img src={match.teams.home.logo} alt={match.teams.home.name} className="w-7 h-7 rounded" />
                  <span className="font-semibold">{match.teams.home.name}</span>
                  <span className={`text-xl font-bold mx-2 ${isLive ? "text-green-700" : isNS ? "text-blue-800" : "text-gray-600"}`}>
                    {match.goals.home} - {match.goals.away}
                  </span>
                  <span className="font-semibold">{match.teams.away.name}</span>
                  <img src={match.teams.away.logo} alt={match.teams.away.name} className="w-7 h-7 rounded" />
                </div>
                <div className="flex flex-col items-end min-w-[80px]">
                  <span className="text-xs text-gray-500">{match.league.name}</span>
                  <span className={`text-xs mt-1 px-2 py-0.5 rounded font-bold transition-all
                    ${isLive ? "bg-green-100 text-green-800 animate-pulse"
                      : isNS ? "bg-gray-100 text-blue-700"
                      : "bg-gray-100 text-gray-500"}
                  `}>
                    {statusText(match.fixture.status.short, match.fixture.status.elapsed, fixtureLocal)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// Função auxiliar para status amigável
function statusText(short: string, elapsed?: number, localDate?: Date) {
  switch (short) {
    case "NS": return localDate ? format(localDate, "HH:mm") : "A definir";
    case "1H": return `1º tempo ${elapsed || ""}'`;
    case "HT": return "Intervalo";
    case "2H": return `2º tempo ${elapsed || ""}'`;
    case "ET": return `Prorrogação ${elapsed || ""}'`;
    case "P": return "Pênaltis";
    case "FT": return "Finalizado";
    case "AET": return "Finalizado (Prorrogação)";
    case "PEN": return "Finalizado (Pênaltis)";
    case "SUSP": return "Suspenso";
    case "PST": return "Adiado";
    case "CANC": return "Cancelado";
    case "ABD": return "Abandonado";
    case "AWD": return "W.O.";
    case "WO": return "W.O.";
    case "LIVE": return `Ao Vivo ${elapsed || ""}'`;
    default: return short;
  }
}