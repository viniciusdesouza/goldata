// Estrutura de tipo para cada campeonato
interface Campeonato {
  league: {
    id: number;
    name: string;
    type: string;
    logo: string;
  };
  country: {
    name: string;
    code: string | null;
    flag: string | null;
  };
}

// Lista estática com os dados completos dos principais campeonatos.
// Isso torna a API de busca e filtro instantânea, sem precisar de chamadas externas.
export const MAIORES_CAMPEONATOS: Campeonato[] = [
  {
    league: { id: 71, name: "Brasileirão Série A", type: "League", logo: "https://media.api-sports.io/football/leagues/71.png" },
    country: { name: "Brazil", code: "BR", flag: "https://media.api-sports.io/flags/br.svg" }
  },
  {
    league: { id: 39, name: "Premier League", type: "League", logo: "https://media.api-sports.io/football/leagues/39.png" },
    country: { name: "England", code: "GB", flag: "https://media.api-sports.io/flags/gb.svg" }
  },
  {
    league: { id: 140, name: "La Liga", type: "League", logo: "https://media.api-sports.io/football/leagues/140.png" },
    country: { name: "Spain", code: "ES", flag: "https://media.api-sports.io/flags/es.svg" }
  },
  {
    league: { id: 61, name: "Ligue 1", type: "League", logo: "https://media.api-sports.io/football/leagues/61.png" },
    country: { name: "France", code: "FR", flag: "https://media.api-sports.io/flags/fr.svg" }
  },
  {
    league: { id: 78, name: "Bundesliga", type: "League", logo: "https://media.api-sports.io/football/leagues/78.png" },
    country: { name: "Germany", code: "DE", flag: "https://media.api-sports.io/flags/de.svg" }
  },
  {
    league: { id: 135, name: "Serie A", type: "League", logo: "https://media.api-sports.io/football/leagues/135.png" },
    country: { name: "Italy", code: "IT", flag: "https://media.api-sports.io/flags/it.svg" }
  },
  {
    league: { id: 2, name: "UEFA Champions League", type: "Cup", logo: "https://media.api-sports.io/football/leagues/2.png" },
    country: { name: "World", code: null, flag: null }
  },
  {
    league: { id: 3, name: "UEFA Europa League", type: "Cup", logo: "https://media.api-sports.io/football/leagues/3.png" },
    country: { name: "World", code: null, flag: null }
  },
  {
    league: { id: 11, name: "Copa Libertadores", type: "Cup", logo: "https://media.api-sports.io/football/leagues/11.png" },
    country: { name: "World", code: null, flag: null }
  },
  {
    league: { id: 94, name: "Primeira Liga", type: "League", logo: "https://media.api-sports.io/football/leagues/94.png" },
    country: { name: "Portugal", code: "PT", flag: "https://media.api-sports.io/flags/pt.svg" }
  },
  {
    league: { id: 88, name: "Eredivisie", type: "League", logo: "https://media.api-sports.io/football/leagues/88.png" },
    country: { name: "Netherlands", code: "NL", flag: "https://media.api-sports.io/flags/nl.svg" }
  },
  {
    league: { id: 253, name: "Major League Soccer", type: "League", logo: "https://media.api-sports.io/football/leagues/253.png" },
    country: { name: "USA", code: "US", flag: "https://media.api-sports.io/flags/us.svg" }
  },
  {
    league: { id: 281, name: "Liga Profesional", type: "League", logo: "https://media.api-sports.io/football/leagues/128.png" },
    country: { name: "Argentina", code: "AR", flag: "https://media.api-sports.io/flags/ar.svg" }
  },
  {
    league: { id: 72, name: "Brasileirão Série B", type: "League", logo: "https://media.api-sports.io/football/leagues/72.png" },
    country: { name: "Brazil", code: "BR", flag: "https://media.api-sports.io/flags/br.svg" }
  },
  {
    league: { id: 79, name: "2. Bundesliga", type: "League", logo: "https://media.api-sports.io/football/leagues/79.png" },
    country: { name: "Germany", code: "DE", flag: "https://media.api-sports.io/flags/de.svg" }
  },
  {
    league: { id: 40, name: "Championship", type: "League", logo: "https://media.api-sports.io/football/leagues/40.png" },
    country: { name: "England", code: "GB", flag: "https://media.api-sports.io/flags/gb.svg" }
  },
  {
    league: { id: 188, name: "A-League Men", type: "League", logo: "https://media.api-sports.io/football/leagues/188.png" },
    country: { name: "Australia", code: "AU", flag: "https://media.api-sports.io/flags/au.svg" }
  },
  {
    league: { id: 203, name: "Süper Lig", type: "League", logo: "https://media.api-sports.io/football/leagues/203.png" },
    country: { name: "Turkey", code: "TR", flag: "https://media.api-sports.io/flags/tr.svg" }
  },
  {
    league: { id: 180, name: "Premiership", type: "League", logo: "https://media.api-sports.io/football/leagues/180.png" },
    country: { name: "Scotland", code: "GB", flag: "https://media.api-sports.io/flags/gb.svg" }
  },
  {
    league: { id: 4, name: "Euro Championship", type: "Cup", logo: "https://media.api-sports.io/football/leagues/4.png" },
    country: { name: "World", code: null, flag: null }
  }
];
