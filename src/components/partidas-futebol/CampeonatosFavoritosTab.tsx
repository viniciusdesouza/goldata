"use client";
import { useEffect, useState } from "react";
import { useFixedChampionships } from "@/components/campeonatos/FixedChampionshipsContext";
import UltimaProximaRodada from "@/components/campeonatos/UltimaProximaRodada";
import EmptySeguindoMessage from "./EmptySeguindoMessage";

const POLLING_INTERVAL = 120000; // 2 minutos

export default function CampeonatosFavoritosTab({
  EmptyComponent,
}: {
  EmptyComponent?: React.ReactNode;
} = {}) {
  const { fixed } = useFixedChampionships();
  const [leaguesInfo, setLeaguesInfo] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0); // para forçar recarregar

  // Polling: a cada 2min, refaz fetch das infos dos campeonatos
  useEffect(() => {
    let running = true;
    let interval: NodeJS.Timeout | null = null;

    async function fetchAll() {
      setLoading(true);
      const infos: Record<number, any> = {};
      await Promise.all(
        fixed.map(async (leagueId) => {
          try {
            const res = await fetch(`/api/football/campeonatos/info?league=${leagueId}`);
            const data = await res.json();
            infos[leagueId] = data.response?.[0]?.league || {};
          } catch {
            infos[leagueId] = {};
          }
        })
      );
      if (running) setLeaguesInfo(infos);
      setLoading(false);
    }

    function doFetchAndReload() {
      fetchAll();
      setReloadKey((k) => k + 1);
    }

    if (fixed.length > 0) {
      doFetchAndReload();
      interval = setInterval(doFetchAndReload, POLLING_INTERVAL);
    } else {
      setLoading(false);
    }
    return () => {
      running = false;
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [fixed]);

  if (loading) {
    return (
      <div className="py-8 text-center text-zinc-500">
        Carregando campeonatos favoritos...
      </div>
    );
  }
  if (!fixed.length) {
    return (
      EmptyComponent ||
      <EmptySeguindoMessage title="Nenhum campeonato favorito.">
        Siga campeonatos para acompanhar aqui!
      </EmptySeguindoMessage>
    );
  }

  return (
    <>
      {fixed.map((leagueId) => {
        const info = leaguesInfo[leagueId] || {};
        const temporada = info.season || new Date().getFullYear();

        return (
          <div key={leagueId} className="mb-6">
            {/* reloadKey força re-render/polling das rodadas */}
            <UltimaProximaRodada
              key={`${leagueId}-${reloadKey}`}
              leagueId={leagueId}
              temporada={temporada}
            />
          </div>
        );
      })}
    </>
  );
}