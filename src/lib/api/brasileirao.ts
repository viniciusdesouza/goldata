const API_KEY = process.env.APIFOOTBALL_KEY || "7566e353035f51833447b2d2420fec99";
const BASE_URL = "https://v3.football.api-sports.io";

// ID da liga brasileira Série A na API-FOOTBALL
const BRASILEIRAO_LEAGUE_ID = 71; // 71 é o code da Série A, confira na documentação se precisar!

// Classificação (standings)
export async function getClassificacao(ano: number) {
  const res = await fetch(
    `${BASE_URL}/standings?league=${BRASILEIRAO_LEAGUE_ID}&season=${ano}`,
    {
      headers: { "x-apisports-key": API_KEY },
      next: { revalidate: 60 }
    }
  );
  if (!res.ok) throw new Error("Erro ao buscar classificação");
  return res.json();
}

// Artilheiros (top scorers)
export async function getArtilheiros(ano: number) {
  const res = await fetch(
    `${BASE_URL}/players/topscorers?league=${BRASILEIRAO_LEAGUE_ID}&season=${ano}`,
    {
      headers: { "x-apisports-key": API_KEY },
      next: { revalidate: 60 }
    }
  );
  if (!res.ok) throw new Error("Erro ao buscar artilheiros");
  return res.json();
}

// Jogos recentes (últimos jogos da liga)
export async function getJogosRecentes(ano: number) {
  const res = await fetch(
    `${BASE_URL}/fixtures?league=${BRASILEIRAO_LEAGUE_ID}&season=${ano}&last=10`,
    {
      headers: { "x-apisports-key": API_KEY },
      next: { revalidate: 60 }
    }
  );
  if (!res.ok) throw new Error("Erro ao buscar jogos recentes");
  return res.json();
}