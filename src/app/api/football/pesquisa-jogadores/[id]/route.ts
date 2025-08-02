import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const CACHE_TTL = 600; // 10 minutos

const API_FOOTBALL_KEY = process.env.APIFOOTBALL_KEY || "";
const API_FOOTBALL_URL = "https://v3.football.api-sports.io";
const SEASON = "2024";

async function getPlayerDetails(playerId: string) {
  const params = new URLSearchParams({
    id: playerId,
    season: SEASON,
  });
  const url = `${API_FOOTBALL_URL}/players?${params.toString()}`;
  const cacheKey = `football:pesquisa-jogadores:details:${playerId}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  const res = await fetch(url, {
    headers: { "x-apisports-key": API_FOOTBALL_KEY, accept: "application/json" },
    cache: "no-store",
  });
  const data = await res.json();
  const detail = data?.response?.[0] ?? null;
  await redis.set(cacheKey, JSON.stringify(detail), "EX", CACHE_TTL);
  return detail;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const playerId = params.id;
  if (!playerId) {
    return NextResponse.json({ error: "id param is required" }, { status: 400 });
  }

  const detail = await getPlayerDetails(playerId);

  // Devolve sempre um array em "response", igual aos outros endpoints
  return NextResponse.json({ response: detail ? [detail] : [] }, {
    status: 200,
    headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=60" },
  });
}