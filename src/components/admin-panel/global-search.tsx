"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getClubeByNome } from "@/services/clubes-api";

// SVG: Lupa sofisticada, fina, correta
function SearchSophisticatedIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="20" y2="20" />
    </svg>
  );
}

// Debounce helper
function debounce<F extends (...args: any[]) => void>(func: F, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface Clube {
  id: string | number;
  nome: string;
  logo?: string;
  pais?: string;
}

export function GlobalSearch() {
  const [search, setSearch] = useState("");
  const [clubes, setClubes] = useState<Clube[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();

  const debounceRef = useRef(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setClubes([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const clubesResult = await getClubeByNome(query);
        setClubes(clubesResult || []);
      } catch {
        setClubes([]);
      }
      setLoading(false);
    }, 400)
  );

  // Handle input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    setShowDropdown(true);
    setLoading(true);
    debounceRef.current(val);
  };

  // Hide dropdown on blur (delay para permitir click)
  const handleBlur = () => setTimeout(() => setShowDropdown(false), 200);

  // Navega para página do clube ao clicar
  const handleSelectClube = (id: string | number) => {
    setShowDropdown(false);
    setSearch("");
    setClubes([]);
    router.push(`/clubes/${id}`);
  };

  return (
    <form
      className="w-full flex justify-center items-center relative"
      autoComplete="off"
      onSubmit={e => e.preventDefault()}
      role="search"
      style={{ maxWidth: 500, margin: "0 auto" }}
    >
      <div className="flex-1 relative max-w-[500px]">
        <input
          type="text"
          className={`
            block w-full pl-5 pr-12 py-2.5
            bg-zinc-100 dark:bg-zinc-900
            border border-zinc-300 dark:border-zinc-700
            rounded-full
            shadow-none
            text-base
            focus:outline-none
            focus:border-blue-600
            transition
            placeholder:text-zinc-500
            text-zinc-900 dark:text-zinc-100
            h-[40px]
          `}
          placeholder="Pesquisar clubes de futebol"
          value={search}
          onFocus={() => setShowDropdown(true)}
          onBlur={handleBlur}
          onChange={handleChange}
          aria-label="Pesquisar clubes de futebol"
        />
        <button
          type="submit"
          tabIndex={-1}
          className={`
            absolute top-0 right-0
            h-full aspect-square
            flex items-center justify-center
            bg-transparent border-none
            rounded-full
            transition
            focus:outline-none focus:ring-2 focus:ring-blue-500
            z-10
          `}
          style={{
            boxShadow: "none",
            padding: 0,
            margin: 0,
          }}
          aria-label="Pesquisar"
        >
          <span className="flex items-center justify-center w-full h-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
            <SearchSophisticatedIcon />
          </span>
        </button>
        {showDropdown && (loading || clubes.length > 0 || search.trim()) && (
          <div className="absolute z-20 mt-2 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl max-h-[370px] overflow-auto left-0">
            {loading && (
              <div className="p-4 text-center text-zinc-400">Buscando clubes...</div>
            )}
            {!loading && clubes.length > 0 && (
              <ul>
                {clubes.slice(0, 10).map(clube => (
                  <li key={clube.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectClube(clube.id)}
                      className="w-full flex items-center px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition text-left"
                    >
                      {clube.logo && (
                        <img
                          src={clube.logo}
                          alt={clube.nome}
                          className="w-6 h-6 object-contain mr-2"
                        />
                      )}
                      <span className="truncate">{clube.nome}</span>
                      {clube.pais && (
                        <span className="ml-2 text-xs text-zinc-400">{clube.pais}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {!loading && search.trim() && clubes.length === 0 && (
              <div className="p-4 text-center text-zinc-400">
                Nenhum clube encontrado.
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
}