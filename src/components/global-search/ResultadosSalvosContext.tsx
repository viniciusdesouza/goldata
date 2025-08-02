"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { normalizeMatch } from "./normalizeMatch";

type Partida = any;
type Clube = any;
type Campeonato = any;

type ResultadosSalvosContextType = {
  partidas: Partida[];
  clubes: Clube[];
  campeonatos: Campeonato[];
  salvarPartida: (p: Partida) => void;
  salvarClube: (c: Clube) => void;
  salvarCampeonato: (c: Campeonato) => void;
};

const ResultadosSalvosContext = createContext<ResultadosSalvosContextType | undefined>(undefined);

function getFromStorage<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function saveToStorage<T>(key: string, arr: T[]) {
  localStorage.setItem(key, JSON.stringify(arr));
}

export function ResultadosSalvosProvider({ children }: { children: React.ReactNode }) {
  const [partidas, setPartidas] = useState<any[]>([]);
  const [clubes, setClubes] = useState<any[]>([]);
  const [campeonatos, setCampeonatos] = useState<any[]>([]);

  // Carrega do localStorage na montagem e normaliza
  useEffect(() => {
    const stored = getFromStorage<any>("partidasSalvas");
    const normalizadas = stored.map(normalizeMatch).filter(Boolean);
    setPartidas(normalizadas);
    setClubes(getFromStorage<any>("clubesSalvos"));
    setCampeonatos(getFromStorage<any>("campeonatosSalvos"));
  }, []);

  const salvarPartida = useCallback((partida: Partida) => {
    setPartidas((current) => {
      const id = partida.fixture?.id || partida.id;
      if (current.some((p) => (p.fixture?.id || p.id) === id)) return current;
      const normalizada = normalizeMatch(partida);
      if (!normalizada) return current;
      const novo = [normalizada, ...current]; // Add no topo
      saveToStorage("partidasSalvas", novo);
      return novo;
    });
  }, []);

  const salvarClube = useCallback((clube: Clube) => {
    setClubes((current) => {
      if (current.some((c) => c.id === clube.id)) return current;
      const novo = [clube, ...current];
      saveToStorage("clubesSalvos", novo);
      return novo;
    });
  }, []);

  const salvarCampeonato = useCallback((camp: Campeonato) => {
    setCampeonatos((current) => {
      if (current.some((c) => c.id === camp.id)) return current;
      const novo = [camp, ...current];
      saveToStorage("campeonatosSalvos", novo);
      return novo;
    });
  }, []);

  return (
    <ResultadosSalvosContext.Provider value={{
      partidas, clubes, campeonatos,
      salvarPartida, salvarClube, salvarCampeonato,
    }}>
      {children}
    </ResultadosSalvosContext.Provider>
  );
}

export function useResultadosSalvos() {
  const ctx = useContext(ResultadosSalvosContext);
  if (!ctx) throw new Error("useResultadosSalvos precisa estar dentro do ResultadosSalvosProvider");
  return ctx;
}