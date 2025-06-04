import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const homeId = searchParams.get("home");
  const awayId = searchParams.get("away");
  const last = searchParams.get("last") || "5";

  if (!homeId || !awayId) {
    return NextResponse.json({ error: "Missing required params (home, away)" }, { status: 400 });
  }

  const apiRes = await fetch(
    `https://v3.football.api-sports.io/fixtures/headtohead?h2h=${homeId}-${awayId}&last=${last}`,
    {
      headers: {
        "x-apisports-key": process.env.APIFOOTBALL_KEY as string,
      },
      next: { revalidate: 60 },
    }
  );
  const data = await apiRes.json();

  return NextResponse.json(data);
}