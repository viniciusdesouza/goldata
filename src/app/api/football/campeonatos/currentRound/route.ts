import { NextRequest } from "next/server";

// Busca a rodada atual usando API-Football
async function getCurrentRoundFromAPI(league: string | number, season: string | number) {
  const res = await fetch(
    `https://v3.football.api-sports.io/fixtures/rounds?league=${league}&season=${season}&current=true`,
    {
      headers: {
        "x-apisports-key": process.env.APIFOOTBALL_KEY!,
      },
      next: { revalidate: 1800 }, // cache 30min
    }
  );
  const data = await res.json();
  // API retorna array, geralmente só um elemento quando current=true
  return data.response?.[0] || null;
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const league = searchParams.get("league");
  const season = searchParams.get("season");

  if (!league || !season) {
    return new Response(
      JSON.stringify({ error: "Missing league or season parameters" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const currentRound = await getCurrentRoundFromAPI(league, season);
    return new Response(
      JSON.stringify({ response: currentRound }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch current round" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}