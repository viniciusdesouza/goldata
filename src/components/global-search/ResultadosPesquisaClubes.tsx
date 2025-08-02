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
      {clubes.map((clube, idx) => (
        <li key={clube.id || idx} className="mb-2">
          <ResultadoClubeItem clube={clube} />
          {idx < clubes.length - 1 && (
            <hr className="my-6 border-zinc-200 dark:border-zinc-700" />
          )}
        </li>
      ))}
    </ul>
  );
}
