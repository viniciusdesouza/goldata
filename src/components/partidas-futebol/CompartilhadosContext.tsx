"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type CompartilhadosContextType = {
  compartilhados: number[];
  toggleCompartilhado: (fixtureId: number) => void;
  isCompartilhado: (fixtureId: number) => boolean;
};

export const CompartilhadosContext = createContext<CompartilhadosContextType | undefined>(undefined);

export function CompartilhadosProvider({ children }: { children: React.ReactNode }) {
  const [compartilhados, setCompartilhados] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const salvos = localStorage.getItem("compartilhados");
      if (salvos) setCompartilhados(JSON.parse(salvos));
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("compartilhados", JSON.stringify(compartilhados));
    }
  }, [compartilhados, hydrated]);

  const toggleCompartilhado = (fixtureId: number) => {
    setCompartilhados((prev) =>
      prev.includes(fixtureId)
        ? prev.filter((id) => id !== fixtureId)
        : [...prev, fixtureId]
    );
  };

  const isCompartilhado = (fixtureId: number) => compartilhados.includes(fixtureId);

  if (!hydrated) return <></>;

  return (
    <CompartilhadosContext.Provider value={{ compartilhados, toggleCompartilhado, isCompartilhado }}>
      {children}
    </CompartilhadosContext.Provider>
  );
}

export function useCompartilhados() {
  const ctx = useContext(CompartilhadosContext);
  if (!ctx) throw new Error("useCompartilhados deve ser usado dentro do CompartilhadosProvider");
  return ctx;
}