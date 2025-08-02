"use client";

import { SidebarCategoryPreview } from "@/components/admin-panel/sidebar-categories-preview";
import { Trophy } from "lucide-react";

// Função processData igual você usa no sidebar
function processCampeonatosData(data?: any) {
  if (!data || !data.response) return [];
  return data.response
    .map((item: any) => ({
      id: item.league.id,
      name: item.league.name,
      logo: item.league.logo,
      url: `/campeonatos/${item.league.id}`,
      itemType: "campeonato" as const,
      showPin: true,
    }))
    .slice(0, 10);
}

export default function CampeonatosGridHome() {
  return (
    <SidebarCategoryPreview
      title="Campeonatos Populares"
      icon={<Trophy size={20} />}
      fetchUrl="/api/football/campeonatos/fixed"
      allUrl="/campeonatos"
      processData={processCampeonatosData}
      itemUrlPrefix="/campeonatos/"
      layout="grid"
    />
  );
}