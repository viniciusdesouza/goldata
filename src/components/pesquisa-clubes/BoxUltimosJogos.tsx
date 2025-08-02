import React, { useState } from "react";
import MatchItemSemFavoritos from "@/components/partidas-futebol/MatchItemSemFavoritos";

interface BoxUltimosJogosProps {
  jogos: any[];
  titulo?: string;
  pageSize?: number;
}

const BoxUltimosJogos: React.FC<BoxUltimosJogosProps> = ({
  jogos = [],
  titulo,
  pageSize = 5,
}) => {
  const [offset, setOffset] = useState(pageSize);

  const mostrar = jogos.slice(0, offset);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[6px] border border-gray-200 dark:border-zinc-700 p-4">
      <div className="font-semibold mb-2">{titulo || "Últimos Jogos"}</div>
      {(!jogos || jogos.length === 0) ? (
        <div className="text-gray-500 text-sm">Nenhum jogo encontrado.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {mostrar.map((jogo) => (
            <div key={jogo.fixture.id}>
              <MatchItemSemFavoritos match={jogo} />
            </div>
          ))}
          {offset < jogos.length && (
            <button
              className="self-center mt-2 px-4 py-2 rounded-lg bg-[hsl(220_7%_38%)] text-white text-sm font-semibold shadow transition hover:bg-[hsl(220_7%_28%)]"
              onClick={() => setOffset((o) => o + pageSize)}
            >
              Ver mais últimos jogos
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BoxUltimosJogos;