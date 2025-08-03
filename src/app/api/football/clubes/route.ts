// API: /api/football/clubes?league=ID
// Retorna clubes de uma liga, formato: { response: [{team: {id, name, logo, country}}, ...] }

import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

// Padronização Redis global para evitar múltiplas conexões
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
if (!globalThis.__redis__) {
  globalThis.__redis__ = new Redis(REDIS_URL);
}
const redis: Redis = globalThis.__redis__;

const CACHE_TTL = 60 * 60 * 24 * 3; // 3 dias
const API_KEY = process.env.APIFOOTBALL_KEY;
const API_BASE = "https://v3.football.api-sports.io";

export async function GET(req: NextRequest) {
  try {
    const league = req.nextUrl.searchParams.get("league");
    if (!league) {
      return NextResponse.json({ response: [], error: "Liga não informada." }, { status: 400 });
    }

    // Temporada dinâmica sempre atual
    const season = new Date().getFullYear();
    const cacheKey = `football:clubes:${league}:${season}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      const data = JSON.parse(cached);
      // Garante formato { response: [...] }
      return NextResponse.json(
        { response: Array.isArray(data.response) ? data.response : [] },
        { status: 200 }
      );
    }

    const url = `${API_BASE}/teams?league=${encodeURIComponent(league)}&season=${season}`;
    const res = await fetch(url, {
      headers: { "x-apisports-key": API_KEY!, "accept": "application/json" },
    });
    const data = await res.json();

    if (data?.errors?.rateLimit) {
      return NextResponse.json(
        { response: [], error: "Você excedeu o limite de requisições à API-Football. Tente novamente em 1 minuto." },
        { status: 429 }
      );
    }

    // Garante formato
    const resp = { response: Array.isArray(data.response) ? data.response : [] };
    await redis.set(cacheKey, JSON.stringify(resp), "EX", CACHE_TTL);

    return NextResponse.json(resp, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=259200, stale-while-revalidate=86400" },
    });
  } catch (err) {
    return NextResponse.json({ response: [], error: "Erro interno do servidor." }, { status: 500 });
  }
}