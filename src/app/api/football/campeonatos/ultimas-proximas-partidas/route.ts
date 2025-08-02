import { NextRequest, NextResponse } from "next/server";
import { Redis } from "ioredis";

// --- Definição de Tipos para a Resposta da API ---
// Isso resolve o erro "implicitly has an 'any' type"
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
const CACHE_TTL = 120; // 2 minutos

// --- Padrão de Cache de Conexão com Redis ---
if (!globalThis.__redis__) {
  globalThis.__redis__ = new Redis(REDIS_URL);
}
const redis: Redis = globalThis.__redis__;

export async function GET(req: NextRequest) {
  try {
    const league = req.nextUrl.searchParams.get("league");
    const season = req.nextUrl.searchParams.get("season");

    if (!league || !season) {
      return NextResponse.json({ error: "Missing league or season" }, { status: 400 });
    }

    const cacheKey = `ultimas-proximas-partidas:${league}:${season}`;
    let allData: ApiResponse; // Aplicando o tipo aqui
    const cached = await redis.get(cacheKey);

    if (cached) {
      allData = JSON.parse(cached) as ApiResponse;
    } else {
      const params = new URLSearchParams({ league, season });
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

    // Ordena partidas por data - Agora o TypeScript sabe que 'a' e 'b' são do tipo 'Partida'
    const jogos = (allData.response || []).sort(
      (a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime()
    );
    const now = new Date();

    // Próximos 5 (data >= agora)
    const proximos = jogos.filter(j => new Date(j.fixture.date) >= now).slice(0, 5);

    // Últimos 5 (data < agora, ordem decrescente)
    const ultimos = jogos
      .filter(j => new Date(j.fixture.date) < now)
      .reverse() // Usar reverse() é mais eficiente que um segundo sort
      .slice(0, 5);

    return NextResponse.json({ proximos, ultimos }, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=30" },
    });
  } catch (error) {
    console.error("Erro na rota /ultimas-proximas-partidas:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
