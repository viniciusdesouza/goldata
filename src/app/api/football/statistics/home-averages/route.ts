import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const teamId = searchParams.get("team");
  const season = searchParams.get("season");
  const league = searchParams.get("league");

  if (!teamId || !season || !league) {
    return NextResponse.json({ error: "Missing required params (team, season, league)" }, { status: 400 });
  }

  const apiRes = await fetch(
    `https://v3.football.api-sports.io/teams/statistics?team=${teamId}&season=${season}&league=${league}`,
    {
      headers: {
        "x-apisports-key": process.env.APIFOOTBALL_KEY as string,
      },
    }
  );
  const data = await apiRes.json();

  // Corrigido para acessar os campos certos
  const r = data.response;
  const averages = {
    matches: r?.fixtures?.played?.home ?? "-",
    goals_for_per_game: r?.goals?.for?.average?.home ?? "-",
    goals_against_per_game: r?.goals?.against?.average?.home ?? "-",
    wins: r?.fixtures?.wins?.home ?? "-",
    draws: r?.fixtures?.draws?.home ?? "-",
    loses: r?.fixtures?.loses?.home ?? "-",
    clean_sheets: r?.clean_sheet?.home ?? "-",
    failed_to_score: r?.failed_to_score?.home ?? "-",
  };

  return NextResponse.json({ averages, raw: r });
}