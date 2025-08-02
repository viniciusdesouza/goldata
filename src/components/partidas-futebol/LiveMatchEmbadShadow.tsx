"use client";

import { useState, useEffect, useRef } from "react";
import MatchItem from "./MatchItem";
import { ContainerSection } from "@/app/Containers-Categorias-Home";

function MatchSkeleton() {
  return (
    <ContainerSection>
      <div className="w-full h-96 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
    </ContainerSection>
  );
}

export default function LiveMatchEmbed({ fixtureId }: { fixtureId: number }) {
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpdateMessage, setShowUpdateMessage] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const res = await fetch(`/api/football/partidas-futebol/fixture/${fixtureId}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Não foi possível carregar os dados da partida.");
        const data = await res.json();

        if (data.response && data.response.length > 0) {
          const newMatchData = data.response[0];
          setMatch((prev: any) => {
            if (prev && JSON.stringify(prev.goals) !== JSON.stringify(newMatchData.goals)) {
              setShowUpdateMessage(true);
              setTimeout(() => setShowUpdateMessage(false), 2500);
            }
            return newMatchData;
          });

          const status = newMatchData.fixture.status.short;
          if (["FT", "AET", "PEN"].includes(status) && intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        } else {
          throw new Error("Partida não encontrada.");
        }
        setError(null);
      } catch (err: any) {
        setError(err.message || "Erro ao buscar dados.");
        if (intervalRef.current) clearInterval(intervalRef.current);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fetchMatchData, 30000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fixtureId]);

  if (loading) {
    return <MatchSkeleton />;
  }

  if (error) {
    return (
      <ContainerSection>
        <div className="text-center text-red-500 py-10">{error}</div>
      </ContainerSection>
    );
  }

  if (!match) return null;

  return (
    // ✅ USA O SEU CONTAINER PADRÃO E A CLASSE 'not-prose'
    <ContainerSection className="relative my-6 not-prose dark:bg-zinc-900">
      <MatchItem match={match} showFavoritos={false} />
      {showUpdateMessage && (
        <div className="absolute top-6 right-6 bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full border border-green-400 animate-pulse">
          Placar atualizado em tempo real ⚡️
        </div>
      )}
    </ContainerSection>
  );
}