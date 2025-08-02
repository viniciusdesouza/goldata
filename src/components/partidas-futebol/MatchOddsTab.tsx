"use client";
import { useState } from "react";
import { oddsToProbabilities } from "./utils";

interface MatchOddsTabProps {
  match: any;
  odds?: { [fixtureId: number]: { preMatch: any; live: any } };
  loadingOdds?: { [fixtureId: number]: boolean };
}

function statusLabel(status: string) {
  if (["FT", "AET", "PEN", "CANC", "POST", "ABD", "AWD", "WO"].includes(status)) return "finished";
  if (["NS", "TBD"].includes(status)) return "not_started";
  if (["1H", "2H", "ET", "LIVE", "HT", "P"].includes(status)) return "live";
  return "unknown";
}

const ODDS_TABS = [
  { key: "pre", label: "Odds pré-jogo", color: "bg-neutral-100 dark:bg-transparent text-zinc-900 dark:text-white border-zinc-400 dark:border-white" },
  { key: "live", label: "Odds ao vivo", color: "bg-neutral-100 dark:bg-transparent text-zinc-900 dark:text-white border-zinc-400 dark:border-white" },
] as const;

type OddsTab = typeof ODDS_TABS[number]["key"];

// Badge para odds: destaque quando é o menor odd, caso contrário padrão com borda cinza escura e texto preto (modo light), branco no dark
function getOddNumberClass(isMin: boolean) {
  return isMin
    ? "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-sm border font-bold border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-white dark:text-zinc-900"
    : "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-sm border font-bold border-zinc-400 bg-zinc-100 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100";
}
function getOddNumberNeutralClass() {
  return "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-sm border font-semibold border-neutral-300 bg-neutral-100 text-zinc-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-zinc-100";
}

export default function MatchOddsTab({
  match,
  odds = {},
  loadingOdds = {},
}: MatchOddsTabProps) {
  const fixtureId = match.fixture.id;
  const loading = loadingOdds[fixtureId];
  const oddsObj = odds[fixtureId]?.preMatch;
  const liveOddsObj = odds[fixtureId]?.live;
  const [tab, setTab] = useState<OddsTab>("pre");

  const matchStatus = match.fixture.status?.short || "NS";
  const matchStatusLabel = statusLabel(matchStatus);

  function findBet(bookmakers: any[], names: string[]): any | null {
    for (const bookmaker of bookmakers || []) {
      for (const bet of bookmaker.bets) {
        if (names.includes(bet.name)) {
          return { bookmaker, bet };
        }
      }
    }
    return null;
  }

  function get1x2OddClass(itemValue: string, oddsArray: any[]) {
    const numericOdds = oddsArray
      .map((v: any) => Number(v.odd))
      .filter((v: number) => !isNaN(v));
    const minOdd = Math.min(...numericOdds);

    const thisOddNum = Number(
      oddsArray.find((v: any) => v.value === itemValue)?.odd
    );
    return getOddNumberClass(!isNaN(thisOddNum) && thisOddNum === minOdd);
  }

  function renderOddsList(oddsObj: any) {
    if (!oddsObj || !oddsObj.bookmakers?.length) {
      return (
        <div className="text-[13px] text-zinc-600 dark:text-zinc-300 italic">
          Odds não disponíveis para esta partida.
        </div>
      );
    }

    const matchWinner = findBet(oddsObj.bookmakers, ["Match Winner", "Resultado Final", "1X2"]);
    const overUnder = findBet(oddsObj.bookmakers, ["Goals Over/Under", "Total Goals", "Mais/Menos de Gols"]);
    const btts = findBet(oddsObj.bookmakers, ["Both Teams To Score", "Ambas as equipes marcam"]);
    const prob = oddsToProbabilities(oddsObj);

    const sectionTitle = "text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mt-2 mb-1 pl-2 tracking-tight";

    const list1x2 = matchWinner ? (
      <div className="mb-2">
        <div className={sectionTitle}>Resultado Final (1X2)</div>
        <div className="flex flex-col gap-1">
          {matchWinner.bet.values.map((item: any) => {
            let label = item.value;
            if (item.value === "Home" || item.value === "1") label = match.teams.home.name;
            else if (item.value === "Away" || item.value === "2") label = match.teams.away.name;
            else if (item.value === "Draw" || item.value === "X") label = "Empate";
            return (
              <div
                key={item.value}
                className="flex justify-between items-center px-3 py-1 bg-white dark:bg-zinc-900 rounded-md border border-zinc-300 dark:border-zinc-700 text-[13px]"
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{label}</span>
                <span className="flex gap-2 items-center">
                  <span className={get1x2OddClass(item.value, matchWinner.bet.values)}>
                    {item.odd}
                  </span>
                  <span
                    className={getOddNumberClass(
                      item.value === matchWinner.bet.values.reduce((prev: any, curr: any) =>
                        Number(curr.odd) < Number(prev.odd) ? curr : prev
                      ).value
                    )}
                  >
                    {prob
                      ? item.value === "Home" || item.value === "1"
                        ? prob.home.toFixed(1) + "%"
                        : item.value === "Draw" || item.value === "X"
                        ? prob.draw.toFixed(1) + "%"
                        : item.value === "Away" || item.value === "2"
                        ? prob.away.toFixed(1) + "%"
                        : "-"
                      : "-"}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    ) : null;

    const listOverUnder = overUnder ? (
      <div className="mb-2">
        <div className={sectionTitle}>Over/Under (Total de Gols)</div>
        <div className="flex flex-col gap-1">
          {overUnder.bet.values.slice(0, 6).map((item: any) => (
            <div
              key={item.value + item.odd}
              className="flex justify-between items-center px-3 py-1 bg-white dark:bg-zinc-900 rounded-md border border-zinc-300 dark:border-zinc-700 text-[13px]"
            >
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{item.value}</span>
              <span
                className={
                  /Under|Menos/i.test(item.value)
                    ? getOddNumberNeutralClass()
                    : getOddNumberClass(false)
                }
              >
                {item.odd}
              </span>
            </div>
          ))}
        </div>
      </div>
    ) : null;

    const listBTTS = btts ? (
      <div className="mb-2">
        <div className={sectionTitle}>Ambas as equipes marcam</div>
        <div className="flex flex-col gap-1">
          {btts.bet.values.map((item: any) => (
            <div
              key={item.value + item.odd}
              className="flex justify-between items-center px-3 py-1 bg-white dark:bg-zinc-900 rounded-md border border-zinc-300 dark:border-zinc-700 text-[13px]"
            >
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{item.value}</span>
              <span
                className={
                  /Não|No/i.test(item.value)
                    ? getOddNumberNeutralClass()
                    : getOddNumberClass(false)
                }
              >
                {item.odd}
              </span>
            </div>
          ))}
        </div>
      </div>
    ) : null;

    return (
      <div className="flex flex-col gap-1">
        {list1x2}
        {listOverUnder}
        {listBTTS}
        <div className="text-[12px] text-zinc-600 dark:text-zinc-300 mt-2">
          <span className="font-medium">Casa de aposta:</span>{" "}
          <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{matchWinner?.bookmaker?.name || "-"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl mt-2 p-4 w-full max-w-[850px] mx-auto">
      <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-3 text-center text-[15px]">
        Odds e probabilidades
      </div>
      <div className="flex flex-col gap-1">
        {/* Sub-botões Odds pré-jogo / Odds ao vivo */}
        <div className="flex gap-2 justify-end mb-6">
          {ODDS_TABS.map((t) => {
            const isActive = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 py-1 rounded-lg text-sm border shadow-sm transition font-semibold ${
                  isActive
                    ? t.color
                    : "bg-neutral-100 dark:bg-neutral-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        {/* Conteúdo Odds */}
        {tab === "pre" ? (
          loading ? (
            <div className="text-[13px] text-zinc-600 dark:text-zinc-300 text-center py-3">Carregando odds pré-jogo...</div>
          ) : (
            renderOddsList(oddsObj)
          )
        ) : (
          (() => {
            if (matchStatusLabel === "not_started") {
              return (
                <div className="text-[13px] text-zinc-600 dark:text-zinc-300 text-center py-4">
                  Odds ao vivo indisponíveis porque a partida ainda não começou.
                </div>
              );
            }
            if (matchStatusLabel === "finished") {
              return (
                <div className="text-[13px] text-zinc-600 dark:text-zinc-300 text-center py-4">
                  Odds ao vivo indisponíveis porque a partida já terminou.
                </div>
              );
            }
            return loading ? (
              <div className="text-[13px] text-zinc-600 dark:text-zinc-300 text-center py-3">Carregando odds ao vivo...</div>
            ) : (
              renderOddsList(liveOddsObj)
            );
          })()
        )}
      </div>
    </div>
  );
}
