"use client";
import { Share2 } from "lucide-react";
import { useState } from "react";
import "@/components/pesquisa-clubes/sharebuttonclube.css";

type ShareButtonCampeonatoProps = {
  id: number;
  showText?: boolean; // Se true, mostra texto ("Compartilhar"), se false, só ícone.
  className?: string;
  size?: number;      // Tamanho do ícone, default 20
  label?: string;     // Texto customizável
};

export default function ShareButtonCampeonato({
  id,
  showText = true,
  className = "",
  size = 20,
  label = "Comp.",
}: ShareButtonCampeonatoProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = `${window.location.origin}/campeonatos/${id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Veja este campeonato!",
          text: "Confira este campeonato que compartilhei com você:",
          url,
        });
        setCopied(false);
      } catch {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  // Adota o padrão das classes do PinButtonClube
  const btnClass = showText
    ? `club-share-btn${copied ? " copied" : ""} ${className}`
    : `club-share-icon-btn${copied ? " copied" : ""} ${className}`;

  return (
    <button
      type="button"
      className={btnClass}
      aria-label="Compartilhar campeonato"
      title={copied ? "Link copiado!" : "Compartilhar"}
      onClick={handleShare}
      tabIndex={0}
    >
      {showText && <span className="club-btn-label">{copied ? "Copiado!" : label}</span>}
      <Share2
        size={showText ? size : size - 2}
        className="club-share-icon"
        color="#06b6d4"
        strokeWidth={1.8}
      />
    </button>
  );
}