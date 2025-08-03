// Estilos exclusivos e padronizados para área de grid/lista de categorias (clubes, campeonatos, jogadores)

// Container principal centralizado da página de categorias
// PADRÃO ÚNICO: max-w-4xl, padding horizontal unificado, centralizado
export const CATEGORIA_CONTAINER =
  "w-full max-w-4xl mx-auto px-4 sm:px-8 flex flex-col items-center";

// Grid: 2 colunas no desktop, 1 no mobile, espaçamento reduzido
export const CATEGORIA_GRID =
  "grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 w-full mt-3";

// Card individual: ocupa 100% da coluna, altura baixa, sombra e borda padronizada
export const CATEGORIA_CARD =
  "flex items-center gap-3 border border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 rounded-lg shadow-sm px-4 py-2 transition hover:border-blue-500 dark:hover:border-blue-400 w-full min-h-[46px]";

// Imagem/logo do card menor
export const CATEGORIA_CARD_IMG =
  "w-9 h-9 object-contain";

// Nome principal do card
export const CATEGORIA_CARD_NOME =
  "font-semibold text-base";

// Info secundária do card
export const CATEGORIA_CARD_INFO =
  "text-sm opacity-70";

// Mensagem auxiliar (vazio, carregando, etc)
export const CATEGORIA_AUX =
  "col-span-full text-center text-gray-500 py-4 text-base";