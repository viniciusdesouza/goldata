"use client";
import { useRef, useEffect, useState } from "react";
import "./campeonato-tabs-bar.css";

export default function CampeonatoTabsBar({
  tabs,
  currentTab,
  onTab,
}: {
  tabs: { key: string; label: string; icon?: JSX.Element | null }[];
  currentTab: string;
  onTab: (tab: string) => void;
}) {
  const barRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  // Drag state
  const isDragging = useRef(false);
  const dragStartX = useRef<number | null>(null);
  const dragScrollLeft = useRef<number>(0);

  // Mouse drag
  function handleMouseDown(e: React.MouseEvent) {
    if (!barRef.current) return;
    isDragging.current = true;
    dragStartX.current = e.pageX - barRef.current.offsetLeft;
    dragScrollLeft.current = barRef.current.scrollLeft;
    document.body.style.userSelect = "none";
  }
  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || !barRef.current || dragStartX.current === null) return;
    const x = e.pageX - barRef.current.offsetLeft;
    const walk = x - dragStartX.current;
    barRef.current.scrollLeft = dragScrollLeft.current - walk;
  }
  function handleMouseUp() {
    isDragging.current = false;
    dragStartX.current = null;
    document.body.style.userSelect = "";
  }
  function handleMouseLeave() {
    isDragging.current = false;
    dragStartX.current = null;
    document.body.style.userSelect = "";
  }

  // Touch drag
  function handleTouchStart(e: React.TouchEvent) {
    if (!barRef.current) return;
    isDragging.current = true;
    dragStartX.current = e.touches[0].clientX - barRef.current.offsetLeft;
    dragScrollLeft.current = barRef.current.scrollLeft;
  }
  function handleTouchMove(e: React.TouchEvent) {
    if (!isDragging.current || !barRef.current || dragStartX.current === null) return;
    const x = e.touches[0].clientX - barRef.current.offsetLeft;
    const walk = x - dragStartX.current;
    barRef.current.scrollLeft = dragScrollLeft.current - walk;
  }
  function handleTouchEnd() {
    isDragging.current = false;
    dragStartX.current = null;
  }

  // Setas e indicador
  function checkArrows() {
    if (!barRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = barRef.current;
    setShowLeft(scrollLeft > 8);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 8);
  }

  useEffect(() => {
    if (!barRef.current) return;
    const el = barRef.current;
    checkArrows();
    el.addEventListener("scroll", checkArrows);
    window.addEventListener("resize", checkArrows);
    return () => {
      el.removeEventListener("scroll", checkArrows);
      window.removeEventListener("resize", checkArrows);
    };
  }, []);

  // Centraliza tab ativa (UX extra)
  useEffect(() => {
    if (!barRef.current) return;
    const idx = tabs.findIndex(t => t.key === currentTab);
    const tab = tabRefs.current[idx];
    const bar = barRef.current;
    if (tab && bar) {
      const tabLeft = tab.offsetLeft;
      const tabWidth = tab.offsetWidth;
      const scrollWidth = bar.offsetWidth;
      const scrollTo = tabLeft - (scrollWidth - tabWidth) / 2;
      bar.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
    setTimeout(checkArrows, 50);
  }, [currentTab, tabs]);

  // Função para scrollar com as setas
  const scrollByAmount = (dx: number) => {
    barRef.current?.scrollBy({ left: dx, behavior: "smooth" });
  };

  // Estilo para o círculo das setas (light/dark responsivo)
  const arrowCircleClass =
    "rounded-full shadow-md flex items-center justify-center transition-colors " +
    "bg-white/90 dark:bg-[#23272f]/80 hover:bg-zinc-100 dark:hover:bg-[#323943] " +
    "border border-zinc-200 dark:border-zinc-800";

  return (
    <div
      className="w-full max-w-3xl mx-auto relative flex items-center select-none"
      style={{ marginBottom: 12 }}
    >
      {/* Seta esquerda */}
      {showLeft && (
        <button
          className="absolute left-0 z-10 h-full flex items-center pl-1"
          onClick={() => scrollByAmount(-200)}
          style={{ pointerEvents: "auto" }}
          aria-label="Anterior"
          tabIndex={-1}
          type="button"
        >
          <span
            className={arrowCircleClass}
            style={{
              width: 32,
              height: 32,
              minWidth: 32,
              minHeight: 32,
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          >
            <svg width={20} height={20} stroke="currentColor" fill="none" viewBox="0 0 24 24" className="w-5 h-5 text-zinc-400 dark:text-zinc-300">
              <polyline points="15 18 9 12 15 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </button>
      )}
      {/* Barra de tabs */}
      <div
        ref={barRef}
        className="flex flex-row flex-nowrap relative bg-transparent overflow-x-auto overflow-y-hidden scrollbar-hide"
        style={{
          borderBottom: "2px solid #e5e7eb",
          minHeight: 50,
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "x mandatory",
          paddingBottom: 0,
          width: "100%",
          maxWidth: "100%",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {tabs.map((tab, i) => {
          const isActive = currentTab === tab.key;
          return (
            <button
              // CORREÇÃO: A função ref agora tem um corpo e não retorna um valor.
              ref={el => { tabRefs.current[i] = el; }}
              key={tab.key}
              data-tabkey={tab.key}
              className={[
                "campeonato-tab-btn",
                isActive ? "active" : "",
              ].join(" ")}
              aria-selected={isActive}
              tabIndex={0}
              onClick={() => onTab(tab.key)}
              type="button"
            >
              {tab.icon && (
                <span className="flex items-center justify-center" style={{ fontSize: 19 }}>
                  {tab.icon}
                </span>
              )}
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
      {/* Seta direita */}
      {showRight && (
        <button
          className="absolute right-0 z-10 h-full flex items-center pr-1"
          onClick={() => scrollByAmount(200)}
          style={{ pointerEvents: "auto" }}
          aria-label="Próximo"
          tabIndex={-1}
          type="button"
        >
          <span
            className={arrowCircleClass}
            style={{
              width: 32,
              height: 32,
              minWidth: 32,
              minHeight: 32,
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          >
            <svg width={20} height={20} stroke="currentColor" fill="none" viewBox="0 0 24 24" className="w-5 h-5 text-zinc-400 dark:text-zinc-300">
              <polyline points="9 18 15 12 9 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </button>
      )}
      {/* Esconde a scrollbar nativa */}
      <style jsx global>{`
        .scrollbar-hide {
          scrollbar-width: none !important;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
