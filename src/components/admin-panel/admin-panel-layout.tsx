"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { SheetMenu } from "./sheet-menu";

interface AdminPanelLayoutProps {
  children: ReactNode;
}

export default function AdminPanelLayout({ children }: AdminPanelLayoutProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  // Fecha o SheetMenu automaticamente ao expandir para lg (desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSheetOpen(false); // lg breakpoint
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-900 min-h-screen">
      <Navbar title="Painel Principal" onOpenMenuMobile={() => setSheetOpen(true)} />
      <SheetMenu open={sheetOpen} onOpenChange={setSheetOpen} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}