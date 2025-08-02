import React from "react";

interface CompeticaoAtual {
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

interface BoxCompCurrentProps {
  competicoes: CompeticaoAtual[];
}

const BoxCompCurrent: React.FC<BoxCompCurrentProps> = ({ competicoes }) => {
  if (!competicoes || competicoes.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-[6px] border border-gray-200 dark:border-zinc-700 p-4">
        <div className="font-semibold mb-2">Competições Atuais</div>
        <div className="text-gray-500 text-sm">
          Nenhuma competição encontrada nesta temporada.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[6px] border border-gray-200 dark:border-zinc-700 p-4">
      <div className="font-semibold mb-2">Competições Atuais</div>
      <div className="flex flex-wrap gap-4">
        {competicoes.map((comp) => (
          <div
            key={comp.id}
            className="flex items-center gap-2 px-2 py-1 border border-gray-200 dark:border-zinc-700 rounded bg-gray-50 dark:bg-gray-800"
          >
            <img
              src={comp.logo}
              alt={comp.nome}
              className="w-7 h-7 rounded border bg-white"
            />
            <div>
              <div className="font-semibold">{comp.nome}</div>
              <div className="text-xs text-gray-500">
                {comp.pais} &middot; {comp.tipo}
                {comp.temporada && comp.temporada.year
                  ? ` &middot; ${comp.temporada.year}`
                  : ""}
                {comp.temporada && comp.temporada.current === false
                  ? " (não atual)"
                  : ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoxCompCurrent;