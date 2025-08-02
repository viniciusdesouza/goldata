import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const CACHE_TTL = 300; // 5 minutos

const API_FOOTBALL_KEY = process.env.APIFOOTBALL_KEY || process.env.API_FOOTBALL_KEY || "";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("search");

  if (!search) {
    return NextResponse.json({ error: "Missing required parameter: search" }, { status: 400 });
  }

  const cacheKey = `football:clubes-search:${search}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return NextResponse.json(JSON.parse(cached), {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
    });
  }

  const res = await fetch(
    `https://v3.football.api-sports.io/teams?search=${encodeURIComponent(search)}`,
    {
      headers: {
        "x-apisports-key": API_FOOTBALL_KEY,
        "accept": "application/json",
      },
      cache: "no-store",
    }
  );
  const data = await res.json();

  await redis.set(cacheKey, JSON.stringify(data), "EX", CACHE_TTL);

  return NextResponse.json(data, {
    status: 200,
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
  });
}