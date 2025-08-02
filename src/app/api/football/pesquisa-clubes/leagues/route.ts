import { NextRequest, NextResponse } from "next/server";

// Lista fixa das principais ligas e países, pode ser expandida conforme necessidade
const leagues = [
  {
    league: { id: 39, name: "Premier League" },
    country: { name: "England" }
  },
  {
    league: { id: 140, name: "La Liga" },
    country: { name: "Spain" }
  },
  {
    league: { id: 78, name: "Bundesliga" },
    country: { name: "Germany" }
  },
  {
    league: { id: 135, name: "Serie A" },
    country: { name: "Italy" }
  },
  {
    league: { id: 61, name: "Ligue 1" },
    country: { name: "France" }
  },
  {
    league: { id: 2, name: "UEFA Champions League" },
    country: { name: "Europe" }
  },
  {
    league: { id: 71, name: "Brasileirão" },
    country: { name: "Brazil" }
  },
  {
    league: { id: 94, name: "Argentine Primera División" },
    country: { name: "Argentina" }
  },
  {
    league: { id: 253, name: "MLS" },
    country: { name: "USA" }
  },
  {
    league: { id: 501, name: "Saudi Pro League" },
    country: { name: "Saudi Arabia" }
  }
];

export async function GET(req: NextRequest) {
  return NextResponse.json({ response: leagues }, {
    status: 200,
    headers: { "Cache-Control": "public, s-maxage=36000" }, // 10h cache
  });
}