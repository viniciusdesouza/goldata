import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const CACHE_TTL = 120;

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const homeId = searchParams.get("home");
  const awayId = searchParams.get("away");
  const last = searchParams.get("last") || "5";

  if (!homeId || !awayId) {
    return NextResponse.json({ error: "Missing required params (home, away)" }, { status: 400 });
  }

  const cacheKey = `football:statistics:h2h:${homeId}:${awayId}:${last}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return NextResponse.json(JSON.parse(cached), {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=30" },
    });
  }

  const apiKey = process.env.APIFOOTBALL_KEY || process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  const apiRes = await fetch(
    `https://v3.football.api-sports.io/fixtures/headtohead?h2h=${homeId}-${awayId}&last=${last}`,
    {
      headers: {
        "x-apisports-key": apiKey,
        "accept": "application/json",
      },
      cache: "no-store",
    }
  );
  const data = await apiRes.json();

  await redis.set(cacheKey, JSON.stringify(data), "EX", CACHE_TTL);
  return NextResponse.json(data, {
    status: 200,
    headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=30" },
  });
}