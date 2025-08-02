import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://v3.football.api-sports.io/players";
const API_KEY = process.env.APIFOOTBALL_KEY; // Corrija para o nome da sua variável de ambiente!

export async function GET(req: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ response: [], error: "API Key ausente" }, { status: 500 });
    }

    // Busque uma página aleatória de jogadores
    const randomPage = Math.floor(Math.random() * 50) + 1; // Ajuste conforme o total de páginas disponíveis na API
    const url = `${API_URL}?page=${randomPage}&limit=10`;

    const res = await fetch(url, {
      headers: {
        "x-apisports-key": API_KEY,
      },
      next: { revalidate: 60 * 60 * 24 * 7 }, // cache 7 dias
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { response: [], error: `API error: ${res.status} - ${text}` },
        { status: 500 }
      );
    }

    const data = await res.json();

    if (!data.response || !Array.isArray(data.response)) {
      return NextResponse.json(
        { response: [], error: "Dados inesperados da API-FOOTBALL" },
        { status: 500 }
      );
    }

    // Apenas nome, nacionalidade e foto
    const jogadores = data.response.map((item: any) => ({
      player: {
        id: item.player.id,
        name: item.player.name,
        nationality: item.player.nationality,
        photo: item.player.photo,
      }
    }));

    return NextResponse.json({ response: jogadores });
  } catch (err: any) {
    return NextResponse.json(
      { response: [], error: err?.message || "Erro interno" },
      { status: 500 }
    );
  }
}