import { Search } from "lucide-react";

interface DashboardSearchBarProps {
  search: string;
  setSearch: (s: string) => void;
}

export default function DashboardSearchBar({ search, setSearch }: DashboardSearchBarProps) {
  return (
    <div className="flex justify-center items-center my-4 px-2">
      <div className="relative w-full max-w-2xl">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Pesquisar campeonato, país ou time..."
          className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
          style={{ minWidth: 0 }}
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500">
          <Search size={18} />
        </span>
      </div>
    </div>
  );
}