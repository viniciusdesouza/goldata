"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PinButtonClube from "@/components/pesquisa-clubes/PinButtonClube";
import ShareButtonClube from "@/components/pesquisa-clubes/ShareButtonClube";
import ClubTabsBar from "@/components/pesquisa-clubes/ClubTabsBar";
import CalendarioClubesTab from "@/components/pesquisa-clubes/CalendarioClubesTab";
import BoxEstatisticasTemporada from "@/components/pesquisa-clubes/BoxEstatisticasTemporada";
import BoxClassificacaoLiga from "@/components/pesquisa-clubes/BoxClassificacaoLiga";
import BoxCompeticoesJogadas from "@/components/pesquisa-clubes/BoxCompeticoesJogadas";
import "@/components/pesquisa-clubes/sharebuttonclube.css";

// --- Definição de Tipos ---
interface Clube {
  id: number;
  name: string;
  logo: string;
  founded: number | null;
}

interface Pais {
  name: string;
  flag: string;
}

interface Competicao {
  id: number | string;
  name: string;
  nome?: string;
}

interface Partida {
  league?: {
    id: number;
  };
}

// CORREÇÃO: Adicionando a propriedade 'goals' que estava faltando
interface TeamStanding {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
}

const TAB_LIST = [
  { key: "jogos", label: "Jogos/Calendário" },
  { key: "estatisticas", label: "Estatísticas" },
  { key: "classificacao", label: "Classificação" },
  { key: "historico", label: "Competições Disputadas" },
];

function isAmericanLeague(pais: Pais | null): boolean {
  if (!pais?.name) return false;
  const americas = [
    "Brazil", "Brasil", "Argentina", "Uruguay", "Paraguay", "Chile", "Colombia", "Peru",
    "Ecuador", "Venezuela", "Bolivia", "Mexico", "México", "USA", "Estados Unidos", "Canada", "Canadá"
  ];
  return americas.some((p) => pais.name?.toLowerCase().includes(p.toLowerCase()));
}

export default function ClubeDetalhesPage() {
  const params = useParams();
  const clubId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  // Estados com tipos definidos
  const [clube, setClube] = useState<Clube | null>(null);
  const [pais, setPais] = useState<Pais | null>(null);
  const [estadio, setEstadio] = useState<string | null>(null);
  const [temporadas, setTemporadas] = useState<number[]>([]);
  const [temporada, setTemporada] = useState<number | null>(null);
  const [competicoes, setCompeticoes] = useState<Competicao[]>([]);
  const [competicaoSelecionada, setCompeticaoSelecionada] = useState<Competicao | null>(null);
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [loadingPartidas, setLoadingPartidas] = useState(false);
  const [estatisticas, setEstatisticas] = useState<any>(null);
  const [classificacao, setClassificacao] = useState<TeamStanding[]>([]);
  const [historicoComp, setHistoricoComp] = useState<any[]>([]);
  const [tab, setTab] = useState<string>("jogos");
  const [loading, setLoading] = useState(true);
  const [loadingCompeticoes, setLoadingCompeticoes] = useState(false);
  const [error, setError] = useState<string>("");

  // --- Busca dados do clube ---
  useEffect(() => {
    if (!clubId) return;
    setLoading(true);
    setError("");
    Promise.all([
      fetch(`/api/football/pesquisa-clubes/teams?id=${clubId}`).then(res => res.json()),
      fetch(`/api/football/pesquisa-clubes/countries?team=${clubId}`).then(res => res.json()),
    ])
      .then(([clubeRes, paisRes]) => {
        setClube(clubeRes.response?.[0]?.team || null);
        setPais(paisRes.response?.[0] || null);
        setEstadio(clubeRes.response?.[0]?.venue?.name || null);
      })
      .catch(() => setError("Erro ao carregar informações do clube."))
      .finally(() => setLoading(false));
  }, [clubId]);

  // --- Temporadas disponíveis ---
  useEffect(() => {
    if (!clubId) return;
    fetch(`/api/football/pesquisa-clubes/seasons?team=${clubId}`)
      .then(res => res.json())
      .then(data => {
        const temps = (data.response || []).sort((a: number, b: number) => b - a);
        setTemporadas(temps);
        setTemporada(temps[0] || null);
      });
  }, [clubId]);

  // --- Competições disponíveis na temporada selecionada ---
  useEffect(() => {
    if (!clubId || !temporada) return;
    setLoadingCompeticoes(true);
    fetch(`/api/football/pesquisa-clubes/competitions?team=${clubId}&season=${temporada}`)
      .then(res => res.json())
      .then((compData) => {
        const lista: Competicao[] = compData.response || [];
        const listaComTodos: Competicao[] = [{ id: "all", nome: "Todos os Campeonatos", name: "Todos os Campeonatos" }, ...lista];
        setCompeticoes(listaComTodos);
        setCompeticaoSelecionada((prev) => {
          if (prev && listaComTodos.some(c => String(c.id) === String(prev.id))) {
            return prev;
          }
          return listaComTodos[0];
        });
      })
      .finally(() => setLoadingCompeticoes(false));
  }, [clubId, temporada]);

  // --- Busca partidas da temporada/competição ---
  useEffect(() => {
    if (!clubId || !temporada || !competicaoSelecionada) return;
    setLoadingPartidas(true);
    fetch(`/api/football/club-matches?team=${clubId}&season=${temporada}`)
      .then(res => res.json())
      .then(data => {
        let partidasFiltradas: Partida[] = data.response || [];
        if (competicaoSelecionada.id !== "all") {
          partidasFiltradas = partidasFiltradas.filter(p => String(p.league?.id) === String(competicaoSelecionada.id));
        }
        setPartidas(partidasFiltradas);
      })
      .finally(() => setLoadingPartidas(false));
  }, [clubId, temporada, competicaoSelecionada]);

  // --- Busca dados específicos da competição ---
  useEffect(() => {
    if (!clubId || !temporada || !competicaoSelecionada || competicaoSelecionada.id === "all") {
      setEstatisticas(null);
      setClassificacao([]);
      setHistoricoComp([]);
      return;
    }
    fetch(`/api/football/pesquisa-clubes/statistics-temporada?team=${clubId}&season=${temporada}&league=${competicaoSelecionada.id}`)
      .then(res => res.json())
      .then(data => setEstatisticas(data.response ?? null));
    
    fetch(`/api/football/pesquisa-clubes/standings?league=${competicaoSelecionada.id}&season=${temporada}`)
      .then(res => res.json())
      .then(data => {
        const standingsData = data.response?.[0]?.league?.standings?.[0] || [];
        setClassificacao(standingsData);
      });

    fetch(`/api/football/pesquisa-clubes/competitions-played?team=${clubId}&season=${temporada}`)
      .then(res => res.json())
      .then(data => setHistoricoComp(data.response || []));
  }, [clubId, temporada, competicaoSelecionada]);

  if (loading) {
    return (
      <div className="text-center py-12">Carregando informações do clube...</div>
    );
  }
  if (error) {
    return (
      <div className="text-center text-red-500 py-12">{error}</div>
    );
  }

  const showFilters = tab === "estatisticas" || tab === "classificacao";

  function TabPanelWrapper({ children }: { children: React.ReactNode }) {
    return (
      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl p-4 w-full mx-auto">
        {children}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative mb-4">
          <img
            src={clube?.logo}
            alt={clube?.name}
            className="w-24 h-24 object-contain bg-white dark:bg-zinc-800 p-2 rounded-full shadow-lg border-2 border-zinc-200 dark:border-zinc-700"
          />
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{clube?.name}</h1>
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mt-2">
          {pais?.flag && <img src={pais.flag} alt={pais.name} className="w-5 h-auto rounded-sm" />}
          <span>{pais?.name}</span>
          {clube?.founded && <span>&bull; Fundado em {clube.founded}</span>}
        </div>
        <div className="mt-4 flex items-center gap-2">
            {clubId && <PinButtonClube id={Number(clubId)} />}
            {clubId && <ShareButtonClube id={Number(clubId)} />}
        </div>
      </div>
      
      <ClubTabsBar tabs={TAB_LIST} currentTab={tab} onTab={setTab} />

      {/* Filtros */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 my-6 justify-center">
          <select
            value={temporada ?? ""}
            onChange={e => setTemporada(Number(e.target.value))}
            className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {temporadas.map((year) => (
              <option key={year} value={year}>
                {isAmericanLeague(pais) ? year : `${year}/${String(year + 1).slice(-2)}`}
              </option>
            ))}
          </select>
          <select
            value={competicaoSelecionada?.id || ""}
            disabled={loadingCompeticoes || competicoes.length === 0}
            onChange={e => {
              const comp = competicoes.find(c => String(c.id) === e.target.value);
              setCompeticaoSelecionada(comp || competicoes[0]);
            }}
            className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {competicoes.map(c => (
              <option key={c.id} value={c.id}>{c.nome || c.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Conteúdo das Abas */}
      <div className="mt-6">
        {tab === "jogos" && (
          <TabPanelWrapper>
            {loadingPartidas ? (
              <div className="text-center py-8">Carregando partidas...</div>
            ) : (
              <CalendarioClubesTab partidas={partidas} pageSize={5} />
            )}
          </TabPanelWrapper>
        )}
        {tab === "estatisticas" && (
          <TabPanelWrapper>
            {competicaoSelecionada?.id !== "all" ? (
              <BoxEstatisticasTemporada estatisticas={estatisticas} />
            ) : (
              <div className="text-center py-8">Selecione um campeonato para ver as estatísticas.</div>
            )}
          </TabPanelWrapper>
        )}
        {tab === "classificacao" && (
          <TabPanelWrapper>
            {competicaoSelecionada?.id !== "all" ? (
              <BoxClassificacaoLiga classificacao={classificacao} clubeId={Number(clubId)} />
            ) : (
              <div className="text-center py-8">Selecione um campeonato para ver a classificação.</div>
            )}
          </TabPanelWrapper>
        )}
        {tab === "historico" && (
          <TabPanelWrapper>
            <BoxCompeticoesJogadas competicoes={historicoComp} />
          </TabPanelWrapper>
        )}
      </div>
    </div>
  );
}
