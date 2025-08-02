"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type FixedClubesContextType = {
  fixed: number[];
  toggleFixed: (id: number) => void;
  isFixed: (id: number) => boolean;
};

const FixedClubesContext = createContext<FixedClubesContextType | undefined>(undefined);

export function FixedClubesProvider({ children }: { children: ReactNode }) {
  const [fixed, setFixed] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fixedClubes");
      if (saved) setFixed(JSON.parse(saved));
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("fixedClubes", JSON.stringify(fixed));
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
    <FixedClubesContext.Provider value={{ fixed, toggleFixed, isFixed }}>
      {children}
    </FixedClubesContext.Provider>
  );
}

export function useFixedClubes() {
  const ctx = useContext(FixedClubesContext);
  if (!ctx) throw new Error("useFixedClubes must be used inside FixedClubesProvider");
  return ctx;
}