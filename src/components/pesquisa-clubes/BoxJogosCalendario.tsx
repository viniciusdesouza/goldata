import { useMemo, useState } from "react";
import MatchItem from "@/components/partidas-futebol/MatchItem";

interface BoxJogosCalendarioProps {
  partidas: any[];
  pageSize?: number;
}

export default function BoxJogosCalendario({ partidas = [], pageSize = 5 }: BoxJogosCalendarioProps) {
  const [tab, setTab] = useState<"proximas" | "anteriores">("proximas");
  const [offset, setOffset] = useState(pageSize);

  const now = new Date();

  // Próximas partidas: datas futuras e ordem crescente
  const proximas = useMemo(
    () =>
      partidas
        .filter((m) => new Date(m.fixture.date) >= now)
        .sort((a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime()),
    [partidas, now]
  );

  // Últimas partidas: datas passadas e ordem decrescente
  const anteriores = useMemo(
    () =>
      partidas
        .filter((m) => new Date(m.fixture.date) < now)
        .sort((a, b) => new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime()),
    [partidas, now]
  );

  const mostrar = tab === "proximas"
    ? proximas.slice(0, offset)
    : anteriores.slice(0, offset);

  function handleTabChange(newTab: "proximas" | "anteriores") {
    if (tab !== newTab) {
      setTab(newTab);
      setOffset(pageSize);
    }
  }

  function handleVerMais() {
    if (tab === "proximas" && offset < proximas.length) setOffset((o) => o + pageSize);
    if (tab === "anteriores" && offset < anteriores.length) setOffset((o) => o + pageSize);
  }

  const total = tab === "proximas" ? proximas.length : anteriores.length;

  return (
    <div className="w-full">
      <div className="flex gap-2 justify-center mb-4">
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${
            tab === "anteriores"
              ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-100"
          }`}
          onClick={() => handleTabChange("anteriores")}
          type="button"
          disabled={tab === "anteriores"}
        >
          Últimos Jogos
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${
            tab === "proximas"
              ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-100"
          }`}
          onClick={() => handleTabChange("proximas")}
          type="button"
          disabled={tab === "proximas"}
        >
          Próximos Jogos
        </button>
      </div>
      {mostrar.length === 0 ? (
        <div className="text-gray-500 text-sm text-center py-8">
          Nenhuma partida {tab === "proximas" ? "futura" : "anterior"} encontrada.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {mostrar.map((match) => (
            <div key={match.fixture.id}>
              <MatchItem match={match} showFavoritos />
            </div>
          ))}
          {offset < total && (
            <button
              className="self-center mt-2 px-4 py-2 rounded-lg bg-[hsl(220_7%_38%)] text-white text-sm font-semibold shadow transition hover:bg-[hsl(220_7%_28%)]"
              onClick={handleVerMais}
              type="button"
            >
              Ver mais {tab === "proximas" ? "próximos" : "últimos"} jogos
            </button>
          )}
        </div>
      )}
    </div>
  );
}