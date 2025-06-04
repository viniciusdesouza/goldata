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
    // Pré-jogo
    const preMatchPromise = fetch(
      `${API_FOOTBALL_BASE}/odds?fixture=${fixtureId}`,
      {
        headers: { "x-apisports-key": API_KEY },
        next: { revalidate: 90 },
      }
    ).then(res => res.ok ? res.json() : null);
    // Ao vivo
    const livePromise = fetch(
      `${API_FOOTBALL_BASE}/odds/live?fixture=${fixtureId}`,
      {
        headers: { "x-apisports-key": API_KEY },
        next: { revalidate: 15 },
      }
    ).then(res => res.ok ? res.json() : null);

    const [preMatchData, liveData] = await Promise.all([preMatchPromise, livePromise]);

    // Padroniza resposta: odds da API vêm em .response[0] ou array vazio
    const preMatch = preMatchData?.response?.[0] || null;
    const live = liveData?.response?.[0] || null;

    return NextResponse.json({ preMatch, live });
  } catch (e) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}