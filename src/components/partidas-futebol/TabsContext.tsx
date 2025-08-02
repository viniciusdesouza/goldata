"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type Tab = "aoVivo" | "todos" | "terminados" | "favoritos" | "campeonatosFixos";

const TabsContext = createContext<{
  tab: Tab;
  setTab: (tab: Tab) => void;
}>({
  tab: "aoVivo",
  setTab: () => {},
});

export function TabsProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<Tab>("aoVivo");
  return (
    <TabsContext.Provider value={{ tab, setTab }}>
      {children}
    </TabsContext.Provider>
  );
}

export function useTabs() {
  return useContext(TabsContext);
}