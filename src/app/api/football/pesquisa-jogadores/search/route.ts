import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";
import pLimit from "p-limit";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const CACHE_TTL = 900; // 15 minutos

const API_FOOTBALL_KEY = process.env.APIFOOTBALL_KEY || "";
const API_FOOTBALL_URL = "https://v3.football.api-sports.io";
const SEASON = "2024";

// Função para buscar todos os IDs de ligas
async function getAllLeagueIds(): Promise<string[]> {
  const cacheKey = `football:leagues:all:${SEASON}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  const res = await fetch(`${API_FOOTBALL_URL}/leagues?season=${SEASON}`, {
    headers: { "x-apisports-key": API_FOOTBALL_KEY, accept: "application/json" },
    cache: "no-store",
  });
  const data = await res.json();
  const ids = data?.response?.map((item: any) => item.league.id.toString()) || [];
  await redis.set(cacheKey, JSON.stringify(ids), "EX", 3600); // cache liga 1h
  return ids;
}

// Função para buscar jogadores por nome e liga com timeout e tratamento de erro
async function fetchPlayersByNameAndLeague(name: string, leagueId: string) {
  let page = 1;
  let allPlayers: any[] = [];
  while (true) {
    const params = new URLSearchParams();
    params.append("search", name);
    params.append("league", leagueId);
    params.append("season", SEASON);
    params.append("page", page.toString());
    const url = `${API_FOOTBALL_URL}/players?${params.toString()}`;

    const cacheKey = `football:pesquisa-jogadores:search:${name}:league:${leagueId}:page:${page}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      const players = JSON.parse(cached);
      if (!players.length) break;
      allPlayers = allPlayers.concat(players);
      if (players.length < 20) break;
      page++;
      continue;
    }

    // Timeout de 10 segundos por requisição
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(url, {
        headers: { "x-apisports-key": API_FOOTBALL_KEY, accept: "application/json" },
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      const players = data?.response ?? [];
      await redis.set(cacheKey, JSON.stringify(players), "EX", CACHE_TTL);
      if (!players.length) break;
      allPlayers = allPlayers.concat(players);
      if (players.length < 20) break; // última página
      page++;
    } catch (err) {
      clearTimeout(timeout);
      break;
    }
  }
  return allPlayers;
}

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("search");
  if (!search) {
    return NextResponse.json({ error: "search param is required" }, { status: 400 });
  }
  let leagueIds: string[] = [];
  try {
    leagueIds = await getAllLeagueIds();
  } catch (err) {
    return NextResponse.json({ error: "Erro ao buscar ligas: " + (err as Error).message }, { status: 500 });
  }

  const cacheKey = `football:pesquisa-jogadores:searchAll:${search}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return NextResponse.json(JSON.parse(cached), {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=90" },
    });
  }

  // Limite de concorrência: só 8 requisições simultâneas
  const limit = pLimit(8);
  let allPlayers: any[] = [];
  try {
    const results = await Promise.all(
      leagueIds.map(lid => limit(() => fetchPlayersByNameAndLeague(search, lid)))
    );
    allPlayers = results.flat();
  } catch (err) {
    return NextResponse.json({ error: "Erro ao buscar jogadores: " + (err as Error).message }, { status: 500 });
  }

  // Remover duplicatas por id de jogador
  const seen = new Set();
  const uniqueResults = allPlayers.filter((item) => {
    if (seen.has(item.player.id)) return false;
    seen.add(item.player.id);
    return true;
  });

  const resp = { response: uniqueResults };
  await redis.set(cacheKey, JSON.stringify(resp), "EX", CACHE_TTL);

  return NextResponse.json(resp, {
    status: 200,
    headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=90" },
  });
}