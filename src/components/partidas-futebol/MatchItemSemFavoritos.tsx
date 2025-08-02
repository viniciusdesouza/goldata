import { useEffect, useState } from "react";
import MatchTabs from "./MatchTabs";
import { statusColors, statusText } from "./utils";
import Link from "next/link";

// Função para buscar eventos (gols) de uma partida
async function fetchMatchEvents(fixtureId: number) {
  const res = await fetch(`/api/football/partidas-futebol/events?fixture=${fixtureId}`);
  return res.json();
}

function getMinuteAndStatus(status: { short: string; elapsed?: number }) {
  switch (status.short) {
    case "NS": return "Pré-jogo";
    case "1H": return `1ºT ${status.elapsed ?? ""}'`;
    case "HT": return "Intervalo";
    case "2H": return `2ºT ${status.elapsed ?? ""}'`;
    case "ET": return `Prorrogação ${status.elapsed ?? ""}'`;
    case "P": return "Pênaltis";
    case "FT": return "Finalizado";
    default: return statusText(status.short);
  }
}

function renderGoals(events: any[], team: "home" | "away", teamName: string) {
  const teamGoals = events.filter(
    (ev: any) => ev.type === "Goal" && ev.team?.name === teamName
  );
  if (!teamGoals.length) return null;
  return (
    <ul className="mt-1 text-xs text-gray-700 space-y-0.5">
      {teamGoals.map((goal, idx) => (
        <li key={idx} className="flex items-center gap-1">
          <span className="font-bold text-green-700">{goal.player?.name}</span>
          <span>
            {goal.detail && goal.detail !== "Normal Goal" ? (
              <span className="italic text-gray-500">({goal.detail})</span>
            ) : null}
          </span>
          {goal.assist?.name && (
            <span className="text-gray-500 ml-1">Assist: {goal.assist.name}</span>
          )}
          <span className="ml-1 text-[11px] text-gray-400">{goal.time?.elapsed}'</span>
        </li>
      ))}
    </ul>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MatchItemSemFavoritos({ match }: any) {
  const status = match.fixture.status.short;
  const color = statusColors(status);
  const fixtureId = match.fixture.id;

  // Eventos (gols)
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchMatchEvents(fixtureId)
      .then((data) => {
        if (isMounted) setEvents(data.response ?? []);
      })
      .finally(() => {
        if (isMounted) setLoadingEvents(false);
      });
    return () => {
      isMounted = false;
    };
  }, [fixtureId]);

  // Apenas a localização (estádio + cidade)
  const horario = formatDate(match.fixture.date);
  const estadioPartida = match.fixture.venue?.name?.trim() || "Local indefinido";
  const cidade = match.fixture.venue?.city || "";
  const localCompleto = `${estadioPartida}${cidade ? `, ${cidade}` : ""}`;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[6px] p-4 pb-0 mb-4">
      {/* Horário e Local */}
      <div className="flex items-center justify-center gap-2 text-[16px] text-gray-600 mb-2">
        <span className="font-semibold">
          {horario}
        </span>
        <span className="text-[22px] leading-none pb-0.5 select-none" aria-hidden>·</span>
        <span className="truncate font-medium" title={localCompleto}>
          {localCompleto}
        </span>
      </div>
      <div className="flex items-center justify-between">
        {/* Time Mandante */}
        <div className="flex-1 flex flex-col items-center">
          <Link href={`/clubes/${match.teams.home.id}`} className="group flex flex-col items-center">
            <img
              src={match.teams.home.logo}
              alt={match.teams.home.name}
              className="w-7 h-7 group-hover:scale-110 transition"
            />
            <span className="text-sm mt-1 group-hover:underline">{match.teams.home.name}</span>
          </Link>
          {!loadingEvents && renderGoals(events, "home", match.teams.home.name)}
        </div>
        {/* Placar, tempo de jogo */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-blue-800">
            {getMinuteAndStatus(match.fixture.status)}
          </span>
          <span className={`text-xl font-bold ${color}`}>
            {match.goals.home} - {match.goals.away}
          </span>
        </div>
        {/* Time Visitante */}
        <div className="flex-1 flex flex-col items-center">
          <Link href={`/clubes/${match.teams.away.id}`} className="group flex flex-col items-center">
            <img
              src={match.teams.away.logo}
              alt={match.teams.away.name}
              className="w-7 h-7 group-hover:scale-110 transition"
            />
            <span className="text-sm mt-1 group-hover:underline">{match.teams.away.name}</span>
          </Link>
          {!loadingEvents && renderGoals(events, "away", match.teams.away.name)}
        </div>
      </div>
      {/* Espaço extra entre a partida e as tabs */}
      <div className="h-3" />
      <MatchTabs match={match} />
    </div>
  );
}