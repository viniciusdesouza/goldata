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
      next: { revalidate: 60 }, // opcional: revalida a cada 1 min para evitar rate-limit
    }
  );
  const data = await apiRes.json();

  return NextResponse.json(data);
}