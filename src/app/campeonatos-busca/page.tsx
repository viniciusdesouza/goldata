"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// Interfaces para tipagem dos dados da API
interface CountryApi {
  name: string;
  flag: string;
}

interface LeagueApi {
  league: {
    id: number;
    name:string;
    logo: string;
  };
  country: {
    name: string;
    flag: string;
  };
}

export default function BuscaCampeonatosPage() {
  const [countries, setCountries] = useState<CountryApi[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [leagues, setLeagues] = useState<LeagueApi[]>([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingLeagues, setLoadingLeagues] = useState(false);
  const [error, setError] = useState("");

  // Carrega países ao montar a página
  useEffect(() => {
    setLoadingCountries(true);
    fetch("/api/football/paises")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data.response || []);
      })
      .catch(() => setError("Erro ao carregar países."))
      .finally(() => setLoadingCountries(false));
  }, []);

  // Carrega ligas do país selecionado
  useEffect(() => {
    if (!selectedCountry) {
      setLeagues([]);
      setSelectedLeagueId(null);
      return;
    }
    setLoadingLeagues(true);
    setError(""); // Limpa o erro ao buscar novas ligas
    fetch(`/api/football/ligas?country=${encodeURIComponent(selectedCountry)}`)
      .then((res) => res.json())
      .then((data) => {
        setLeagues(data.response || []);
      })
      .catch(() => setError("Erro ao carregar campeonatos."))
      .finally(() => setLoadingLeagues(false));
  }, [selectedCountry]);

  // Estilos para os selects
  const selectClasses = "border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[220px]";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-zinc-900 dark:text-zinc-100">Pesquisar Campeonatos</h1>
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <select
          className={selectClasses}
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          disabled={loadingCountries}
        >
          <option value="">{loadingCountries ? "Carregando..." : "Selecione um país"}</option>
          {countries.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {selectedCountry && (
          <select
            className={selectClasses}
            value={selectedLeagueId ?? ""}
            onChange={(e) => setSelectedLeagueId(e.target.value ? Number(e.target.value) : null)}
            disabled={loadingLeagues || leagues.length === 0}
          >
            <option value="">{loadingLeagues ? "Carregando..." : "Selecione um campeonato"}</option>
            {leagues.map((l) => (
              <option key={l.league.id} value={l.league.id}>
                {l.league.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {error && <div className="text-red-500 text-center py-4">{error}</div>}

      {/* Exibe o campeonato selecionado */}
      {selectedLeagueId && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
          {leagues
            .filter((l) => l.league.id === selectedLeagueId)
            .map((c) => (
              <Link
                key={c.league.id}
                href={`/maiores-campeonatos/${c.league.id}`}
                className="group block p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-md text-center"
              >
                <img
                  src={c.league.logo}
                  alt={c.league.name}
                  className="w-20 h-20 mx-auto mb-3 object-contain"
                  loading="lazy"
                />
                <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 block truncate">{c.league.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{c.country.name}</span>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
