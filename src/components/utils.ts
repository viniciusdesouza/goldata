import countries from "i18n-iso-countries";
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
countries.registerLocale(require("i18n-iso-countries/langs/pt.json"));
countries.registerLocale(require("i18n-iso-countries/langs/es.json"));

const countryNameExceptions: Record<string, string> = {
  "World": "🌎",
  "England": "GB",
  "South-Korea": "KR",
  "South Korea": "KR",
  "USA": "US",
  "United States": "US",
};

function getCountryISO2(name: string): string | undefined {
  if (!name) return undefined;

  const exception = countryNameExceptions[name.trim()];
  if (exception) return exception;

  // Busca em vários idiomas e variações
  let code =
    countries.getAlpha2Code(name.trim(), "en") ||
    countries.getAlpha2Code(name.trim(), "pt") ||
    countries.getAlpha2Code(name.trim(), "es");

  // Tenta remover hífens
  if (!code && name.includes("-")) {
    const noHyphen = name.replace(/-/g, " ");
    code =
      countries.getAlpha2Code(noHyphen, "en") ||
      countries.getAlpha2Code(noHyphen, "pt") ||
      countries.getAlpha2Code(noHyphen, "es");
  }

  return code;
}

export function countryToFlagEmoji(country: string) {
  if (!country) return "";
  let code = getCountryISO2(country);
  if (code === "🌎" || code === "World") return "🌎";
  if (!code) return country; // fallback: exibe o nome original se não encontrar
  if (code.length !== 2) return code;
  return String.fromCodePoint(
    0x1f1e6 + code.toUpperCase().charCodeAt(0) - 65,
    0x1f1e6 + code.toUpperCase().charCodeAt(1) - 65
  );
}