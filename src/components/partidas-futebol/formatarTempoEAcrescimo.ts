export type TempoAcrescimo = {
  tempo: string;        // Ex: 45', 45+2', 90+4', Intervalo, Encerrado, Programada
  acrescimo?: string;   // Ex: "+2 de acréscimo"
  rawElapsed: number;
  rawExtra?: number;
  statusShort: string;
};

/**
 * Formata o tempo e o acréscimo de acordo com o status do jogo e dados oficiais da API-Football.
 */
export function formatarTempoEAcrescimo(
  elapsed: number | null | undefined,
  extra: number | null | undefined,
  statusShort: string
): TempoAcrescimo {
  elapsed = Number(elapsed) || 0;
  extra = Number(extra) || 0;
  let tempo = "-";
  let acrescimo: string | undefined = undefined;

  // Pré-jogo
  if (statusShort === "NS" || statusShort === "TBD") {
    tempo = "Programada";
    return { tempo, rawElapsed: elapsed, rawExtra: extra, statusShort };
  }

  // Pênaltis
  if (statusShort === "P") {
    tempo = "Pênaltis";
    return { tempo, rawElapsed: elapsed, rawExtra: extra, statusShort };
  }

  // Intervalo
  if (statusShort === "HT") {
    tempo = "Intervalo";
    return { tempo, rawElapsed: elapsed, rawExtra: extra, statusShort };
  }

  // Finalizado
  if (["FT", "AET", "PEN", "FT_PEN"].includes(statusShort)) {
    if (elapsed >= 105) { // prorrogação
      tempo = extra > 0 ? `120+${extra}'` : `120'`;
    } else if (elapsed >= 90) { // tempo normal
      tempo = extra > 0 ? `90+${extra}'` : `90'`;
    } else if (elapsed > 0) {
      tempo = `${elapsed}'`;
    } else {
      tempo = "Encerrado";
    }
    return { tempo, rawElapsed: elapsed, rawExtra: extra, statusShort };
  }

  // Durante o jogo ao vivo (1º tempo)
  if (statusShort === "1H" || statusShort === "LIVE" || statusShort === "IN_PROGRESS") {
    if (elapsed <= 45) {
      tempo = `${elapsed}'`;
    } else {
      // acréscimo 1º tempo
      tempo = `45+${extra > 0 ? extra : elapsed - 45}'`;
      if (extra > 0) acrescimo = `+${extra} de acréscimo`;
    }
    return { tempo, acrescimo, rawElapsed: elapsed, rawExtra: extra, statusShort };
  }

  // Durante o jogo ao vivo (2º tempo)
  if (statusShort === "2H") {
    if (elapsed <= 90) {
      tempo = `${elapsed}'`;
    } else {
      // acréscimo 2º tempo
      tempo = `90+${extra > 0 ? extra : elapsed - 90}'`;
      if (extra > 0) acrescimo = `+${extra} de acréscimo`;
    }
    return { tempo, acrescimo, rawElapsed: elapsed, rawExtra: extra, statusShort };
  }

  // Prorrogação
  if (statusShort === "ET") {
    if (elapsed <= 105) {
      tempo = `${elapsed}'`;
    } else if (elapsed > 105 && elapsed <= 120) {
      tempo = `105+${extra > 0 ? extra : elapsed - 105}'`;
      if (extra > 0) acrescimo = `+${extra} de acréscimo`;
    } else if (elapsed > 120) {
      tempo = `120+${extra > 0 ? extra : elapsed - 120}'`;
      if (extra > 0) acrescimo = `+${extra} de acréscimo`;
    }
    return { tempo, acrescimo, rawElapsed: elapsed, rawExtra: extra, statusShort };
  }

  // Fallback
  tempo = elapsed > 0 ? `${elapsed}'` : "-";
  return { tempo, rawElapsed: elapsed, rawExtra: extra, statusShort };
}