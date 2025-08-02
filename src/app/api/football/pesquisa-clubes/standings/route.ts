import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const CACHE_TTL = 180;

const API_FOOTBALL_KEY = process.env.APIFOOTBALL_KEY || process.env.API_FOOTBALL_KEY || "";
const API_FOOTBALL_URL = "https://v3.football.api-sports.io/standings";

export async function GET(req: NextRequest) {
  const league = req.nextUrl.searchParams.get("league");
  const season = req.nextUrl.searchParams.get("season");
  const team = req.nextUrl.searchParams.get("team");

  if (!season) {
    return NextResponse.json({ error: "Missing required parameter: season" }, { status: 400 });
  }

  let url;
  let cacheKey;
  if (league) {
    url = `${API_FOOTBALL_URL}?league=${league}&season=${season}`;
    cacheKey = `football:standings:league:${league}:season:${season}`;
  } else if (team) {
    // Busca todas as ligas do time na temporada, pega a primeira e busca standings dela
    cacheKey = `football:standings:team:${team}:season:${season}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached), {
        status: 200,
        headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=30" },
      });
    }
    const leaguesUrl = `https://v3.football.api-sports.io/leagues?team=${team}&season=${season}`;
    try {
      const leaguesRes = await fetch(leaguesUrl, {
        headers: {
          "x-apisports-key": API_FOOTBALL_KEY,
          "accept": "application/json",
        },
        cache: "no-store",
      });
      if (!leaguesRes.ok) {
        const txt = await leaguesRes.text();
        return NextResponse.json({ error: `API error (leagues): ${leaguesRes.status}`, detail: txt }, { status: leaguesRes.status });
      }
      const leaguesData = await leaguesRes.json();
      const firstLeague = leaguesData?.response?.[0]?.league?.id;
      if (!firstLeague) {
        return NextResponse.json({ response: [] }, {
          status: 200,
          headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=30" },
        });
      }
      url = `${API_FOOTBALL_URL}?league=${firstLeague}&season=${season}`;
    } catch (e: any) {
      return NextResponse.json({ error: "Internal error fetching league", detail: e?.message || e?.toString() }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: "Missing required parameters: league or team" }, { status: 400 });
  }

  cacheKey = cacheKey || `football:standings:league:${league}:season:${season}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return NextResponse.json(JSON.parse(cached), {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=30" },
    });
  }

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
    const resp = { response: data?.response?.[0]?.league?.standings?.[0] || [] };
    await redis.set(cacheKey, JSON.stringify(resp), "EX", CACHE_TTL);
    return NextResponse.json(resp, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=30" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: "Internal error", detail: e?.message || e?.toString() }, { status: 500 });
  }
}