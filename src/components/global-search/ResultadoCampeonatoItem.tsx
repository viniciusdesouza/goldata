"use client";
import { useResultadosSalvos } from "./ResultadosSalvosContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react"; // Import React for event types

// --- Definição de Tipos ---
interface Campeonato {
  id: number;
  name: string;
  logo: string;
  country?: {
    name: string;
  };
}

interface Props {
  campeonato: Campeonato;
}

// CORREÇÃO: Aplicando o tipo 'Props' ao componente
export default function ResultadoCampeonatoItem({ campeonato }: Props) {
  const { salvarCampeonato } = useResultadosSalvos();
  const router = useRouter();

  // CORREÇÃO: Adicionando o tipo 'React.MouseEvent' ao evento
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    salvarCampeonato(campeonato);
    router.push("/?tab=resultados&subtab=campeonatos");
  }

  return (
    <div onClick={handleClick} style={{ cursor: "pointer" }}>
      <Link
        href={`/campeonatos/${campeonato.id}`}
        className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
      >
        <img src={campeonato.logo} alt={campeonato.name} className="w-8 h-8 rounded bg-white object-contain" />
        <div>
          <div className="font-bold">{campeonato.name}</div>
          <div className="text-xs text-zinc-500">{campeonato.country?.name}</div>
        </div>
      </Link>
    </div>
  );
}
