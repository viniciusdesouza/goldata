import React, { useRef, useEffect, useState } from "react";
import "../tabs/tabs-bar-youtube.css"; // Certifique-se que o CSS é igual ao das tabs principais

interface Tab {
  key: string;
  label: string;
  icon?: JSX.Element | null;
}

interface TabPartidasProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export default function TabPartidas({ tabs, activeTab, onTabChange }: TabPartidasProps) {
  const barRef = useRef<HTMLDivElement | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (!barRef.current) return;
    const el = barRef.current.querySelector<HTMLButtonElement>(
      `[data-tabkey="${activeTab}"]`
    );
    if (el) {
      setIndicatorStyle({
        left: el.offsetLeft - barRef.current.scrollLeft,
        width: el.offsetWidth,
      });
      // Auto scroll para a tab ativa ficar sempre visível
      const bar = barRef.current;
      const elLeft = el.offsetLeft;
      const elRight = el.offsetLeft + el.offsetWidth;
      const barLeft = bar.scrollLeft;
      const barRight = bar.scrollLeft + bar.offsetWidth;
      if (elLeft < barLeft) {
        bar.scrollTo({ left: elLeft - 16, behavior: "smooth" });
      } else if (elRight > barRight) {
        bar.scrollTo({ left: elRight - bar.offsetWidth + 16, behavior: "smooth" });
      }
    }
  }, [activeTab, tabs]);

  // Swipe support (touch)
  const touchStartX = useRef<number | null>(null);
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 44) {
      const idx = tabs.findIndex(t => t.key === activeTab);
      if (dx < 0 && idx < tabs.length - 1) onTabChange(tabs[idx + 1].key);
      else if (dx > 0 && idx > 0) onTabChange(tabs[idx - 1].key);
    }
    touchStartX.current = null;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-2xl mx-auto">
        <div
          ref={barRef}
          className="flex flex-row relative bg-transparent scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent overflow-x-auto overflow-y-hidden no-scrollbar-hide select-none"
          style={{
            borderBottom: "2.5px solid #e5e7eb",
            minHeight: 46,
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
            paddingBottom: 0,
            justifyContent: "center"
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                data-tabkey={tab.key}
                type="button"
                className={[
                  "flex flex-col items-center justify-center px-5 py-2 transition-all duration-200 outline-none whitespace-nowrap",
                  isActive
                    ? "text-blue-600 dark:text-blue-400 font-bold"
                    : "text-zinc-500 dark:text-zinc-400 font-normal hover:text-blue-600 dark:hover:text-blue-400",
                  "text-[14.4px] md:text-[15px]",
                ].join(" ")}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  minWidth: 80,
                  fontSize: 14.7,
                  scrollSnapAlign: "center",
                  fontFamily: 'Roboto, Arial, sans-serif'
                }}
                aria-selected={isActive}
                tabIndex={0}
                onClick={() => onTabChange(tab.key)}
              >
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
          {/* Indicador animado igual tab principal */}
          <span
            className="absolute bottom-0 h-[3px] rounded-full bg-blue-600 dark:bg-blue-400 transition-all duration-200"
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              opacity: indicatorStyle.width ? 1 : 0,
              height: 3,
              transition: "left 0.2s, width 0.2s"
            }}
          />
        </div>
      </div>
    </div>
  );
}