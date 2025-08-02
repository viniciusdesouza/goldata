import { useMemo, useState } from "react";
import MatchItem from "@/components/partidas-futebol/MatchItem";

type Props = {
  partidas: any[];
  pageSize?: number;
};

export default function CalendarioClubesTab({ partidas, pageSize = 5 }: Props) {
  const [tab, setTab] = useState<"proximos" | "anteriores">("proximos");
  const [offset, setOffset] = useState(pageSize);

  const now = useMemo(() => new Date(), [partidas]);

  // Próximos: apenas partidas do futuro (>= agora), ordem crescente
  const proximos = useMemo(
    () =>
      partidas
        .filter(m => new Date(m.fixture.date) >= now)
        .sort((a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime()),
    [partidas, now]
  );

  // Últimos: partidas do passado (< agora), ordem decrescente
  const anteriores = useMemo(
    () =>
      partidas
        .filter(m => new Date(m.fixture.date) < now)
        .sort((a, b) => new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime()),
    [partidas, now]
  );

  const lista = tab === "proximos" ? proximos : anteriores;
  const mostrar = lista.slice(0, offset);

  function handleTabChange(newTab: "proximos" | "anteriores") {
    setTab(newTab);
    setOffset(pageSize);
  }

  function handleVerMais() {
    setOffset(o => o + pageSize);
  }

  return (
    <>
      {/* Header com tabs */}
      <div className="flex items-center justify-between px-2 py-2 bg-slate-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800 rounded-t-2xl">
        <span className="font-bold text-base text-[hsl(220_7%_38%)] dark:text-white">
          {tab === "proximos" ? "Próximos Jogos" : "Últimos Jogos"}
        </span>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-md text-sm font-semibold border transition ${
              tab === "anteriores"
                ? "bg-[hsl(220_7%_38%)] text-white border-[hsl(220_7%_38%)] shadow"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            }`}
            onClick={() => handleTabChange("anteriores")}
            disabled={tab === "anteriores"}
            type="button"
          >
            Partidas anteriores
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-semibold border transition ${
              tab === "proximos"
                ? "bg-[hsl(220_7%_38%)] text-white border-[hsl(220_7%_38%)] shadow"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            }`}
            onClick={() => handleTabChange("proximos")}
            disabled={tab === "proximos"}
            type="button"
          >
            Próximas partidas
          </button>
        </div>
      </div>
      {/* Lista de jogos */}
      <div className="flex flex-col gap-4 pt-4">
        {mostrar.length === 0 ? (
          <div className="text-zinc-400 dark:text-zinc-500 text-center py-8">
            Nenhuma partida {tab === "proximos" ? "futura" : "anterior"} encontrada.
          </div>
        ) : (
          mostrar.map((match, idx) => (
            <div key={match.fixture.id}>
              <MatchItem match={match} showFavoritos />
              {idx < mostrar.length - 1 && (
                <div className="w-full h-px mt-2 mb-1 bg-zinc-200 dark:bg-zinc-800" />
              )}
            </div>
          ))
        )}
        {offset < lista.length && mostrar.length > 0 && (
          <button
            className="self-center mt-2 px-4 py-2 rounded-lg bg-[hsl(220_7%_38%)] text-white text-sm font-semibold shadow transition hover:bg-[hsl(220_7%_28%)]"
            onClick={handleVerMais}
            type="button"
          >
            Ver mais {tab === "proximos" ? "próximos" : "últimos"} jogos
          </button>
        )}
      </div>
    </>
  );
}