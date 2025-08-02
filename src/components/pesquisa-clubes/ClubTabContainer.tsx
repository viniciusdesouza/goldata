import React, { useState } from "react";
import BoxJogosClubes from "./BoxJogosClubes";
import BoxEstatisticasTemporada from "@/components/pesquisa-clubes/BoxEstatisticasTemporada";
import BoxClassificacaoLiga from "@/components/pesquisa-clubes/BoxClassificacaoLiga";
import BoxCompCurrent from "@/components/pesquisa-clubes/BoxCompCurrent";
import BoxCompeticoesJogadas from "@/components/pesquisa-clubes/BoxCompeticoesJogadas";
import { AUX_TEXT_CLASS } from "../campeonatos/styles";
import { CATEGORY_CONTAINER_CLASS } from "@/app/styles-categorias";

const TABS = [
  { key: "jogos", label: "Jogos/Calendário" },
  { key: "estatisticas", label: "Estatísticas" },
  { key: "classificacao", label: "Classificação" },
  { key: "atuais", label: "Competições Atuais" },
  { key: "jogadas", label: "Competições Jogadas" },
];

interface ClubTabContainerProps {
  clubId: number | string;
  temporada: number;
  leagueId: number | string;
  estatisticas: any;
  classificacao: any[];
  competicoesAtuais: any[];
  competicoesJogadas: any[];
}

export default function ClubTabContainer({
  clubId,
  temporada,
  leagueId,
  estatisticas,
  classificacao,
  competicoesAtuais,
  competicoesJogadas,
}: ClubTabContainerProps) {
  const [activeTab, setActiveTab] = useState<string>("jogos");

  return (
    <div
      className={CATEGORY_CONTAINER_CLASS}
      style={{
        borderRadius: "var(--radius)",
        border: "1.5px solid hsl(var(--border))",
        background: "hsl(var(--container))",
        color: "hsl(var(--container-foreground))",
        boxShadow: "0 2px 10px 0 #0001"
      }}
    >
      <div className="w-full p-4 shadow-sm" style={{ borderRadius: "var(--radius)" }}>
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-2 rounded-lg font-bold text-sm border transition-all ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white border-blue-600 shadow"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Conteúdo das Tabs */}
        <div className="w-full">
          {activeTab === "jogos" && (
            <BoxJogosClubes
              clubId={clubId}
              temporada={temporada}
              leagueId={leagueId}
              titulo="Jogos do clube"
              pageSize={5}
            />
          )}
          {activeTab === "estatisticas" && <BoxEstatisticasTemporada estatisticas={estatisticas} />}
          {activeTab === "classificacao" && <BoxClassificacaoLiga classificacao={classificacao} />}
          {activeTab === "atuais" && <BoxCompCurrent competicoes={competicoesAtuais} />}
          {activeTab === "jogadas" && <BoxCompeticoesJogadas competicoes={competicoesJogadas} />}
          {!TABS.map(t => t.key).includes(activeTab) && (
            <div className={AUX_TEXT_CLASS + " text-center py-8"}>
              Selecione uma das abas acima para visualizar os detalhes do clube.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}