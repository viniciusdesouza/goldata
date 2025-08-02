"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type CompartilhadosRecebidosContextType = {
  compartilhadosRecebidos: number[];
  adicionarCompartilhadoRecebido: (fixtureId: number) => void;
  removerCompartilhadoRecebido: (fixtureId: number) => void;
  isCompartilhadoRecebido: (fixtureId: number) => boolean;
};

export const CompartilhadosRecebidosContext = createContext<CompartilhadosRecebidosContextType | undefined>(undefined);

export function CompartilhadosRecebidosProvider({ children }: { children: React.ReactNode }) {
  const [compartilhadosRecebidos, setCompartilhadosRecebidos] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const salvos = localStorage.getItem("compartilhadosRecebidos");
      if (salvos) setCompartilhadosRecebidos(JSON.parse(salvos));
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("compartilhadosRecebidos", JSON.stringify(compartilhadosRecebidos));
    }
  }, [compartilhadosRecebidos, hydrated]);

  const adicionarCompartilhadoRecebido = (fixtureId: number) => {
    setCompartilhadosRecebidos((prev) =>
      prev.includes(fixtureId)
        ? prev
        : [...prev, fixtureId]
    );
  };

  const removerCompartilhadoRecebido = (fixtureId: number) => {
    setCompartilhadosRecebidos((prev) =>
      prev.filter((id) => id !== fixtureId)
    );
  };

  const isCompartilhadoRecebido = (fixtureId: number) =>
    compartilhadosRecebidos.includes(fixtureId);

  if (!hydrated) return <></>;

  return (
    <CompartilhadosRecebidosContext.Provider value={{
      compartilhadosRecebidos,
      adicionarCompartilhadoRecebido,
      removerCompartilhadoRecebido,
      isCompartilhadoRecebido,
    }}>
      {children}
    </CompartilhadosRecebidosContext.Provider>
  );
}

export function useCompartilhadosRecebidos() {
  const ctx = useContext(CompartilhadosRecebidosContext);
  if (!ctx) throw new Error("useCompartilhadosRecebidos deve ser usado dentro do CompartilhadosRecebidosProvider");
  return ctx;
}