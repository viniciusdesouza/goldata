import React from "react";

interface PaisInfo {
  name: string;
  code?: string;
  flag?: string;
  continent?: string;
}

interface BoxPaisProps {
  pais: PaisInfo | null;
}

const BoxPais: React.FC<BoxPaisProps> = ({ pais }) => {
  if (!pais) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-[6px] border border-gray-200 dark:border-zinc-700 p-4">
        <div className="font-semibold mb-2">País</div>
        <div className="text-gray-500 text-sm">
          Nenhuma informação de país disponível.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[6px] border border-gray-200 dark:border-zinc-700 p-4 flex items-center gap-4">
      {pais.flag && (
        <img
          src={pais.flag}
          alt={pais.name}
          className="w-10 h-7 rounded border bg-white"
        />
      )}
      <div>
        <div className="font-bold text-lg">{pais.name}</div>
        {pais.continent && (
          <div className="text-sm text-gray-500">{pais.continent}</div>
        )}
        {pais.code && (
          <div className="text-xs text-gray-400">Código: {pais.code}</div>
        )}
      </div>
    </div>
  );
};

export default BoxPais;