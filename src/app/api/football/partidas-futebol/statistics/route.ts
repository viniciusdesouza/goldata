import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const CACHE_TTL = 120; // 2 minutos

export async function GET(req: NextRequest) {
  const team = req.nextUrl.searchParams.get("team");
  const season = req.nextUrl.searchParams.get("season");
  const league = req.nextUrl.searchParams.get("league");
  if (!team || !season || !league) {
    return NextResponse.json({ error: "Missing team, season or league" }, { status: 400 });
  }

  const cacheKey = `football:statistics:team:${team}:season:${season}:league:${league}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    const parsed = JSON.parse(cached);
    return NextResponse.json({ response: parsed.response ?? parsed }, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=30" },
    });
  }

  const apiKey = process.env.APIFOOTBALL_KEY || process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  const url = `https://v3.football.api-sports.io/teams/statistics?team=${team}&season=${season}&league=${league}`;
  try {
    const res = await fetch(url, {
      headers: {
        "x-apisports-key": apiKey,
        "accept": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: `API error: ${res.status}`, detail: txt }, { status: 500 });
    }

    const data = await res.json();
    await redis.set(cacheKey, JSON.stringify(data), "EX", CACHE_TTL);
    return NextResponse.json({ response: data.response ?? data }, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=30" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: "Internal error", detail: e?.message || e?.toString() }, { status: 500 });
  }
}