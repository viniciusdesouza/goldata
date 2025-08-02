"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ListaArtilheiros from "@/components/campeonatos/ListaArtilheiros";
import TabelaClassificacao from "@/components/campeonatos/TabelaClassificacao";
import UltimaProximaRodada from "@/components/campeonatos/UltimaProximaRodada";
import { AUX_TEXT_CLASS } from "@/components/partidas-futebol/styles";
import PinButton from "@/components/campeonatos/PinButton";
import ShareButtonCampeonato from "@/components/campeonatos/ShareButtonCampeonato";
import CampeonatoTabsBar from "@/components/campeonatos/CampeonatoTabsBar";
import "@/components/campeonatos/sharebuttoncampeonato.css";

// TABS sem "Rodadas"
const TABS = [
  { key: "ultimasproximas", label: "Última/Próxima rodada" },
  { key: "classificacao", label: "Classificação" },
  { key: "artilheiros", label: "Artilheiros" },
];

function isAmericanLeague(pais: any) {
  if (!pais?.name) return false;
  const americas = [
    "Brazil", "Brasil", "Argentina", "Uruguay", "Paraguay", "Chile", "Colombia", "Peru",
    "Ecuador", "Venezuela", "Bolivia", "Mexico", "México", "USA", "Estados Unidos", "Canada", "Canadá",
    "Costa Rica", "Honduras", "Panama", "El Salvador", "Guatemala", "Nicaragua", "Jamaica",
    "Trinidad and Tobago", "Suriname", "Guyana", "French Guiana", "Cuba", "Haiti", "Dominican Republic",
    "Puerto Rico", "Bahamas", "Barbados", "Belize", "Bermuda", "Grenada", "Saint Lucia",
    "Saint Vincent and the Grenadines", "Saint Kitts and Nevis", "Antigua and Barbuda", "Dominica"
  ];
  return americas.some((p) => pais.name?.toLowerCase().includes(p.toLowerCase()));
}

export default function CampeonatoDetalhesPage() {
  const params = useParams();
  const leagueId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [temporadas, setTemporadas] = useState<number[]>([]);
  const [temporada, setTemporada] = useState<number | null>(null);
  const [campeonato, setCampeonato] = useState<any>(null);
  const [pais, setPais] = useState<any>(null);
  const [artilheiros, setArtilheiros] = useState<any>(null);
  const [classificacao, setClassificacao] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingTab, setLoadingTab] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("ultimasproximas");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!leagueId) return;
    setLoading(true);
    setError("");
    Promise.all([
      fetch(`/api/football/campeonatos/details?id=${leagueId}`).then(res => res.json()),
      fetch(`/api/football/campeonatos/seasons?id=${leagueId}`).then(res => res.json()),
    ])
      .then(([details, seasons]) => {
        const leagueData = details.response?.[0];
        setCampeonato(leagueData?.league || null);
        setPais(leagueData?.country || null);
        let temps = (seasons.response || []).sort((a: number, b: number) => b - a);
        setTemporadas(temps);
        setTemporada(temps[0] || null);
      })
      .catch(() => setError("Erro ao carregar dados do campeonato."))
      .finally(() => setLoading(false));
  }, [leagueId]);

  useEffect(() => {
    if (!leagueId || !temporada) return;
    if (activeTab === "ultimasproximas") return;
    setLoadingTab(true);
    setError("");
    let url = "";
    if (activeTab === "artilheiros") {
      url = `/api/football/campeonatos/topscorers?league=${leagueId}&season=${temporada}`;
    } else if (activeTab === "classificacao") {
      url = `/api/football/campeonatos/standings?league=${leagueId}&season=${temporada}`;
    }
    if (!url) return;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (activeTab === "artilheiros") setArtilheiros(data);
        if (activeTab === "classificacao") setClassificacao(data);
      })
      .catch(() => setError("Erro ao carregar dados da aba selecionada."))
      .finally(() => setLoadingTab(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leagueId, temporada, activeTab]);

  if (loading) {
    return (
      <div className="text-[15px] text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 rounded-2xl text-center py-12 mt-12 font-normal">
        Carregando informações do campeonato...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 rounded-2xl py-12 mt-12 text-[15px] font-normal">
        {error}
      </div>
    );
  }

  const showSelectTemporada = true;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <h1 className="text-2xl text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 rounded-2xl text-center mb-6 flex justify-center items-center gap-2 flex-wrap font-normal">
        {leagueId && (
          <>
            <PinButton id={Number(leagueId)} />
            <ShareButtonCampeonato id={Number(leagueId)} showText={true} />
          </>
        )}
        {campeonato?.name ?? "Detalhes do Campeonato"}
      </h1>
      <div className="flex flex-col items-center mt-2 mb-2 w-full">
        <div
          className="flex items-center justify-center rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow"
          style={{
            width: 90,
            height: 90,
            marginBottom: 10,
            position: "relative",
            zIndex: 10,
            overflow: "hidden",
            borderRadius: "1rem",
          }}
        >
          {campeonato?.logo ? (
            <img
              src={campeonato.logo}
              alt={campeonato?.name}
              className="w-full h-full object-contain"
              style={{ maxWidth: "80px", maxHeight: "80px", borderRadius: "0.7rem" }}
              draggable={false}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800" />
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 mb-1 font-normal">
          {pais?.flag && (
            <img src={pais.flag} alt={pais.name} className="w-6 h-4 rounded-sm border" />
          )}
          <span>{pais?.name}</span>
        </div>
        <span className="text-xs text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 mb-2 font-normal">
          {campeonato?.type ? campeonato.type : ""}
          {campeonato?.season && ` · Temporada atual: ${campeonato.season}`}
        </span>
      </div>
      {/* Select temporada acima das tabs */}
      {showSelectTemporada && (
        <div className="w-full flex justify-center mb-6">
          <select
            className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-3 py-2 min-w-[120px] rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-700 transition-colors text-base font-normal"
            value={temporada ?? ""}
            onChange={e => setTemporada(Number(e.target.value))}
          >
            {temporadas.map((year) => (
              <option key={year} value={year}>
                {isAmericanLeague(pais)
                  ? year
                  : `${year}/${String(year + 1).slice(-2)}`}
              </option>
            ))}
          </select>
        </div>
      )}
      {/* Tabs */}
      <CampeonatoTabsBar
        tabs={TABS}
        currentTab={activeTab}
        onTab={setActiveTab}
      />
      {/* Conteúdo principal das abas */}
      <section className="w-full">
        {loadingTab && (activeTab === "classificacao" || activeTab === "artilheiros") ? (
          <div className={AUX_TEXT_CLASS + " py-8"}>Carregando...</div>
        ) : (
          <>
            {activeTab === "classificacao" && (
              <div className="mb-6 mt-2">
                <TabelaClassificacao data={classificacao} />
              </div>
            )}
            {activeTab === "artilheiros" && (
              <div className="mb-6 mt-2">
                <ListaArtilheiros data={artilheiros} />
              </div>
            )}
            {activeTab === "ultimasproximas" && leagueId && temporada && (
              <div className="mb-6 mt-3">
                <UltimaProximaRodada
                  leagueId={leagueId}
                  temporada={temporada}
                />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}