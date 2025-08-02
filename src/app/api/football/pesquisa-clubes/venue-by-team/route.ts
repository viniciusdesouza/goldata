import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const CACHE_TTL = 3600; // 1 hora em segundos

const API_FOOTBALL_KEY = process.env.APIFOOTBALL_KEY || process.env.API_FOOTBALL_KEY || "";
const API_FOOTBALL_URL = "https://v3.football.api-sports.io/teams";

export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get("team");
  if (!teamId) {
    return NextResponse.json({ error: "Missing required parameter: team" }, { status: 400 });
  }

  const cacheKey = `football:venue:team:${teamId}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return NextResponse.json(JSON.parse(cached), {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300" },
    });
  }

  const url = `${API_FOOTBALL_URL}?id=${teamId}`;
  try {
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

    const data = await res.json();
    // Padrão: response[0].venue
    const venue = data?.response?.[0]?.venue;
    if (!venue) {
      return NextResponse.json({ error: "Venue not found for team." }, { status: 404 });
    }

    await redis.set(cacheKey, JSON.stringify({ venue }), "EX", CACHE_TTL);
    return NextResponse.json({ venue }, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: "Internal error fetching venue", detail: e?.message || e?.toString() }, { status: 500 });
  }
}