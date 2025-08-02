"use client";
import "./tabs-partidas.css";

// CORREÇÃO: O objeto countryNamePT foi movido para dentro deste arquivo,
// resolvendo o erro de importação.
const countryNamePT: Record<string, string> = {
  Brazil: "Brasil",
  England: "Inglaterra",
  Spain: "Espanha",
  Italy: "Itália",
  Germany: "Alemanha",
  France: "França",
  // Adicione outras traduções conforme necessário
};

interface DashboardFiltersProps {
  countryList: string[];
  leagueList: { id: string; name: string }[];
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedLeague: string;
  setSelectedLeague: (league: string) => void;
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (val: boolean) => void;
}

export default function DashboardFilters({
  countryList,
  leagueList,
  selectedCountry,
  setSelectedCountry,
  selectedLeague,
  setSelectedLeague,
  showOnlyFavorites,
  setShowOnlyFavorites,
}: DashboardFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-4">
      <select
        className={`
          dashboard-filter-btn
          min-w-[140px] md:min-w-[180px] px-5 py-2
        `}
        value={selectedCountry}
        onChange={e => {
          setSelectedCountry(e.target.value);
          setSelectedLeague("");
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
        className={`
          dashboard-filter-btn
          min-w-[140px] md:min-w-[180px] px-5 py-2
        `}
        value={selectedLeague}
        onChange={e => setSelectedLeague(e.target.value)}
      >
        <option value="">Todas as ligas</option>
        {leagueList.map(l => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>
      <label
        className={`
          dashboard-filter-btn
          flex items-center gap-2 min-w-[130px] px-5 py-2 cursor-pointer text-sm font-semibold
        `}
        style={{ userSelect: "none" }}
      >
        <input
          type="checkbox"
          checked={showOnlyFavorites}
          onChange={e => setShowOnlyFavorites(e.target.checked)}
          className="form-checkbox accent-blue-500 w-4 h-4"
        />
        Só favoritos
      </label>
    </div>
  );
}
