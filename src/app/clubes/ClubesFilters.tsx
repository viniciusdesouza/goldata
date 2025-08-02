interface ClubesFiltersProps {
  countries: string[];
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  leagues: { id: number; name: string }[];
  selectedLeague: string;
  setSelectedLeague: (league: string) => void;
  searchText: string;
  setSearchText: (text: string) => void;
}

export default function ClubesFilters({
  countries,
  selectedCountry,
  setSelectedCountry,
  leagues,
  selectedLeague,
  setSelectedLeague,
  searchText,
  setSearchText,
}: ClubesFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      <input
        type="text"
        placeholder="Buscar clube..."
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        className="rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-1.5 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        className="rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-1.5 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedCountry}
        onChange={e => {
          setSelectedCountry(e.target.value);
          setSelectedLeague("");
        }}
      >
        <option value="">Todos os países</option>
        {countries.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select
        className="rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-1.5 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedLeague}
        onChange={e => setSelectedLeague(e.target.value)}
      >
        <option value="">Todas as ligas</option>
        {leagues.map(l => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>
    </div>
  );
}