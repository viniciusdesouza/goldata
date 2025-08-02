"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PlayerTabs from "@/components/pesquisa-jogadores/PlayerTabs";
import PlayerOverviewTab from "@/components/pesquisa-jogadores/PlayerOverviewTab";
import PlayerStatsTab from "@/components/pesquisa-jogadores/PlayerStatsTab";
import PlayerClubsTab from "@/components/pesquisa-jogadores/PlayerClubsTab";

// --- Definição de Tipos ---
interface PlayerData {
  player: {
    id: number;
    name: string;
    photo: string;
    nationality: string;
    flag: string | null;
    birth: {
      date: string;
      country: string;
    };
  };
  // Adicione outras propriedades se necessário
}

interface CountryData {
  name: string;
  flag: string;
}

const TABS = [
  { key: "overview", label: "Visão Geral" },
  { key: "stats", label: "Estatísticas" },
  { key: "clubs", label: "Clubes" },
];

export default function PlayerDetalhesPage() {
  const params = useParams();
  const playerId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [pais, setPais] = useState<CountryData | null>(null);

  // Carrega detalhes do jogador e país
  useEffect(() => {
    if (!playerId) return;
    setLoading(true);
    setError("");
    fetch(`/api/football/pesquisa-jogadores/${playerId}?search=${playerId}`)
      .then(res => res.json())
      .then(data => {
        const jogador = data?.response?.[0] ?? null;
        setPlayer(jogador);
        if (jogador?.player?.nationality) {
          fetch(`/api/football/pesquisa-clubes/countries?name=${encodeURIComponent(jogador.player.nationality)}`)
            .then(res => res.json())
            .then(dataPais => setPais(dataPais?.response?.[0] ?? null))
            .catch(() => setPais(null));
        }
      })
      .catch(() => setError("Erro ao carregar dados do jogador."))
      .finally(() => setLoading(false));
  }, [playerId]);

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center text-zinc-500 dark:text-zinc-400 py-12">Carregando informações do jogador...</div>
      </main>
    );
  }

  if (error || !player) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center text-red-500 py-12">{error || "Jogador não encontrado."}</div>
      </main>
    );
  }

  const { name, photo, nationality, birth } = player.player;
  const flagUrl: string | null = pais?.flag || player.player?.flag;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="w-full">
        {/* Header do jogador */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <img
              src={photo}
              alt={name}
              className="w-24 h-24 object-cover rounded-full bg-white dark:bg-zinc-800 p-1 shadow-lg border-2 border-zinc-200 dark:border-zinc-700"
            />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{name}</h1>
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mt-2">
            {nationality && flagUrl && (
              <img src={flagUrl} alt={nationality} className="w-5 h-auto rounded-sm border border-zinc-300" />
            )}
            <span>{nationality}</span>
          </div>
          {birth?.date && (
            <div className="text-xs text-zinc-500 mt-1">
              <span>Nascido em {new Date(birth.date).toLocaleDateString('pt-BR')}</span>
              {birth.country && <span> &bull; {birth.country}</span>}
            </div>
          )}
        </div>

        {/* Tabs e Conteúdo */}
        <div className="flex flex-col items-center w-full">
          <div className="w-full flex justify-center mb-6 border-b border-zinc-200 dark:border-zinc-800">
            <PlayerTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <section className="w-full">
            {activeTab === "overview" && <PlayerOverviewTab player={player} />}
            {activeTab === "stats" && <PlayerStatsTab player={player} />}
            {activeTab === "clubs" && <PlayerClubsTab player={player} />}
          </section>
        </div>
      </div>
    </main>
  );
}
