import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const CACHE_TTL = 180;

const API_FOOTBALL_KEY = process.env.APIFOOTBALL_KEY || process.env.API_FOOTBALL_KEY || "";
const API_FOOTBALL_URL = "https://v3.football.api-sports.io/teams/statistics";

export async function GET(req: NextRequest) {
  const team = req.nextUrl.searchParams.get("team");
  const season = req.nextUrl.searchParams.get("season");
  const league = req.nextUrl.searchParams.get("league"); // <-- ADICIONE ISSO

  if (!team || !season || !league) {
    return NextResponse.json({ error: "Missing required parameters: team, season and league" }, { status: 400 });
  }

  const cacheKey = `football:statistics:team:${team}:season:${season}:league:${league}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return NextResponse.json(JSON.parse(cached), {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=30" },
    });
  }

  // Inclua o parâmetro league na URL
  const url = `${API_FOOTBALL_URL}?team=${team}&season=${season}&league=${league}`;

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
    const resp = { response: data?.response || null };
    await redis.set(cacheKey, JSON.stringify(resp), "EX", CACHE_TTL);
    return NextResponse.json(resp, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=30" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: "Internal error", detail: e?.message || e?.toString() }, { status: 500 });
  }
}