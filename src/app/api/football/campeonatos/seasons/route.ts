import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");
const REDIS_KEY = "campeonatos:seasons";
const REDIS_TTL = 600; // 10 min

export async function GET(req: NextRequest) {
  try {
    const cached = await redis.get(REDIS_KEY);
    if (cached) {
      const data = JSON.parse(cached);
      return NextResponse.json({ response: data }, { status: 200 });
    }

    const apiKey = process.env.APIFOOTBALL_KEY || process.env.API_FOOTBALL_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    const res = await fetch("https://v3.football.api-sports.io/leagues/seasons", {
      headers: {
        "x-apisports-key": apiKey,
        "accept": "application/json",
      },
    });
    if (!res.ok) {
      const txt = await res.text();
      console.error("Erro na API-Football seasons:", txt);
      throw new Error("API-Football error");
    }
    const data = await res.json();
    const currentYear = new Date().getFullYear();
    // Garante que é array e filtra anos futuros
    const temporadas = Array.isArray(data.response)
      ? data.response.filter((y: number) => y <= currentYear)
      : [];

    await redis.set(REDIS_KEY, JSON.stringify(temporadas), "EX", REDIS_TTL);
    return NextResponse.json({ response: temporadas }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar temporadas:", error);
    return NextResponse.json({ error: "Erro ao buscar temporadas." }, { status: 500 });
  }
}