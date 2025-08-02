import { useState } from "react";

const TABS = [
  { key: "explore", label: "Explorar", color: "#2563eb" },
  { key: "myfixes", label: "Meus Fixos", color: "#9333ea" },
];

export default function NavigationTabs({ tab, setTab }: { tab: string; setTab: (tab: string) => void }) {
  return (
    <div className="flex gap-2 mt-2 mb-4 w-full max-w-2xl mx-auto">
      {TABS.map((t) => (
        <button
          key={t.key}
          className={`
            flex-1 py-3 text-lg font-bold rounded-2xl transition
            ${tab === t.key
              ? `shadow-lg text-white`
              : `bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200`
            }
          `}
          style={{
            background: tab === t.key ? t.color : undefined,
            transform: tab === t.key ? 'scale(1.06)' : undefined,
            boxShadow: tab === t.key ? `0 4px 16px -4px ${t.color}44` : undefined,
          }}
          onClick={() => setTab(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}