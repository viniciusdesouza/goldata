import { NextRequest, NextResponse } from "next/server";
import { MAIORES_CAMPEONATOS } from "../maiores"; // CORREÇÃO: Importando a variável correta
import { Redis } from "ioredis";

// Validação e Configuração de Variáveis de Ambiente
if (!process.env.APIFOOTBALL_KEY || !process.env.REDIS_URL) {
  throw new Error("As variáveis de ambiente APIFOOTBALL_KEY e REDIS_URL devem ser definidas.");
}
const API_KEY = process.env.APIFOOTBALL_KEY;
const REDIS_URL = process.env.REDIS_URL;

// 1 hora em segundos
const CACHE_SECONDS = 3600;
const REDIS_KEY = "campeonatos:lista-alguns";

// Padrão de Cache de Conexão com Redis
if (!globalThis.__redis__) {
  globalThis.__redis__ = new Redis(REDIS_URL);
}
const redis: Redis = globalThis.__redis__;

async function fetchLeagueById(id: number) {
  try {
    const resp = await fetch(
      `https://v3.football.api-sports.io/leagues?id=${id}`,
      { headers: { "x-apisports-key": API_KEY } }
    );
    if (!resp.ok) return null;
    const data = await resp.json();
    return data.response?.[0] ?? null;
  } catch (error) {
    console.error(`Falha ao buscar league ID: ${id}`, error);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    // 1. Tenta ler do cache Redis
    const cached = await redis.get(REDIS_KEY);
    if (cached) {
      return NextResponse.json(JSON.parse(cached), {
        status: 200,
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=600`,
          "X-Cache": "HIT"
        }
      });
    }

    // CORREÇÃO: Extrai os IDs da lista de objetos importada
    const campeonatosIds = MAIORES_CAMPEONATOS.map(c => c.league.id);

    // 2. Busca todos os campeonatos em paralelo
    const campeonatos = (
      await Promise.all(campeonatosIds.map(fetchLeagueById))
    ).filter(Boolean); // 'filter(Boolean)' remove quaisquer resultados nulos da busca

    const response = { response: campeonatos };

    // 3. Salva no Redis
    await redis.set(REDIS_KEY, JSON.stringify(response), "EX", CACHE_SECONDS);

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=600`,
        "X-Cache": "MISS"
      }
    });
  } catch (error) {
    console.error("Erro na rota /lista-alguns-campeonatos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar os campeonatos dinâmicos." },
      { status: 500 }
    );
  }
}
