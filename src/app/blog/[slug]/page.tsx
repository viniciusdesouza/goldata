import { getPostData, getSortedPostsData } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { ContainerPage } from '@/app/Containers-Categorias-Home';
import type { Metadata } from 'next';

// Define o tipo para os parâmetros da página e metadados
type Props = {
  params: { slug: string };
};

// Define a estrutura de dados para o resumo de um post
interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
}

// A busca de dados pode ser assíncrona
export async function generateStaticParams() {
  // Informamos ao TS que a função retorna uma lista de PostSummary
  const posts = await getSortedPostsData() as PostSummary[];
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// CORREÇÃO: Aplicamos o tipo PostSummary para que o TS reconheça 'title' e 'excerpt'
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const posts = await getSortedPostsData() as PostSummary[];
  const post = posts.find(p => p.slug === params.slug);
  
  if (!post) {
    return { title: 'Post Não Encontrado' };
  }
  
  // Agora o TypeScript sabe que 'post.title' e 'post.excerpt' existem.
  return { title: post.title, description: post.excerpt };
}

// A função principal já estava correta, mas usamos 'Props' para consistência
export default async function Post({ params }: Props) {
  const postData = await getPostData(params.slug);

  if (!postData) {
    notFound();
  }

  return (
    <ContainerPage className="py-8">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-zinc-900 dark:text-zinc-100">
            {postData.frontmatter.title}
          </h1>
          <div className="text-gray-500 dark:text-gray-400">
            <p>Por {postData.frontmatter.author}</p>
            <time dateTime={postData.frontmatter.date}>
              {new Date(postData.frontmatter.date).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </div>
        </header>

        <div className="prose dark:prose-invert max-w-none">
          {postData.content}
        </div>
      </article>
    </ContainerPage>
  );
}
