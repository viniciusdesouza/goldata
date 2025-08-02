import React, { useState, useMemo } from "react";
import BoxUltimosJogos from "./BoxUltimosJogos";
import BoxProximosJogos from "./BoxProximosJogos";

interface BoxJogosTabsProps {
  partidasTodas: any[]; // todas as partidas já carregadas para o clube/temporada
}

export default function BoxJogosTabs({ partidasTodas = [] }: BoxJogosTabsProps) {
  const [tab, setTab] = useState<"ultimos" | "proximos">("ultimos");

  // Filtra as partidas localmente como no ClubesFavoritosTab
  const now = useMemo(() => new Date(), []);
  const ultimos = useMemo(
    () =>
      partidasTodas
        .filter((m) => new Date(m.fixture.date) < now)
        .sort((a, b) => new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime()),
    [partidasTodas, now]
  );
  const proximos = useMemo(
    () =>
      partidasTodas
        .filter((m) => new Date(m.fixture.date) >= now)
        .sort((a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime()),
    [partidasTodas, now]
  );

  return (
    <div className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 shadow-sm">
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${
            tab === "ultimos"
              ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-100"
          }`}
          onClick={() => setTab("ultimos")}
        >
          Últimos Jogos
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${
            tab === "proximos"
              ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-100"
          }`}
          onClick={() => setTab("proximos")}
        >
          Próximos Jogos
        </button>
      </div>
      {tab === "ultimos" ? (
        <BoxUltimosJogos jogos={ultimos} />
      ) : (
        <BoxProximosJogos jogos={proximos} />
      )}
    </div>
  );
}