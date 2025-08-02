import { useEffect, useRef } from "react";

type Callback<T> = (data: T) => void;
type Fetcher<T> = () => Promise<T>;
type ShouldPoll<T> = (data: T) => boolean;

/**
 * Requisições automáticas para atualizações ao vivo.
 * @param fetcher - função para buscar dados
 * @param callback - chamada com os dados retornados
 * @param deps - dependências para novo fetch (ex: filtros, busca)
 * @param intervalMs - intervalo em ms (default: 15s)
 * @param shouldPoll - opcional: só faz polling se retornar true
 */
export function useLivePolling<T>(
  fetcher: Fetcher<T>,
  callback: Callback<T>,
  deps: unknown[] = [],
  intervalMs = 15000,
  shouldPoll?: ShouldPoll<T>
) {
  const latestData = useRef<T | null>(null);

  useEffect(() => {
    let mounted = true;

    const poll = async () => {
      try {
        const data = await fetcher();
        if (mounted) {
          callback(data);
          latestData.current = data;
        }
      } catch {}
    };

    poll(); // inicial

    let interval: NodeJS.Timeout | null = null;

    interval = setInterval(async () => {
      // Se não precisa pollling, não faz
      if (shouldPoll && latestData.current && !shouldPoll(latestData.current)) return;
      await poll();
    }, intervalMs);

    return () => {
      mounted = false;
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line
  }, deps);
}