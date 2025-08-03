"use client";
import ResultadosPartidas from "@/components/global-search/ResultadosPartidas";
import ResultadosClubes from "@/components/global-search/ResultadosClubes";
import ResultadosCampeonatos from "@/components/global-search/ResultadosCampeonatos";
import { SearchCheck } from "lucide-react";

const RESULTADOS_TABS = [
  { key: "partidas", label: "Resultados partidas", icon: <SearchCheck size={18} strokeWidth={2} /> },
  { key: "clubes", label: "Resultados clubes", icon: <SearchCheck size={18} strokeWidth={2} /> },
  { key: "campeonatos", label: "Resultados campeonatos", icon: <SearchCheck size={18} strokeWidth={2} /> },
];

import TabsBar from "./TabsBar";

export default function ResultadosTabs({
  selectedTab,
  onTabChange,
}: {
  selectedTab: string;
  onTabChange: (tab: string) => void;
}) {
  return (
    <div className="w-full max-w-[850px] mx-auto">
      <TabsBar tabs={RESULTADOS_TABS} currentTab={selectedTab} onTab={onTabChange} />
      <div className="mt-2">
        {selectedTab === "partidas" && <ResultadosPartidas />}
        {selectedTab === "clubes" && <ResultadosClubes />}
        {selectedTab === "campeonatos" && <ResultadosCampeonatos />}
      </div>
    </div>
  );
}