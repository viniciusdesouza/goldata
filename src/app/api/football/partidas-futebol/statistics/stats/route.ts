import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const CACHE_TTL = 60; // Estatísticas por partida podem mudar rápido

const API_FOOTBALL_BASE = "https://v3.football.api-sports.io";
const API_KEY = process.env.APIFOOTBALL_KEY || process.env.API_FOOTBALL_KEY;

export async function GET(req: NextRequest) {
  const fixtureId = req.nextUrl.searchParams.get("fixture");
  if (!fixtureId) {
    return NextResponse.json({ error: "Missing fixture id" }, { status: 400 });
  }
  if (!API_KEY) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  const cacheKey = `football:statistics:stats:${fixtureId}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return NextResponse.json(JSON.parse(cached), {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=15" },
    });
  }

  try {
    const res = await fetch(
      `${API_FOOTBALL_BASE}/fixtures/statistics?fixture=${fixtureId}`,
      {
        headers: { "x-apisports-key": API_KEY, "accept": "application/json" },
        cache: "no-store",
      }
    );
    if (!res.ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const data = await res.json();
    let resp;
    if (!Array.isArray(data.response) || data.response.length < 2) {
      resp = { home: [], away: [] };
    } else {
      resp = {
        home: data.response[0].statistics,
        away: data.response[1].statistics,
      };
    }
    await redis.set(cacheKey, JSON.stringify(resp), "EX", CACHE_TTL);
    return NextResponse.json(resp, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=15" },
    });
  } catch (e) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}