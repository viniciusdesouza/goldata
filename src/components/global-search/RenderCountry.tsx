import React from "react";

export function RenderCountry({ country }: { country?: any }) {
  if (!country || (!country.name && !country.flag)) return null;
  return (
    <span className="flex items-center gap-1 ml-1 text-xs text-zinc-500">
      {country.flag && (
        <img src={country.flag} alt={country.name} className="w-4 h-4 inline-block" />
      )}
      {country.name}
    </span>
  );
}