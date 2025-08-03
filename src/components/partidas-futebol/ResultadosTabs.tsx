"use client";
import ResultadosPartidas from "@/components/global-search/ResultadosPartidas";
import ResultadosClubes from "@/components/global-search/ResultadosClubes";
import ResultadosCampeonatos from "@/components/global-search/ResultadosCampeonatos";
import { SearchCheck } from "lucide-react";
import TabsBar from "./TabsBar";
import { useState } from "react";

const RESULTADOS_TABS = [
  { key: "partidas", label: "Resultados partidas", icon: <SearchCheck size={18} strokeWidth={2} /> },
  { key: "clubes", label: "Resultados clubes", icon: <SearchCheck size={18} strokeWidth={2} /> },
  { key: "campeonatos", label: "Resultados campeonatos", icon: <SearchCheck size={18} strokeWidth={2} /> },
];

// Se você quiser valores dinâmicos, você pode adaptar para pegar do contexto ou props.
// Aqui, valores fixos apenas para exemplo.
const DEFAULT_LEAGUE_ID = 71;
const DEFAULT_TEMPORADA = 2024;

export default function ResultadosTabs({
  selectedTab,
  onTabChange,
}: {
  selectedTab: string;
  onTabChange: (tab: string) => void;
}) {
  // Se quiser permitir escolher league/temporada, troque por useState ou props/context.
  // const [leagueId, setLeagueId] = useState(DEFAULT_LEAGUE_ID);
  // const [temporada, setTemporada] = useState(DEFAULT_TEMPORADA);

  return (
    <div className="w-full max-w-[850px] mx-auto">
      <TabsBar tabs={RESULTADOS_TABS} currentTab={selectedTab} onTab={onTabChange} />
      <div className="mt-2">
        {selectedTab === "partidas" && <ResultadosPartidas />}
        {selectedTab === "clubes" && <ResultadosClubes />}
        {selectedTab === "campeonatos" && (
          <ResultadosCampeonatos leagueId={DEFAULT_LEAGUE_ID} temporada={DEFAULT_TEMPORADA} />
        )}
      </div>
    </div>
  );
}