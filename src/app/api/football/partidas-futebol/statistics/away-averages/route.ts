import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const CACHE_TTL = 120;

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const teamId = searchParams.get("team");
  const season = searchParams.get("season");
  const league = searchParams.get("league");

  if (!teamId || !season || !league) {
    return NextResponse.json({ error: "Missing required params (team, season, league)" }, { status: 400 });
  }

  const cacheKey = `football:statistics:away-averages:${teamId}:${season}:${league}`;
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
    `https://v3.football.api-sports.io/teams/statistics?team=${teamId}&season=${season}&league=${league}`,
    {
      headers: {
        "x-apisports-key": apiKey,
        "accept": "application/json",
      },
      cache: "no-store",
    }
  );
  const data = await apiRes.json();

  const r = data.response;
  const averages = {
    matches: r?.fixtures?.played?.away ?? "-",
    goals_for_per_game: r?.goals?.for?.average?.away ?? "-",
    goals_against_per_game: r?.goals?.against?.average?.away ?? "-",
    wins: r?.fixtures?.wins?.away ?? "-",
    draws: r?.fixtures?.draws?.away ?? "-",
    loses: r?.fixtures?.loses?.away ?? "-",
    clean_sheets: r?.clean_sheet?.away ?? "-",
    failed_to_score: r?.failed_to_score?.away ?? "-",
  };

  const resp = { averages, raw: r };

  await redis.set(cacheKey, JSON.stringify(resp), "EX", CACHE_TTL);
  return NextResponse.json(resp, {
    status: 200,
    headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=30" },
  });
}