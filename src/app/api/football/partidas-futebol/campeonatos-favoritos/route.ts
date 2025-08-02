import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    response: [
      { id: 1, nome: "Partida 1", status: "live" },
      { id: 2, nome: "Partida 2", status: "finished" },
    ],
  });
}