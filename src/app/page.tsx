"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import TabsPartidas from "@/components/partidas-futebol/TabsPartidas";
import { ContainerPage } from "./Containers-Categorias-Home"; // importa o componente container padrão

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const searchParams = useSearchParams();
  const selectedTab = searchParams?.get("tab") || "seguindo";

  return (
    <ContainerPage>
    
      <TabsPartidas selectedDate={selectedDate} selectedTab={selectedTab} />
    </ContainerPage>
  );
}