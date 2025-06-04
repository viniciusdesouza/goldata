"use client";
import { ptBR } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { useMemo } from "react";

/**
 * Adicione este CSS ao seu globals.css (ou equivalente) para o destaque:
 * 
 * .calendar-selected {
 *   background-color: #2563eb !important;   // Azul preenchido
 *   color: #fff !important;
 *   font-weight: 700;
 *   border-radius: 9999px !important;
 *   border: none !important;
 *   box-shadow: 0 1px 3px #0001;
 * }
 * .calendar-today {
 *   border: 1.5px solid #93c5fd !important; // Azul claro
 *   background-color: #fff !important;
 *   color: #2563eb !important;
 *   font-weight: 700;
 *   border-radius: 9999px !important;
 * }
 * .calendar-hover:not(.calendar-selected):not(.calendar-today) {
 *   background-color: #e0e7ff !important;   // Azul lilás sutil
 *   color: #1e40af !important;
 *   border-radius: 9999px !important;
 * }
 */

type CalendarCustomProps = {
  selected: Date;
  onSelect: (date: Date) => void;
};

export default function CalendarCustom({ selected, onSelect }: CalendarCustomProps) {
  const selectedLabel = useMemo(() =>
    selected ? format(selected, "'Data selecionada:' dd/MM/yyyy", { locale: ptBR }) : null,
    [selected]
  );

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <div className="flex items-center space-x-2 mb-2">
        <span className="inline-block bg-blue-50 text-blue-800 rounded-md px-4 py-1 font-medium shadow-sm border border-blue-200 text-sm">
          {selectedLabel}
        </span>
      </div>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        locale={ptBR}
        weekStartsOn={0}
        showOutsideDays
        modifiers={{
          today: new Date(),
        }}
        modifiersClassNames={{
          today: "calendar-today",
          selected: "calendar-selected",
          hover: "calendar-hover"
        }}
        className="rounded-md border shadow p-2 bg-white"
        styles={{
          caption: { textAlign: "center", fontWeight: "bold", color: "#2563eb" },
          table: { width: "100%" },
          head_row: { backgroundColor: "#eff6ff" },
          row: {},
          cell: { minWidth: 36, minHeight: 36, cursor: "pointer" },
        }}
      />
    </div>
  );
}