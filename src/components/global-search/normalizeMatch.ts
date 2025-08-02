export function normalizeMatch(match: any): any | null {
  if (!match) return null;
  // Já está no formato esperado
  if (match.fixture && match.teams && match.league) return match;

  // Flat format vindo da pesquisa global ou localStorage
  if (match.id && match.teams && match.league && match.date) {
    return {
      fixture: {
        id: match.id,
        date: match.date,
        status: {
          short: match.status?.short || match.status || "NS",
          elapsed: match.elapsed || 0,
          extra: match.extra || 0,
        },
        venue: match.venue || {},
      },
      league: match.league,
      teams: match.teams,
      goals: match.goals || { home: null, away: null },
    };
  }

  // Caso venha do API-Football response completo
  if (match.fixture && match.teams && match.league) return match;

  // Dados realmente incompletos
  return null;
}