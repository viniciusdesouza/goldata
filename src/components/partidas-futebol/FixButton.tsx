import { Star, Pin, UserPlus } from "lucide-react";
import React from "react"; // Import React for event types

// --- Definição de Tipos ---
interface FixButtonProps {
  active: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "partida" | "campeonato" | "clube";
}

// CORREÇÃO: Aplicando os tipos às props do componente
export default function FixButton({ active, onClick, type = "partida" }: FixButtonProps) {
  const icon = type === "partida"
    ? <Star fill={active ? "#fde047" : "none"} color="#fde047" size={20} />
    : type === "campeonato"
      ? <Pin fill={active ? "#fb923c" : "none"} color="#fb923c" size={20} />
      : <UserPlus color="#9333ea" size={20} />;
      
  const label = active
    ? (type === "partida" ? "Desfavoritar" : type === "campeonato" ? "Desafixar" : "Deixar de seguir")
    : (type === "partida" ? "Favoritar" : type === "campeonato" ? "Fixar" : "Seguir");

  return (
    <button
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold border transition
        ${active ? "bg-yellow-100 dark:bg-yellow-800 shadow" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"}
      `}
      style={{
        borderColor: active ? "#fde047" : "#e5e7eb",
        color: active ? "#b45309" : "#444",
        boxShadow: active ? "0 2px 12px #fde04744" : undefined,
        fontWeight: active ? 700 : 500,
      }}
      onClick={onClick}
      aria-pressed={active}
    >
      {icon}
      {label}
    </button>
  );
}
