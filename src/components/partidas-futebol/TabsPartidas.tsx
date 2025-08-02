"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PartidasFavoritas from "./PartidasFavoritas";
import ClubesFavoritosTab from "@/components/partidas-futebol/ClubesFavoritosTab";
import CampeonatosFavoritosTab from "@/components/partidas-futebol/CampeonatosFavoritosTab";
import PartidasCompartilhadas from "@/components/partidas-futebol/PartidasCompartilhadas";
import PartidasRecebidas from "@/components/partidas-futebol/PartidasRecebidas";
import ResultadosPartidas from "@/components/global-search/ResultadosPartidas";
import ResultadosClubes from "@/components/global-search/ResultadosClubes";
import ResultadosCampeonatos from "@/components/global-search/ResultadosCampeonatos";
import ParaVoceHomeGrids from "./ParaVoceHomeGrids";
import { useGlobalSearchExpand } from "@/components/global-search/GlobalSearchExpandContext";
import EmptySeguindoMessage from "./EmptySeguindoMessage";
import { getMainTabHref } from "@/lib/menu-list";
import "./tabs-partidas.css";

// --- Configuração das Abas ---
export const MAIN_TABS = [
  { key: "seguindo", label: "Seguindo" },
  { key: "descobrir", label: "Descobrir" },
  { key: "compartilhados", label: "Compartilhados" },
  { key: "resultados", label: "Resultados de Pesquisa" },
];
export const SEGUINDO_TABS = [
  { key: "favoritos", label: "Partidas Favoritas" },
  { key: "clubesFavoritos", label: "Clubes Favoritos" },
  { key: "campeonatosFavoritos", label: "Campeonatos Favoritos" },
];
export const COMPARTILHADOS_TABS = [
  { key: "voceCompartilhou", label: "Você compartilhou" },
  { key: "compartilhadosComVoce", label: "Compartilhados com você" },
];
export const RESULTADOS_TABS = [
  { key: "partidas", label: "Resultados partidas" },
  { key: "clubes", label: "Resultados clubes" },
  { key: "campeonatos", label: "Resultados campeonatos" },
];

// --- Barra de Abas Filhas (ESTILO RESTAURADO) ---
function ChildTabsBarScroll({
  tabs,
  currentTab,
  onTab,
  className = "",
  style = {},
}: {
  tabs: { key: string; label: string }[];
  currentTab: string;
  onTab: (tab: string) => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [tabIdx, setTabIdx] = React.useState(() =>
    tabs.findIndex(t => t.key === currentTab)
  );
  React.useEffect(() => {
    setTabIdx(tabs.findIndex(t => t.key === currentTab));
  }, [currentTab, tabs]);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  let startX = 0;
  let drag = false;
  function onTouchStart(e: React.TouchEvent) {
    drag = true;
    startX = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (!drag) return;
    const endX = e.changedTouches[0].clientX;
    if (endX - startX > 48 && tabIdx > 0) onTab(tabs[tabIdx - 1].key);
    else if (startX - endX > 48 && tabIdx < tabs.length - 1)
      onTab(tabs[tabIdx + 1].key);
    drag = false;
  }
  function goToTab(idx: number) {
    if (idx < 0 || idx >= tabs.length) return;
    onTab(tabs[idx].key);
  }
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") goToTab(tabIdx - 1);
    if (e.key === "ArrowRight") goToTab(tabIdx + 1);
  }

  return (
    <div
      className={`flex items-center gap-2 py-2 px-1 mb-2 relative justify-between ${className}`}
      style={style}
      ref={containerRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="tablist"
    >
      <div className="flex gap-2 flex-1 justify-start overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={[
              "px-4 py-1 rounded-full text-sm font-medium border transition whitespace-nowrap",
              currentTab === tab.key
                ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                : "bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white border-zinc-200 dark:border-zinc-700 hover:bg-black/80 dark:hover:bg-white/80 hover:text-white dark:hover:text-black",
            ].join(" ")}
            onClick={() => onTab(tab.key)}
            type="button"
            aria-selected={currentTab === tab.key}
            tabIndex={0}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex gap-1 ml-2">
        <button
          aria-label="Anterior"
          onClick={() => goToTab(tabIdx - 1)}
          disabled={tabIdx === 0}
          className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 transition hover:bg-zinc-200 dark:hover:bg-zinc-700"
          type="button"
          tabIndex={-1}
        >
          <svg width={20} height={20} stroke="currentColor" fill="none" viewBox="0 0 24 24" className="w-5 h-5"><polyline points="15 18 9 12 15 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button
          aria-label="Próxima"
          onClick={() => goToTab(tabIdx + 1)}
          disabled={tabIdx === tabs.length - 1}
          className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 transition hover:bg-zinc-200 dark:hover:bg-zinc-700"
          type="button"
          tabIndex={-1}
        >
          <svg width={20} height={20} stroke="currentColor" fill="none" viewBox="0 0 24 24" className="w-5 h-5"><polyline points="9 18 15 12 9 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}


// --- Hook para Montagem Preguiçosa ---
function useLazyMount<T extends string>(active: T) {
  const [mounted, setMounted] = React.useState<Record<string, boolean>>({ [active]: true });
  React.useEffect(() => {
    setMounted(old => ({ ...old, [active]: true }));
  }, [active]);
  return mounted;
}

// --- Componentes de Conteúdo das Abas ---
function DescobrirHome({ selectedDate }: { selectedDate: Date }) {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <ParaVoceHomeGrids selectedDate={selectedDate} />
    </div>
  );
}

function SeguindoTabs({ selectedTab, onTabChange, goToDescobrir }: { selectedTab: string, onTabChange: (tab: string) => void, goToDescobrir: () => void }) {
  const mounted = useLazyMount(selectedTab);
  return (
    <div className="w-full max-w-4xl mx-auto">
      <ChildTabsBarScroll tabs={SEGUINDO_TABS} currentTab={selectedTab} onTab={onTabChange} />
      <div>
        {mounted["favoritos"] && selectedTab === "favoritos" && <PartidasFavoritas EmptyComponent={<EmptySeguindoMessage title="Nenhuma partida favorita." showBuscar onBuscar={goToDescobrir}>Salve partidas para acompanhar aqui!</EmptySeguindoMessage>} />}
        {mounted["clubesFavoritos"] && selectedTab === "clubesFavoritos" && <ClubesFavoritosTab EmptyComponent={<EmptySeguindoMessage title="Nenhum clube favorito." showBuscar onBuscar={goToDescobrir}>Siga clubes para acompanhar aqui!</EmptySeguindoMessage>} />}
        {mounted["campeonatosFavoritos"] && selectedTab === "campeonatosFavoritos" && <CampeonatosFavoritosTab EmptyComponent={<EmptySeguindoMessage title="Nenhum campeonato favorito." showBuscar onBuscar={goToDescobrir}>Siga campeonatos para acompanhar aqui!</EmptySeguindoMessage>} />}
      </div>
    </div>
  );
}

function CompartilhadosTabs({ selectedTab, onTabChange }: { selectedTab: string, onTabChange: (tab: string) => void }) {
  const mounted = useLazyMount(selectedTab);
  return (
    <div className="w-full max-w-4xl mx-auto">
      <ChildTabsBarScroll tabs={COMPARTILHADOS_TABS} currentTab={selectedTab} onTab={onTabChange} />
      <div>
        {mounted["voceCompartilhou"] && selectedTab === "voceCompartilhou" && <PartidasCompartilhadas />}
        {mounted["compartilhadosComVoce"] && selectedTab === "compartilhadosComVoce" && <PartidasRecebidas />}
      </div>
    </div>
  );
}

function ResultadosTabs({ selectedTab, onTabChange }: { selectedTab: string, onTabChange: (tab: string) => void }) {
  const mounted = useLazyMount(selectedTab);
  return (
    <div className="w-full max-w-4xl mx-auto">
      <ChildTabsBarScroll tabs={RESULTADOS_TABS} currentTab={selectedTab} onTab={onTabChange} />
      <div className="mt-2">
        {mounted["partidas"] && selectedTab === "partidas" && <ResultadosPartidas />}
        {mounted["clubes"] && selectedTab === "clubes" && <ResultadosClubes />}
        {mounted["campeonatos"] && selectedTab === "campeonatos" && <ResultadosCampeonatos />}
      </div>
    </div>
  );
}

// --- Barra de Abas Principal (FUNCIONALIDADE COMPLETA RESTAURADA) ---
function TabsBarScroll({ tabs, currentTab, onTab, getHref }: { tabs: { key: string; label: string }[], currentTab: string, onTab: (tab: string) => void, getHref: (tabKey: string) => string }) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [showLeft, setShowLeft] = React.useState(false);
  const [showRight, setShowRight] = React.useState(false);

  const isDragging = React.useRef(false);
  const dragStartX = React.useRef<number | null>(null);
  const dragScrollLeft = React.useRef<number>(0);

  function handleMouseDown(e: React.MouseEvent) {
    if (!scrollRef.current) return;
    isDragging.current = true;
    dragStartX.current = e.pageX - scrollRef.current.offsetLeft;
    dragScrollLeft.current = scrollRef.current.scrollLeft;
  }
  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || !scrollRef.current || dragStartX.current === null) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - dragStartX.current;
    scrollRef.current.scrollLeft = dragScrollLeft.current - walk;
  }
  function handleMouseUp() { isDragging.current = false; }
  function handleMouseLeave() { isDragging.current = false; }

  function checkArrows() {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 10);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 10);
  }

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkArrows();
    el.addEventListener("scroll", checkArrows);
    window.addEventListener("resize", checkArrows);
    return () => {
      el.removeEventListener("scroll", checkArrows);
      window.removeEventListener("resize", checkArrows);
    };
  }, []);

  React.useEffect(() => {
    if (!currentTab || !scrollRef.current) return;
    const activeTab = scrollRef.current.querySelector(`[data-tabkey="${currentTab}"]`) as HTMLElement | null;
    if (activeTab) {
      const scroll = scrollRef.current;
      const scrollWidth = scroll.offsetWidth;
      const tabWidth = activeTab.offsetWidth;
      const scrollTo = activeTab.offsetLeft - (scrollWidth - tabWidth) / 2;
      scroll.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  }, [currentTab]);

  const scrollByAmount = (dx: number) => {
    scrollRef.current?.scrollBy({ left: dx, behavior: "smooth" });
  };

  const arrowCircleClass = "absolute z-10 h-full flex items-center p-2 bg-gradient-to-r from-zinc-50 via-zinc-50/80 to-transparent dark:from-zinc-900/50 dark:via-zinc-900/80 dark:to-transparent";

  return (
    <div className="w-full max-w-4xl mx-auto relative select-none rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 mb-2 p-1">
      {showLeft && (
        <button onClick={() => scrollByAmount(-250)} className={`${arrowCircleClass} left-0`}>
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/80 dark:bg-zinc-800/80 shadow-md border border-zinc-200 dark:border-zinc-700"><ChevronLeft size={20} /></span>
        </button>
      )}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="flex flex-row flex-nowrap gap-2 w-full relative overflow-x-auto overflow-y-hidden scrollbar-hide p-1"
      >
        {tabs.map(tab => (
          <a
            key={tab.key}
            href={getHref(tab.key)}
            data-tabkey={tab.key}
            onClick={e => { e.preventDefault(); onTab(tab.key); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              currentTab === tab.key
                ? "bg-zinc-800 text-white shadow-sm"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>
      {showRight && (
        <button onClick={() => scrollByAmount(250)} className={`${arrowCircleClass.replace('to-r', 'to-l').replace('from-zinc-50', 'from-transparent').replace('dark:from-zinc-900/50', 'dark:from-transparent')} right-0`}>
           <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/80 dark:bg-zinc-800/80 shadow-md border border-zinc-200 dark:border-zinc-700"><ChevronRight size={20} /></span>
        </button>
      )}
    </div>
  );
}


// --- Componente Principal ---
export default function TabsPartidas({ selectedDate, selectedTab }: { selectedDate: Date, selectedTab?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlMainTab = searchParams?.get("tab") as "descobrir" | "seguindo" | "compartilhados" | "resultados" | null;
  const urlSubTab = searchParams?.get("subtab") as string | null;

  const mainTab = urlMainTab || "seguindo";
  const seguindoTab = urlMainTab === "seguindo" ? (urlSubTab || "favoritos") : "favoritos";
  const compartilhadosTab = urlMainTab === "compartilhados" ? (urlSubTab || "voceCompartilhou") : "voceCompartilhou";
  const resultadosTab = urlMainTab === "resultados" ? (urlSubTab || "partidas") : "partidas";

  function handleMainTab(tab: string) { router.replace(getMainTabHref(tab)); }
  function handleSeguindoTab(tab: string) { router.replace(`/?tab=seguindo&subtab=${tab}`); }
  function handleCompartilhadosTab(tab: string) { router.replace(`/?tab=compartilhados&subtab=${tab}`); }
  function handleResultadosTab(tab: string) { router.replace(`/?tab=resultados&subtab=${tab}`); }
  function goToDescobrir() { router.replace(getMainTabHref("descobrir")); }

  return (
    <div>
      <TabsBarScroll tabs={MAIN_TABS} currentTab={mainTab} onTab={handleMainTab} getHref={getMainTabHref} />
      {mainTab === "descobrir" && <DescobrirHome selectedDate={selectedDate} />}
      {mainTab === "seguindo" && <SeguindoTabs selectedTab={seguindoTab} onTabChange={handleSeguindoTab} goToDescobrir={goToDescobrir} />}
      {mainTab === "compartilhados" && <CompartilhadosTabs selectedTab={compartilhadosTab} onTabChange={handleCompartilhadosTab} />}
      {mainTab === "resultados" && <ResultadosTabs selectedTab={resultadosTab} onTabChange={handleResultadosTab} />}
    </div>
  );
}
