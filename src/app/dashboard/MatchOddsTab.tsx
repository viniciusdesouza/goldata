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

export default function MatchOddsTab({
  match,
  odds = {},
  loadingOdds = {},
}: MatchOddsTabProps) {
  const fixtureId = match.fixture.id;
  const loading = loadingOdds[fixtureId];
  const oddsObj = odds[fixtureId]?.preMatch;
  const liveOddsObj = odds[fixtureId]?.live;
  const [tab, setTab] = useState<"pre" | "live">("pre");

  // status example: NS = Not Started, 1H = 1st Half, FT = Finished, etc...
  const matchStatus = match.fixture.status?.short || "NS";
  const matchStatusLabel = statusLabel(matchStatus);

  // --- odds helpers ---
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

  function renderOddsTable(oddsObj: any) {
    if (!oddsObj || !oddsObj.bookmakers?.length) {
      return (
        <div className="text-xs italic text-gray-500">
          Odds não disponíveis para esta partida.
        </div>
      );
    }

    // 1X2 odds
    const matchWinner = findBet(oddsObj.bookmakers, ["Match Winner", "Resultado Final", "1X2"]);
    // Over/Under odds (for main line, e.g. Over/Under 2.5)
    const overUnder = findBet(oddsObj.bookmakers, ["Goals Over/Under", "Total Goals", "Mais/Menos de Gols"]);
    // Both teams to score
    const btts = findBet(oddsObj.bookmakers, ["Both Teams To Score", "Ambas as equipes marcam"]);

    // Probabilidades para 1x2
    const prob = oddsToProbabilities(oddsObj);

    return (
      <div className="overflow-x-auto mt-2">
        <table className="min-w-[350px] w-full text-xs border border-gray-200 dark:border-gray-700 rounded">
          <thead>
            <tr className="bg-fuchsia-100 dark:bg-fuchsia-800">
              <th className="py-2 px-2 text-left text-fuchsia-900 dark:text-fuchsia-100">Mercado</th>
              <th className="py-2 px-2 text-center text-fuchsia-900 dark:text-fuchsia-100">Odd</th>
              <th className="py-2 px-2 text-center text-fuchsia-900 dark:text-fuchsia-100">% Implícita</th>
            </tr>
          </thead>
          <tbody>
            {/* Odds 1X2 */}
            {matchWinner &&
              matchWinner.bet.values.map((item: any) => (
                <tr key={item.value}>
                  <td className="py-1.5 px-2 font-semibold text-left">
                    {item.value === "Home" || item.value === "1"
                      ? match.teams.home.name
                      : item.value === "Away" || item.value === "2"
                      ? match.teams.away.name
                      : item.value === "Draw" || item.value === "X"
                      ? "Empate"
                      : item.value}
                  </td>
                  <td className="py-1.5 px-2 text-center">{item.odd}</td>
                  <td className="py-1.5 px-2 text-center">
                    {prob
                      ? item.value === "Home" || item.value === "1"
                        ? prob.home.toFixed(1) + "%"
                        : item.value === "Draw" || item.value === "X"
                        ? prob.draw.toFixed(1) + "%"
                        : item.value === "Away" || item.value === "2"
                        ? prob.away.toFixed(1) + "%"
                        : "-"
                      : "-"}
                  </td>
                </tr>
              ))}

            {/* Over/Under Gols */}
            {overUnder && (
              <>
                <tr>
                  <td colSpan={3} className="py-2 px-2 font-bold text-fuchsia-800 dark:text-fuchsia-100 bg-fuchsia-50 dark:bg-fuchsia-950 text-left">
                    Over/Under (Total de Gols)
                  </td>
                </tr>
                {overUnder.bet.values.slice(0, 6).map((item: any) => (
                  <tr key={item.value + item.odd}>
                    <td className="py-1.5 px-2 text-left">{item.value}</td>
                    <td className="py-1.5 px-2 text-center">{item.odd}</td>
                    <td className="py-1.5 px-2 text-center">-</td>
                  </tr>
                ))}
              </>
            )}

            {/* Ambas as equipes marcam */}
            {btts && (
              <>
                <tr>
                  <td colSpan={3} className="py-2 px-2 font-bold text-fuchsia-800 dark:text-fuchsia-100 bg-fuchsia-50 dark:bg-fuchsia-950 text-left">
                    Ambas as equipes marcam
                  </td>
                </tr>
                {btts.bet.values.map((item: any) => (
                  <tr key={item.value + item.odd}>
                    <td className="py-1.5 px-2 text-left">{item.value}</td>
                    <td className="py-1.5 px-2 text-center">{item.odd}</td>
                    <td className="py-1.5 px-2 text-center">-</td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
        <div className="mt-2 text-xs text-gray-500">
          <span className="font-semibold">Casa de aposta:</span> {matchWinner?.bookmaker?.name || "-"}
        </div>
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="animate-fadeIn mt-2 border border-fuchsia-200 dark:border-fuchsia-800 bg-fuchsia-50 dark:bg-fuchsia-950 rounded-xl p-3">
      {/* Sub-botões Odds pré-jogo / Odds ao vivo */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded text-xs font-bold border ${
            tab === "pre"
              ? "bg-fuchsia-600 text-white border-fuchsia-800"
              : "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300"
          }`}
          onClick={() => setTab("pre")}
        >
          Odds pré-jogo
        </button>
        <button
          className={`px-3 py-1 rounded text-xs font-bold border ${
            tab === "live"
              ? "bg-fuchsia-600 text-white border-fuchsia-800"
              : "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300"
          }`}
          onClick={() => setTab("live")}
        >
          Odds ao vivo
        </button>
      </div>

      {/* Conteúdo Odds */}
      {tab === "pre" ? (
        loading ? (
          <div className="text-center py-3 text-gray-500">Carregando odds pré-jogo...</div>
        ) : (
          renderOddsTable(oddsObj)
        )
      ) : (
        // Odds ao vivo
        (() => {
          if (matchStatusLabel === "not_started") {
            return (
              <div className="text-center text-xs text-gray-500 py-4">
                Odds ao vivo indisponíveis porque a partida ainda não começou.
              </div>
            );
          }
          if (matchStatusLabel === "finished") {
            return (
              <div className="text-center text-xs text-gray-500 py-4">
                Odds ao vivo indisponíveis porque a partida já terminou.
              </div>
            );
          }
          // Se está ao vivo
          return loading ? (
            <div className="text-center py-3 text-gray-500">Carregando odds ao vivo...</div>
          ) : (
            renderOddsTable(liveOddsObj)
          );
        })()
      )}
    </div>
  );
}