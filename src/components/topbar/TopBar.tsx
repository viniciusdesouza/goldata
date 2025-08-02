"use client";

import { Navbar } from "@/components/admin-panel/navbar";

/**
 * TopBar reutilizável para dashboard, passando o título como prop.
 */
export default function TopBar({ title }: { title?: string }) {
  return (
    <Navbar title={title} />
  );
}