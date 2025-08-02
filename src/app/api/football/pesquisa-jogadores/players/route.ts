import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const CACHE_TTL = 86400 * 3; // 3 dias

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const club = searchParams.get("club");
  const season = searchParams.get("season");

  if (!club || !season) {
    return NextResponse.json({ response: [] }, { status: 200 });
  }

  // GARANTE que o cache é por clube+temporada!
  const cacheKey = `football:players:club:${club}:season:${season}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return NextResponse.json(JSON.parse(cached), { status: 200 });
  }

  let allPlayers: any[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const url = `https://v3.football.api-sports.io/players?team=${encodeURIComponent(
      club
    )}&season=${encodeURIComponent(season)}&page=${page}`;
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

    if (data?.response) {
      allPlayers = allPlayers.concat(data.response);
    }

    if (page === 1 && data?.paging?.total) {
      totalPages = data.paging.total;
    }

    page++;
  } while (page <= totalPages);

  const result = {
    response: allPlayers,
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);

  return NextResponse.json(result, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=259200, stale-while-revalidate=86400",
    },
  });
}