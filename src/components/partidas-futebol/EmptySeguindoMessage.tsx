import React from "react";

export default function EmptySeguindoMessage({
  title,
  children,
  showBuscar = true,
  onBuscar,
}: {
  title: string;
  children: React.ReactNode;
  showBuscar?: boolean;
  onBuscar?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="font-semibold text-lg mb-2 text-zinc-700 dark:text-zinc-200">{title}</div>
      <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{children}</div>
      {showBuscar && (
        <button
          type="button"
          className="tabs-sub-btn font-semibold px-5 py-2"
          style={{ minWidth: 140, borderRadius: 999 }}
          onClick={onBuscar}
        >
          Buscar partidas e campeonatos
        </button>
      )}
    </div>
  );
}