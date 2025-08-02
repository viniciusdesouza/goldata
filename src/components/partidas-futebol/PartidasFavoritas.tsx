"use client";
import { useFavoritos } from "./FavoritosContext";
import { useEffect, useState } from "react";
import MatchItem from "./MatchItem";
import EmptySeguindoMessage from "./EmptySeguindoMessage";

// --- Definição de Tipos ---
// CORREÇÃO: Usando a mesma interface 'Match' detalhada que o componente MatchItem espera.
interface Match {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
      long: string; // Propriedade que estava faltando
      elapsed?: number;
      extra?: number;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    season: number;
    round: string;
  };
  teams: {
    home: { id: number; name: string; logo: string };
    away: { id: number; name: string; logo: string };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}

// --- Funções Utilitárias ---
// Movidas para dentro do arquivo para evitar erros de importação.
const countryNameToCode: Record<string, string> = {
  Brazil: "BR", England: "GB", Spain: "ES", Italy: "IT", Germany: "DE", France: "FR", World: "🌍",
};

function countryToFlagEmoji(countryName: string): string {
  const code = countryNameToCode[countryName];
  if (!code) return "🏳️";
  if (code.length > 2) return code;
  const codePoints = code.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function getCountryFlagUrl(countryName?: string): string | null {
    if (!countryName) return null;
    const code = countryNameToCode[countryName];
    if (code && code.length === 2) {
        return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
    }
    return null;
}

export default function PartidasFavoritas({
  EmptyComponent,
}: {
  EmptyComponent?: React.ReactNode;
} = {}) {
  const { favoritos } = useFavoritos();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!favoritos.length) {
      setMatches([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    fetch(`/api/football/partidas-futebol/fixturesByIds?ids=${favoritos.join(",")}`)
      .then(res => res.json())
      .then(data => setMatches(Array.isArray(data.response) ? data.response : []))
      .finally(() => setLoading(false));
  }, [favoritos]);

  function groupMatchesByCountry(matchesList: Match[]): Record<string, Match[]> {
    const grouped: Record<string, Match[]> = {};
    for (const match of matchesList) {
      const country = match.league.country || "Desconhecido";
      if (!grouped[country]) {
        grouped[country] = [];
      }
      grouped[country].push(match);
    }
    return grouped;
  }
  const grouped = groupMatchesByCountry(matches);

  if (loading) {
    return (
      <div className="border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl mt-2 p-4 w-full max-w-[850px] mx-auto">
        <div className="text-blue-800 dark:text-blue-200 text-center py-10 font-semibold">
          Carregando partidas favoritas...
        </div>
      </div>
    );
  }

  if (favoritos.length === 0 || matches.length === 0) {
    return EmptyComponent || (
      <EmptySeguindoMessage title="Nenhuma partida favorita.">
        Salve partidas para acompanhar aqui!
      </EmptySeguindoMessage>
    );
  }

  return (
    <div className="space-y-6 w-full pb-16">
      {Object.entries(grouped).map(([country, matches]) => {
        const flagUrl = getCountryFlagUrl(country);
        return (
          <div
            key={country}
            className="border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl mt-2 p-4 w-full max-w-[850px] mx-auto shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3 mt-1 px-1">
              {flagUrl ? (
                <img
                  src={flagUrl}
                  alt={country}
                  className="w-6 h-auto rounded border border-zinc-200 dark:border-zinc-700"
                />
              ) : (
                <span className="text-lg">{countryToFlagEmoji(country)}</span>
              )}
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-lg">{country}</span>
            </div>
            <ul className="flex flex-col">
              {matches.map((match, idx) => (
                <li key={match.fixture.id}>
                  <MatchItem match={match} showFavoritos={true} />
                  {matches.length > 1 && idx < matches.length - 1 && (
                    <div className="w-full h-px my-3 bg-zinc-200 dark:bg-zinc-800" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
