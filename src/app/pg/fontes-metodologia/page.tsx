export default function FontesMetodologiaPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Fontes e Metodologia</h1>
      <p className="mb-4 text-zinc-700 dark:text-zinc-300">
        Todas as informações e estatísticas disponíveis neste site são obtidas principalmente através da <a href="https://www.api-football.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">API-Football</a>, uma das maiores bases de dados sobre futebol do mundo.
      </p>
      <p className="mb-4 text-zinc-700 dark:text-zinc-300">
        Os dados são atualizados automaticamente em intervalos regulares, garantindo informações recentes sobre jogos, clubes, jogadores e campeonatos.
      </p>
      <p className="mb-4 text-zinc-700 dark:text-zinc-300">
        As estatísticas são processadas e exibidas conforme os dados recebidos da API, podendo haver pequenas diferenças em relação a outras fontes oficiais devido a critérios de contagem ou atualização.
      </p>
      <p className="mb-4 text-zinc-700 dark:text-zinc-300">
        Para saber mais sobre a metodologia ou sugerir melhorias, entre em contato conosco.
      </p>
    </main>
  );
}