"use client";
import { usePathname } from "next/navigation";
import React from "react";

const GLOBAL_TABS = [
  { key: "seguindo", label: "Seguindo", href: "/?tab=seguindo" },
  { key: "descobrir", label: "Descobrir", href: "/?tab=descobrir" },
  { key: "compartilhados", label: "Compartilhados", href: "/?tab=compartilhados" },
  { key: "resultados", label: "Resultados de Pesquisa", href: "/?tab=resultados" },
  { key: "artigos", label: "Artigos & Notícias", href: "/blog?tab=todos" },
];

export default function GlobalTabsBar() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed top-0 left-0 w-full z-40 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800"
      style={{ minHeight: 54 }}
    >
      <div className="flex justify-center gap-2 py-2">
        {GLOBAL_TABS.map(tab => {
          // Checagem simples de "ativa" (ajuste conforme sua lógica de tab)
          const isActive =
            (tab.href.startsWith("/blog") && pathname.startsWith("/blog")) ||
            (tab.href.startsWith("/?tab=") && pathname === "/" && typeof window !== "undefined" && window.location.search.includes(tab.key));
          return (
            <a
              key={tab.key}
              href={tab.href}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                isActive
                  ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-black dark:border-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {tab.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}