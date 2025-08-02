import { NextResponse } from "next/server";

export async function GET() {
  // Exemplo fixo, troque para retornar partidas favoritas do usuário
  return NextResponse.json({
    response: [
      { id: 10, nome: "Favorita 1", status: "live" },
      { id: 20, nome: "Favorita 2", status: "finished" },
    ],
  });
}