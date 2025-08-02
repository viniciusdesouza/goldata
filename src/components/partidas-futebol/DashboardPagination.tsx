import { ChevronLeft, ChevronRight } from "lucide-react";

interface DashboardPaginationProps {
  totalPages: number;
  page: number;
  setPage: (p: number) => void;
}

export default function DashboardPagination({ totalPages, page, setPage }: DashboardPaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center my-4 gap-2">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-xs shadow transition hover:scale-105 focus:outline-none ${page === 1 ? "opacity-40 cursor-not-allowed" : "bg-gradient-to-br from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500"}`}
      >
        <ChevronLeft size={16} /> Página anterior
      </button>
      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
        Página {page} de {totalPages}
      </span>
      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-xs shadow transition hover:scale-105 focus:outline-none ${page === totalPages ? "opacity-40 cursor-not-allowed" : "bg-gradient-to-br from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500"}`}
      >
        Próxima <ChevronRight size={16} />
      </button>
    </div>
  );
}