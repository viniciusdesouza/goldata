import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const CACHE_TTL = 86400 * 3; // 3 dias

export async function GET(req: NextRequest) {
  const league = req.nextUrl.searchParams.get("league");
  const season = req.nextUrl.searchParams.get("season");
  if (!league || !season) {
    return NextResponse.json({ error: "Liga e temporada são obrigatórias." }, { status: 400 });
  }

  const cacheKey = `football:rounds:${league}:${season}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      // Sempre normalize para { response: [...] }
      const data = JSON.parse(cached);
      const rounds = Array.isArray(data.response) ? data.response : data;
      return NextResponse.json({ response: rounds }, { status: 200 });
    }

    const apiKey = process.env.APIFOOTBALL_KEY || process.env.API_FOOTBALL_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    const url = `https://v3.football.api-sports.io/fixtures/rounds?league=${encodeURIComponent(league)}&season=${encodeURIComponent(season)}`;
    const res = await fetch(url, {
      headers: {
        "x-apisports-key": apiKey,
        "accept": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("Erro na API-Football rounds:", txt);
      return NextResponse.json({ error: `API error: ${res.status}`, detail: txt }, { status: 500 });
    }

    const data = await res.json();
    // Normaliza para sempre ser array
    const rounds = Array.isArray(data.response) ? data.response : [];
    await redis.set(cacheKey, JSON.stringify({ response: rounds }), "EX", CACHE_TTL);

    return NextResponse.json({ response: rounds }, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=259200, stale-while-revalidate=86400",
      },
    });
  } catch (e: any) {
    console.error("Erro interno ao buscar rounds:", e);
    return NextResponse.json({ error: "Internal error", detail: e?.message || e?.toString() }, { status: 500 });
  }
}