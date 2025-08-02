import { NextRequest, NextResponse } from "next/server";
import { Redis } from "ioredis"; // Importação normal, sem @ts-ignore

// Validação inicial das variáveis de ambiente
if (!process.env.APIFOOTBALL_KEY || !process.env.REDIS_URL) {
  throw new Error("As variáveis de ambiente APIFOOTBALL_KEY e REDIS_URL devem ser definidas.");
}

const APIFOOTBALL_KEY = process.env.APIFOOTBALL_KEY;
const REDIS_URL = process.env.REDIS_URL;

// Padrão de cache de conexão com Redis, agora com os tipos corretos
// Isso evita criar múltiplas conexões em ambiente de desenvolvimento com Hot Reload
if (!globalThis.__redis__) {
  globalThis.__redis__ = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 2,
    enableOfflineQueue: false,
  });
}
// Atribui a instância global a uma constante local com o tipo correto
const redis: Redis = globalThis.__redis__;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const leagueId = searchParams.get("id");

  if (!leagueId) {
    return NextResponse.json(
      { error: "Parâmetro 'id' é obrigatório." },
      { status: 400 }
    );
  }

  const cacheKey = `apifootball:league:details:${leagueId}`;
  const CACHE_TTL = 60 * 60 * 4; // 4 horas

  try {
    // 1. Primeiro tenta pelo cache Redis
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached), { status: 200 });
    }

    // 2. Busca na API-FOOTBALL
    const apiRes = await fetch(
      `https://v3.football.api-sports.io/leagues?id=${leagueId}`,
      {
        headers: {
          "x-apisports-key": APIFOOTBALL_KEY,
        },
        next: { revalidate: CACHE_TTL },
      }
    );

    if (!apiRes.ok) {
      return NextResponse.json(
        { error: "Não foi possível buscar os dados da API-FOOTBALL." },
        { status: apiRes.status }
      );
    }

    const data = await apiRes.json();

    // 3. Salva no cache Redis
    await redis.set(cacheKey, JSON.stringify(data), "EX", CACHE_TTL);

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("Erro na rota /campeonatos/details:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}