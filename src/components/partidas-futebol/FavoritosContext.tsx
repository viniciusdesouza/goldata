"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type FavoritosContextType = {
  favoritos: number[];
  toggleFavorito: (fixtureId: number) => void;
  isFavorito: (fixtureId: number) => boolean;
};

export const FavoritosContext = createContext<FavoritosContextType | undefined>(undefined);

export function FavoritosProvider({ children }: { children: React.ReactNode }) {
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Só executa no client, nunca no SSR!
  useEffect(() => {
    if (typeof window !== "undefined") {
      const salvos = localStorage.getItem("favoritos");
      if (salvos) setFavoritos(JSON.parse(salvos));
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("favoritos", JSON.stringify(favoritos));
    }
  }, [favoritos, hydrated]);

  const toggleFavorito = (fixtureId: number) => {
    setFavoritos((prev) =>
      prev.includes(fixtureId)
        ? prev.filter((id) => id !== fixtureId)
        : [...prev, fixtureId]
    );
  };

  const isFavorito = (fixtureId: number) => favoritos.includes(fixtureId);

  // Evita flicker do SSR/client
  if (!hydrated) return <></>;

  return (
    <FavoritosContext.Provider value={{ favoritos, toggleFavorito, isFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  const ctx = useContext(FavoritosContext);
  if (!ctx) throw new Error("useFavoritos deve ser usado dentro do FavoritosProvider");
  return ctx;
}