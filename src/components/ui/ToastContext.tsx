"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import Link from "next/link";

// Tipos de toast
type ToastType = "success" | "error" | "info";
type Toast = {
  id: number;
  message: string;
  type?: ToastType;
  actionLabel?: string;
  action?: () => void;
  href?: string; // Novo campo para link
  colorClass?: string;
};

const ToastContext = createContext<{ showToast: (t: Omit<Toast, "id">) => void } | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function showToast(toast: Omit<Toast, "id">) {
    const id = Date.now() + Math.random();
    setToasts((curr) => [...curr, { ...toast, id }]);
    setTimeout(() => {
      setToasts((curr) => curr.filter((t) => t.id !== id));
    }, 4500);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed z-[9999] left-1/2 -translate-x-1/2 top-4 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              px-5 py-3 rounded-lg shadow-lg flex items-center gap-3
              text-white font-semibold text-base pointer-events-auto
              transition-all
              ${toast.colorClass
                ? toast.colorClass
                : toast.type === "success"
                ? "bg-orange-500"
                : toast.type === "error"
                ? "bg-red-500"
                : "bg-zinc-800"
              }
            `}
            style={{ minWidth: 260, maxWidth: 380 }}
          >
            <span>{toast.message}</span>
            {toast.href && toast.actionLabel ? (
              <Link
                href={toast.href}
                className="ml-3 underline font-bold text-white"
                tabIndex={0}
                style={{ pointerEvents: "auto" }}
              >
                {toast.actionLabel}
              </Link>
            ) : toast.action && toast.actionLabel ? (
              <button
                className="ml-3 underline font-bold text-white"
                onClick={toast.action}
                tabIndex={0}
                style={{ pointerEvents: "auto" }}
              >
                {toast.actionLabel}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast precisa do ToastProvider");
  return ctx;
}