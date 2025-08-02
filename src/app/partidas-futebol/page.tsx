"use client";

import { useState } from "react";
import CalendarCustom from "@/components/partidas-futebol/CalendarCustom";
import { FavoritosProvider } from "@/components/partidas-futebol/FavoritosContext";
import TabsPartidas from "@/components/partidas-futebol/TabsPartidas";
import {
  ContainerPage,
  ContainerSection,
} from "@/app/Containers-Categorias-Home";

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <FavoritosProvider>
      <ContainerPage>
        <h1 className="text-2xl font-bold text-center mb-6">Partidas de Futebol</h1>
        <ContainerSection className="mb-4">
          <div className="flex flex-col items-center w-full">
            <CalendarCustom
              selected={selectedDate}
              onSelect={date => date && setSelectedDate(date)}
            />
          </div>
        </ContainerSection>
        <TabsPartidas selectedDate={selectedDate} />
      </ContainerPage>
    </FavoritosProvider>
  );
}