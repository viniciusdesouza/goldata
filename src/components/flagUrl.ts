// Este utilitário retorna a URL da bandeira pelo nome do país.
// Troque pelo CDN/API que preferir. Aqui uso o flagcdn.com (SVGs oficiais).
export function getCountryFlagUrl(countryName: string) {
  if (!countryName) return "";
  // Mapeamento de exceções para nomes diferentes do padrão ISO (adicione se precisar)
  const nameExceptions: Record<string, string> = {
    "England": "gb-eng",
    "Scotland": "gb-sct",
    "Wales": "gb-wls",
    "Northern Ireland": "gb-nir",
    "USA": "us",
    "United States": "us",
    "South Korea": "kr",
    "Ivory Coast": "ci",
    "Czech Republic": "cz",
    "Republic of Ireland": "ie",
    // ...
  };
  let code = nameExceptions[countryName];
  if (!code) {
    // flagcdn usa iso2 minúsculo. Use i18n-iso-countries para obter o código ISO:
    try {
      const countries = require("i18n-iso-countries");
      countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
      code = countries.getAlpha2Code(countryName, "en")?.toLowerCase();
    } catch {}
  }
  if (!code) return "";
  return `https://flagcdn.com/w40/${code}.png`;
}