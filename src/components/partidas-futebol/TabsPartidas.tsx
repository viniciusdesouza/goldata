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
import EmptySeguindoMessage from "./EmptySeguindoMessage";
import { getMainTabHref } from "@/lib/menu-list";
import TabsBarScroll from "./TabsBarScroll";
import "./tabs-partidas.css";

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
// Tab "Jogadores" removida de SEGUINDO_TABS

export const COMPARTILHADOS_TABS = [
  { key: "voceCompartilhou", label: "Você compartilhou" },
  { key: "compartilhadosComVoce", label: "Compartilhados com você" },
];
export const RESULTADOS_TABS = [
  { key: "partidas", label: "Resultados partidas" },
  { key: "clubes", label: "Resultados clubes" },
  { key: "campeonatos", label: "Resultados campeonatos" },
];

function useLazyMount<T extends string>(active: T) {
  const [mounted, setMounted] = React.useState<Record<string, boolean>>({ [active]: true });
  React.useEffect(() => {
    setMounted(old => ({ ...old, [active]: true }));
  }, [active]);
  return mounted;
}

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
      <TabsBarScroll
        tabs={SEGUINDO_TABS}
        currentTab={selectedTab}
        onTab={onTabChange}
        buttonClass="tabs-sub-btn"
        containerClass="tabs-sub-bar"
      />
      <div>
        {mounted["favoritos"] && selectedTab === "favoritos" && (
          <PartidasFavoritas
            EmptyComponent={
              <EmptySeguindoMessage title="Nenhuma partida favorita." showBuscar onBuscar={goToDescobrir}>
                Salve partidas para acompanhar aqui!
              </EmptySeguindoMessage>
            }
          />
        )}
        {mounted["clubesFavoritos"] && selectedTab === "clubesFavoritos" && (
          <ClubesFavoritosTab
            EmptyComponent={
              <EmptySeguindoMessage title="Nenhum clube favorito." showBuscar onBuscar={goToDescobrir}>
                Siga clubes para acompanhar aqui!
              </EmptySeguindoMessage>
            }
          />
        )}
        {mounted["campeonatosFavoritos"] && selectedTab === "campeonatosFavoritos" && (
          <CampeonatosFavoritosTab
            EmptyComponent={
              <EmptySeguindoMessage title="Nenhum campeonato favorito." showBuscar onBuscar={goToDescobrir}>
                Siga campeonatos para acompanhar aqui!
              </EmptySeguindoMessage>
            }
          />
        )}
        {/* Tab "Jogadores" removida daqui também */}
      </div>
    </div>
  );
}
function CompartilhadosTabs({ selectedTab, onTabChange }: { selectedTab: string, onTabChange: (tab: string) => void }) {
  const mounted = useLazyMount(selectedTab);
  return (
    <div className="w-full max-w-4xl mx-auto">
      <TabsBarScroll
        tabs={COMPARTILHADOS_TABS}
        currentTab={selectedTab}
        onTab={onTabChange}
        buttonClass="tabs-sub-btn"
        containerClass="tabs-sub-bar"
      />
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
      <TabsBarScroll
        tabs={RESULTADOS_TABS}
        currentTab={selectedTab}
        onTab={onTabChange}
        buttonClass="tabs-sub-btn"
        containerClass="tabs-sub-bar"
      />
      <div className="mt-2">
        {mounted["partidas"] && selectedTab === "partidas" && <ResultadosPartidas />}
        {mounted["clubes"] && selectedTab === "clubes" && <ResultadosClubes />}
        {mounted["campeonatos"] && selectedTab === "campeonatos" && <ResultadosCampeonatos />}
      </div>
    </div>
  );
}

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
      <TabsBarScroll
        tabs={MAIN_TABS}
        currentTab={mainTab}
        onTab={handleMainTab}
        getHref={getMainTabHref}
        buttonClass="tabs-main-btn"
        containerClass="tabs-main-pill"
      />
      {mainTab === "descobrir" && <DescobrirHome selectedDate={selectedDate} />}
      {mainTab === "seguindo" && (
        <SeguindoTabs
          selectedTab={seguindoTab}
          onTabChange={handleSeguindoTab}
          goToDescobrir={goToDescobrir}
        />
      )}
      {mainTab === "compartilhados" && (
        <CompartilhadosTabs
          selectedTab={compartilhadosTab}
          onTabChange={handleCompartilhadosTab}
        />
      )}
      {mainTab === "resultados" && (
        <ResultadosTabs
          selectedTab={resultadosTab}
          onTabChange={handleResultadosTab}
        />
      )}
    </div>
  );
}