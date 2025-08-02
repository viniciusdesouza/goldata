import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const CACHE_TTL = 600; // 10 minutos

const API_FOOTBALL_KEY = process.env.APIFOOTBALL_KEY || process.env.API_FOOTBALL_KEY || "";
const API_FOOTBALL_URL = "https://v3.football.api-sports.io/countries";

export async function GET(req: NextRequest) {
  const team = req.nextUrl.searchParams.get("team");
  const name = req.nextUrl.searchParams.get("name");

  let countryName = name;
  let cacheKey;

  // Se o parâmetro 'team' foi passado, buscar o nome do país do clube
  if (team && !name) {
    cacheKey = `football:countries:team:${team}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached), {
        status: 200,
        headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=60" },
      });
    }
    const teamUrl = `https://v3.football.api-sports.io/teams?id=${team}`;
    try {
      const teamRes = await fetch(teamUrl, {
        headers: {
          "x-apisports-key": API_FOOTBALL_KEY,
          "accept": "application/json",
        },
        cache: "no-store",
      });

      if (!teamRes.ok) {
        const txt = await teamRes.text();
        return NextResponse.json({ error: `API error (team): ${teamRes.status}`, detail: txt }, { status: teamRes.status });
      }

      const teamData = await teamRes.json();
      countryName = teamData?.response?.[0]?.team?.country;
      if (!countryName) {
        return NextResponse.json({ error: "Could not determine country from team ID." }, { status: 404 });
      }
    } catch (e: any) {
      return NextResponse.json({ error: "Internal error fetching team", detail: e?.message || e?.toString() }, { status: 500 });
    }
  } else {
    cacheKey = `football:countries:name:${countryName}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached), {
        status: 200,
        headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=60" },
      });
    }
  }

  if (!countryName) {
    return NextResponse.json({ error: "Missing required parameter: name or team" }, { status: 400 });
  }

  const url = `${API_FOOTBALL_URL}?name=${encodeURIComponent(countryName)}`;

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
      return NextResponse.json({ error: `API error (countries): ${res.status}`, detail: txt }, { status: res.status });
    }

    const data = await res.json();
    const resp = { response: data?.response || [] };
    await redis.set(cacheKey, JSON.stringify(resp), "EX", CACHE_TTL);
    return NextResponse.json(resp, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=60" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: "Internal error fetching country", detail: e?.message || e?.toString() }, { status: 500 });
  }
}