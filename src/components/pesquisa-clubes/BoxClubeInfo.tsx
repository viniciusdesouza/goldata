import React from "react";

interface ClubeInfoProps {
  clube: {
    id: number;
    name: string;
    logo: string;
    founded?: number;
    country?: string;
    stadium?: string;
    city?: string;
    capacity?: number;
    address?: string;
    [key: string]: any;
  } | null;
}

const BoxClubeInfo: React.FC<{ clube: ClubeInfoProps["clube"] }> = ({ clube }) => {
  if (!clube) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-[6px] border border-gray-200 dark:border-zinc-700 p-4">
        <div className="font-semibold mb-2">Informações do Clube</div>
        <div className="text-gray-500 text-sm">
          Nenhum dado disponível para o clube selecionado.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[6px] border border-gray-200 dark:border-zinc-700 p-4 flex flex-col items-center">
      <div className="flex items-center gap-4 mb-2">
        {clube.logo && (
          <img
            src={clube.logo}
            alt={clube.name}
            className="w-16 h-16 rounded-full border bg-white"
          />
        )}
        <div>
          <div className="font-bold text-2xl">{clube.name}</div>
          {clube.country && (
            <div className="text-gray-500 dark:text-gray-300 text-sm">
              {clube.country}
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 w-full max-w-md">
        {clube.founded && (
          <div>
            <span className="font-semibold">Fundado:</span>{" "}
            {clube.founded}
          </div>
        )}
        {clube.stadium && (
          <div>
            <span className="font-semibold">Estádio:</span>{" "}
            {clube.stadium}
          </div>
        )}
        {clube.city && (
          <div>
            <span className="font-semibold">Cidade:</span> {clube.city}
          </div>
        )}
        {clube.capacity && (
          <div>
            <span className="font-semibold">Capacidade:</span>{" "}
            {clube.capacity.toLocaleString("pt-BR")}
          </div>
        )}
        {clube.address && (
          <div className="col-span-2">
            <span className="font-semibold">Endereço:</span> {clube.address}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoxClubeInfo;