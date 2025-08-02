// Padrão único para área de categorias e listas (clubes, campeonatos, jogadores, partidas-futebol)

// Container principal centralizado da página de categorias
export const CATEGORIA_CONTAINER =
  "w-full max-w-4xl mx-auto px-4 sm:px-8 flex flex-col items-center";

// Grid: 2 colunas no desktop, 1 no mobile, espaçamento visual confortável
export const CATEGORIA_GRID =
  "grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 w-full mt-3";

// Título da página de categoria
export const CATEGORIA_TITULO =
  "text-2xl font-bold mb-6 mt-2 text-center";

// Wrapper dos filtros (busca, selects, botões)
export const CATEGORIA_FILTROS =
  "flex flex-wrap gap-1 justify-center mb-3";

// Input/select dos filtros
export const CATEGORIA_INPUT =
  "rounded-xl border border-gray-300 dark:border-gray-700 px-2 py-1 bg-white dark:bg-gray-900 text-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-500 h-9";

// Botão dos filtros
export const CATEGORIA_BOTAO =
  "px-3 py-1 rounded-xl text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:bg-green-50 dark:hover:bg-green-900 transition h-9";

// Card padrão (linha, logo à esquerda, nome à direita), 100% da coluna, compacto
export const CATEGORIA_CARD =
  "flex items-center gap-3 border border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 rounded-lg shadow-sm px-4 py-2 transition hover:border-blue-500 dark:hover:border-blue-400 w-full min-h-[46px]";

// Imagem/logo do card menor
export const CATEGORIA_CARD_IMG =
  "w-9 h-9 object-contain";

// Nome principal do card
export const CATEGORIA_CARD_NOME =
  "font-semibold text-base";

// Info secundária do card (país, posição, etc)
export const CATEGORIA_CARD_INFO =
  "text-sm opacity-70";

// Mensagem auxiliar (vazio, carregando, etc)
export const CATEGORIA_AUX =
  "col-span-full text-center text-gray-500 py-4 text-base";