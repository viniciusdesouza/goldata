"use client";
import ResultadoPartidaItem from "./ResultadoPartidaItem";
import { normalizeMatch } from "./normalizeMatch";

// --- Definição de Tipos ---
interface Partida {
  id?: number; // O ID pode estar na raiz
  fixture?: {
    id: number;
    // Adicione outras propriedades se necessário
  };
  // Adicione outras propriedades da partida se necessário
}

interface Props {
  partidas: Partida[];
}

// CORREÇÃO: Aplicando o tipo 'Props' ao componente
export default function ResultadosPesquisaPartidas({ partidas }: Props) {
  if (!partidas || partidas.length === 0) {
    return <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">Nenhuma partida encontrada.</div>;
  }

  return (
    <div>
      {partidas.map((partida, idx) => {
        const normalized = normalizeMatch(partida);
        if (!normalized) {
          return (
            <div key={partida.id || idx} className="py-8 text-center text-red-500">
              Dados da partida inválidos.
            </div>
          );
        }
        return (
          <div key={normalized.fixture?.id || partida.id || idx}>
            <ResultadoPartidaItem partida={normalized} />
            {idx < partidas.length - 1 && (
              <hr className="my-6 border-zinc-200 dark:border-zinc-700" />
            )}
          </div>
        );
      })}
    </div>
  );
}
