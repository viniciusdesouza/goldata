"use client";
import { MenuCustom } from "@/components/admin-panel/menu-custom";

export function SidebarToggle() {
  return (
    <aside
      className="fixed left-0 top-0 z-40 h-screen flex flex-col sidebar-menu-custom w-[260px] transition-transform duration-300 ease-in-out translate-x-0"
      style={{ paddingTop: "64px" }}
    >
      <MenuCustom />
    </aside>
  );
}