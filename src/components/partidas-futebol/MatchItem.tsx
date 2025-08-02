"use client";
import Link from "next/link";
import { Star, Share2, MapPin, CalendarDays, BarChart2, Clock } from "lucide-react";
import MatchTabs from "./MatchTabs";
import { useFavoritos } from "./FavoritosContext";
import { useCompartilhados } from "./CompartilhadosContext";
import { useToast } from "@/components/ui/ToastContext";
import { statusColors } from "./utils";
import { formatarDataPartida } from "./utilsFormatarData";
import { useRouter } from "next/navigation";
import { useTabs } from "./TabsContext";
import "./matchitem.css";
import { useEffect, useState, Dispatch, SetStateAction } from "react";

// --- Definição de Tipos ---
interface MatchEvent {
  type: string;
  detail?: string;
  player?: { name: string };
  assist?: { name: string };
  time?: { elapsed: number };
  team?: { name: string };
}

interface Match {
  fixture: {
    id: number;
    status: {
      short: string;
      long: string;
      elapsed?: number;
      extra?: number;
    };
    date: string;
    venue?: {
      name?: string;
      city?: string;
    };
  };
  league: {
    id: number;
    name: string;
    logo: string;
    round: string;
    season: number; // CORREÇÃO: Adicionando a propriedade 'season' que estava faltando.
  };
  teams: {
    home: { id: number; name: string; logo: string };
    away: { id: number; name: string; logo: string };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}

interface MatchItemProps {
  match: Match;
  showFavoritos?: boolean;
  openFixtureId?: number | null;
  setOpenFixtureId?: Dispatch<SetStateAction<number | null>>;
  openTab?: string;
  setOpenTab?: (tab: string) => void;
  h2h?: any;
  loadingH2H?: boolean;
  lineups?: any;
  loadingLineups?: boolean;
  odds?: any;
  loadingOdds?: boolean;
  probabilities?: any;
  loadingProb?: boolean;
  standings?: any;
  loadingStandings?: boolean;
  stats?: any;
  loadingStats?: boolean;
  showActions?: boolean;
}


const TOAST_FAVORITOS_CLASS = "bg-yellow-300 text-black";
const TOAST_COMPARTILHADOS_CLASS = "bg-cyan-300 text-black";

async function fetchMatchEvents(fixtureId: number): Promise<{ response: MatchEvent[] }> {
  const res = await fetch(`/api/football/partidas-futebol/events?fixture=${fixtureId}`);
  return res.json();
}

function renderGoalIcon(detail: string | undefined) {
  if (detail === "Own Goal") {
    return <span className="mi-goal-ball mi-goal-own">⚽️</span>;
  }
  if (detail === "Missed Penalty") {
    return <span className="mi-goal-ball mi-goal-missed">⚽️❌</span>;
  }
  if (detail === "Penalty") {
    return <span className="mi-goal-ball mi-goal-penalty">⚽️</span>;
  }
  return <span className="mi-goal-ball mi-goal-normal">⚽️</span>;
}

function renderGoals(events: MatchEvent[], teamName: string) {
  const teamGoals = events.filter(
    (ev) => ev.type === "Goal" && ev.team?.name === teamName
  );
  if (!teamGoals.length) return null;
  return (
    <ul className="mi-goals-list">
      {teamGoals.map((goal, idx) => {
        const isOwn = goal.detail === "Own Goal";
        const isMissed = goal.detail === "Missed Penalty";
        const isPenalty = goal.detail === "Penalty";
        return (
          <li
            key={idx}
            className={[
              "mi-goal-item",
              isOwn ? "mi-goal-own" : "",
              isMissed ? "mi-goal-missed" : "",
              isPenalty ? "mi-goal-penalty" : "",
            ].join(" ")}
          >
            {renderGoalIcon(goal.detail)}
            <span className="mi-goal-player">{goal.player?.name}</span>
            {isOwn && (
              <span className="mi-goal-detail" style={{ color: "#e11d48", marginLeft: 3 }}>
                gol contra
              </span>
            )}
            {isPenalty && (
              <span className="mi-goal-detail" style={{ color: "#7c3aed", marginLeft: 3 }}>
                pênalti
              </span>
            )}
            {isMissed && (
              <span className="mi-goal-detail" style={{ color: "#b91c1c", marginLeft: 3 }}>
                pênalti perdido
              </span>
            )}
            {!isOwn && !isMissed && goal.assist?.name && (
              <span className="mi-goal-assist">Assist: {goal.assist.name}</span>
            )}
            <span className="mi-goal-time">{goal.time?.elapsed}'</span>
          </li>
        );
      })}
    </ul>
  );
}

function MatchStatusBadge({ statusShort, elapsed, extra }: { statusShort: string, elapsed?: number, extra?: number }) {
  if (["NS", "TBD"].includes(statusShort)) {
    return (
      <span className="mi-status-badge mi-status-badge-scheduled text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500 bg-blue-50 dark:bg-blue-950">
        Programada
      </span>
    );
  }

  if (statusShort === "HT") {
    return (
      <span className="mi-status-badge mi-status-badge-blink">
        Intervalo
      </span>
    );
  }

  if (["1H", "2H", "LIVE", "IN_PROGRESS", "ET", "P"].includes(statusShort)) {
    let tempo = "";
    elapsed = Number(elapsed) || 0;
    extra = Number(extra) || 0;

    if (["1H", "2H", "ET", "P"].includes(statusShort)) {
        tempo = `${elapsed}'`;
    }
    
    return (
      <span className="mi-status-badge mi-status-badge-blink">
        <span className="mi-live-dot" />
        Ao vivo {tempo}{extra > 0 && `+${extra}`}
      </span>
    );
  }

  if (["FT", "AET", "PEN"].includes(statusShort)) {
    return (
      <span className="mi-status-badge mi-status-badge-finished">
        Encerrado
      </span>
    );
  }

  return (
    <span className="mi-status-badge">
      {statusShort}
    </span>
  );
}

export default function MatchItem({ match, showFavoritos = true }: MatchItemProps) {
  if (!match?.fixture?.id || !match.teams || !match.league) {
    return <div className="mi-list-container text-center py-4">Dados da partida inválidos.</div>;
  }

  const { fixture, league, teams, goals } = match;
  const { id: fixtureId, status, date, venue } = fixture;

  const { toggleFavorito, isFavorito } = useFavoritos();
  const { toggleCompartilhado, isCompartilhado } = useCompartilhados();
  const { showToast } = useToast();
  const router = useRouter();
  
  const { setTab } = useTabs() as { setTab?: (tabKey: string) => void };

  const favorito = isFavorito(fixtureId);
  const compartilhado = isCompartilhado(fixtureId);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  function handleToggleFavorito() {
    toggleFavorito(fixtureId);
    showToast?.({
      message: !favorito ? "Partida adicionada aos favoritos! Acessar" : "Partida removida dos favoritos!",
      type: !favorito ? "success" : "info",
      colorClass: TOAST_FAVORITOS_CLASS,
      actionLabel: !favorito ? "Acessar" : undefined,
      action: !favorito ? () => {
        setTab?.("favoritos");
        router.replace("/?tab=seguindo&subtab=favoritos");
      } : undefined,
    });
  }

  function handleCompartilhar() {
    toggleCompartilhado(fixtureId);
    if (!compartilhado) {
        const url = `${window.location.origin}/partidas-futebol/${fixtureId}?shared=1`;
        navigator.clipboard.writeText(url);
        showToast?.({
            message: "Link da partida copiado para compartilhar! Acessar",
            type: "success",
            colorClass: TOAST_COMPARTILHADOS_CLASS,
            actionLabel: "Acessar",
            action: () => {
                setTab?.("voceCompartilhou");
                router.replace("/?tab=compartilhados&subtab=voceCompartilhou");
            },
        });
    } else {
        showToast?.({
            message: "Partilha removida.",
            type: "info",
            colorClass: TOAST_COMPARTILHADOS_CLASS,
        });
    }
  }

  useEffect(() => {
    let isMounted = true;
    setLoadingEvents(true);
    fetchMatchEvents(fixtureId)
      .then((data) => {
        if (isMounted) setEvents(data.response ?? []);
      })
      .finally(() => {
        if (isMounted) setLoadingEvents(false);
      });
    return () => { isMounted = false; };
  }, [fixtureId, goals.home, goals.away]);

  const dataFormatada = formatarDataPartida(status.short, date);
  const horario = new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const localCompleto = [venue?.name, venue?.city].filter(Boolean).join(', ');
  const hasGoals = events.some(ev => ev.type === "Goal");

  return (
    <div className="mi-list-container">
      <div className="mi-list-header">
        <div className="mi-list-league-row-responsive">
          <div className="mi-list-league-logo-wrap">
            {league.logo && <img src={league.logo} alt={league.name} className="mi-list-league-logo" loading="lazy" />}
          </div>
          <div className="mi-list-league-main">
            <div className="mi-list-league-title-row">
              <div className="mi-list-league-info">
                <Link href={`/campeonatos/${league.id}`} className="mi-list-league-link" title={league.name}>
                  {league.name}
                </Link>
                {league.round && <span className="mi-list-round">{league.round}</span>}
              </div>
              <div className="mi-list-header-actions">
                <button className={`mi-list-fav-btn mi-list-btn-small${favorito ? " favorito" : ""}`} onClick={handleToggleFavorito} title={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
                  <Star size={16} className="mi-fav-star" color={favorito ? "#eab308" : "#bfa800"} fill={favorito ? "#eab308" : "none"} strokeWidth={1.5} />
                  <span className="mi-btn-label">{favorito ? "Favoritado" : "Favoritar"}</span>
                </button>
                <button className={`mi-list-share-btn mi-list-btn-small${compartilhado ? " compartilhado" : ""}`} onClick={handleCompartilhar} title={compartilhado ? "Remover compartilhamento" : "Compartilhar"}>
                  <Share2 size={16} className="mi-share-icon" color={compartilhado ? "#06b6d4" : "#0891b2"} fill="none" strokeWidth={1.8} />
                  <span className="mi-btn-label">{compartilhado ? "Compartilhado" : "Compartilhar"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mi-list-info-row"><CalendarDays size={14} className="mi-label-icon" /> Data: <span className="mi-list-info-value">{dataFormatada}</span></div>
      <div className="mi-list-info-row"><Clock size={14} className="mi-label-icon" /> Horário: <span className="mi-list-info-value">{horario}</span></div>
      <div className="mi-list-info-row"><MapPin size={14} className="mi-label-icon" /> Local: <span className="mi-list-info-value">{localCompleto || <span className="text-zinc-400">Não informado</span>}</span></div>
      <div className="mi-list-info-row"><BarChart2 size={14} className="mi-label-icon" /> Status: <span className="mi-list-info-value"><MatchStatusBadge statusShort={status.short} elapsed={status.elapsed} extra={status.extra} /></span></div>

      <div className="mi-list-teams-score">
        <div className="mi-list-team">
          <Link href={`/clubes/${teams.home.id}`} className="mi-list-team-link">
            <img src={teams.home.logo} alt={teams.home.name} className="mi-list-team-logo" />
            <span className="mi-list-team-name">{teams.home.name}</span>
          </Link>
        </div>
        <div className="mi-list-score">
          <span className={`mi-list-score-number ${statusColors(status.short)}`}>{goals.home}</span>
          <span className="mi-list-score-sep">–</span>
          <span className={`mi-list-score-number ${statusColors(status.short)}`}>{goals.away}</span>
        </div>
        <div className="mi-list-team">
          <Link href={`/clubes/${teams.away.id}`} className="mi-list-team-link">
            <img src={teams.away.logo} alt={teams.away.name} className="mi-list-team-logo" />
            <span className="mi-list-team-name">{teams.away.name}</span>
          </Link>
        </div>
      </div>
      
      {hasGoals && (
        <div className="mi-list-goals-section">
          <div className="mi-list-goals-side">
            {!loadingEvents && renderGoals(events, teams.home.name)}
          </div>
          <div className="mi-list-goals-side">
            {!loadingEvents && renderGoals(events, teams.away.name)}
          </div>
        </div>
      )}
      
      <div className="mi-list-tabs">
        <MatchTabs match={match} />
      </div>
    </div>
  );
}
