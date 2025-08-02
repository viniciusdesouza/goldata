"use client";
import { useResultadosSalvos } from "./ResultadosSalvosContext";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

// --- Definição de Tipos ---
interface Clube {
  id: number;
  name: string;
  logo: string;
  country?: {
    name: string;
  };
}

export default function ResultadosClubes() {
  const { clubes } = useResultadosSalvos();
  const searchParams = useSearchParams();
  
  // CORREÇÃO: Acessando 'searchParams' de forma segura com optional chaining (?.)
  const highlight = searchParams?.get("highlight");
  const blocoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (highlight === "novo" && blocoRef.current) {
      const element = blocoRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset;
      const offset = (typeof window !== "undefined" && window.innerWidth >= 768) ? 80 : 112;
      window.scrollTo({ top: y - offset, behavior: "smooth" });
    }
  }, [highlight, clubes.length]);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl mt-2 p-4 w-full max-w-[850px] mx-auto">
      <div
        className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-200"
        id="bloco-clubes-salvos"
        ref={blocoRef}
      >
        Resultados de Clubes Salvos
      </div>
      {clubes.length === 0 && (
        <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">Nenhum clube salvo.</div>
      )}
      <ul className="space-y-2">
        {clubes.map((clube: Clube) => (
          <li key={clube.id}>
            <Link
              href={`/clubes/${clube.id}`}
              className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <img src={clube.logo} alt={clube.name} className="w-8 h-8 rounded-full bg-white object-contain" />
              <div>
                <div className="font-bold text-zinc-900 dark:text-zinc-100">{clube.name}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">{clube.country?.name}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
