"use client";

import { useState, useEffect } from "react";
import MatchItem from "./MatchItem";

// --- Definição de Tipos ---
interface Match {
  fixture: {
    id: number;
    status: {
      short: string;
    };
  };
  // Adicione outras propriedades da partida conforme necessário
}

// Idealmente, esta interface deveria ser exportada do arquivo MatchItem.tsx
interface MatchItemProps {
  match: Match;
  showActions?: boolean; // Adicionando a prop opcional que estava faltando
}

// Criando uma versão tipada do MatchItem para uso local
const TypedMatchItem = MatchItem as React.FC<MatchItemProps>;


function MatchSkeleton() {
  return (
    <div className="w-full h-96 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse my-6"></div>
  );
}

export default function LiveMatchEmbed({ fixtureId }: { fixtureId: number }) {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpdateMessage, setShowUpdateMessage] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const fetchMatchData = async () => {
      try {
        const res = await fetch(`/api/football/partidas-futebol/fixture/${fixtureId}`);
        if (!res.ok) {
          throw new Error("Não foi possível carregar os dados da partida.");
        }
        const data = await res.json();
        
        if (data.response && data.response.length > 0) {
          const newMatchData: Match = data.response[0];
          
          // Compara o placar para mostrar a mensagem de atualização
          if (match !== null) {
            setShowUpdateMessage(true);
            setTimeout(() => setShowUpdateMessage(false), 2500);
          }
          
          setMatch(newMatchData);

          const status = newMatchData.fixture.status.short;
          if (["FT", "AET", "PEN"].includes(status) && intervalId) {
            clearInterval(intervalId);
          }
        } else {
          throw new Error("Partida não encontrada.");
        }
      } catch (err: any) {
        setError(err.message);
        if (intervalId) clearInterval(intervalId);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData(); // Busca inicial
    intervalId = setInterval(fetchMatchData, 30000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixtureId]);

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <MatchSkeleton />
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="text-center text-red-500 py-10">{error}</div>
      </div>
    );
  }
  if (!match) return null;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative my-6 p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-md">
        <TypedMatchItem match={match} showActions={false} />
        {showUpdateMessage && (
          <div 
            className="absolute top-6 right-6 bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full border border-green-400 animate-pulse"
          >
            Placar atualizado em tempo real ⚡️
          </div>
        )}
      </div>
    </div>
  );
}
