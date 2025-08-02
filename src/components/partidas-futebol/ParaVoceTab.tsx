"use client";
import ParaVoceHomeGrids from "./ParaVoceHomeGrids";

interface Props {
  expandirPesquisaGlobal: () => void;
  selectedDate: Date;
}

export default function ParaVoceTab({ expandirPesquisaGlobal, selectedDate }: Props) {
  return (
    <ParaVoceHomeGrids
      expandirPesquisaGlobal={expandirPesquisaGlobal}
      selectedDate={selectedDate}
    />
  );
}