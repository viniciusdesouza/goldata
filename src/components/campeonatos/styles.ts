// Estilização centralizada para maiores campeonatos
// Siga o padrão do projeto utilizado em partidas de futebol

// Dados principais (valores, gols, pontos)
export const DATA_VALUE_CLASS =
  "px-2.5 py-1 rounded-lg text-[15px] font-normal bg-green-100 text-green-700";

// Nome do time (tabela, artilheiros)
export const TEAM_NAME_CLASS =
  "text-[14px] font-normal text-gray-900 dark:text-gray-100 truncate";

// Títulos de seções, nome do campeonato, subtítulos
export const SECTION_TITLE_CLASS =
  "text-[14px] font-medium text-gray-700 dark:text-gray-200";

// Header/cabeçalho das tabelas
export const TABLE_HEADER_CELL_CLASS =
  "py-2 px-2 text-left text-green-900 dark:text-green-100 font-medium text-[14px] uppercase tracking-wide";

// Célula comum de tabela (alinhada ao centro)
export const TABLE_CELL_CLASS =
  "py-1.5 px-2 text-center";

// Nome do jogador/treinador (artilheiros, técnicos)
export const PERSON_NAME_CLASS =
  "text-sm text-gray-700 dark:text-gray-100 font-normal";

// Subtítulo (ex: rodada, estádio)
export const SUBTITLE_CLASS =
  "text-[13px] font-medium text-gray-500 dark:text-gray-400";

// Botões de aba ou filtros (ex: temporadas, tabs)
export const TAB_BUTTON_CLASS =
  "px-3 py-1 rounded text-[14px] font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:bg-green-50 dark:hover:bg-green-900 transition";

// Mensagens auxiliares, loading, sem dados
export const AUX_TEXT_CLASS =
  "text-[14px] text-gray-500 dark:text-gray-400";

// Posição, ranking ou info extra pequena
export const SMALL_INFO_CLASS =
  "ml-2 text-[12px] text-green-400 dark:text-green-300";

// Utilitário para destacar linha na tabela de classificação
export function highlightStandingsRow(teamId: number, highlightIds: number[]) {
  if (highlightIds.includes(teamId)) return "bg-green-100 dark:bg-green-900";
  return "";
}

// Utilitário para resultado de jogo (vitória/empate/derrota)
export function getResultColor(goalsA: number | null, goalsB: number | null, home: boolean) {
  if (goalsA === null || goalsB === null) return "";
  if (goalsA === goalsB) return "text-yellow-500 font-semibold"; // empate
  if (home && goalsA > goalsB) return "text-green-600 font-bold";
  if (!home && goalsB > goalsA) return "text-green-600 font-bold";
  return "text-red-500 font-semibold";
}