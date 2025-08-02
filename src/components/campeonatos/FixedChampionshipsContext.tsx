"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type FixedChampionshipsContextType = {
  fixed: number[];
  toggleFixed: (id: number) => void;
  isFixed: (id: number) => boolean;
};

const FixedChampionshipsContext = createContext<FixedChampionshipsContextType | undefined>(undefined);

export function FixedChampionshipsProvider({ children }: { children: ReactNode }) {
  const [fixed, setFixed] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fixedChampionships");
      if (saved) setFixed(JSON.parse(saved));
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("fixedChampionships", JSON.stringify(fixed));
    }
  }, [fixed, hydrated]);

  function toggleFixed(id: number) {
    setFixed((curr) =>
      curr.includes(id) ? curr.filter((fid) => fid !== id) : [...curr, id]
    );
  }

  function isFixed(id: number) {
    return fixed.includes(id);
  }

  if (!hydrated) return null;

  return (
    <FixedChampionshipsContext.Provider value={{ fixed, toggleFixed, isFixed }}>
      {children}
    </FixedChampionshipsContext.Provider>
  );
}

export function useFixedChampionships() {
  const ctx = useContext(FixedChampionshipsContext);
  if (!ctx) throw new Error("useFixedChampionships must be used inside FixedChampionshipsProvider");
  return ctx;
}