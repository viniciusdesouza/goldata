import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const league = searchParams.get("league");
  if (!league) return NextResponse.json({ error: "Missing league id" }, { status: 400 });

  const redisKey = `league-info:${league}`;
  let data = await redis.get(redisKey);

  if (data) {
    return NextResponse.json({ response: JSON.parse(data), cached: true });
  }

  const apiRes = await fetch(`https://api-football-v1.p.rapidapi.com/v3/leagues?id=${league}`, {
    headers: { "x-rapidapi-key": process.env.APIFOOTBALL_KEY! }
  });
  const apiData = await apiRes.json();

  // Se não encontrou a liga, retorne 404
  if (!apiData.response || apiData.response.length === 0) {
    return NextResponse.json({ error: "League not found" }, { status: 404 });
  }

  await redis.set(redisKey, JSON.stringify(apiData.response), "EX", 60 * 60 * 24);

  return NextResponse.json({ response: apiData.response, cached: false });
}