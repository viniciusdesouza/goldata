import { NextRequest, NextResponse } from "next/server";
import { Redis } from "ioredis";

// --- Definição de Tipos ---
interface Partida {
  fixture: {
    id: number;
    status: {
      short: string;
    };
    // Adicione outros campos que precisar
  };
  // Adicione outros campos que precisar
}

// --- Validação e Configuração de Variáveis de Ambiente ---
if (!process.env.APIFOOTBALL_KEY || !process.env.REDIS_URL) {
  throw new Error("As variáveis de ambiente APIFOOTBALL_KEY e REDIS_URL devem ser definidas.");
}
const API_FOOTBALL_KEY = process.env.APIFOOTBALL_KEY;
const REDIS_URL = process.env.REDIS_URL;
const API_FOOTBALL_URL = "https://v3.football.api-sports.io/fixtures";

// --- Padrão de Cache de Conexão com Redis ---
if (!globalThis.__redis__) {
  globalThis.__redis__ = new Redis(REDIS_URL);
}
const redis: Redis = globalThis.__redis__;

const LIVE_STATUSES = new Set(["1H", "HT", "2H", "ET", "P", "LIVE"]);
const CACHE_TTL_SECONDS = 12 * 3600; // 12 horas

/**
 * Busca uma única partida, usando o cache Redis.
 * Força uma atualização da API se a partida estiver ao vivo.
 */
async function getFixture(id: string): Promise<Partida | null> {
  const cacheKey = `football:fixture:id:${id}`;
  const cachedData = await redis.get(cacheKey);
  let fixture: Partida | null = null;
  let shouldForceUpdate = false;

  if (cachedData) {
    try {
      fixture = JSON.parse(cachedData) as Partida;
      // Força a atualização se o status da partida em cache estiver ao vivo
      if (fixture?.fixture?.status?.short && LIVE_STATUSES.has(fixture.fixture.status.short)) {
        shouldForceUpdate = true;
      }
    } catch (e) {
      console.error(`Erro ao parsear o JSON do cache para o fixture ID ${id}`, e);
      // Se o cache estiver corrompido, força a atualização
      shouldForceUpdate = true; 
    }
  }

  // Se não houver cache ou se a atualização for forçada, busca na API
  if (!fixture || shouldForceUpdate) {
    const url = `${API_FOOTBALL_URL}?id=${id}`;
    const res = await fetch(url, {
      headers: {
        // O erro é resolvido aqui, pois API_FOOTBALL_KEY foi validado no início
        "x-apisports-key": API_FOOTBALL_KEY,
        "accept": "application/json",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const apiData = await res.json();
      const fetchedFixture = apiData.response?.[0];
      if (fetchedFixture) {
        await redis.set(cacheKey, JSON.stringify(fetchedFixture), "EX", CACHE_TTL_SECONDS);
        return fetchedFixture;
      }
    }
    // Se a API falhar mas tivermos um cache antigo (mesmo que ao vivo), retornamos ele
    // para não quebrar a UI.
    return fixture; 
  }

  return fixture;
}

export async function GET(req: NextRequest) {
  try {
    const idsParam = req.nextUrl.searchParams.get("ids");
    if (!idsParam) {
      return NextResponse.json({ error: "Missing ids parameter" }, { status: 400 });
    }
    
    const ids = Array.from(new Set(idsParam.split(",").map(x => x.trim()).filter(Boolean)));

    if (ids.length === 0) {
      return NextResponse.json({ response: [] }, { status: 200 });
    }

    // Busca todas as partidas em paralelo
    const fixtures = (await Promise.all(ids.map(getFixture))).filter(Boolean);

    return NextResponse.json({ response: fixtures }, { status: 200 });

  } catch (error) {
    console.error("Erro na rota /fixturesByIds:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
