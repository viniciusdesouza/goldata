import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const CACHE_TTL = 120; // 2 minutos

const API_FOOTBALL_KEY = process.env.APIFOOTBALL_KEY || process.env.API_FOOTBALL_KEY || "";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("search");
  const season = req.nextUrl.searchParams.get("season") || new Date().getFullYear().toString();

  if (!search) {
    return NextResponse.json({ error: "Missing required parameter: search" }, { status: 400 });
  }

  const cacheKey = `football:partidas-search:${search}:${season}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return NextResponse.json(JSON.parse(cached), {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=30" },
    });
  }

  // 1. Buscar times pelo texto
  const teamsRes = await fetch(
    `https://v3.football.api-sports.io/teams?search=${encodeURIComponent(search)}`,
    {
      headers: {
        "x-apisports-key": API_FOOTBALL_KEY,
        "accept": "application/json",
      },
      cache: "no-store",
    }
  );
  const teamsData = await teamsRes.json();
  const teams = teamsData?.response || [];
  if (teams.length === 0) {
    await redis.set(cacheKey, JSON.stringify({ response: [] }), "EX", CACHE_TTL);
    return NextResponse.json({ response: [] }, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=30" },
    });
  }

  // 2. Buscar fixtures dos times encontrados (limite para evitar muitas chamadas)
  let fixtures: any[] = [];
  for (const team of teams.slice(0, 2)) { // Limite para os 2 primeiros times encontrados
    const teamId = team.team?.id;
    if (!teamId) continue;
    const fixturesRes = await fetch(
      `https://v3.football.api-sports.io/fixtures?team=${teamId}&season=${season}&next=5`,
      {
        headers: {
          "x-apisports-key": API_FOOTBALL_KEY,
          "accept": "application/json",
        },
        cache: "no-store",
      }
    );
    const fixturesData = await fixturesRes.json();
    fixtures = fixtures.concat(fixturesData?.response || []);
  }

  // 3. Remover duplicatas (caso times se enfrentem)
  const uniqueFixtures = Array.from(
    new Map(fixtures.map(f => [f.fixture.id, f])).values()
  );

  const resp = { response: uniqueFixtures };
  await redis.set(cacheKey, JSON.stringify(resp), "EX", CACHE_TTL);

  return NextResponse.json(resp, {
    status: 200,
    headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=30" },
  });
}