"use client";
import MatchItem from "./MatchItem";
// CORREÇÃO: 'ShadowRoot' é o export padrão da biblioteca, então não deve ser importado com chaves {}.
import ShadowRoot from "react-shadow";

// --- Definição de Tipos ---
// Reutilizando a interface 'Match' para garantir consistência e segurança de tipo.
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
  };
  league: {
    id: number;
    name: string;
    logo: string;
    season: number;
    round: string;
  };
  teams: {
    home: any; // Pode ser mais detalhado se necessário
    away: any;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}

interface MatchItemShadowProps {
  match: Match;
}

export default function MatchItemShadow({ match }: MatchItemShadowProps) {
  return (
    // @ts-ignore - A biblioteca 'react-shadow' pode ter problemas de tipo com React 18. Esta diretiva ignora o erro.
    <ShadowRoot mode="open">
      <link rel="stylesheet" href="/_next/static/css/mi-match-root.css" />
      <div className="mi-match-root">
        <MatchItem match={match} showFavoritos={false} />
      </div>
    </ShadowRoot>
  );
}
