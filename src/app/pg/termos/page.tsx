export default function TermosPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Termos de Uso</h1>
      <p className="mb-4 text-zinc-700 dark:text-zinc-300">
        Ao acessar e utilizar este site, você concorda com os termos e condições abaixo:
      </p>
      <ul className="list-disc pl-5 mb-4 text-zinc-700 dark:text-zinc-300">
        <li>O conteúdo do site é fornecido apenas para fins informativos e não deve ser utilizado para apostas.</li>
        <li>Os dados exibidos são provenientes de terceiros (API-Football) e podem sofrer alterações sem aviso prévio.</li>
        <li>É proibida a reprodução não autorizada do conteúdo, exceto para uso pessoal e não comercial.</li>
        <li>Não nos responsabilizamos por eventuais falhas ou indisponibilidade do serviço.</li>
        <li>Reservamo-nos o direito de modificar os termos a qualquer momento.</li>
      </ul>
      <p className="mb-4 text-zinc-700 dark:text-zinc-300">
        Para dúvidas ou solicitações, utilize nossa página de contato.
      </p>
    </main>
  );
}