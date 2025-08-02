import { useEffect, useState } from "react";
import { getClassificacao, getArtilheiros, getJogosRecentes } from "../lib/api/brasileirao";

export interface ClubeClassificacao {
  pos: number;
  clube: string;
  pontos: number;
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  golsPro: number;
  golsContra: number;
  saldo: number;
}

export interface Artilheiro {
  jogador: string;
  clube: string;
  gols: number;
}

export interface Jogo {
  data: string;
  casa: string;
  fora: string;
  placar: string;
}

export function useBrasileirao(ano: number) {
  const [classificacao, setClassificacao] = useState<ClubeClassificacao[]>([]);
  const [artilheiros, setArtilheiros] = useState<Artilheiro[]>([]);
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    setErro("");
    Promise.all([
      getClassificacao(ano),
      getArtilheiros(ano),
      getJogosRecentes(ano)
    ])
      .then(([c, a, j]) => {
        setClassificacao(c);
        setArtilheiros(a);
        setJogos(j);
      })
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false));
  }, [ano]);

  return { classificacao, artilheiros, jogos, loading, erro };
}