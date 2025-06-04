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

  // Adicione este log para depurar!
  console.log("API-FOOTBALL RAW DATA:", JSON.stringify(data, null, 2));

  const r = data.response;

  if (!r || typeof r !== "object") {
    return NextResponse.json({
      averages: {
        matches: "-",
        goals_for_per_game: "-",
        goals_against_per_game: "-",
        wins: "-",
        draws: "-",
        loses: "-",
        clean_sheets: "-",
        failed_to_score: "-"
      },
      raw: r ?? {}
    });
  }

  const averages = {
    matches: r?.fixtures?.played?.away ?? "-",
    goals_for_per_game: r?.goals?.for?.average?.away ?? "-",
    goals_against_per_game: r?.goals?.against?.average?.away ?? "-",
    wins: r?.fixtures?.wins?.away ?? "-",
    draws: r?.fixtures?.draws?.away ?? "-",
    loses: r?.fixtures?.loses?.away ?? "-",
    clean_sheets: r?.clean_sheet?.away ?? "-",
    failed_to_score: r?.failed_to_score?.away ?? "-",
  };

  return NextResponse.json({ averages, raw: r });
}