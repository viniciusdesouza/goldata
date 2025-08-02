"use client";
import ResultadoClubeItem from "./ResultadoClubeItem";

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
  clubes: Clube[];
}

// CORREÇÃO: Aplicando o tipo 'Props' ao componente
export default function ResultadosPesquisaClubes({ clubes }: Props) {
  if (!clubes || clubes.length === 0) {
    return <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">Nenhum clube encontrado.</div>;
  }

  return (
    <ul className="space-y-3">
      {clubes.map((clube) => (
        <li key={clube.id}>
          <ResultadoClubeItem clube={clube} />
        </li>
      ))}
    </ul>
  );
}
