"use client";
import PartidasFavoritas from "./PartidasFavoritas";
import ClubesFavoritosTab from "@/components/partidas-futebol/ClubesFavoritosTab";
import CampeonatosFavoritosTab from "./CampeonatosFavoritosTab";
import { Heart } from "lucide-react";

const SEGUINDO_TABS = [
  { key: "favoritos", label: "Partidas Favoritas", icon: <Heart size={18} strokeWidth={2} /> },
  { key: "clubesFavoritos", label: "Clubes Favoritos", icon: <Heart size={18} strokeWidth={2} /> },
  { key: "campeonatosFavoritos", label: "Campeonatos Favoritos", icon: <Heart size={18} strokeWidth={2} /> },
];

import TabsBar from "./TabsPartidas"; // Ou importe TabsBar corretamente caso esteja em outro arquivo

export default function SeguindoTabs({
  selectedTab,
  onTabChange,
}: {
  selectedTab: string;
  onTabChange: (tab: string) => void;
}) {
  return (
    <>
      <TabsBar tabs={SEGUINDO_TABS} currentTab={selectedTab} onTab={onTabChange} />
      <div>
        {selectedTab === "favoritos" && <PartidasFavoritas />}
        {selectedTab === "clubesFavoritos" && <ClubesFavoritosTab />}
        {selectedTab === "campeonatosFavoritos" && <CampeonatosFavoritosTab />}
      </div>
    </>
  );
}