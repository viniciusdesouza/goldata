export interface Clube {
  id: string | number;
  nome: string;
  logo?: string;
  pais?: string;
}

export async function getClubeByNome(query: string): Promise<Clube[]> {
  const res = await fetch(`/api/football/pesquisa-clubes/teams?search=${encodeURIComponent(query)}`)
    .then(res => res.json());

  return (
    res?.response?.map((c: any) => ({
      id: c.team?.id ?? c.id,
      nome: c.team?.name ?? c.name,
      logo: c.team?.logo ?? c.logo,
      pais: c.team?.country ?? c.country,
    })) ?? []
  );
}