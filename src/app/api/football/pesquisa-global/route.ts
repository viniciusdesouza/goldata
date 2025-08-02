import { NextRequest, NextResponse } from "next/server";
import { Redis } from "ioredis";

// --- Definição de Tipos ---
interface Country {
  name: string;
  code: string | null;
  flag: string | null;
}

interface Club {
  id: number;
  name: string;
  logo: string;
  country: Country;
}

interface League {
  id: number;
  name: string;
  logo: string;
  type: string;
  country: Country;
}

interface Fixture {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
    };
  };
  league: {
    id: number;
    name: string;
    logo: string;
    round: string;
    season: number;
    country: string;
  };
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null };
    away: { id: number; name: string; logo: string; winner: boolean | null };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}

// --- Validação e Configuração de Variáveis de Ambiente ---
if (!process.env.APIFOOTBALL_KEY || !process.env.REDIS_URL) {
  throw new Error("As variáveis de ambiente APIFOOTBALL_KEY e REDIS_URL devem ser definidas.");
}
const API_FOOTBALL_KEY = process.env.APIFOOTBALL_KEY;
const REDIS_URL = process.env.REDIS_URL;
const CACHE_TTL = 120; // 2 minutos

// --- Padrão de Cache de Conexão com Redis ---
if (!globalThis.__redis__) {
  globalThis.__redis__ = new Redis(REDIS_URL);
}
const redis: Redis = globalThis.__redis__;

// --- Funções Utilitárias ---
function dedupeBy<T>(arr: T[], key: (el: T) => any): T[] {
  const seen = new Set();
  return arr.filter(item => {
    const k = key(item);
    if (seen.has(k) || k === null || k === undefined) return false;
    seen.add(k);
    return true;
  });
}

async function fetchFromApi<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url, {
      headers: { "x-apisports-key": API_FOOTBALL_KEY, "accept": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.response || [];
  } catch (error) {
    console.error(`Erro ao buscar da API: ${url}`, error);
    return [];
  }
}

// --- Handler Principal da Rota ---
export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("search");
  if (!search) {
    return NextResponse.json({ error: "Missing required parameter: search" }, { status: 400 });
  }

  const cacheKey = `football:pesquisa-global:${search}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached), {
        status: 200,
        headers: { "Cache-Control": `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=30` }
      });
    }

    // 1. Buscar Clubes e Campeonatos em paralelo
    const [clubesResponse, leaguesResponse, liveFixturesResponse] = await Promise.all([
      fetchFromApi<{ team: Club }>(`https://v3.football.api-sports.io/teams?search=${encodeURIComponent(search)}`),
      fetchFromApi<{ league: League }>(`https://v3.football.api-sports.io/leagues?search=${encodeURIComponent(search)}`),
      fetchFromApi<Fixture>(`https://v3.football.api-sports.io/fixtures?live=all`)
    ]);

    // Com os tipos definidos, 'c' é inferido corretamente, resolvendo o erro.
    const clubes = dedupeBy(clubesResponse.map(item => item.team), c => c.id).slice(0, 2);
    const campeonatos = dedupeBy(leaguesResponse.map(item => item.league), c => c.id).slice(0, 10);

    // 2. Filtrar partidas ao vivo que correspondem à busca
    const searchLower = search.toLowerCase();
    const liveMatches = liveFixturesResponse.filter(p =>
      p.teams.home.name.toLowerCase().includes(searchLower) ||
      p.teams.away.name.toLowerCase().includes(searchLower) ||
      p.league.name.toLowerCase().includes(searchLower)
    );

    let partidas: Fixture[] = [...liveMatches];

    // 3. Buscar próximas partidas para os clubes e campeonatos encontrados (em paralelo)
    const fixturePromises: Promise<Fixture[]>[] = [];

    // Próximas 7 partidas para cada clube
    clubes.forEach(team => {
      fixturePromises.push(fetchFromApi<Fixture>(`https://v3.football.api-sports.io/fixtures?team=${team.id}&next=7`));
    });

    // Próximas 5 partidas para cada campeonato
    campeonatos.forEach(camp => {
      fixturePromises.push(fetchFromApi<Fixture>(`https://v3.football.api-sports.io/fixtures?league=${camp.id}&next=5`));
    });

    const fixtureResults = await Promise.all(fixturePromises);
    fixtureResults.forEach(result => {
      partidas.push(...result);
    });

    // 4. Processamento final: deduplicar, ordenar e formatar
    const liveStatusSet = new Set(["1H", "HT", "2H", "ET", "P", "LIVE"]);
    const finalPartidas = dedupeBy(partidas, p => p.fixture.id)
      .sort((a, b) => {
        const aIsLive = liveStatusSet.has(a.fixture.status.short);
        const bIsLive = liveStatusSet.has(b.fixture.status.short);
        if (aIsLive && !bIsLive) return -1;
        if (!aIsLive && bIsLive) return 1;
        return new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime();
      })
      .slice(0, 30);

    const response = { clubes, campeonatos, partidas: finalPartidas };

    await redis.set(cacheKey, JSON.stringify(response), "EX", CACHE_TTL);

    return NextResponse.json(response, {
      status: 200,
      headers: { "Cache-Control": `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=30` }
    });

  } catch (error) {
    console.error("Erro na rota /pesquisa-global:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
