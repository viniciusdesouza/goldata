import React from "react";

interface TemporadaSelectProps {
  temporadas: number[];
  temporadaAtual: number;
  onChange: (temporada: number) => void;
  disabled?: boolean;
}

const TemporadaSelect: React.FC<TemporadaSelectProps> = ({
  temporadas,
  temporadaAtual,
  onChange,
  disabled,
}) => {
  if (!temporadas || temporadas.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="temporada-select" className="font-semibold text-sm">
        Temporada:
      </label>
      <select
        id="temporada-select"
        className="border border-gray-200 dark:border-zinc-700 rounded-[6px] px-2 py-1 bg-white dark:bg-zinc-900"
        value={temporadaAtual}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
      >
        {temporadas
          .slice()
          .sort((a, b) => b - a)
          .map((temporada) => (
            <option value={temporada} key={temporada}>
              {temporada}
            </option>
          ))}
      </select>
    </div>
  );
};

export default TemporadaSelect;