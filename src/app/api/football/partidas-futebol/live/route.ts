import { NextRequest, NextResponse } from "next/server";
import { fetchWithCache } from "../_utils";

export async function GET(_req: NextRequest) {
  const apiKey = process.env.APIFOOTBALL_KEY || process.env.API_FOOTBALL_KEY;
  if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 500 });

  const cacheKey = "football:live";
  const url = "https://v3.football.api-sports.io/fixtures?live=all";

  try {
    const data = await fetchWithCache({
      cacheKey,
      url,
      headers: {
        "x-apisports-key": apiKey,
        "accept": "application/json",
      },
      ttl: 60,
    });
    return NextResponse.json({ response: data.response ?? [] }, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=15",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: "Internal error", detail: e?.message || e?.toString() }, { status: 500 });
  }
}