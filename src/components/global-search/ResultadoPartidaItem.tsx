"use client";
import { useResultadosSalvos } from "./ResultadosSalvosContext";
import { useRouter } from "next/navigation";
import MatchItem from "@/components/partidas-futebol/MatchItem";
import { normalizeMatch } from "./normalizeMatch";

// --- Definição de Tipos ---
// Define a estrutura bruta da partida, como vem da API
interface Partida {
  fixture: {
    id: number;
    // Adicione outras propriedades do fixture se necessário
  };
  league: object; // Detalhes da liga
  teams: object; // Detalhes dos times
  goals: object; // Detalhes dos gols
  // Adicione outras propriedades que a API retorna
}

interface Props {
  partida: Partida;
}

// CORREÇÃO: Aplicando o tipo 'Props' ao componente
export default function ResultadoPartidaItem({ partida }: Props) {
  const { salvarPartida } = useResultadosSalvos();
  const router = useRouter();

  // NUNCA normalize aqui para salvar!
  function handleClick() {
    salvarPartida(partida); // Salva o BRUTO
    router.push("/?tab=resultados&subtab=partidas");
  }

  // Só normalize na exibição
  const normalized = normalizeMatch(partida);

  if (!normalized) {
    return <div className="py-8 text-center text-red-400">Dados da partida inválidos.</div>;
  }

  return (
    <div onClick={handleClick} style={{ cursor: "pointer" }}>
      <MatchItem match={normalized} />
    </div>
  );
}
