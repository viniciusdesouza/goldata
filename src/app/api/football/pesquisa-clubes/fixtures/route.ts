import { NextRequest, NextResponse } from "next/server";
import { Redis } from "ioredis";

// --- Definição de Tipos ---
interface Partida {
  fixture: {
    id: number;
    date: string;
    // Adicione outros campos que você possa precisar
  };
  // Adicione outros campos da partida se precisar (league, teams, etc.)
}

interface ApiResponse {
  response: Partida[];
}

// --- Validação e Configuração de Variáveis de Ambiente ---
if (!process.env.APIFOOTBALL_KEY || !process.env.REDIS_URL) {
  throw new Error("As variáveis de ambiente APIFOOTBALL_KEY e REDIS_URL devem ser definidas.");
}
const API_FOOTBALL_KEY = process.env.APIFOOTBALL_KEY;
const REDIS_URL = process.env.REDIS_URL;
const API_FOOTBALL_URL = "https://v3.football.api-sports.io/fixtures";
const CACHE_TTL = 180; // 3 minutos

// --- Padrão de Cache de Conexão com Redis ---
if (!globalThis.__redis__) {
  globalThis.__redis__ = new Redis(REDIS_URL);
}
const redis: Redis = globalThis.__redis__;

export async function GET(req: NextRequest) {
  try {
    const team = req.nextUrl.searchParams.get("team");
    const season = req.nextUrl.searchParams.get("season");
    const league = req.nextUrl.searchParams.get("league");
    const next = req.nextUrl.searchParams.get("next");
    const last = req.nextUrl.searchParams.get("last");
    const offset = parseInt(req.nextUrl.searchParams.get("offset") || "0", 10);
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || next || last || "5", 10);

    if (!team || !season) {
      return NextResponse.json({ error: "Missing required parameters: team and season" }, { status: 400 });
    }

    // Não inclua offset/limit no cacheKey para reaproveitar cache do total de jogos
    const cacheKey = `football:fixtures:team:${team}:season:${season}:league:${league || "all"}`;
    let allData: ApiResponse;
    const cached = await redis.get(cacheKey);

    if (cached) {
      allData = JSON.parse(cached) as ApiResponse;
    } else {
      const params = new URLSearchParams({ team, season });
      if (league) params.append("league", league);
      
      const url = `${API_FOOTBALL_URL}?${params.toString()}`;
      const res = await fetch(url, {
        headers: {
          "x-apisports-key": API_FOOTBALL_KEY,
          "accept": "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const txt = await res.text();
        return NextResponse.json({ error: `API error: ${res.status}`, detail: txt }, { status: res.status });
      }

      const data = await res.json() as ApiResponse;
      allData = { response: data?.response || [] };
      await redis.set(cacheKey, JSON.stringify(allData), "EX", CACHE_TTL);
    }

    // Filtrar jogos futuros/passados
    let jogos: Partida[] = allData.response || [];
    const now = new Date();

    if (next) {
      jogos = jogos
        .filter(j => new Date(j.fixture.date) >= now)
        .sort((a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime());
    } else if (last) {
      jogos = jogos
        .filter(j => new Date(j.fixture.date) < now)
        .sort((a, b) => new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime());
    }
    
    // Paginação manual
    const paginated = jogos.slice(offset, offset + limit);

    return NextResponse.json({ response: paginated }, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=30" },
    });
  } catch (error) {
    console.error("Erro na rota /pesquisa-clubes/fixtures:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
