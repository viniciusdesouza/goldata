"use client";
import { useState, useMemo } from "react";
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  isToday,
  getYear,
  getMonth,
  subMonths,
  addMonths,
  setMonth,
  setYear,
  startOfMonth,
  endOfMonth,
  subDays,
} from "date-fns";
import { ptBR } from "date-fns/locale";

// Ícones SVG inline para Chevron e Calendário
function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" width={20} height={20} fill="none" {...props}>
      <path d="M10.5 13L6 8L10.5 3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" width={20} height={20} fill="none" {...props}>
      <path d="M5.5 3L10 8L5.5 13" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
      <rect x="2.5" y="4.5" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M2.5 8h15" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

const WEEK_DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function getMonthMatrix(month: Date) {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const matrix: (Date | null)[][] = [];
  let current = startOfWeek(start, { weekStartsOn: 0 });
  while (current <= end) {
    const week: (Date | null)[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(
        current >= start && current <= end ? new Date(current) : null
      );
      current = addDays(current, 1);
    }
    matrix.push(week);
  }
  return matrix;
}

type CalendarCustomProps = {
  selected: Date;
  onSelect: (date: Date) => void;
};

/**
 * Componente de calendário customizado com visual de filtro de data.
 * Mostra linha com chevrons, ícone de calendário e data; clique expande calendário.
 */
export default function CalendarCustom({ selected, onSelect }: CalendarCustomProps) {
  const [expanded, setExpanded] = useState(false);
  const [displayMonth, setDisplayMonth] = useState<Date>(
    new Date(getYear(selected ?? new Date()), getMonth(selected ?? new Date()), 1)
  );
  const currentYear = getYear(new Date());
  const yearList = Array.from({ length: (currentYear + 4) - 1970 + 1 }, (_, i) => 1970 + i);

  const weekStart = startOfWeek(selected ?? new Date(), { weekStartsOn: 0 });
  const weekDays = useMemo(
    () => Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)),
    [weekStart.getTime()]
  );
  const monthMatrix = useMemo(() => getMonthMatrix(displayMonth), [displayMonth.getTime()]);

  // Mudança de dia no cabeçalho rápido
  function handlePrevDay() {
    const prev = subDays(selected, 1);
    onSelect(prev);
    setDisplayMonth(new Date(getYear(prev), getMonth(prev), 1));
  }
  function handleNextDay() {
    const next = addDays(selected, 1);
    onSelect(next);
    setDisplayMonth(new Date(getYear(next), getMonth(next), 1));
  }
  function handleExpand() {
    setExpanded((e) => !e);
    setDisplayMonth(new Date(getYear(selected), getMonth(selected), 1));
  }
  function handlePrevMonth() { setDisplayMonth(prev => subMonths(prev, 1)); }
  function handleNextMonth() { setDisplayMonth(prev => addMonths(prev, 1)); }
  function handleMonthChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setDisplayMonth(prev => setMonth(prev, Number(e.target.value)));
  }
  function handleYearChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setDisplayMonth(prev => setYear(prev, Number(e.target.value)));
  }

  return (
    <div className="w-full flex flex-col items-center relative">
      {/* Cabeçalho compacto: setas, calendário, data, click para expandir */}
      <div
        className={[
          "flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 shadow-sm cursor-pointer transition",
          expanded ? "ring-2 ring-blue-200 dark:ring-blue-900" : ""
        ].join(" ")}
        style={{ minWidth: 0, minHeight: 44, borderRadius: 13 }}
        tabIndex={0}
        onClick={handleExpand}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") handleExpand(); }}
        aria-expanded={expanded}
        title="Selecionar data"
      >
        <button
          type="button"
          className="rounded-full p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          onClick={e => { e.stopPropagation(); handlePrevDay(); }}
          aria-label="Dia anterior"
          tabIndex={0}
        >
          <ChevronLeftIcon />
        </button>
        <span className="flex items-center gap-2 select-none">
          <CalendarIcon className="text-blue-600 dark:text-blue-400" />
          <span className="font-semibold text-base text-black dark:text-white">
            {selected instanceof Date && !isNaN(selected.getTime())
              ? format(selected, "EEEE, dd 'de' MMMM", { locale: ptBR })
              : ""}
          </span>
        </span>
        <button
          type="button"
          className="rounded-full p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          onClick={e => { e.stopPropagation(); handleNextDay(); }}
          aria-label="Próximo dia"
          tabIndex={0}
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Calendário expandido */}
      {expanded && (
        <div
          className="z-20 w-full flex flex-col items-center mt-2"
          style={{ position: "absolute", maxWidth: 360, top: "100%" }}
        >
          <div className="max-w-[360px] w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-lg px-5 pt-4 pb-4"
            style={{ borderRadius: 18 }}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="font-bold text-lg flex items-center gap-1 text-black dark:text-white">
                <CalendarIcon className="inline text-blue-600 dark:text-blue-400" /> Calendário
              </span>
              <button
                onClick={() => setExpanded(false)}
                className="font-bold rounded-lg px-3 py-1 text-sm transition bg-black dark:bg-white text-white dark:text-black shadow"
                type="button"
              >
                Fechar
              </button>
            </div>
            {selected && (
              <div
                className="text-center mx-auto mt-2 mb-1 font-bold rounded-md px-3 py-1 shadow bg-black dark:bg-white text-white dark:text-black inline-block"
                style={{ borderRadius: 9 }}
              >
                {selected instanceof Date && !isNaN(selected.getTime())
                  ? format(selected, "dd MMM yyyy", { locale: ptBR })
                  : ""}
              </div>
            )}

            <div className="flex justify-center items-center gap-2 py-2">
              <button
                className="rounded-full w-9 h-9 flex items-center justify-center text-black dark:text-white font-bold hover:bg-black/90 dark:hover:bg-white/90 hover:text-white dark:hover:text-black transition"
                aria-label="Mês anterior"
                onClick={handlePrevMonth}
                type="button"
              >{"‹"}</button>
              <select
                className="border-none bg-transparent font-bold text-black dark:text-white text-base px-2 py-1 rounded-full focus:bg-zinc-100 dark:focus:bg-zinc-800 cursor-pointer transition"
                value={getMonth(displayMonth)}
                onChange={handleMonthChange}
                style={{ borderRadius: 13 }}
              >
                {MONTHS.map((m, idx) => (
                  <option className="bg-white dark:bg-zinc-900 text-black dark:text-white" key={m} value={idx}>{m}</option>
                ))}
              </select>
              <select
                className="border-none bg-transparent font-bold text-black dark:text-white text-base px-2 py-1 rounded-full focus:bg-zinc-100 dark:focus:bg-zinc-800 cursor-pointer transition"
                value={getYear(displayMonth)}
                onChange={handleYearChange}
                style={{ borderRadius: 13 }}
              >
                {yearList.map((year) => (
                  <option className="bg-white dark:bg-zinc-900 text-black dark:text-white" key={year} value={year}>{year}</option>
                ))}
              </select>
              <button
                className="rounded-full w-9 h-9 flex items-center justify-center text-black dark:text-white font-bold hover:bg-black/90 dark:hover:bg-white/90 hover:text-white dark:hover:text-black transition"
                aria-label="Próximo mês"
                onClick={handleNextMonth}
                type="button"
              >{"›"}</button>
            </div>

            <div className="flex w-full justify-center gap-2 mb-2 mt-1">
              {WEEK_DAYS.map((wd, i) => (
                <div key={wd + i} className="font-bold text-xs text-black dark:text-white w-8 text-center">{wd}</div>
              ))}
            </div>

            <div>
              <div className="flex flex-col gap-2 w-full">
                {monthMatrix.map((week, idx) => (
                  <CalendarWeekRow
                    days={week}
                    key={idx}
                    selected={selected}
                    onSelect={date => {
                      onSelect(date);
                      setExpanded(false);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CalendarWeekRow({
  days,
  selected,
  onSelect,
}: {
  days: (Date | null)[];
  selected: Date;
  onSelect: (date: Date) => void;
}) {
  return (
    <div className="flex w-full justify-center gap-2">
      {days.map((date, idx) => {
        if (!date) {
          return (
            <div
              className="w-9 h-9"
              key={idx}
            ></div>
          );
        }
        const isSelected = selected && isSameDay(selected, date);
        const isTodayDate = isToday(date);
        return (
          <button
            key={date.toISOString()}
            onClick={() => onSelect(date)}
            className={[
              "w-9 h-9 flex items-center justify-center font-semibold text-base transition border-2",
              isSelected
                ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                : isTodayDate
                  ? "border-black dark:border-white text-black dark:text-white"
                  : "text-black dark:text-white border-transparent hover:bg-black/90 dark:hover:bg-white/90 hover:text-white dark:hover:text-black"
            ].join(" ")}
            tabIndex={0}
            type="button"
            style={{ borderRadius: 13 }}
          >
            {format(date, "d")}
          </button>
        );
      })}
    </div>
  );
}