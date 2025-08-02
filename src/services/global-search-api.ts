export type SearchResultType = "league" | "club" | "player" | "fixture";

export interface LeagueResult {
  type: "league";
  id: number | string;
  name: string;
  logo: string;
  country?: string;
  link: string;
}
export interface ClubResult {
  type: "club";
  id: number | string;
  name: string;
  logo: string;
  country?: string;
  link: string;
}
export interface PlayerResult {
  type: "player";
  id: number | string;
  name: string;
  photo: string;
  link: string;
}
export interface FixtureResult {
  type: "fixture";
  id: number | string;
  home: { name: string; logo: string };
  away: { name: string; logo: string };
  date: string;
  link: string;
}

export type GlobalSearchResult =
  | LeagueResult
  | ClubResult
  | PlayerResult
  | FixtureResult;

export interface GlobalSearchGroups {
  leagues: LeagueResult[];
  clubs: ClubResult[];
  players: PlayerResult[];
  fixtures: FixtureResult[];
}

// Busca por ligas/campeonatos
export async function searchLeagues(query: string): Promise<LeagueResult[]> {
  const res = await fetch(
    `/api/football/maiores-campeonatos?search=${encodeURIComponent(query)}`
  ).then(res => res.json());
  return (
    res?.response?.map((l: any) => ({
      type: "league",
      id: l.league.id,
      name: l.league.name,
      logo: l.league.logo,
      country: l.country?.name,
      link: `/maiores-campeonatos/${l.league.id}`,
    })) ?? []
  );
}

// Busca por clubes
export async function searchClubs(query: string): Promise<ClubResult[]> {
  const res = await fetch(
    `/api/football/pesquisa-clubes/teams?search=${encodeURIComponent(query)}`
  ).then(res => res.json());
  return (
    res?.response?.map((c: any) => ({
      type: "club",
      id: c.team?.id ?? c.id,
      name: c.team?.name ?? c.name,
      logo: c.team?.logo ?? c.logo,
      country: c.team?.country ?? c.country,
      link: `/pesquisa-clubes/${c.team?.id ?? c.id}`,
    })) ?? []
  );
}

// Busca por jogadores
export async function searchPlayers(query: string): Promise<PlayerResult[]> {
  const res = await fetch(
    `/api/football/pesquisa-jogadores/search?search=${encodeURIComponent(query)}`
  ).then(res => res.json());
  return (
    res?.response?.map((p: any) => ({
      type: "player",
      id: p.player?.id ?? p.id,
      name: p.player?.name ?? p.name,
      photo: p.player?.photo ?? p.photo,
      link: `/pesquisa-jogadores/${p.player?.id ?? p.id}`,
    })) ?? []
  );
}

// Busca por partidas/fixtures
export async function searchFixtures(query: string): Promise<FixtureResult[]> {
  const res = await fetch(
    `/api/football/partidas-futebol/fixtures?search=${encodeURIComponent(query)}`
  ).then(res => res.json());
  return (
    res?.response?.map((f: any) => ({
      type: "fixture",
      id: f.fixture.id,
      home: { name: f.teams.home.name, logo: f.teams.home.logo },
      away: { name: f.teams.away.name, logo: f.teams.away.logo },
      date: f.fixture.date,
      link: `/partidas-futebol/${f.fixture.id}`,
    })) ?? []
  );
}

// Busca global agrupada
export async function globalSearch(query: string): Promise<GlobalSearchGroups> {
  const [leagues, clubs, players, fixtures] = await Promise.all([
    searchLeagues(query),
    searchClubs(query),
    searchPlayers(query),
    searchFixtures(query),
  ]);
  return { leagues, clubs, players, fixtures };
}