"use client";
import PartidasCompartilhadas from "./PartidasCompartilhadas";
import PartidasRecebidas from "./PartidasRecebidas";
import { Share2 } from "lucide-react";
import React from "react";

const COMPARTILHADOS_TABS = [
  { key: "voceCompartilhou", label: "Você compartilhou", icon: <Share2 size={16} /> },
  { key: "compartilhadosComVoce", label: "Compartilhados com você", icon: <Share2 size={16} /> },
];

// --- Componente de Barra de Abas Reutilizável ---
// Este componente foi criado para lidar com a renderização das abas.
interface TabsBarProps {
  tabs: { key: string; label: string; icon?: React.ReactNode }[];
  currentTab: string;
  onTab: (tab: string) => void;
}

function TabsBar({ tabs, currentTab, onTab }: TabsBarProps) {
  return (
    <div className="flex items-center gap-2 py-2 px-1 mb-4 border-b border-zinc-200 dark:border-zinc-800">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTab(tab.key)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            currentTab === tab.key
              ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50"
          }`}
          type="button"
          aria-selected={currentTab === tab.key}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}


// --- Componente Principal ---
interface CompartilhadosTabsProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

export default function CompartilhadosTabs({
  selectedTab,
  onTabChange,
}: CompartilhadosTabsProps) {
  return (
    <>
      {/* Agora usando o componente TabsBar correto, que resolve o erro de tipo. */}
      <TabsBar tabs={COMPARTILHADOS_TABS} currentTab={selectedTab} onTab={onTabChange} />
      <div>
        {selectedTab === "voceCompartilhou" && <PartidasCompartilhadas />}
        {selectedTab === "compartilhadosComVoce" && <PartidasRecebidas />}
      </div>
    </>
  );
}
