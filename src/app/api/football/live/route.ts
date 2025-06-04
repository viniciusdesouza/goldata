import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const CACHE_TTL = 60; // 1 minuto

export async function GET(_req: NextRequest) {
  const cacheKey = "football:live";
  const cached = await redis.get(cacheKey);
  if (cached) {
    const parsed = JSON.parse(cached);
    return NextResponse.json({ response: parsed.response ?? [] });
  }

  const apiKey = process.env.APIFOOTBALL_KEY; // <--- Padronize aqui
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  const url = `https://v3.football.api-sports.io/fixtures?live=all`;
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
    return NextResponse.json({ response: data.response ?? [] });
  } catch (e: any) {
    return NextResponse.json({ error: "Internal error", detail: e?.message || e?.toString() }, { status: 500 });
  }
}