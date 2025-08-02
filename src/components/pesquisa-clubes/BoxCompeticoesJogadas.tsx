import React from "react";
import Link from "next/link";

interface CompeticaoJogada {
  id: number;
  nome: string;
  logo: string;
  tipo: string;
  pais: string;
  temporada?: {
    year: number;
    start?: string;
    end?: string;
    current?: boolean;
    coverage?: any;
  };
}

interface BoxCompeticoesJogadasProps {
  competicoes: CompeticaoJogada[];
}

const BoxCompeticoesJogadas: React.FC<BoxCompeticoesJogadasProps> = ({ competicoes }) => {
  if (!competicoes || competicoes.length === 0) {
    return (
      <div>
        <div className="font-semibold mb-2 text-center">Competições Jogadas</div>
        <div className="text-gray-500 text-sm">
          Nenhuma competição registrada para esta temporada.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="font-semibold mb-2 text-center">Competições Jogadas</div>
      <ul className="flex flex-col gap-1">
        {/* Cabeçalho */}
        <li className="flex items-center px-2 py-1 text-[14px] font-semibold text-blue-900 dark:text-blue-100 border-b border-zinc-200 dark:border-zinc-700 bg-blue-50 dark:bg-blue-950 rounded-t-xl select-none">
          <span className="w-9" /> {/* Espaço para o logo */}
          <span className="flex-1 text-left pl-2">Competição</span>
          <span className="w-36 text-center">País / Tipo / Ano</span>
        </li>
        {competicoes.map((comp, idx) => (
          <li
            key={comp.id}
            className={
              "flex items-center px-2 py-[0.313rem] text-[14px] border border-zinc-200 dark:border-zinc-800 rounded-md w-full " +
              (idx % 2 === 0
                ? "bg-white dark:bg-zinc-900"
                : "bg-gray-50 dark:bg-zinc-800")
            }
          >
            <span className="w-9 flex justify-center items-center">
              <img
                src={comp.logo}
                alt={comp.nome}
                className="w-7 h-7 rounded border bg-white"
                loading="lazy"
              />
            </span>
            <span className="flex-1 text-left font-medium text-zinc-700 dark:text-zinc-200 pl-2" style={{ fontSize: 14 }}>
              <Link
                href={`/campeonatos/${comp.id}`}
                className="text-blue-700 dark:text-blue-300 hover:underline transition-colors"
              >
                {comp.nome}
              </Link>
            </span>
            <span className="w-36 text-center text-xs text-gray-600 dark:text-zinc-300 font-medium">
              <span className="inline-block">{comp.pais}</span>
              <span className="mx-1 text-gray-400">&middot;</span>
              <span className="inline-block">{comp.tipo}</span>
              {comp.temporada && comp.temporada.year && (
                <>
                  <span className="mx-1 text-gray-400">&middot;</span>
                  <span className="inline-block">{comp.temporada.year}</span>
                </>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoxCompeticoesJogadas;