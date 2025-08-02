"use client";

const FAV_STATS = [
  "posse de bola", "gols", "chutes a gol", "chutes", "escanteios", "defesas", "ataques", "passes certos", "grandes chances", "finalizações bloqueadas"
];
const NEG_STATS = [
  "faltas", "cartão amarelo", "cartão vermelho", "impedimentos", "gols sofridos", "erros", "pênaltis contra"
];

const STAT_TRANSLATIONS: Record<string, string> = {
  "Ball Possession": "Posse de bola",
  "Goals": "Gols",
  "Total Shots": "Chutes",
  "Shots": "Chutes",
  "Shots on Goal": "Chutes a gol",
  "Shots on Target": "Chutes a gol",
  "Shots off Goal": "Chutes para fora",
  "Shots off Target": "Chutes para fora",
  "Blocked Shots": "Finalizações bloqueadas",
  "Shots Inside Box": "Chutes dentro da área",
  "Shots inside box": "Chutes dentro da área",
  "Shots insidebox": "Chutes dentro da área",
  "Shots Outside Box": "Chutes fora da área",
  "Shots outside box": "Chutes fora da área",
  "Shots outsidebox": "Chutes fora da área",
  "Fouls": "Faltas",
  "Corner Kicks": "Escanteios",
  "Corners": "Escanteios",
  "Offsides": "Impedimentos",
  "Yellow Cards": "Cartão amarelo",
  "Red Cards": "Cartão vermelho",
  "Goalkeeper Saves": "Defesas",
  "Saves": "Defesas",
  "Total passes": "Passes",
  "Passes": "Passes",
  "Passes Accurate": "Passes certos",
  "Passes %": "Precisão dos passes (%)",
  "Attacks": "Ataques",
  "Dangerous Attacks": "Ataques perigosos",
  "Penalties": "Pênaltis",
  "Penalties Scored": "Pênaltis convertidos",
  "Penalties Missed": "Pênaltis perdidos",
  "Penalties Conceded": "Pênaltis contra",
  "Penalties conceded": "Pênaltis contra",
  "Big Chances": "Grandes chances",
  "Big Chances Missed": "Grandes chances perdidas",
  "Substitutions": "Substituições",
  "Clearances": "Cortes",
  "Interceptions": "Interceptações",
  "Tackles": "Desarmes",
  "Dribbles": "Dribles",
  "Possession lost": "Posse perdida",
  "Duels won": "Duelos ganhos",
  "Errors": "Erros",
  "Goals conceded": "Gols sofridos",
  "expected_goals": "Gols esperados (xG)",
  "Expected goals": "Gols esperados (xG)",
  "goals_prevented": "Gols evitados",
  "Goals prevented": "Gols evitados",
};

function translateStat(type: string): string {
  const clean = type.trim().replace(/[:：]$/, "");
  if (STAT_TRANSLATIONS[clean]) return STAT_TRANSLATIONS[clean];
  const found = Object.keys(STAT_TRANSLATIONS).find(
    k => k.toLowerCase() === clean.toLowerCase()
  );
  if (found) return STAT_TRANSLATIONS[found];
  return clean;
}

function isFavStat(type: string) {
  return FAV_STATS.some(s => type.toLowerCase().includes(s));
}
function isNegStat(type: string) {
  return NEG_STATS.some(s => type.toLowerCase().includes(s));
}

function parseNumber(val: string | number | null): number {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const n = Number(val.replace(/[^\d.,-]/g, "").replace(",", "."));
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

function statWinner(type: string, home: number, away: number): "home" | "away" | "draw" {
  if (home === away) return "draw";
  if (isFavStat(type)) {
    return home > away ? "home" : "away";
  }
  if (isNegStat(type)) {
    return home < away ? "home" : "away";
  }
  return home > away ? "home" : "away";
}

function getStatBarWidths(homeVal: string | number | null, awayVal: string | number | null) {
  const home = Math.max(0, parseNumber(homeVal));
  const away = Math.max(0, parseNumber(awayVal));
  const total = home + away;
  if (!total || isNaN(home) || isNaN(away)) return [50, 50];
  let homeW = Math.round((home / total) * 100);
  let awayW = Math.round((away / total) * 100);
  if (home > 0 && homeW < 10) homeW = 10;
  if (away > 0 && awayW < 10) awayW = 10;
  return [homeW, awayW];
}

interface StatItem {
  type: string;
  value: string | number | null;
}
interface MatchStatsTabProps {
  match: any;
  stats?: { [fixtureId: number]: { home: StatItem[]; away: StatItem[] } };
  loadingStats?: { [fixtureId: number]: boolean };
}

export default function MatchStatsTab({
  match,
  stats = {},
  loadingStats = {},
}: MatchStatsTabProps) {
  const fixtureId = match.fixture.id;
  const loading = loadingStats[fixtureId];
  const statsObj = stats[fixtureId];

  let homeStats = statsObj?.home || [];
  let awayStats = statsObj?.away || [];

  if (homeStats.length && awayStats.length) {
    const types = Array.from(new Set([...homeStats.map(s => s.type), ...awayStats.map(s => s.type)]));
    homeStats = types.map(type => homeStats.find(s => s.type === type) || { type, value: "-" });
    awayStats = types.map(type => awayStats.find(s => s.type === type) || { type, value: "-" });
  }

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl mt-2 p-4 w-full max-w-[850px] mx-auto">
      <div className="font-bold text-[hsl(220_7%_38%)] dark:text-[hsl(220_8%_85%)] mb-3 text-center text-[15px]">
        Estatísticas da partida
      </div>
      {loading ? (
        <div className="text-[13px] text-zinc-700 dark:text-zinc-300 text-center py-8 font-semibold">
          Carregando estatísticas...
        </div>
      ) : homeStats.length === 0 && awayStats.length === 0 ? (
        <div className="py-6 text-center text-zinc-700 dark:text-zinc-300 text-[13px] italic">
          Estatísticas não disponíveis para esta partida.
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {homeStats.map((stat, idx) => {
            const homeVal = stat.value ?? "-";
            const awayVal = awayStats[idx]?.value ?? "-";
            const homeNum = parseNumber(homeVal);
            const awayNum = parseNumber(awayVal);
            const winner = statWinner(stat.type, homeNum, awayNum);
            const [homeW, awayW] = getStatBarWidths(homeVal, awayVal);

            // Borda cinza padrão para os itens individuais
            const itemBorderClass = "border border-zinc-300 dark:border-zinc-800";

            const homeBarClass =
              winner === "home"
                ? "bg-zinc-900 dark:bg-zinc-300"
                : "bg-zinc-200 dark:bg-zinc-700";
            const awayBarClass =
              winner === "away"
                ? "bg-zinc-900 dark:bg-zinc-300"
                : "bg-zinc-200 dark:bg-zinc-700";

            return (
              <div
                key={stat.type + idx}
                className={`flex flex-col gap-1 bg-white dark:bg-zinc-900 rounded-md px-2 py-1.5 ${itemBorderClass}`}
              >
                <div className="flex items-center">
                  <div className="flex-1 flex justify-end">
                    <span
                      className={
                        (winner === "home"
                          ? "font-bold text-zinc-900 dark:text-zinc-300"
                          : "font-semibold text-zinc-700 dark:text-zinc-400") +
                        " text-[0.96rem] min-w-[25px] text-center"
                      }
                      style={{
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {homeVal}
                    </span>
                  </div>
                  <div className="flex-1 text-center text-[13px] text-zinc-900 dark:text-zinc-100 font-semibold">
                    {translateStat(stat.type)}
                  </div>
                  <div className="flex-1 flex justify-start">
                    <span
                      className={
                        (winner === "away"
                          ? "font-bold text-zinc-900 dark:text-zinc-300"
                          : "font-semibold text-zinc-700 dark:text-zinc-400") +
                        " text-[0.96rem] min-w-[25px] text-center"
                      }
                      style={{
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {awayVal}
                    </span>
                  </div>
                </div>
                {/* Barra */}
                <div className="flex items-center h-[0.38rem] mt-1 gap-2">
                  <div className="flex-1 flex justify-end">
                    <div
                      className={`transition-all duration-300 rounded-l-full ${homeBarClass}`}
                      style={{
                        width: `${homeW}%`,
                        height: "0.25rem",
                        minWidth: homeW > 0 ? 8 : 0,
                        maxWidth: "100%",
                      }}
                    />
                  </div>
                  <div className="w-2" />
                  <div className="flex-1 flex justify-start">
                    <div
                      className={`transition-all duration-300 rounded-r-full ${awayBarClass}`}
                      style={{
                        width: `${awayW}%`,
                        height: "0.25rem",
                        minWidth: awayW > 0 ? 8 : 0,
                        maxWidth: "100%",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
