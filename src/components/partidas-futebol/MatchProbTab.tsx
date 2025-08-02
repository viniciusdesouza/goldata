interface MatchProbTabProps {
  match: any;
  probabilities?: { [fixtureId: number]: { home: number; draw: number; away: number } };
  loadingProb?: { [fixtureId: number]: boolean };
}

export default function MatchProbTab({
  match,
  probabilities = {},
  loadingProb = {},
}: MatchProbTabProps) {
  const fixtureId = match.fixture.id;
  const loading = loadingProb[fixtureId];
  const prob = probabilities[fixtureId];

  return (
    <div className="animate-fadeIn mt-2 border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 rounded-xl p-3">
      {loading ? (
        <div className="text-center py-3 text-gray-500">Carregando probabilidades...</div>
      ) : prob ? (
        <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch">
          <div className="flex-1 flex flex-col items-center bg-blue-100 dark:bg-blue-900 rounded-lg p-3">
            <span className="font-medium text-blue-800 dark:text-blue-100 text-sm mb-1">{match.teams.home.name}</span>
            <span className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {prob.home.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500">Vitória mandante</span>
          </div>
          <div className="flex-1 flex flex-col items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
            <span className="font-medium text-gray-800 dark:text-gray-200 text-sm mb-1">Empate</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {prob.draw.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500">Empate</span>
          </div>
          <div className="flex-1 flex flex-col items-center bg-violet-100 dark:bg-violet-900 rounded-lg p-3">
            <span className="font-medium text-violet-800 dark:text-violet-100 text-sm mb-1">{match.teams.away.name}</span>
            <span className="text-2xl font-bold text-violet-900 dark:text-violet-100">
              {prob.away.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500">Vitória visitante</span>
          </div>
        </div>
      ) : (
        <div className="text-xs italic text-gray-500">Probabilidades não disponíveis para esta partida.</div>
      )}
    </div>
  );
}