"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MatchesLive from "./MatchesLive";
import ClubesGrid from "./ClubesGrid";
import CampeonatosGrid from "./CampeonatosGrid";
// Removido: import JogadoresGrid from "./JogadoresGrid";

// Tipos
type MainTab = "clubes" | "campeonatos"; // Removido "jogadores"
type PartidasTab = "aoVivo" | "programada" | "terminados";

const PARTIDAS_TABS: { key: PartidasTab; label: string }[] = [
  { key: "aoVivo", label: "Ao Vivo" },
  { key: "programada", label: "Programada" },
  { key: "terminados", label: "Terminados" },
];

const GRID_TABS: { key: MainTab; label: string }[] = [
  { key: "clubes", label: "Clubes" },
  { key: "campeonatos", label: "Campeonatos" },
  // Removido: { key: "jogadores", label: "Jogadores" },
];

export default function ParaVoceHomeGrids({
  expandirPesquisaGlobal,
  selectedDate,
}: {
  expandirPesquisaGlobal?: () => void;
  selectedDate: Date;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Sincronização da tab principal com a URL
  const descobrirTab = searchParams?.get("descobrirTab") as MainTab | null;
  const [mainTab, setMainTab] = useState<MainTab>(descobrirTab || "clubes");

  useEffect(() => {
    if (descobrirTab && descobrirTab !== mainTab) {
      setMainTab(descobrirTab);
    }
  }, [descobrirTab]);

  const tabIndex = GRID_TABS.findIndex((t) => t.key === mainTab);
  function goToTab(idx: number) {
    if (idx < 0 || idx >= GRID_TABS.length) return;
    const key = GRID_TABS[idx].key;
    setMainTab(key);
    const params = new URLSearchParams(searchParams?.toString());
    params.set("descobrirTab", key);
    router.replace(`?${params.toString()}#descobrir-tabs`, { scroll: false });
  }

  // Tabs de partidas (aoVivo, programada, terminados)
  const tabQuery = searchParams?.get("partidasTab");
  const [tabPartidas, setTabPartidas] = useState<PartidasTab>(() => {
    if (tabQuery === "programada" || tabQuery === "terminados") {
      return tabQuery;
    }
    return "aoVivo";
  });

  useEffect(() => {
    const newTab =
      tabQuery === "programada" || tabQuery === "terminados"
        ? tabQuery
        : "aoVivo";
    if (newTab !== tabPartidas) {
      setTabPartidas(newTab);
    }
  }, [tabQuery, tabPartidas]);

  function handleTabClick(key: PartidasTab) {
    setTabPartidas(key);
    const params = new URLSearchParams(searchParams?.toString());
    params.set("partidasTab", key);
    router.replace(`?${params.toString()}#partidas-tabs`, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {GRID_TABS.map((t) => (
              <button
                key={t.key}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                  mainTab === t.key
                    ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-black dark:border-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
                onClick={() => {
                  setMainTab(t.key);
                  const params = new URLSearchParams(searchParams?.toString());
                  params.set("descobrirTab", t.key);
                  router.replace(`?${params.toString()}#descobrir-tabs`, { scroll: false });
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            <button
              aria-label="Anterior"
              onClick={() => goToTab(tabIndex - 1)}
              disabled={tabIndex === 0}
              className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 transition hover:bg-zinc-200 dark:hover:bg-zinc-700"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              aria-label="Próxima"
              onClick={() => goToTab(tabIndex + 1)}
              disabled={tabIndex === GRID_TABS.length - 1}
              className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 transition hover:bg-zinc-200 dark:hover:bg-zinc-700"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div>
          {mainTab === "clubes" && <ClubesGrid />}
          {mainTab === "campeonatos" && <CampeonatosGrid />}
          {/* Removido: {mainTab === "jogadores" && <JogadoresGrid />} */}
        </div>
      </div>

      <div id="partidas">
        <h2 className="text-xl font-bold mb-4">Partidas de Futebol</h2>
        <div id="partidas-tabs" className="flex gap-2 mb-4 scroll-mt-[80px]">
          {PARTIDAS_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                tabPartidas === tab.key
                  ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-black dark:border-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
              onClick={() => handleTabClick(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {tabPartidas === "aoVivo" && (
          <MatchesLive onlyLive selectedDate={selectedDate} />
        )}
        {tabPartidas === "programada" && (
          <MatchesLive onlyScheduled selectedDate={selectedDate} />
        )}
        {tabPartidas === "terminados" && (
          <MatchesLive onlyFinished selectedDate={selectedDate} />
        )}
      </div>
    </div>
  );
}