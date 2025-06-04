import { countryNamePT } from "./utils";

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
        className="rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-1.5 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        className="rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-1.5 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedLeague}
        onChange={e => setSelectedLeague(e.target.value)}
      >
        <option value="">Todas as ligas</option>
        {leagueList.map(l => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>
      <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
        <input
          type="checkbox"
          checked={showOnlyFavorites}
          onChange={e => setShowOnlyFavorites(e.target.checked)}
          className="form-checkbox accent-blue-500"
        />
        Só favoritos
      </label>
    </div>
  );
}