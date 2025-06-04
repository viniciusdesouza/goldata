interface MatchAverageTabProps {
  match: any;
  type: "mandante" | "visitante";
  mandanteStats?: { [fixtureId: number]: { home: any; away: any } };
  visitanteStats?: { [fixtureId: number]: { home: any; away: any } };
  loadingMandante?: { [fixtureId: number]: boolean };
  loadingVisitante?: { [fixtureId: number]: boolean };
}

export default function MatchAverageTab({
  match,
  type,
  mandanteStats = {},
  visitanteStats = {},
  loadingMandante = {},
  loadingVisitante = {},
}: MatchAverageTabProps) {
  const fixtureId = match.fixture.id;
  const isMandante = type === "mandante";
  const statsObj = isMandante ? mandanteStats[fixtureId] : visitanteStats[fixtureId];
  const loading = isMandante ? loadingMandante[fixtureId] : loadingVisitante[fixtureId];
  const teamName = isMandante ? match.teams.home.name : match.teams.away.name;

  function renderFullAverages(avgObj: { home: any; away: any } | undefined, teamName: string) {
    if (!avgObj) return <div className="text-xs italic text-gray-500">Médias não disponíveis.</div>;
    return (
      <div className="overflow-x-auto mt-2">
        <table className="min-w-[350px] w-full text-xs border border-gray-200 dark:border-gray-700 rounded">
          <thead>
            <tr className="bg-blue-100 dark:bg-blue-800">
              <th colSpan={2} className="py-2 px-2 text-left text-blue-900 dark:text-blue-200">Dentro de casa ({teamName})</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Partidas:</td><td>{avgObj.home?.matches ?? "-"}</td></tr>
            <tr><td>Gols marcados por jogo:</td><td>{avgObj.home?.goals_for_per_game ?? "-"}</td></tr>
            <tr><td>Gols sofridos por jogo:</td><td>{avgObj.home?.goals_against_per_game ?? "-"}</td></tr>
            <tr><td>Vitórias:</td><td>{avgObj.home?.wins ?? "-"}</td></tr>
            <tr><td>Empates:</td><td>{avgObj.home?.draws ?? "-"}</td></tr>
            <tr><td>Derrotas:</td><td>{avgObj.home?.loses ?? "-"}</td></tr>
            <tr><td>Clean sheets:</td><td>{avgObj.home?.clean_sheets ?? "-"}</td></tr>
            <tr><td>Não marcou gol:</td><td>{avgObj.home?.failed_to_score ?? "-"}</td></tr>
          </tbody>
          <thead>
            <tr className="bg-violet-100 dark:bg-violet-800">
              <th colSpan={2} className="py-2 px-2 text-left text-violet-900 dark:text-violet-200">Fora de casa ({teamName})</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Partidas:</td><td>{avgObj.away?.matches ?? "-"}</td></tr>
            <tr><td>Gols marcados por jogo:</td><td>{avgObj.away?.goals_for_per_game ?? "-"}</td></tr>
            <tr><td>Gols sofridos por jogo:</td><td>{avgObj.away?.goals_against_per_game ?? "-"}</td></tr>
            <tr><td>Vitórias:</td><td>{avgObj.away?.wins ?? "-"}</td></tr>
            <tr><td>Empates:</td><td>{avgObj.away?.draws ?? "-"}</td></tr>
            <tr><td>Derrotas:</td><td>{avgObj.away?.loses ?? "-"}</td></tr>
            <tr><td>Clean sheets:</td><td>{avgObj.away?.clean_sheets ?? "-"}</td></tr>
            <tr><td>Não marcou gol:</td><td>{avgObj.away?.failed_to_score ?? "-"}</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div
      className={`animate-fadeIn mt-2 border ${
        isMandante
          ? "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950"
          : "border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950"
      } rounded-xl p-3`}
    >
      {loading ? (
        <div className="text-center py-3 text-gray-500">
          Carregando médias do {isMandante ? "mandante" : "visitante"}...
        </div>
      ) : (
        renderFullAverages(statsObj, teamName)
      )}
    </div>
  );
}