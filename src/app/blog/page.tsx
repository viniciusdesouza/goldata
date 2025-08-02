import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';
import { ContainerPage, ContainerSection } from '@/app/Containers-Categorias-Home';

// Define a estrutura de dados para o resumo de um post
interface PostSummary {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category?: string; // Adicionando a propriedade opcional 'category'
}

export default function BlogPage({
  searchParams,
}: {
  searchParams: { tab: string };
}) {
  // Aplicamos o tipo para que o TypeScript conheça todas as propriedades
  const allPosts = getSortedPostsData() as PostSummary[];
  const currentTab = searchParams.tab || 'todos';

  const filteredPosts = allPosts.filter(post => {
    if (currentTab === 'todos') return true;
    // Agora o TypeScript sabe que 'post.category' existe e o erro é resolvido.
    if (currentTab === 'artigos') return post.category?.toLowerCase() === 'artigo';
    if (currentTab === 'noticias') return post.category?.toLowerCase() === 'notícia';
    return true;
  });

  return (
    <ContainerPage className="py-8">
      <h1 className="text-4xl font-bold mb-8 text-zinc-900 dark:text-zinc-100">
        Blog: {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
      </h1>

      <div className="grid gap-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(({ slug, title, date, excerpt }) => (
            <Link href={`/blog/${slug}`} key={slug}>
              <ContainerSection className="dark:bg-zinc-900 hover:border-blue-500 dark:hover:border-blue-500 transition-colors duration-200">
                <h2 className="text-2xl font-semibold mb-2 text-zinc-900 dark:text-zinc-100">{title}</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  {new Date(date).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-gray-700 dark:text-gray-300">{excerpt}</p>
              </ContainerSection>
            </Link>
          ))
        ) : (
          <p>Nenhuma publicação encontrada nesta categoria.</p>
        )}
      </div>
    </ContainerPage>
  );
}
