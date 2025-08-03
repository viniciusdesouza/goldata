// API: /api/football/campeonatos/lista-alguns-campeonatos
// Retorna lista estática dos principais campeonatos, formato: { response: [...] }

import { NextRequest, NextResponse } from "next/server";
import { MAIORES_CAMPEONATOS } from "../maiores";
import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
if (!globalThis.__redis__) {
  globalThis.__redis__ = new Redis(REDIS_URL);
}
const redis: Redis = globalThis.__redis__;

const API_KEY = process.env.APIFOOTBALL_KEY!;
const CACHE_SECONDS = 3600; // 1 hora
const REDIS_KEY = "campeonatos:lista-alguns";

// Busca info do campeonato na API externa
async function fetchLeagueById(id: number) {
  try {
    const resp = await fetch(
      `https://v3.football.api-sports.io/leagues?id=${id}`,
      { headers: { "x-apisports-key": API_KEY } }
    );
    if (!resp.ok) return null;
    const data = await resp.json();
    return data.response?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function GET(_req: NextRequest) {
  try {
    const cached = await redis.get(REDIS_KEY);
    if (cached) {
      return NextResponse.json(JSON.parse(cached), {
        status: 200,
        headers: { "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=600` }
      });
    }

    // Busca todos campeonatos em paralelo
    const campeonatosIds = MAIORES_CAMPEONATOS.map(c => c.league.id);
    const campeonatos = (
      await Promise.all(campeonatosIds.map(fetchLeagueById))
    ).filter(Boolean);

    const response = { response: campeonatos };
    await redis.set(REDIS_KEY, JSON.stringify(response), "EX", CACHE_SECONDS);

    return NextResponse.json(response, {
      status: 200,
      headers: { "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=600` }
    });
  } catch {
    return NextResponse.json({ response: [], error: "Erro ao buscar os campeonatos." }, { status: 500 });
  }
}