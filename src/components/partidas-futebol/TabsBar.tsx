"use client";
import { useEffect, useRef, useState } from "react";

export type TabType = {
  key: string;
  label: string;
  icon?: JSX.Element | null;
};

export default function TabsBar({
  tabs,
  currentTab,
  onTab,
  main = false,
}: {
  tabs: TabType[];
  currentTab: string;
  onTab: (tab: string) => void;
  main?: boolean;
}) {
  const barRef = useRef<HTMLDivElement | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (!barRef.current) return;
    const el = barRef.current.querySelector<HTMLButtonElement>(
      `[data-tabkey="${currentTab}"]`
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
  }, [currentTab, tabs]);

  // Suporte simples a swipe (mobile)
  const touchStartX = useRef<number | null>(null);
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 44) {
      const idx = tabs.findIndex(t => t.key === currentTab);
      if (dx < 0 && idx < tabs.length - 1) onTab(tabs[idx + 1].key);
      else if (dx > 0 && idx > 0) onTab(tabs[idx - 1].key);
    }
    touchStartX.current = null;
  }

  return (
    <div
      className="w-full max-w-2xl mx-auto flex flex-col items-center select-none"
      style={{ marginBottom: main ? 12 : 4 }}
    >
      <div
        ref={barRef}
        className={`flex flex-row relative bg-transparent ${
          main
            ? "scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent overflow-x-auto overflow-y-hidden no-scrollbar-hide"
            : ""
        }`}
        style={{
          borderBottom: main ? "2px solid #e5e7eb" : "1px solid #e5e7eb",
          minHeight: main ? 50 : 42,
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "x mandatory",
          paddingBottom: 0,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              data-tabkey={tab.key}
              className={[
                "flex flex-col items-center justify-center px-4 py-2 gap-1 transition-all duration-200 outline-none whitespace-nowrap",
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-bold"
                  : "text-zinc-500 dark:text-zinc-400 font-normal hover:text-blue-600 dark:hover:text-blue-400",
                main ? "text-[15px]" : "text-[13px]"
              ].join(" ")}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                minWidth: main ? 66 : 52,
                fontSize: main ? 15 : 13,
                scrollSnapAlign: "center"
              }}
              aria-selected={isActive}
              tabIndex={0}
              onClick={() => onTab(tab.key)}
              type="button"
            >
              {tab.icon && (
                <span className="flex items-center justify-center" style={{ fontSize: main ? 19 : 15 }}>
                  {tab.icon}
                </span>
              )}
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
        <span
          className="absolute bottom-0 h-1 rounded-full bg-blue-600 dark:bg-blue-400 transition-all duration-200"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
            opacity: indicatorStyle.width ? 1 : 0,
            height: main ? 3 : 2,
            transition: "left 0.2s, width 0.2s"
          }}
        />
      </div>
    </div>
  );
}