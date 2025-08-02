"use client";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useFixedChampionships } from "./FixedChampionshipsContext";
import { useToast } from "@/components/ui/ToastContext";
import { useTheme } from "next-themes";
import "./pinbutton.css";

type PinButtonProps = {
  id: number;
  size?: number;
  showText?: boolean; // se true, aparece "Favoritar"/"Fixar", se false só ícone
  label?: string;     // texto customizável
};

// Tons vermelhos suaves (igual ao círculo do botão e do ícone)
const RED_FILL_LIGHT = "#fecaca";        // red-200
const RED_STROKE_LIGHT = "#b91c1c";     // red-800
const RED_BORDER_LIGHT = "#fee2e2";     // red-100 (borda suave NÃO favoritado)
const RED_BORDER_PINNED_LIGHT = "#dc2626"; // red-600 (borda forte favoritado)

const RED_FILL_DARK = "#fca5a5";        // red-300
const RED_STROKE_DARK = "#fb7185";      // red-400
const RED_BORDER_DARK = "#3f1c21";      // dark: bem fraco (NÃO favoritado)
const RED_BORDER_PINNED_DARK = "#fb7185"; // dark: forte (favoritado)

export default function PinButton({
  id,
  size = 20,
  showText = true,
  label = "Seguir",
}: PinButtonProps) {
  const { isFixed, toggleFixed } = useFixedChampionships();
  const { showToast } = useToast();
  const fixed = isFixed(id);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Hover state para trocar texto "Seguindo" <-> "Deixar de seguir"
  const [isHovered, setIsHovered] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    toggleFixed(id);

    showToast({
      message: fixed
        ? "Campeonato removido dos favoritos"
        : "Campeonato adicionado aos favoritos! Acessar",
      type: "success",
      actionLabel: fixed ? undefined : "Acessar",
      href: fixed
        ? undefined
        : "/?tab=seguindo&subtab=campeonatosFavoritos",
      colorClass: !fixed ? "bg-red-600" : undefined,
      action: undefined,
    });
  }

  // Bordas do círculo: mais fraco quando não favoritado, mais forte quando favoritado
  const circleBorderColor = fixed
    ? (isDark ? RED_BORDER_PINNED_DARK : RED_BORDER_PINNED_LIGHT)
    : (isDark ? RED_BORDER_DARK : RED_BORDER_LIGHT);

  // Cores do coração
  const heartStroke = fixed
    ? (isDark ? RED_STROKE_DARK : RED_STROKE_LIGHT)
    : (isDark ? RED_STROKE_DARK : RED_STROKE_LIGHT);
  const heartFill = fixed
    ? (isDark ? RED_FILL_DARK : RED_FILL_LIGHT)
    : "none";

  // Texto do botão: alterna entre "Seguir", "Seguindo" e "Deixar de seguir" (em duas linhas, expande até a borda)
  let buttonText: React.ReactNode = label;
  if (showText) {
    if (fixed) {
      if (isHovered) {
        buttonText = (
          <span
            style={{
              display: "inline-block",
              whiteSpace: "normal",
              lineHeight: "1.15",
              textAlign: "center",
              width: "100%",
              minWidth: 70,
              wordBreak: "keep-all",
            }}
          >
            Deixar de<br />seguir
          </span>
        );
      } else {
        buttonText = "Seguindo";
      }
    }
  }

  // Altura mínima forçada para comportar 2 linhas sempre que necessário
  const extraStyle =
    showText && fixed && isHovered
      ? { minHeight: 40, paddingTop: 7, paddingBottom: 7, transition: "min-height 0.15s,padding 0.15s" }
      : { minHeight: 32, transition: "min-height 0.15s,padding 0.15s" };

  return (
    <button
      title={fixed ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      onClick={handleClick}
      className={
        showText
          ? `champ-pin-btn${fixed ? " pinned" : ""}`
          : `champ-pin-icon-btn${fixed ? " pinned" : ""}`
      }
      aria-pressed={fixed}
      tabIndex={0}
      type="button"
      style={{
        borderColor: circleBorderColor,
        ...extraStyle,
        overflow: "hidden",
        width: showText ? undefined : undefined,
        maxWidth: "100%",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showText && buttonText}
      <Heart
        size={size}
        strokeWidth={2}
        color={heartStroke}
        fill={heartFill}
        className="champ-pin-icon"
        style={{ marginLeft: showText ? 6 : 0 }}
      />
    </button>
  );
}