import { NextRequest, NextResponse } from "next/server";
// Importando a variável correta que contém os objetos completos.
import { MAIORES_CAMPEONATOS } from "./maiores";

// Esse endpoint retorna até 20 campeonatos, usando o array MAIORES_CAMPEONATOS.
// Filtros opcionais por país (country) e busca (search)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country");
  const search = searchParams.get("search")?.trim().toLowerCase() || "";

  // Use o array de objetos completos aqui
  let filtered = [...MAIORES_CAMPEONATOS];

  if (country) {
    // Agora 'c' é um objeto e tem a propriedade 'country', o que corrige o erro.
    filtered = filtered.filter(
      c => c.country.name.toLowerCase() === country.toLowerCase()
    );
  }
  if (search) {
    // A propriedade 'league' também existe, corrigindo o erro aqui também.
    filtered = filtered.filter(
      c =>
        c.league.name.toLowerCase().includes(search) ||
        c.country.name.toLowerCase().includes(search)
    );
  }

  // A lógica de slice e retorno permanece a mesma.
  filtered = filtered.slice(0, 20);

  return NextResponse.json(
    { response: filtered },
    {
      status: 200,
      headers: {
        // Cache longo, pois esses dados são estáticos.
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      },
    }
  );
}
