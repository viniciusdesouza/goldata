import { NextRequest, NextResponse } from "next/server";
import { Redis } from "ioredis";

// --- Definição de Tipos para a Resposta da API ---
// Isso resolve o erro "implicitly has an 'any' type"
interface Partida {
  fixture: {
    id: number;
    date: string;
    // Adicione outros campos do fixture se precisar usá-los
  };
  league: {
    round: string;
    // Adicione outros campos da league se precisar usá-los
  };
  // Adicione outros campos da partida se precisar usá-los
}

interface ApiResponse {
  response: Partida[];
}

// --- Validação e Configuração de Variáveis de Ambiente ---
if (!process.env.APIFOOTBALL_KEY || !process.env.REDIS_URL) {
  throw new Error("As variáveis de ambiente APIFOOTBALL_KEY e REDIS_URL devem ser definidas.");
}
const API_FOOTBALL_KEY = process.env.APIFOOTBALL_KEY;
const REDIS_URL = process.env.REDIS_URL;
const API_FOOTBALL_URL = "https://v3.football.api-sports.io/fixtures";
const CACHE_TTL = 120; // 2 minutos

// --- Padrão de Cache de Conexão com Redis ---
if (!globalThis.__redis__) {
  globalThis.__redis__ = new Redis(REDIS_URL);
}
const redis: Redis = globalThis.__redis__;

export async function GET(req: NextRequest) {
  const league = req.nextUrl.searchParams.get("league");
  const season = req.nextUrl.searchParams.get("season");

  if (!league || !season) {
    return NextResponse.json({ error: "Missing league or season" }, { status: 400 });
  }

  const cacheKey = `rodadas-atual-proxima:${league}:${season}`;
  let allData: ApiResponse; // Aplicando o tipo aqui
  const cached = await redis.get(cacheKey);

  if (cached) {
    allData = JSON.parse(cached) as ApiResponse; // Convertendo o JSON para o nosso tipo
  } else {
    const params = new URLSearchParams({ league, season });
    const url = `${API_FOOTBALL_URL}?${params.toString()}`;
    const res = await fetch(url, {
      headers: {
        "x-apisports-key": API_FOOTBALL_KEY,
        "accept": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: `API error: ${res.status}`, detail: txt }, { status: res.status });
    }

    const data = (await res.json()) as ApiResponse; // Convertendo a resposta da API para o nosso tipo
    allData = { response: data?.response || [] };
    await redis.set(cacheKey, JSON.stringify(allData), "EX", CACHE_TTL);
  }

  // Agora o TypeScript sabe que 'a' e 'b' são do tipo 'Partida'
  const jogos = (allData.response || []).sort(
    (a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime()
  );

  // Agrupa por rodada
  const rodadas: { [round: string]: Partida[] } = {}; // Tipagem mais específica
  for (const partida of jogos) {
    const round = partida.league.round || "Desconhecida";
    if (!rodadas[round]) rodadas[round] = [];
    rodadas[round].push(partida);
  }

  // Ordena as rodadas por data da primeira partida de cada
  const rodadaKeys = Object.keys(rodadas).sort((a, b) => {
    const dateA = new Date(rodadas[a][0]?.fixture.date || 0).getTime();
    const dateB = new Date(rodadas[b][0]?.fixture.date || 0).getTime();
    return dateA - dateB;
  });

  // Encontra a rodada atual e a próxima
  const now = new Date();
  let ultimaRodadaKey = rodadaKeys[0] || "N/A";
  let proximaRodadaKey = rodadaKeys[0] || "N/A";
  let proximaRodadaEncontrada = false;

  for (const key of rodadaKeys) {
    const jogosRodada = rodadas[key];
    const algumaNoPassadoOuAgora = jogosRodada.some(j => new Date(j.fixture.date) <= now);
    const todasNoFuturo = jogosRodada.every(j => new Date(j.fixture.date) > now);

    if (algumaNoPassadoOuAgora) {
      ultimaRodadaKey = key;
    }
    
    if (todasNoFuturo && !proximaRodadaEncontrada) {
      proximaRodadaKey = key;
      proximaRodadaEncontrada = true;
    }
  }
  
  // Se todas as rodadas já passaram, a "próxima" pode ser a última encontrada
  if (!proximaRodadaEncontrada) {
    proximaRodadaKey = ultimaRodadaKey;
  }

  const ultimaRodada = {
    round: ultimaRodadaKey,
    matches: rodadas[ultimaRodadaKey] || [],
  };
  const proximaRodada = {
    round: proximaRodadaKey,
    matches: rodadas[proximaRodadaKey] || [],
  };

  return NextResponse.json({ ultimaRodada, proximaRodada }, {
    status: 200,
    headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=30" },
  });
}