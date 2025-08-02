"use client";

import { MenuCustom } from "./menu-custom";
import React from "react";

interface SheetMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SheetMenu({ open, onOpenChange }: SheetMenuProps) {
  if (!open) return null;
  return (
    <div className="yt-sidebar-sheet-menu-overlay" onClick={() => onOpenChange(false)}>
      <aside
        className="yt-sidebar-sheet-menu"
        onClick={e => e.stopPropagation()}
      >
        <MenuCustom />
      </aside>
    </div>
  );
}