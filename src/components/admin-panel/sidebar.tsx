"use client";

import React from "react";
import { MenuCustom } from "./menu-custom";
import "./sidebar-menu-custom.css";

export function Sidebar() {
  return (
    <aside className="yt-sidebar">
      <MenuCustom />
    </aside>
  );
}