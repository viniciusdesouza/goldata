"use client";
import { Heart } from "lucide-react";
import { useFixedClubes } from "./FixedClubesContext";
import { useToast } from "@/components/ui/ToastContext";
import { useTheme } from "next-themes";
import "./pinbuttonclube.css";
import { useState } from "react";

type PinButtonClubeProps = {
  id: number;
  size?: number;
  showText?: boolean;
  label?: string;
};

export default function PinButtonClube({
  id,
  size = 20,
  showText = true,
  label = "Seguir",
}: PinButtonClubeProps) {
  const { isFixed, toggleFixed } = useFixedClubes();
  const { showToast } = useToast();
  const fixed = isFixed(id);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [isHovered, setIsHovered] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    toggleFixed(id);

    showToast({
      message: fixed
        ? "Clube removido dos favoritos"
        : "Clube adicionado aos favoritos! Acessar",
      type: "success",
      actionLabel: fixed ? undefined : "Acessar",
      href: fixed
        ? undefined
        : "/?tab=seguindo&subtab=clubesFavoritos",
      colorClass: !fixed ? "bg-red-500" : undefined,
      action: undefined,
    });
  }

  const btnClass = showText
    ? `club-heart-btn${fixed ? " pinned" : ""}`
    : `club-heart-icon-btn${fixed ? " pinned" : ""}`;

  const circleBorderColor = fixed
    ? (isDark ? "#fb7185" : "#dc2626")
    : (isDark ? "#3f1c21" : "#fee2e2");

  // Se hover e fixado, mostra em duas linhas formatadas e ocupa todo o botão
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
      className={btnClass}
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
      <HeartIconCustom
        size={size}
        filled={fixed}
        dark={isDark}
        style={{ marginLeft: showText ? 6 : 0 }}
      />
    </button>
  );
}

// Ícone do coração customizado para melhor contraste em ambos os temas
function HeartIconCustom({
  size,
  filled,
  dark,
  style,
}: {
  size: number;
  filled: boolean;
  dark: boolean;
  style?: React.CSSProperties;
}) {
  if (filled) {
    if (dark) {
      return (
        <svg
          className="club-heart-icon"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          style={style}
          fill="none"
        >
          <path
            d="M12 21s-5.05-4.338-7.03-6.493C2.35 12.112 2 10.4 2 9.24 2 6.35 4.686 4 7.457 4A5.08 5.08 0 0 1 12 6.157 5.08 5.08 0 0 1 16.543 4C19.314 4 22 6.35 22 9.24c0 1.16-.35 2.872-2.97 5.267C17.05 16.662 12 21 12 21z"
            fill="#fca5a5"
            fillOpacity="0.55"
            stroke="#fb7185"
            strokeWidth="2"
          />
        </svg>
      );
    }
    return (
      <svg
        className="club-heart-icon"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={style}
        fill="none"
      >
        <path
          d="M12 21s-5.05-4.338-7.03-6.493C2.35 12.112 2 10.4 2 9.24 2 6.35 4.686 4 7.457 4A5.08 5.08 0 0 1 12 6.157 5.08 5.08 0 0 1 16.543 4C19.314 4 22 6.35 22 9.24c0 1.16-.35 2.872-2.97 5.267C17.05 16.662 12 21 12 21z"
          fill="#fecaca"
          stroke="#f87171"
          strokeWidth="2"
        />
      </svg>
    );
  }
  return (
    <svg
      className="club-heart-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={style}
      fill="none"
    >
      <path
        d="M12 21s-5.05-4.338-7.03-6.493C2.35 12.112 2 10.4 2 9.24 2 6.35 4.686 4 7.457 4A5.08 5.08 0 0 1 12 6.157 5.08 5.08 0 0 1 16.543 4C19.314 4 22 6.35 22 9.24c0 1.16-.35 2.872-2.97 5.267C17.05 16.662 12 21 12 21z"
        fill="none"
        stroke={dark ? "#fb7185" : "#b91c1c"}
        strokeWidth="2"
      />
    </svg>
  );
}