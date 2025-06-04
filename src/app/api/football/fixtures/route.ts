import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const CACHE_TTL = 120; // 2 minutos

export async function GET(req: NextRequest) {
  // Parâmetros comuns de fixtures: league, season, team, date, etc
  const league = req.nextUrl.searchParams.get("league");
  const season = req.nextUrl.searchParams.get("season");
  const team = req.nextUrl.searchParams.get("team");
  const date = req.nextUrl.searchParams.get("date");

  // Monta uma chave única de cache baseada nos parâmetros usados
  const cacheKey = `football:fixtures:${league || ""}:${season || ""}:${team || ""}:${date || ""}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return NextResponse.json(JSON.parse(cached));
  }

  // Compatível com as duas variáveis, mas padronize APIFOOTBALL_KEY depois
  const apiKey = process.env.APIFOOTBALL_KEY || process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  // Monta a URL de acordo com os parâmetros disponíveis
  const urlBase = "https://v3.football.api-sports.io/fixtures";
  const params = new URLSearchParams();
  if (league) params.append("league", league);
  if (season) params.append("season", season);
  if (team) params.append("team", team);
  if (date) params.append("date", date);
  const url = `${urlBase}?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        "x-apisports-key": apiKey,
        "accept": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: `API error: ${res.status}`, detail: txt }, { status: 500 });
    }

    const data = await res.json();
    await redis.set(cacheKey, JSON.stringify(data), "EX", CACHE_TTL);
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: "Internal error", detail: e?.message || e?.toString() }, { status: 500 });
  }
}