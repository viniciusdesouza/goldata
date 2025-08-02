import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const CACHE_TTL = 86400 * 3; // 3 dias

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country");
  const season = 2024;

  if (!country) {
    return NextResponse.json({ error: "País não informado." }, { status: 400 });
  }

  const cacheKey = `football:leagues:${country}:${season}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return NextResponse.json(JSON.parse(cached), { status: 200 });
  }

  const url = `https://v3.football.api-sports.io/leagues?country=${encodeURIComponent(country)}&season=${season}`;
  const res = await fetch(url, {
    headers: {
      "x-apisports-key": process.env.APIFOOTBALL_KEY as string,
      "accept": "application/json",
    },
  });

  const data = await res.json();

  if (data?.errors?.rateLimit) {
    return NextResponse.json(
      { error: "Você excedeu o limite de requisições à API-Football. Tente novamente em 1 minuto." },
      { status: 429 }
    );
  }

  await redis.set(cacheKey, JSON.stringify(data), "EX", CACHE_TTL);

  return NextResponse.json(data, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=259200, stale-while-revalidate=86400",
    },
  });
}