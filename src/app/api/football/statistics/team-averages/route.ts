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
    matches: r?.fixtures?.played?.total ?? "-",
    goals_for_per_game: r?.goals?.for?.average?.total ?? "-",
    goals_against_per_game: r?.goals?.against?.average?.total ?? "-",
    wins: r?.fixtures?.wins?.total ?? "-",
    draws: r?.fixtures?.draws?.total ?? "-",
    loses: r?.fixtures?.loses?.total ?? "-",
    clean_sheets: r?.clean_sheet?.total ?? "-",
    failed_to_score: r?.failed_to_score?.total ?? "-",
  };

  return NextResponse.json({ averages, raw: r });
}