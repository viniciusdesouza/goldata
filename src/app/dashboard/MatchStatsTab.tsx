"use client";

interface StatItem {
  type: string;
  value: string | number | null;
}
interface MatchStatsTabProps {
  match: any;
  stats?: { [fixtureId: number]: { home: StatItem[]; away: StatItem[] } };
  loadingStats?: { [fixtureId: number]: boolean };
}

// Função para colorir os números conforme tipo de estatística
function getStatColor(type: string, value: any, homeOrAway: "home" | "away") {
  if (value === null || value === undefined || value === "-") return "bg-gray-100 text-gray-600";
  if (/gol/i.test(type)) {
    // Gols ou gols sofridos
    return "bg-blue-500 text-white";
  }
  if (/posse/i.test(type)) {
    return "bg-yellow-400 text-white";
  }
  if (/chute/i.test(type) && /gol/i.test(type)) {
    // Chutes a gol
    return "bg-green-500 text-white";
  }
  if (/chute/i.test(type)) {
    // Chutes totais
    return "bg-blue-400 text-white";
  }
  if (/cartão.*vermelho/i.test(type)) {
    return "bg-red-700 text-white";
  }
  if (/cartão.*amarelo/i.test(type)) {
    return "bg-yellow-500 text-white";
  }
  if (/falta/i.test(type)) {
    return "bg-gray-400 text-white";
  }
  if (/impedimento/i.test(type)) {
    return "bg-gray-300 text-gray-800";
  }
  if (/escanteio/i.test(type)) {
    return "bg-blue-200 text-blue-900";
  }
  if (/defesa/i.test(type)) {
    return "bg-green-200 text-green-900";
  }
  if (/ataque/i.test(type)) {
    return homeOrAway === "home" ? "bg-blue-100 text-blue-900" : "bg-purple-100 text-purple-900";
  }
  return "bg-blue-100 text-blue-900";
}

export default function MatchStatsTab({
  match,
  stats = {},
  loadingStats = {},
}: MatchStatsTabProps) {
  const fixtureId = match.fixture.id;
  const loading = loadingStats[fixtureId];
  const statsObj = stats[fixtureId];

  // Stats structure: { home: [{type, value}], away: [{type, value}] }
  let homeStats = statsObj?.home || [];
  let awayStats = statsObj?.away || [];

  // Normaliza: garante que ambos têm os mesmos tipos na mesma ordem
  if (homeStats.length && awayStats.length) {
    const types = Array.from(new Set([...homeStats.map(s => s.type), ...awayStats.map(s => s.type)]));
    homeStats = types.map(type => homeStats.find(s => s.type === type) || { type, value: "-" });
    awayStats = types.map(type => awayStats.find(s => s.type === type) || { type, value: "-" });
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow border border-gray-100 px-2 py-2 animate-fadeIn">
      {loading ? (
        <div className="text-center py-3 text-gray-500">Carregando estatísticas...</div>
      ) : homeStats.length === 0 && awayStats.length === 0 ? (
        <div className="text-xs italic text-gray-500">
          Estatísticas não disponíveis para esta partida.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[350px] w-full text-xs border border-gray-200 rounded">
            <thead>
              <tr className="bg-blue-100">
                <th className="py-2 px-2 text-blue-900 text-right w-1/4 font-bold">
                  <div className="flex items-center justify-end gap-2">
                    <img
                      src={match.teams.home.logo}
                      alt={match.teams.home.name}
                      className="w-5 h-5 rounded-full border"
                    />
                    <span className="text-xs font-bold text-gray-900 truncate">{match.teams.home.name}</span>
                  </div>
                </th>
                <th className="py-2 px-2 text-blue-900 w-2/4 font-bold text-center">
                  Estatística
                </th>
                <th className="py-2 px-2 text-blue-900 text-left w-1/4 font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900 truncate">{match.teams.away.name}</span>
                    <img
                      src={match.teams.away.logo}
                      alt={match.teams.away.name}
                      className="w-5 h-5 rounded-full border"
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {homeStats.map((stat, idx) => (
                <tr key={stat.type + idx} className="even:bg-gray-50">
                  <td className="py-1.5 px-2 text-right w-1/4">
                    <span
                      className={
                        "font-bold px-2 py-1 rounded-lg text-xs inline-block " +
                        getStatColor(stat.type, stat.value, "home")
                      }
                    >
                      {stat.value ?? "-"}
                    </span>
                  </td>
                  <td className="py-1.5 px-2 text-xs text-gray-700 w-2/4 text-center font-medium">
                    {stat.type}
                  </td>
                  <td className="py-1.5 px-2 text-left w-1/4">
                    <span
                      className={
                        "font-bold px-2 py-1 rounded-lg text-xs inline-block " +
                        getStatColor(stat.type, awayStats[idx]?.value, "away")
                      }
                    >
                      {awayStats[idx]?.value ?? "-"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}