"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import TabsPartidas from "@/components/partidas-futebol/TabsPartidas";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const searchParams = useSearchParams();
  const selectedTab = searchParams?.get("tab") || "seguindo";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-zinc-900 dark:text-zinc-100">
        Para Você
      </h1>
      <TabsPartidas selectedDate={selectedDate} selectedTab={selectedTab} />
    </main>
  );
}