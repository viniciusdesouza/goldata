import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const CACHE_TTL = 600;

const API_FOOTBALL_KEY = process.env.APIFOOTBALL_KEY || process.env.API_FOOTBALL_KEY || "";
const API_FOOTBALL_URL = "https://v3.football.api-sports.io/teams";

export async function GET(req: NextRequest) {
  let ids = req.nextUrl.searchParams.getAll("id");
  const search = req.nextUrl.searchParams.get("search");
  const country = req.nextUrl.searchParams.get("country");
  const league = req.nextUrl.searchParams.get("league");
  const season = req.nextUrl.searchParams.get("season");

  if (
    (!ids || ids.length === 0) &&
    !search &&
    !(country && season) &&
    !(league && season)
  ) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  let url = `${API_FOOTBALL_URL}?`;
  if (ids && ids.length > 0) {
    ids.forEach(id => { url += `id=${id}&`; });
  }
  if (search) url += `search=${encodeURIComponent(search)}&`;
  if (country) url += `country=${encodeURIComponent(country)}&`;
  if (league) url += `league=${encodeURIComponent(league)}&`;
  if (season) url += `season=${encodeURIComponent(season)}&`;

  const cacheKey = `football:teams:${url.split("?")[1]}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return NextResponse.json(JSON.parse(cached), {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=60" },
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
    const resp = { response: data?.response || [] };
    await redis.set(cacheKey, JSON.stringify(resp), "EX", CACHE_TTL);
    return NextResponse.json(resp, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=60" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: "Internal error", detail: e?.message || e?.toString() }, { status: 500 });
  }
}