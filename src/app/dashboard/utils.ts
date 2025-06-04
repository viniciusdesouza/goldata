export function countryToFlagEmoji(country: string) {
  if (!country) return "";
  const codePoints = country
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export function statusColors(status: string) {
  switch (status) {
    case "FT":
      return "text-green-700";
    case "NS":
      return "text-gray-600";
    case "1H":
    case "2H":
    case "LIVE":
      return "text-red-600 animate-pulse";
    default:
      return "text-gray-700";
  }
}

export function statusText(status: string) {
  switch (status) {
    case "FT":
      return "Encerrado";
    case "NS":
      return "Não iniciado";
    case "1H":
      return "1º Tempo";
    case "2H":
      return "2º Tempo";
    case "LIVE":
      return "Ao Vivo";
    default:
      return status;
  }
}

export function oddsToProbabilities(oddsObj: any) {
  // oddsObj.bookmakers[0].bets[0].values: [{value: "Home", odd: "2.10"}, ...]
  if (!oddsObj || !oddsObj.bookmakers?.length) return null;
  const bookmaker = oddsObj.bookmakers[0];
  const oddsBet = bookmaker.bets.find(
    (b: any) =>
      b.name === "Match Winner" ||
      b.name === "Resultado Final" ||
      b.name === "1X2"
  );
  if (!oddsBet) return null;
  let oddHome: number | undefined, oddDraw: number | undefined, oddAway: number | undefined;
  for (const item of oddsBet.values) {
    if (item.value === "Home" || item.value === "1") oddHome = Number(item.odd);
    else if (item.value === "Draw" || item.value === "X") oddDraw = Number(item.odd);
    else if (item.value === "Away" || item.value === "2") oddAway = Number(item.odd);
  }
  if (!(oddHome && oddDraw && oddAway)) return null;
  const probHome = 100 / oddHome;
  const probDraw = 100 / oddDraw;
  const probAway = 100 / oddAway;
  const total = probHome + probDraw + probAway;
  return {
    home: (probHome / total) * 100,
    draw: (probDraw / total) * 100,
    away: (probAway / total) * 100,
  };
}