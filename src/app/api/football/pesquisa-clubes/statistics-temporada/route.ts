import { NextRequest, NextResponse } from "next/server";
import { Redis } from "ioredis";

// --- Definição de Tipos ---
// Descreve a estrutura dos dados de cartões por minuto
interface CardMinuteDetail {
  total: number | null;
  percentage: string | null;
}

// Descreve a estrutura de uma formação
interface Lineup {
  formation: string;
  played: number;
}

// Descreve a estrutura principal da resposta de estatísticas da API
interface TeamStatisticsResponse {
  cards?: {
    yellow?: { [minute: string]: CardMinuteDetail };
    red?: { [minute: string]: CardMinuteDetail };
  };
  lineups?: Lineup[];
  fixtures?: {
    played?: { total: number };
    wins?: { total: number };
    draws?: { total: number };
    loses?: { total: number };
  };
  goals?: {
    for?: { total?: { total: number }; average?: { total: string } };
    against?: { total?: { total: number }; average?: { total: string } };
  };
  clean_sheet?: { total: number };
  failed_to_score?: { total: number };
  penalty?: {
    scored?: { total: number };
    missed?: { total: number };
    total: number | null;
  };
}

// --- Validação e Configuração de Variáveis de Ambiente ---
if (!process.env.APIFOOTBALL_KEY || !process.env.REDIS_URL) {
  throw new Error("As variáveis de ambiente APIFOOTBALL_KEY e REDIS_URL devem ser definidas.");
}
const API_FOOTBALL_KEY = process.env.APIFOOTBALL_KEY;
const REDIS_URL = process.env.REDIS_URL;
const REDIS_TTL = 600; // 10 minutos

// --- Padrão de Cache de Conexão com Redis ---
if (!globalThis.__redis__) {
  globalThis.__redis__ = new Redis(REDIS_URL);
}
const redis: Redis = globalThis.__redis__;

export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get("team");
  const season = req.nextUrl.searchParams.get("season");
  const leagueId = req.nextUrl.searchParams.get("league");

  if (!teamId || !season || !leagueId) {
    return NextResponse.json(
      { error: "Parâmetros obrigatórios: team, season e league." },
      { status: 400 }
    );
  }

  const REDIS_KEY = `clubes:statistics-temporada:${teamId}:${season}:${leagueId}`;

  try {
    const cached = await redis.get(REDIS_KEY);
    if (cached) {
      const data = JSON.parse(cached);
      return NextResponse.json({ response: data }, { status: 200 });
    }

    const res = await fetch(
      `https://v3.football.api-sports.io/teams/statistics?team=${teamId}&season=${season}&league=${leagueId}`,
      { headers: { "x-apisports-key": API_FOOTBALL_KEY } }
    );

    if (!res.ok) {
      console.error(`API-Football error: ${res.status}`);
      throw new Error("API-Football request failed");
    }

    const apiData = await res.json();
    const stats: TeamStatisticsResponse | null = apiData.response;

    if (!stats) {
      return NextResponse.json({ error: "Nenhuma estatística encontrada para os parâmetros fornecidos." }, { status: 404 });
    }

    // Cartões (amarelos/vermelhos)
    let amarelos = 0;
    let vermelhos = 0;
    if (stats.cards?.yellow) {
      // Com o tipo definido, 'minute' agora é 'CardMinuteDetail' e o erro é resolvido.
      for (const minute of Object.values(stats.cards.yellow)) {
        amarelos += minute.total ?? 0;
      }
    }
    if (stats.cards?.red) {
      for (const minute of Object.values(stats.cards.red)) {
        vermelhos += minute.total ?? 0;
      }
    }

    // Formações mais usadas
    const formacoesMaisUsadas = (stats.lineups || [])
      .map(f => ({ formation: f.formation, played: f.played }))
      .sort((a, b) => b.played - a.played);

    // Adaptação final dos dados
    const adapted = {
      jogos: stats.fixtures?.played?.total ?? 0,
      vitorias: stats.fixtures?.wins?.total ?? 0,
      empates: stats.fixtures?.draws?.total ?? 0,
      derrotas: stats.fixtures?.loses?.total ?? 0,
      golsPro: stats.goals?.for?.total?.total ?? 0,
      golsContra: stats.goals?.against?.total?.total ?? 0,
      cleanSheets: stats.clean_sheet?.total ?? 0,
      jogosSemMarcar: stats.failed_to_score?.total ?? 0,
      cartoesAmarelos: amarelos,
      cartoesVermelhos: vermelhos,
      penaltisConvertidos: stats.penalty?.scored?.total ?? 0,
      penaltisTotais: stats.penalty?.total ?? 0,
      formacoesMaisUsadas,
    };

    await redis.set(REDIS_KEY, JSON.stringify(adapted), "EX", REDIS_TTL);
    return NextResponse.json({ response: adapted }, { status: 200 });

  } catch (error) {
    console.error("Erro ao buscar estatísticas do clube:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas do clube." },
      { status: 500 }
    );
  }
}
