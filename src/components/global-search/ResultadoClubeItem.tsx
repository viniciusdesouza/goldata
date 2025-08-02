"use client";
import { useResultadosSalvos } from "./ResultadosSalvosContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react"; // Import React for event types

// --- Definição de Tipos ---
interface Clube {
  id: number;
  name: string;
  logo: string;
  country?: {
    name: string;
  };
}

interface Props {
  clube: Clube;
}

// CORREÇÃO: Aplicando o tipo 'Props' ao componente
export default function ResultadoClubeItem({ clube }: Props) {
  const { salvarClube } = useResultadosSalvos();
  const router = useRouter();

  // CORREÇÃO: Adicionando o tipo 'React.MouseEvent' ao evento
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    salvarClube(clube);
    router.push("/?tab=resultados&subtab=clubes");
  }

  return (
    <div onClick={handleClick} style={{ cursor: "pointer" }}>
      <Link
        href={`/clubes/${clube.id}`}
        className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
      >
        <img src={clube.logo} alt={clube.name} className="w-8 h-8 rounded-full bg-white object-contain" />
        <div>
          <div className="font-bold">{clube.name}</div>
          <div className="text-xs text-zinc-500">{clube.country?.name}</div>
        </div>
      </Link>
    </div>
  );
}
