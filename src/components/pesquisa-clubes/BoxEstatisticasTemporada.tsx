import React from "react";

interface Formacao {
  formation: string;
  played: number;
}

interface EstatisticasTemporada {
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  golsPro: number;
  golsContra: number;
  saldoGols: number;
  aproveitamento: number;
  mediaGolsPro?: number;
  mediaGolsContra?: number;
  cleanSheets?: number;
  jogosSemMarcar?: number;
  cartoesAmarelos?: number;
  cartoesVermelhos?: number;
  penaltisConvertidos?: number;
  penaltisPerdidos?: number;
  penaltisTotais?: number;
  formacoesMaisUsadas?: Formacao[];
  [key: string]: any;
}

interface BoxEstatisticasTemporadaProps {
  estatisticas: EstatisticasTemporada | null;
}

const labels = [
  "Jogos", "Vitórias", "Empates", "Derrotas",
  "Gols Pró", "Gols Contra", "Saldo de Gols", "Aproveitamento",
  "Média Gols Pró", "Média Gols Contra", "Clean Sheets", "Jogos Sem Marcar",
  "Cartões Amarelos", "Cartões Vermelhos",
  "Pênaltis Convertidos", "Pênaltis Perdidos", "Pênaltis Totais"
];

export default function BoxEstatisticasTemporada({ estatisticas }: BoxEstatisticasTemporadaProps) {
  if (!estatisticas) {
    return (
      <div className="text-zinc-700 dark:text-zinc-300 py-6 text-center max-w-3xl mx-auto">
        Nenhuma estatística disponível para esta temporada.
      </div>
    );
  }

  const mediaGolsPro =
    estatisticas.mediaGolsPro !== undefined
      ? estatisticas.mediaGolsPro
      : estatisticas.jogos > 0
      ? estatisticas.golsPro / estatisticas.jogos
      : 0;

  const mediaGolsContra =
    estatisticas.mediaGolsContra !== undefined
      ? estatisticas.mediaGolsContra
      : estatisticas.jogos > 0
      ? estatisticas.golsContra / estatisticas.jogos
      : 0;

  const statsValues: (string | number)[] = [
    estatisticas.jogos,
    estatisticas.vitorias,
    estatisticas.empates,
    estatisticas.derrotas,
    estatisticas.golsPro,
    estatisticas.golsContra,
    (estatisticas.saldoGols > 0 ? "+" : "") + estatisticas.saldoGols,
    estatisticas.aproveitamento + "%",
    mediaGolsPro.toFixed(2),
    mediaGolsContra.toFixed(2),
    estatisticas.cleanSheets ?? "-",
    estatisticas.jogosSemMarcar ?? "-",
    estatisticas.cartoesAmarelos ?? "-",
    estatisticas.cartoesVermelhos ?? "-",
    estatisticas.penaltisConvertidos ?? "-",
    estatisticas.penaltisPerdidos ?? "-",
    estatisticas.penaltisTotais ?? "-",
  ];

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
      <ul className="flex flex-col gap-1 w-full">
        {/* Cabeçalho */}
        <li className="flex items-center px-2 py-1 text-[14px] font-semibold text-blue-900 dark:text-blue-100 border-b border-zinc-200 dark:border-zinc-700 bg-blue-50 dark:bg-blue-950 rounded-t-xl select-none">
          <span className="flex-1 text-left pl-2">Estatística</span>
          <span className="w-28 text-center">Valor</span>
        </li>
        {labels.map((label, idx) => (
          <li
            key={label}
            className={
              "flex items-center px-2 py-[0.375rem] text-[14px] border border-zinc-200 dark:border-zinc-800 rounded-md w-full " +
              (idx % 2 === 0
                ? "bg-white dark:bg-zinc-900"
                : "bg-gray-50 dark:bg-zinc-800")
            }
          >
            <span
              className="flex-1 text-left font-medium text-zinc-700 dark:text-zinc-200 pl-2"
              style={{ fontSize: 14 }}
            >
              {label}
            </span>
            <span className="w-28 text-center font-semibold text-blue-800 dark:text-blue-100">
              {statsValues[idx]}
            </span>
          </li>
        ))}
        {/* Formações mais usadas */}
        {estatisticas.formacoesMaisUsadas && estatisticas.formacoesMaisUsadas.length > 0 && (
          <li className="px-2 pt-3 pb-1 flex flex-col w-full">
            <div className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-1">
              Formações mais utilizadas
            </div>
            <div className="flex flex-wrap gap-2">
              {estatisticas.formacoesMaisUsadas
                .sort((a, b) => b.played - a.played)
                .slice(0, 3)
                .map((f) => (
                  <span
                    key={f.formation}
                    className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-2 py-0.5 rounded-full font-semibold text-xs shadow border border-blue-200 dark:border-blue-800"
                  >
                    {f.formation}
                    <span className="ml-2 bg-blue-400 dark:bg-blue-700 text-white rounded-full px-2 py-0.5 text-xs font-bold border border-blue-200 dark:border-blue-800">
                      {f.played}x
                    </span>
                  </span>
                ))}
              {estatisticas.formacoesMaisUsadas.length > 3 && (
                <span className="inline-block text-xs text-blue-700 dark:text-blue-200 ml-2 align-middle font-medium">
                  +{estatisticas.formacoesMaisUsadas.length - 3} outras
                </span>
              )}
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}