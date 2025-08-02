"use client";
import React, { createContext, useContext, useRef } from "react";

type GlobalSearchExpandContextType = {
  expandirPesquisaGlobal: () => void;
  setExpandCallback: (cb: () => void) => void;
};

const GlobalSearchExpandContext = createContext<GlobalSearchExpandContextType>({
  expandirPesquisaGlobal: () => {},
  setExpandCallback: () => {},
});

export function useGlobalSearchExpand() {
  return useContext(GlobalSearchExpandContext);
}

/**
 * Provider para envolver sua aplicação (coloque no layout.tsx).
 * O componente GlobalSearch pode chamar setExpandCallback passando uma função que expande o search.
 * Os outros componentes chamam expandirPesquisaGlobal() para expandir.
 */
export function GlobalSearchExpandProvider({ children }: { children: React.ReactNode }) {
  const expandCallbackRef = useRef<(() => void) | null>(null);

  function expandirPesquisaGlobal() {
    expandCallbackRef.current?.();
  }

  function setExpandCallback(cb: () => void) {
    expandCallbackRef.current = cb;
  }

  return (
    <GlobalSearchExpandContext.Provider value={{ expandirPesquisaGlobal, setExpandCallback }}>
      {children}
    </GlobalSearchExpandContext.Provider>
  );
}