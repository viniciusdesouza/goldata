import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");
const REDIS_TTL = 600; // 10 min

export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get("team");
  if (!teamId) {
    return NextResponse.json({ response: [] }, { status: 400 });
  }

  const REDIS_KEY = `clubes:seasons:${teamId}`;

  try {
    const cached = await redis.get(REDIS_KEY);
    if (cached) {
      const data = JSON.parse(cached);
      return NextResponse.json({ response: data }, { status: 200 });
    }

    // Consulta na API-Football: temporadas disponíveis para o clube (time)
    const res = await fetch(
      `https://v3.football.api-sports.io/teams/seasons?team=${teamId}`,
      {
        headers: {
          "x-apisports-key": process.env.APIFOOTBALL_KEY!,
        },
      }
    );
    if (!res.ok) throw new Error("API-Football error");
    const data = await res.json(); // geralmente { response: [2025, 2024, ...] }

    // Se quiser, pode filtrar para não mostrar anos futuros ao atual:
    const currentYear = new Date().getFullYear();
    const temporadas = (data.response || []).filter((y: number) => y <= currentYear);

    await redis.set(REDIS_KEY, JSON.stringify(temporadas), "EX", REDIS_TTL);
    return NextResponse.json({ response: temporadas }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar temporadas do clube:", error);
    return NextResponse.json({ error: "Erro ao buscar temporadas." }, { status: 500 });
  }
}