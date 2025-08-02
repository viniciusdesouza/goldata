import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const API_FOOTBALL_BASE = "https://v3.football.api-sports.io";
const API_KEY = process.env.APIFOOTBALL_KEY || process.env.API_FOOTBALL_KEY;
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const CACHE_TTL_PRE = 180; // 3 minutos para odds pré-jogo
const CACHE_TTL_LIVE = 30; // 30 segundos para odds ao vivo

export async function GET(req: NextRequest) {
  const fixtureId = req.nextUrl.searchParams.get("fixture");
  if (!fixtureId) {
    return NextResponse.json({ error: "Missing fixture id" }, { status: 400 });
  }
  if (!API_KEY) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  // Odds pré-jogo
  const cacheKeyPre = `football:odds:pre:${fixtureId}`;
  // Odds ao vivo
  const cacheKeyLive = `football:odds:live:${fixtureId}`;

  // Busca ambos do cache
  const [cachedPre, cachedLive] = await Promise.all([
    redis.get(cacheKeyPre),
    redis.get(cacheKeyLive)
  ]);

  // Se ambos existem, retorna
  if (cachedPre && cachedLive) {
    return NextResponse.json(
      { preMatch: JSON.parse(cachedPre), live: JSON.parse(cachedLive) },
      {
        status: 200,
        headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=10" },
      }
    );
  }

  // Busca ambos na API em paralelo, só se necessário
  const preMatchPromise = cachedPre
    ? Promise.resolve(JSON.parse(cachedPre))
    : fetch(`${API_FOOTBALL_BASE}/odds?fixture=${fixtureId}`, {
        headers: { "x-apisports-key": API_KEY, "accept": "application/json" },
        cache: "no-store",
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          const value = data?.response?.[0] || null;
          // Só salva se veio algo
          if (value) redis.set(cacheKeyPre, JSON.stringify(value), "EX", CACHE_TTL_PRE);
          return value;
        });

  const livePromise = cachedLive
    ? Promise.resolve(JSON.parse(cachedLive))
    : fetch(`${API_FOOTBALL_BASE}/odds/live?fixture=${fixtureId}`, {
        headers: { "x-apisports-key": API_KEY, "accept": "application/json" },
        cache: "no-store",
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          const value = data?.response?.[0] || null;
          if (value) redis.set(cacheKeyLive, JSON.stringify(value), "EX", CACHE_TTL_LIVE);
          return value;
        });

  const [preMatch, live] = await Promise.all([preMatchPromise, livePromise]);
  return NextResponse.json(
    { preMatch, live },
    {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=10" },
    }
  );
}