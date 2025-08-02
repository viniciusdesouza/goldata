"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import BoxClubeInfo from "@/components/pesquisa-clubes/BoxClubeInfo";
import BoxPais from "@/components/pesquisa-clubes/BoxPais";
import BoxCompCurrent from "@/components/pesquisa-clubes/BoxCompCurrent";
import BoxProximosJogos from "@/components/pesquisa-clubes/BoxProximosJogos";
import BoxUltimosJogos from "@/components/pesquisa-clubes/BoxUltimosJogos";
import TemporadaSelect from "@/components/pesquisa-clubes/TemporadaSelect";
import BoxEstatisticasTemporada from "@/components/pesquisa-clubes/BoxEstatisticasTemporada";
import BoxClassificacaoLiga from "@/components/pesquisa-clubes/BoxClassificacaoLiga";
import BoxCompeticoesJogadas from "@/components/pesquisa-clubes/BoxCompeticoesJogadas";

const temporadasDisponiveis = [2025, 2024, 2023, 2022, 2021, 2020];

export default function ClubeDetalhesPage() {
  const params = useParams();
  const clubId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [temporada, setTemporada] = useState(temporadasDisponiveis[0]);

  // Estados para dados
  const [clube, setClube] = useState(null);
  const [pais, setPais] = useState(null);
  const [competicoesAtuais, setCompeticoesAtuais] = useState([]);
  const [proximosJogos, setProximosJogos] = useState([]);
  const [ultimosJogos, setUltimosJogos] = useState([]);
  const [estatisticas, setEstatisticas] = useState(null);
  const [classificacao, setClassificacao] = useState([]);
  const [competicoesJogadas, setCompeticoesJogadas] = useState([]);

  // Buscar dados do clube e país
  useEffect(() => {
    if (!clubId) return;

    fetch(`/api/football/pesquisa-clubes/teams?id=${clubId}`)
      .then(res => res.json())
      .then(data => setClube(data.response?.[0]?.team || null));

    fetch(`/api/football/pesquisa-clubes/countries?team=${clubId}`)
      .then(res => res.json())
      .then(data => setPais(data.response?.[0] || null));
  }, [clubId]);

  // Buscar dados dependentes da temporada
  useEffect(() => {
    if (!clubId || !temporada) return;

    // 1. Competições atuais
    fetch(`/api/football/pesquisa-clubes/competitions?team=${clubId}&season=${temporada}`)
      .then(res => res.json())
      .then(data => setCompeticoesAtuais(data.response || []));

    // 2. Próximos jogos
    fetch(`/api/football/pesquisa-clubes/fixtures?team=${clubId}&season=${temporada}&next=5`)
      .then(res => res.json())
      .then(data => setProximosJogos(data.response || []));

    // 3. Últimos jogos
    fetch(`/api/football/pesquisa-clubes/fixtures?team=${clubId}&season=${temporada}&last=5`)
      .then(res => res.json())
      .then(data => setUltimosJogos(data.response || []));

    // 4. Estatísticas da temporada
    fetch(`/api/football/pesquisa-clubes/statistics?team=${clubId}&season=${temporada}`)
      .then(res => res.json())
      .then(data => setEstatisticas(data.response || null));

    // 5. Competições jogadas
    fetch(`/api/football/pesquisa-clubes/competitions-played?team=${clubId}&season=${temporada}`)
      .then(res => res.json())
      .then(data => setCompeticoesJogadas(data.response || []));
  }, [clubId, temporada]);

  // Buscar classificação da principal liga da temporada do clube
  useEffect(() => {
    if (!clubId || !temporada) return;

    // Busca as competições do clube na temporada para pegar o leagueId principal
    fetch(`/api/football/pesquisa-clubes/competitions?team=${clubId}&season=${temporada}`)
      .then(res => res.json())
      .then(data => {
        const competicoes = data.response || [];
        // Preferencialmente pega a primeira competição (pode melhorar a lógica conforme sua necessidade)
        const leagueId = competicoes[0]?.id;
        if (leagueId) {
          fetch(`/api/football/pesquisa-clubes/standings?league=${leagueId}&season=${temporada}`)
            .then(res => res.json())
            .then(data => setClassificacao(data.response || []));
        } else {
          // fallback: tenta buscar pela equipe
          fetch(`/api/football/pesquisa-clubes/standings?team=${clubId}&season=${temporada}`)
            .then(res => res.json())
            .then(data => setClassificacao(data.response || []));
        }
      });
  }, [clubId, temporada]);

  return (
    <main className="container mx-auto max-w-3xl py-6 flex flex-col items-center min-h-screen">
      <div className="w-full flex flex-col gap-8">
        <BoxClubeInfo clube={clube} />
        <BoxPais pais={pais} />
        <BoxCompCurrent competicoes={competicoesAtuais} />
        <BoxProximosJogos jogos={proximosJogos} />
        <BoxUltimosJogos jogos={ultimosJogos} />
        <TemporadaSelect temporadas={temporadasDisponiveis} temporadaAtual={temporada} onChange={setTemporada} />
        <BoxEstatisticasTemporada estatisticas={estatisticas} />
        <BoxClassificacaoLiga classificacao={classificacao} />
        <BoxCompeticoesJogadas competicoes={competicoesJogadas} />
      </div>
    </main>
  );
}