import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const CACHE_TTL = 180; // 3 minutos

const API_FOOTBALL_KEY = process.env.APIFOOTBALL_KEY || process.env.API_FOOTBALL_KEY || "";
const API_FOOTBALL_URL = "https://v3.football.api-sports.io/leagues";

export async function GET(req: NextRequest) {
  const team = req.nextUrl.searchParams.get("team");
  const season = req.nextUrl.searchParams.get("season");

  if (!team || !season) {
    return NextResponse.json({ error: "Missing required parameters: team and season" }, { status: 400 });
  }

  const cacheKey = `football:competitions:team:${team}:season:${season}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return NextResponse.json(JSON.parse(cached), {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=30" },
    });
  }

  const url = `${API_FOOTBALL_URL}?team=${team}&season=${season}`;

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
    const response =
      data?.response?.map((ligaObj: any) => ({
        id: ligaObj.league.id,
        nome: ligaObj.league.name,
        logo: ligaObj.league.logo,
        tipo: ligaObj.league.type,
        pais: ligaObj.country.name,
        temporada: ligaObj.seasons?.find((s: any) => s.year == season),
      })) || [];

    const resp = { response };
    await redis.set(cacheKey, JSON.stringify(resp), "EX", CACHE_TTL);

    return NextResponse.json(resp, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=30" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: "Internal error", detail: e?.message || e?.toString() }, { status: 500 });
  }
}