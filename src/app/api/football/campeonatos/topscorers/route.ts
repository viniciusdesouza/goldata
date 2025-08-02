import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const CACHE_TTL = 180; // 3 minutos

export async function GET(req: NextRequest) {
  const leagueId = req.nextUrl.searchParams.get("league");
  const season = req.nextUrl.searchParams.get("season");
  if (!leagueId || !season) {
    return NextResponse.json(
      { response: [], error: "League ID and season are required" },
      { status: 400 }
    );
  }

  const cacheKey = `football:topscorers:${leagueId}:${season}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return NextResponse.json(JSON.parse(cached), {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=180, stale-while-revalidate=30",
      },
    });
  }

  const url = `https://v3.football.api-sports.io/players/topscorers?league=${leagueId}&season=${season}`;
  const headers = {
    "x-apisports-key": process.env.APIFOOTBALL_KEY as string,
    accept: "application/json",
  };

  try {
    const res = await fetch(url, { headers });
    const raw = await res.text();
    if (!res.ok) {
      return NextResponse.json(
        { response: [], error: `API request failed (${res.status}): ${raw}` },
        { status: res.status }
      );
    }
    const data = JSON.parse(raw);
    await redis.set(cacheKey, JSON.stringify(data), "EX", CACHE_TTL);
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=180, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { response: [], error: String(error) },
      { status: 500 }
    );
  }
}