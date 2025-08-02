import { useMemo } from "react";

// Exemplo de tradução de país, adapte conforme seu projeto
const countryNamePT: Record<string, string> = {
  Brazil: "Brasil",
  England: "Inglaterra",
  Spain: "Espanha",
  Italy: "Itália",
  Germany: "Alemanha",
  France: "França",
  // ...adicione mais se desejar
};

interface LeagueType {
  id: number;
  name: string;
  logo: string;
  country: string;
}

interface CampeonatosFiltersProps {
  allLeagues: LeagueType[];
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedLeagueId: number | null;
  setSelectedLeagueId: (id: number | null) => void;
  showOnlyFavorites?: boolean;
  setShowOnlyFavorites?: (val: boolean) => void;
}

export default function CampeonatosFilters({
  allLeagues,
  selectedCountry,
  setSelectedCountry,
  selectedLeagueId,
  setSelectedLeagueId,
  showOnlyFavorites = false,
  setShowOnlyFavorites,
}: CampeonatosFiltersProps) {
  // Lista única de países presentes nas ligas
  const countryList = useMemo(() => {
    const unique = Array.from(new Set(allLeagues.map(l => l.country)));
    unique.sort();
    return unique;
  }, [allLeagues]);

  // Filtra ligas pelo país selecionado
  const filteredLeagues = useMemo(() => {
    if (!selectedCountry) {
      return allLeagues;
    }
    return allLeagues.filter(l => l.country === selectedCountry);
  }, [allLeagues, selectedCountry]);

  // Classes de estilo com Tailwind CSS
  const wrapperClass = "flex flex-wrap items-center gap-4 mb-8";
  const selectClass = "border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]";
  const checkboxLabelClass = "flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer";
  const checkboxInputClass = "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500";

  return (
    <div className={wrapperClass}>
      <select
        className={selectClass}
        value={selectedCountry}
        onChange={e => {
          setSelectedCountry(e.target.value);
          setSelectedLeagueId(null);
        }}
      >
        <option value="">Todos os países</option>
        {countryList.map(c => (
          <option key={c} value={c}>
            {countryNamePT[c] || c}
          </option>
        ))}
      </select>
      <select
        className={selectClass}
        value={selectedLeagueId ?? ""}
        onChange={e => setSelectedLeagueId(e.target.value ? Number(e.target.value) : null)}
      >
        <option value="">Todas as ligas</option>
        {filteredLeagues.map(l => (
          <option key={l.id} value={l.id}>
            {l.name} {l.country ? `(${countryNamePT[l.country] || l.country})` : ""}
          </option>
        ))}
      </select>
      {typeof setShowOnlyFavorites === "function" && (
        <label className={checkboxLabelClass}>
          <input
            type="checkbox"
            checked={showOnlyFavorites}
            onChange={e => setShowOnlyFavorites(e.target.checked)}
            className={checkboxInputClass}
          />
          Só favoritos
        </label>
      )}
    </div>
  );
}
