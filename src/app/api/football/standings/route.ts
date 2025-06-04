import { NextRequest, NextResponse } from "next/server";

const API_FOOTBALL_BASE = "https://v3.football.api-sports.io";
const API_KEY = process.env.APIFOOTBALL_KEY || process.env.API_FOOTBALL_KEY;

export async function GET(req: NextRequest) {
  const league = req.nextUrl.searchParams.get("league");
  const season = req.nextUrl.searchParams.get("season");
  if (!league || !season) {
    return NextResponse.json({ error: "Missing league or season" }, { status: 400 });
  }
  if (!API_KEY) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }
  try {
    const res = await fetch(
      `${API_FOOTBALL_BASE}/standings?league=${league}&season=${season}`,
      {
        headers: { "x-apisports-key": API_KEY },
        next: { revalidate: 600 }, // 10 minutos de cache
      }
    );
    if (!res.ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const data = await res.json();
    // Estrutura esperada: data.response[0].league.standings[0] é um array de TeamStanding
    const standings = data?.response?.[0]?.league?.standings?.[0] || [];
    return NextResponse.json({ standings });
  } catch (e) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}