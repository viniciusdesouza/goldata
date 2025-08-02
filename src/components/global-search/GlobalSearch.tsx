"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useResultadosSalvos } from "./ResultadosSalvosContext";
import { formatarDataPartida } from "@/components/partidas-futebol/utilsFormatarData";

function savePesquisaResults(results: { partidas: any[]; clubes: any[]; campeonatos: any[] }) {
  try {
    localStorage.setItem("pesquisaResultados", JSON.stringify(results));
  } catch {}
}

function debounce<F extends (...args: any[]) => void>(func: F, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ partidas: any[]; clubes: any[]; campeonatos: any[]; }>({ partidas: [], clubes: [], campeonatos: [] });
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();
  const { salvarPartida, salvarClube, salvarCampeonato } = useResultadosSalvos();

  const debounceRef = useRef(
    debounce(async (q: string) => {
      setLoading(true);
      const res = await fetch(`/api/football/pesquisa-global?search=${encodeURIComponent(q)}`);
      const data = await res.json();
      const resultObj = {
        partidas: Array.isArray(data.partidas) ? data.partidas : [],
        clubes: Array.isArray(data.clubes) ? data.clubes : [],
        campeonatos: Array.isArray(data.campeonatos) ? data.campeonatos : [],
      };
      setResults(resultObj);
      savePesquisaResults(resultObj);
      setLoading(false);
    }, 300)
  );

  function onInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    setShowDropdown(!!val.trim());
    if (val.trim()) debounceRef.current(val);
    else setResults({ partidas: [], clubes: [], campeonatos: [] });
  }

  function onBlur() {
    setTimeout(() => setShowDropdown(false), 200);
  }

  function onSelect(item: any, tipo: "partidas" | "clubes" | "campeonatos") {
    setShowDropdown(false);
    setQuery("");
    setResults({ partidas: [], clubes: [], campeonatos: [] });

    if (tipo === "partidas") {
      salvarPartida(item);
      router.push("/?tab=resultados&subtab=partidas&highlight=novo");
    } else if (tipo === "clubes") {
      salvarClube(item);
      router.push("/?tab=resultados&subtab=clubes&highlight=novo");
    } else if (tipo === "campeonatos") {
      salvarCampeonato(item);
      router.push("/?tab=resultados&subtab=campeonatos&highlight=novo");
    }
  }

  const noResults = !loading && query.trim() && results.partidas.length === 0 && results.clubes.length === 0 && results.campeonatos.length === 0;

  return (
    <div className="relative w-full font-sans">
      <div className="relative">
        <input
          type="text"
          className={`
            block w-full
            pl-5 pr-12
            py-2
            rounded-lg
            border border-zinc-300 dark:border-zinc-700
            bg-white dark:bg-zinc-900
            text-zinc-900 dark:text-zinc-100
            placeholder:text-zinc-400 dark:placeholder:text-zinc-500
            text-base
            font-normal
            font-sans
            focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:focus:border-zinc-500 dark:focus:ring-zinc-800
            transition
            shadow-sm
          `}
          placeholder="Buscar por partidas, clubes, campeonatos"
          value={query}
          onChange={onInput}
          onFocus={() => setShowDropdown(!!query.trim())}
          onBlur={onBlur}
          aria-label="Pesquisar"
          autoComplete="off"
          style={{
            minHeight: 0,
            height: "44px",
            boxSizing: "border-box",
          }}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none">
          <svg width={22} height={22} viewBox="0 0 20 20" fill="none">
            <circle cx={9} cy={9} r={7} stroke="currentColor" strokeWidth={1.6} />
            <line x1={14.2} y1={14.2} x2={18} y2={18} stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
          </svg>
        </span>
        {showDropdown && (
          <div className="absolute left-0 top-[110%] w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl z-50 max-h-96 overflow-auto animate-fadein font-sans"
            style={{
              boxShadow: "0 2px 8px 0 rgba(24,24,27,0.06)", // sombra mais suave
            }}
          >
            {loading && <div className="p-4 text-center text-zinc-400 dark:text-zinc-500">Buscando...</div>}
            {noResults && <div className="p-4 text-center text-zinc-400 dark:text-zinc-500">Nenhum resultado encontrado.</div>}
            {!loading && (
              <>
                {results.partidas.length > 0 && (
                  <>
                    <div className="px-4 pt-3 pb-1 font-semibold text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-sans">Próximas partidas</div>
                    <ul>
                      {results.partidas.map((item, idx) => (
                        <li key={item.id || idx}>
                          <button
                            type="button"
                            onClick={() => onSelect(item, "partidas")}
                            className="w-full flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition text-left font-sans"
                          >
                            <span className="flex items-center gap-2">
                              <img src={item.teams.home.logo} alt={item.teams.home.name} className="w-5 h-5 rounded bg-white object-contain" />
                              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{item.teams.home.name}</span>
                              <span className="text-xs text-zinc-500">vs</span>
                              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{item.teams.away.name}</span>
                              <img src={item.teams.away.logo} alt={item.teams.away.name} className="w-5 h-5 rounded bg-white object-contain" />
                            </span>
                            {item.date && (
                              <span
                                className="ml-0 sm:ml-2 mt-1 sm:mt-0 text-xs font-semibold flex items-center gap-2 text-zinc-900 dark:text-zinc-100"
                              >
                                {formatarDataPartida(item.status, item.date)}
                                <span>
                                  {new Date(item.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </span>
                            )}
                            {item.league?.name && (
                              <span className="ml-0 sm:ml-2 mt-1 sm:mt-0 text-xs font-medium text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 inline-block">
                                {item.league.name}
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <hr className="my-2 border-zinc-200 dark:border-zinc-700" />
                  </>
                )}
                {results.clubes.length > 0 && (
                  <>
                    <div className="px-4 pt-1 pb-1 font-semibold text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-sans">Clubes</div>
                    <ul>
                      {results.clubes.map((item, idx) => (
                        <li key={item.id || idx}>
                          <button
                            type="button"
                            onClick={() => onSelect(item, "clubes")}
                            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition text-left font-sans"
                          >
                            <img src={item.logo} alt={item.name} className="w-5 h-5 rounded bg-white object-contain" />
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{item.name}</span>
                            <span className="ml-2 text-xs text-zinc-400">{item.country?.name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                    <hr className="my-2 border-zinc-200 dark:border-zinc-700" />
                  </>
                )}
                {results.campeonatos.length > 0 && (
                  <>
                    <div className="px-4 pt-1 pb-1 font-semibold text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-sans">Campeonatos</div>
                    <ul>
                      {results.campeonatos.map((item, idx) => (
                        <li key={item.id || idx}>
                          <button
                            type="button"
                            onClick={() => onSelect(item, "campeonatos")}
                            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition text-left font-sans"
                          >
                            <img src={item.logo} alt={item.name || item.league?.name} className="w-5 h-5 rounded bg-white object-contain" />
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{item.name || item.league?.name}</span>
                            <span className="ml-2 text-xs text-zinc-400">{item.country?.name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <style jsx global>{`
        .animate-fadein { animation: fadein .13s; }
        @keyframes fadein { from { opacity: 0; transform: translateY(12px);} to { opacity: 1; transform: none;} }
      `}</style>
    </div>
  );
}