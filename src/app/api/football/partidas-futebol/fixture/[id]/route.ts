import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const fixtureId = params.id;
  // ✅ Alterado para usar o nome da sua variável
  const apiKey = process.env.APIFOOTBALL_KEY; 

  console.log('API Key carregada:', apiKey ? 'Sim' : 'Não');

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key não configurada no .env.local' },
      { status: 500 }
    );
  }

  if (!fixtureId) {
    return NextResponse.json(
        { error: 'Fixture ID não fornecido na URL' },
        { status: 400 }
      );
  }

  try {
    const apiUrl = `https://v3.football.api-sports.io/fixtures?id=${fixtureId}`;
    console.log('Chamando a API externa:', apiUrl);

    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': apiKey,
      },
      next: { revalidate: 30 },
    });

    console.log('Status da resposta da API externa:', res.status);

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Corpo do erro da API externa:", errorBody);
      throw new Error(`Falha ao buscar dados da API externa. Status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('ERRO DETALHADO no handler da API:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao processar a requisição.' },
      { status: 500 }
    );
  }
}