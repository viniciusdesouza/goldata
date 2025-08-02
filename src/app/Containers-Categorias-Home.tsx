import React, { ReactNode } from "react";

// Container principal de página (centraliza tudo, mesmo padding dos cards)
export function ContainerPage({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`w-full max-w-3xl mx-auto px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}

// Container para seções internas ou "cards grandes" (borda, sombra, padding)
export function ContainerSection({ children, className = "", style = {} }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <section
      className={
        "w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#161616] shadow-sm p-4 mb-6 " +
        className
      }
      style={style}
    >
      {children}
    </section>
  );
}

// Container para blocos menores, listas, tabelas internas
export function ContainerData({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={
        "w-full rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3 mb-2 " +
        className
      }
    >
      {children}
    </div>
  );
}