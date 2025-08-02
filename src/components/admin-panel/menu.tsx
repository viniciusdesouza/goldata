"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/menu-list";
import React from "react";
import { IconType } from "react-icons"; // Assuming you use react-icons

// --- Definição de Tipos ---
interface Tab {
  key: string;
  label: string;
  href: string;
  icon?: IconType;
  color?: string;
}

interface MenuCategory {
  label: string;
  icon?: IconType;
  tabs?: Tab[];
}

// Constante para a aba principal da home
const HOME_TAB_KEY = "descobrir";

// Função de filtro agora com tipos definidos
function filterMenuList(menuList: MenuCategory[]): (MenuCategory | null)[] {
  const forbiddenLabels = [
    "Conta", "Perfil", "Usuários", "Minha conta", "Administração", "Admin",
    "Configurações da conta", "Configurações de usuário", "User", "Account",
    "Login", "Logout", "Sair", "Entrar", "Registrar",
  ];

  return menuList
    .map(category => {
      const filteredTabs = category.tabs
        ? category.tabs.filter(
            tab => !forbiddenLabels.some(label =>
              (tab.label || "").toLowerCase().includes(label.toLowerCase())
            )
          )
        : undefined;

      if (
        forbiddenLabels.some(label => (category.label || "").toLowerCase().includes(label.toLowerCase())) ||
        (category.tabs && filteredTabs && filteredTabs.length === 0 && category.tabs.length > 0)
      ) {
        return null;
      }
      
      return { ...category, tabs: filteredTabs };
    })
    .filter(Boolean);
}

export function Menu() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // CORREÇÃO: Adiciona uma verificação para garantir que 'pathname' não é nulo.
  if (!pathname) {
    return null; // Retorna nulo ou um componente de loading durante a renderização inicial.
  }

  const menuListRaw = getMenuList(pathname);
  const menuList = filterMenuList(menuListRaw);

  const isOnHome = pathname === "/" || pathname === "/home";
  const partidasTab = searchParams?.get("partidasTab") || "aoVivo";
  const mainTab = searchParams?.get("tab") || HOME_TAB_KEY;
  const hash = typeof window !== "undefined" ? window.location.hash : "";

  // Função de clique agora com o tipo 'Tab'
  function handlePartidasTabClick(
    tab: Tab,
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) {
    if (!isOnHome) return;
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    params.set("tab", HOME_TAB_KEY);
    params.set("partidasTab", tab.key);
    const url = `${window.location.pathname}?${params.toString()}#partidas-tabs`;
    window.history.replaceState(null, "", url);
    setTimeout(() => {
      const el = document.getElementById("partidas-tabs");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 20);
  }

  return (
    <nav className="w-full flex flex-col gap-4 mt-2">
      {menuList.map(category => {
        if (!category) return null;
        return (
          <div key={category.label} className="mb-2">
            <div className="px-2 flex items-center gap-2 mb-1">
              {category.icon && (
                <category.icon
                  size={18}
                  className="text-blue-700 dark:text-blue-300"
                />
              )}
              <span className="font-bold text-[15px] tracking-wide text-blue-700 dark:text-blue-300">
                {category.label}
              </span>
            </div>

            {category.tabs && (
              <ul className="flex flex-col gap-1 ml-3">
                {category.tabs.map(tab => {
                  const isPartidas = category.label === "Partidas de Futebol";
                  const isBlog = category.label === "Artigos & Notícias";
                  let isActive = false;

                  if (isPartidas) {
                    isActive =
                      tab.key === partidasTab &&
                      mainTab === HOME_TAB_KEY &&
                      hash.startsWith("#partidas-tabs");
                  } else if (isBlog) {
                    const blogTab = searchParams?.get("tab") || "todos";
                    isActive = tab.key === blogTab && pathname === "/blog";
                  }

                  let href = tab.href;
                  if (tab.key === "descobrir") {
                    href = "/?tab=descobrir";
                  }
                  const partidasHref = `/?tab=${HOME_TAB_KEY}&partidasTab=${tab.key}#partidas-tabs`;

                  return (
                    <li key={tab.key}>
                      <Link
                        href={isPartidas ? partidasHref : href}
                        scroll={false}
                        onClick={
                          isPartidas
                            ? e => handlePartidasTabClick(tab, e)
                            : undefined
                        }
                        className={cn(
                          "group flex items-center gap-2 px-3 py-2 rounded-md transition-all",
                          "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300",
                          "text-[15px] font-medium text-zinc-800 dark:text-zinc-100",
                          isActive &&
                            "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold"
                        )}
                      >
                        {tab.icon && <tab.icon size={16} color={tab.color} />}
                        <span className="truncate">{tab.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}
