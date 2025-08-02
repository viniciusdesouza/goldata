export default function FaqPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Perguntas Frequentes (FAQ)</h1>
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Como os dados do site são atualizados?</h2>
        <p className="mb-4 text-zinc-700 dark:text-zinc-300">
          As informações são atualizadas automaticamente a partir da API-Football, normalmente a cada poucos minutos.
        </p>
        <h2 className="font-semibold mb-2">Preciso me cadastrar para usar o site?</h2>
        <p className="mb-4 text-zinc-700 dark:text-zinc-300">
          Não! Todos os recursos principais são gratuitos e não exigem cadastro.
        </p>
        <h2 className="font-semibold mb-2">Posso usar as estatísticas do site comercialmente?</h2>
        <p className="mb-4 text-zinc-700 dark:text-zinc-300">
          O uso comercial não é permitido sem autorização prévia. Para parcerias, entre em contato.
        </p>
        <h2 className="font-semibold mb-2">Os dados servem para apostas?</h2>
        <p className="mb-4 text-zinc-700 dark:text-zinc-300">
          O site é apenas informativo e não incentiva ou endossa nenhum tipo de aposta.
        </p>
        <h2 className="font-semibold mb-2">Como posso sugerir melhorias?</h2>
        <p className="mb-4 text-zinc-700 dark:text-zinc-300">
          Use a página de contato para enviar sugestões, críticas ou reportar erros.
        </p>
      </div>
    </main>
  );
}