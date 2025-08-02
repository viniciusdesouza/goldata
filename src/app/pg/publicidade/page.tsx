export default function PublicidadePage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Publicidade</h1>
      <p className="mb-4 text-zinc-700 dark:text-zinc-300">
        Promova sua marca para um público apaixonado por futebol!
      </p>
      <ul className="list-disc pl-5 mb-4 text-zinc-700 dark:text-zinc-300">
        <li>
          <strong>Formatos disponíveis:</strong> banners, publieditoriais, posts patrocinados e integrações especiais.
        </li>
        <li>
          <strong>Mídia kit completo:</strong> solicite pelo e-mail <a href="mailto:publicidade@seudominio.com" className="text-blue-600 dark:text-blue-400 underline">publicidade@seudominio.com</a>.
        </li>
        <li>
          <strong>Parcerias e projetos personalizados:</strong> Fale conosco!
        </li>
      </ul>
      <p className="mb-4 text-zinc-700 dark:text-zinc-300">
        Todos os anúncios são avaliados para garantir a melhor experiência ao usuário.
      </p>
      <p className="mb-4 text-zinc-700 dark:text-zinc-300">
        <a href="/contato" className="text-blue-600 dark:text-blue-400 underline font-medium">Entre em contato</a> para saber mais.
      </p>
    </main>
  );
}