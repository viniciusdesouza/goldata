import { parseISO, format, isToday, isTomorrow, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";

// statusShort: "NS", "1H", "2H", "HT", "FT", etc
export function formatarDataPartida(_statusShort: string, dateISO: string) {
  const data = parseISO(dateISO);

  let prefixo = "";
  if (isToday(data)) {
    prefixo = "hoje";
  } else if (isTomorrow(data)) {
    prefixo = "amanhã";
  } else if (isYesterday(data)) {
    prefixo = "ontem";
  } else {
    // ex: "Sex"
    prefixo = format(data, "EEE", { locale: ptBR });
  }

  const diaMes = format(data, "dd/MM");

  // Capitaliza a primeira letra do prefixo (inclui dias da semana)
  if (prefixo.length > 0) {
    prefixo = prefixo.charAt(0).toUpperCase() + prefixo.slice(1);
  }

  // Apenas retorna o prefixo e a data (sem status de jogo)
  return `${prefixo}, ${diaMes}`;
}