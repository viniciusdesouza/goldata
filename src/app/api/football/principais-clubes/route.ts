import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clubes = [
    {
      team: { id: 33, name: "Manchester United", logo: "https://media-3.api-sports.io/football/teams/33.png" }
    },
    {
      team: { id: 50, name: "Manchester City", logo: "https://media-3.api-sports.io/football/teams/50.png" }
    },
    {
      team: { id: 40, name: "Liverpool", logo: "https://media-3.api-sports.io/football/teams/40.png" }
    },
    {
      team: { id: 541, name: "Real Madrid", logo: "https://media-3.api-sports.io/football/teams/541.png" }
    },
    {
      team: { id: 529, name: "Barcelona", logo: "https://media-3.api-sports.io/football/teams/529.png" }
    },
    {
      team: { id: 85, name: "Bayern Munich", logo: "https://media-3.api-sports.io/football/teams/85.png" }
    },
  ];
  return NextResponse.json({ response: clubes });
}