export interface Match {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
      long: string;
      elapsed?: number;
      extra?: number;
    };
    venue?: { name?: string; city?: string };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    season?: number; // opcional para evitar conflito
    round: string;
  };
  teams: {
    home: { name: string; logo: string; id?: number };
    away: { name: string; logo: string; id?: number };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}