"use client";

import { getMenuList } from "@/lib/menu-list";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";

// --- Definição de Tipos ---
interface Tab {
  key: string;
  label: string;
  href: string;
  icon?: IconType;
  color?: string;
}

interface MenuItem {
  label: string;
  href: string;
  isCategory?: boolean;
  icon?: IconType;
  tabs?: Tab[];
}

export function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!pathname) {
    return null;
  }

  const tabParam = searchParams?.get("tab");
  const subtabParam = searchParams?.get("subtab");
  const partidasTabParam = searchParams?.get("partidasTab");

  const menu: MenuItem[] = getMenuList(pathname).filter(
    (item: MenuItem) => item.label !== "Usuários" && item.label !== "Conta"
  );

  function isActiveTab(tabHref: string): boolean {
    if (!tabHref || !pathname) return false;
    if (tabHref.includes("?")) {
      const urlParams = new URLSearchParams(tabHref.split('?')[1]);
      const tab = urlParams.get('tab');
      const subtab = urlParams.get('subtab');
      const partidasTab = urlParams.get('partidasTab');
      if (tab && tab !== (tabParam || 'seguindo')) return false;
      if (subtab && subtab !== subtabParam) return false;
      if (partidasTab && partidasTab !== partidasTabParam) return false;
      return true;
    }
    return pathname === tabHref;
  }

  return (
    <nav className="yt-sidebar-nav">
      {menu.map((item) =>
        item.isCategory ? (
          <div key={item.label} className="yt-sidebar-category">
            {/* Apenas o texto da categoria, sem ícone */}
            <div className="yt-sidebar-category-label">
              {item.label}
            </div>
            {item.tabs && (
              <ul className="yt-sidebar-list">
                {item.tabs.map(tab => (
                  <li key={tab.key}>
                    <Link
                      href={tab.href}
                      className={`yt-sidebar-link${isActiveTab(tab.href) ? " active" : ""}`}
                      prefetch={false}
                    >
                      <span
                        className="yt-sidebar-link-icon"
                        style={tab.color ? { color: tab.color } : {}}
                      >
                        {tab.icon && <tab.icon size={20} />}
                      </span>
                      <span className="yt-sidebar-link-label">{tab.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div key={item.label} className="yt-sidebar-category">
            <Link href={item.href} className={`yt-sidebar-link${isActiveTab(item.href) ? " active" : ""}`} prefetch={false}>
              <span className="yt-sidebar-link-icon">
                {item.icon && <item.icon size={20} />}
              </span>
              <span className="yt-sidebar-link-label">{item.label}</span>
            </Link>
          </div>
        )
      )}
    </nav>
  );
}