// Estilização centralizada para tabs de partidas de futebol
// Cores mais visíveis e contraste forte

// Dados numéricos e odds (dados principais destacados)
export const DATA_VALUE_CLASS =
  "px-2.5 py-1 rounded-lg text-[15px] font-bold bg-blue-600 text-white shadow";

// Nome do time (tabela, lineups, stats, h2h)
export const TEAM_NAME_CLASS =
  "text-[14px] font-semibold text-gray-900 dark:text-gray-100 truncate";

// Nome do campeonato, títulos de seções, headers principais
export const SECTION_TITLE_CLASS =
  "text-[14px] font-bold text-gray-800 dark:text-gray-100";

// Header/cabeçalho das tabelas
export const TABLE_HEADER_CELL_CLASS =
  "py-2 px-2 text-left text-blue-900 dark:text-blue-200 font-bold text-[14px] bg-blue-100 dark:bg-blue-950";

// Célula comum de tabela (alinhada ao centro)
export const TABLE_CELL_CLASS =
  "py-1.5 px-2 text-center text-gray-900 dark:text-gray-100";

// Nome do treinador (lineups)
export const COACH_NAME_CLASS =
  "text-sm text-gray-800 dark:text-gray-100 font-semibold";

// Título de Titulares/Reservas (lineups)
export const SUBTITLE_CLASS =
  "text-[13px] font-bold text-blue-700 dark:text-blue-200";

// Botões de aba (odds, stats)
export const TAB_BUTTON_CLASS =
  "px-3 py-1 rounded text-[14px] font-bold border border-blue-500 dark:border-blue-400 text-blue-700 dark:text-blue-200 bg-white dark:bg-blue-900 hover:bg-blue-50 dark:hover:bg-blue-800 transition";

// Mensagens auxiliares e loading
export const AUX_TEXT_CLASS =
  "text-[14px] text-gray-700 dark:text-gray-200 font-medium";

// Posição do jogador (lineups)
export const PLAYER_POSITION_CLASS =
  "ml-2 text-[11px] text-blue-700 dark:text-blue-200 font-bold";

// Utilitário para destacar linha na tabela de classificação
export function highlightStandingsRow(teamId: number, homeId: number, awayId: number) {
  if (teamId === homeId) return "bg-blue-200 dark:bg-blue-800 font-bold";
  if (teamId === awayId) return "bg-blue-100 dark:bg-blue-700 font-semibold";
  return "";
}