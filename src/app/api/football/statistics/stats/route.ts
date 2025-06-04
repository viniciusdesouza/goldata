import { NextRequest, NextResponse } from "next/server";

const API_FOOTBALL_BASE = "https://v3.football.api-sports.io";
const API_KEY = process.env.APIFOOTBALL_KEY || process.env.API_FOOTBALL_KEY;

export async function GET(req: NextRequest) {
  const fixtureId = req.nextUrl.searchParams.get("fixture");
  if (!fixtureId) {
    return NextResponse.json({ error: "Missing fixture id" }, { status: 400 });
  }
  if (!API_KEY) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }
  try {
    const res = await fetch(
      `${API_FOOTBALL_BASE}/fixtures/statistics?fixture=${fixtureId}`,
      {
        headers: { "x-apisports-key": API_KEY },
        next: { revalidate: 60 }, // 1 min cache
      }
    );
    if (!res.ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const data = await res.json();
    // Esperado: data.response = [ { team: {...}, statistics: [...] }, { team: {...}, statistics: [...] } ]
    if (!Array.isArray(data.response) || data.response.length < 2) {
      return NextResponse.json({ home: [], away: [] });
    }
    // sempre home e away, na ordem da API
    return NextResponse.json({
      home: data.response[0].statistics,
      away: data.response[1].statistics,
    });
  } catch (e) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}