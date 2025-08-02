import { Share2 } from "lucide-react";

export default function ShareButton({ active, onClick }) {
  return (
    <button
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold border transition
        ${active ? "bg-cyan-50 dark:bg-cyan-900 shadow" : "hover:bg-cyan-100 dark:hover:bg-cyan-800"}
      `}
      style={{
        borderColor: active ? "#06b6d4" : "#bae6fd",
        color: active ? "#0e7490" : "#0891b2",
        boxShadow: active ? "0 2px 12px #06b6d433" : undefined,
        fontWeight: active ? 700 : 500,
      }}
      onClick={onClick}
      aria-pressed={active}
    >
      <Share2 color={active ? "#06b6d4" : "#0891b2"} size={20} />
      {active ? "Compartilhado" : "Compartilhar"}
    </button>
  );
}