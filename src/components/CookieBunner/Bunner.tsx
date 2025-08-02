"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export function CookieBunner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const accepted = localStorage.getItem("cookie_accepted");
      setVisible(!accepted);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem("cookie_accepted", "yes");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9999] flex justify-center pointer-events-none">
      <div
        className="
          pointer-events-auto
          max-w-3xl w-full
          px-4 sm:px-6 pb-4
          mx-auto
        "
      >
        <div
          className="
            bg-zinc-900/95 text-white py-4 px-4 sm:px-6 rounded-2xl shadow-lg
            flex flex-col md:flex-row md:items-center gap-2 md:gap-5
            border-t border-zinc-800
          "
        >
          <span className="flex-1 text-sm text-center md:text-left">
            Usamos cookies para melhorar sua experiência e salvar suas partidas favoritas no navegador.
            Ao continuar navegando, você concorda com nossa&nbsp;
            <Link href="/pg/cookies" className="underline hover:text-blue-300">Política de Cookies</Link>
            &nbsp;e&nbsp;
            <Link href="/pg/privacidade" className="underline hover:text-blue-300">Privacidade</Link>.
          </span>
          <div className="flex justify-center w-full md:w-auto">
            <button
              onClick={handleAccept}
              className="
                mt-1 md:mt-0 w-full md:w-auto px-4 py-1.5 rounded-2xl bg-blue-600
                hover:bg-blue-700 text-white font-semibold text-sm transition
                shadow focus:outline-none focus:ring-2 focus:ring-blue-400
                max-w-[120px]
              "
              type="button"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}