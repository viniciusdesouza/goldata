/**
 * Retorna o minuto formatado e o texto de acréscimo (se houver).
 * Exemplo: { minuto: "90+3'", acrescimo: "+3 de acréscimo" }
 */
export function getMinutoEAcrescimoDisplay(
  elapsed: number | null | undefined,
  extra: number | null | undefined,
  short: string
): { minuto: string; acrescimo: string } {
  elapsed = elapsed ?? 0;
  extra = extra ?? 0;

  let minuto = "-";
  let acrescimoTexto = "";

  // Finalizado: mostrar minuto final, sem aviso de acréscimo
  if (["FT", "AET", "PEN", "FT_PEN"].includes(short)) {
    if (elapsed >= 90) {
      minuto = extra > 0 ? `90+${extra}'` : `${elapsed}'`;
    } else if (elapsed > 105) {
      minuto = extra > 0 ? `120+${extra}'` : `${elapsed}'`;
    } else {
      minuto = "Encerrado";
    }
    return { minuto, acrescimo: "" };
  }

  // 2º Tempo AO VIVO, com acréscimo
  if (short === "2H" && elapsed > 90) {
    const minutosAcrescimo = extra || (elapsed - 90);
    minuto = `90+${minutosAcrescimo}'`;
    if (minutosAcrescimo > 0) {
      acrescimoTexto = `+${minutosAcrescimo} de acréscimo`;
    }
    return { minuto, acrescimo: acrescimoTexto };
  }

  // 1º Tempo AO VIVO, com acréscimo
  if ((short === "1H" || short === "LIVE" || short === "IN_PROGRESS") && elapsed > 45) {
    const minutosAcrescimo = extra || (elapsed - 45);
    minuto = `45+${minutosAcrescimo}'`;
    if (minutosAcrescimo > 0) {
      acrescimoTexto = `+${minutosAcrescimo} de acréscimo`;
    }
    return { minuto, acrescimo: acrescimoTexto };
  }

  // Normal
  if (short === "1H" || short === "LIVE" || short === "IN_PROGRESS") {
    minuto = `${elapsed}'`;
    return { minuto, acrescimo: "" };
  }
  if (short === "2H") {
    minuto = `${elapsed}'`;
    return { minuto, acrescimo: "" };
  }
  if (short === "HT") return { minuto: "Intervalo", acrescimo: "" };
  if (short === "ET") {
    if (elapsed > 105 && elapsed <= 120) {
      const minutosAcrescimo = extra || (elapsed - 105);
      minuto = `105+${minutosAcrescimo}'`;
      if (minutosAcrescimo > 0) acrescimoTexto = `+${minutosAcrescimo} de acréscimo`;
      return { minuto, acrescimo: acrescimoTexto };
    }
    if (elapsed > 120) {
      const minutosAcrescimo = extra || (elapsed - 120);
      minuto = `120+${minutosAcrescimo}'`;
      if (minutosAcrescimo > 0) acrescimoTexto = `+${minutosAcrescimo} de acréscimo`;
      return { minuto, acrescimo: acrescimoTexto };
    }
    minuto = `${elapsed}'`;
    return { minuto, acrescimo: "" };
  }
  if (short === "P") return { minuto: "Pênaltis", acrescimo: "" };
  if (short === "NS") return { minuto: "Programada", acrescimo: "" };

  return { minuto, acrescimo: "" };
}