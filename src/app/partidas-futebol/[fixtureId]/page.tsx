"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useCompartilhadosRecebidos } from "@/components/partidas-futebol/CompartilhadosRecebidosContext";

// Opcional: mostre mensagem de loading enquanto processa o compartilhamento
export default function PartidaCompartilhadaPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { adicionarCompartilhadoRecebido } = useCompartilhadosRecebidos();

  useEffect(() => {
    // CORREÇÃO: Acessando 'params' de forma segura com optional chaining (?.)
    const fixtureIdParam = params?.fixtureId;
    const shared = searchParams?.get("shared");

    if (shared === "1" && fixtureIdParam) {
      const fixtureId = Number(fixtureIdParam);
      
      // Garante que o ID é um número válido antes de usar
      if (!isNaN(fixtureId) && fixtureId > 0) {
        adicionarCompartilhadoRecebido(fixtureId);
        router.replace(`/?tab=compartilhados&subtab=compartilhadosComVoce`);
      } else {
        // Redireciona para a home se o ID for inválido
        router.replace('/');
      }
    } else {
      // Redireciona para a home se os parâmetros não estiverem corretos
      router.replace('/');
    }
    // Usar o objeto 'params' inteiro na dependência é a prática recomendada
  }, [params, searchParams, adicionarCompartilhadoRecebido, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="text-center p-10">
        <p className="text-lg font-medium text-cyan-600 dark:text-cyan-400 animate-pulse">
          Adicionando partida compartilhada à sua lista...
        </p>
      </div>
    </div>
  );
}
