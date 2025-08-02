import Link from "next/link";
import { Pin, Star, ShieldEllipsis } from "lucide-react";

// --- Definição de Tipos ---
interface PinnedItem {
  id: number | string;
  nome: string; // 'nome' parece ser a propriedade usada para o nome
}

interface SidebarFixosProps {
  partidas: PinnedItem[];
  campeonatos: PinnedItem[];
  clubes: PinnedItem[];
}

// CORREÇÃO: Aplicando os tipos às props do componente
export default function SidebarFixos({ partidas, campeonatos, clubes }: SidebarFixosProps) {
  return (
    <aside className="w-full max-w-xs px-3 py-4 rounded-2xl bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-lg mb-4">
      <div className="font-bold text-zinc-700 dark:text-zinc-100 mb-2 flex items-center gap-2">
        <Pin size={18} className="text-orange-500" />
        Meus Fixos
      </div>
      <div className="space-y-3">
        {!!partidas?.length && (
          <div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1">
              <Star size={14} className="text-yellow-400" />
              Partidas
            </div>
            <ul className="flex flex-col gap-1">
              {partidas.slice(0, 4).map((p) =>
                <li key={p.id}>
                  <Link href={`/partidas/${p.id}`} className="hover:underline text-[15px]">{p.nome}</Link>
                </li>
              )}
            </ul>
          </div>
        )}
        {!!campeonatos?.length && (
          <div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1">
              <Pin size={14} className="text-orange-500" />
              Campeonatos
            </div>
            <ul className="flex flex-col gap-1">
              {campeonatos.slice(0, 4).map((c) =>
                <li key={c.id}>
                  <Link href={`/campeonatos/${c.id}`} className="hover:underline text-[15px]">{c.nome}</Link>
                </li>
              )}
            </ul>
          </div>
        )}
        {!!clubes?.length && (
          <div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1">
              <ShieldEllipsis size={14} className="text-purple-600" />
              Clubes
            </div>
            <ul className="flex flex-col gap-1">
              {clubes.slice(0, 4).map((cl) =>
                <li key={cl.id}>
                  <Link href={`/clubes/${cl.id}`} className="hover:underline text-[15px]">{cl.nome}</Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      {/* Dica de interação */}
      <div className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">Arraste para reordenar ou clique para remover</div>
    </aside>
  );
}
