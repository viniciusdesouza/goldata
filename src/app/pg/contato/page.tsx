export default function ContatoPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Contato</h1>
      <p className="mb-4 text-zinc-700 dark:text-zinc-300">
        Tem dúvidas, sugestões, críticas ou encontrou algum erro? Fale conosco!
      </p>
      <ul className="mb-6 text-zinc-700 dark:text-zinc-300">
        <li>
          <strong>E-mail:</strong> <a href="mailto:contato@seudominio.com" className="text-blue-600 dark:text-blue-400 underline">contato@seudominio.com</a>
        </li>
      </ul>
      <p className="mb-2 text-zinc-700 dark:text-zinc-300">
        Em breve, disponibilizaremos um formulário de contato nesta página.
      </p>
    </main>
  );
}