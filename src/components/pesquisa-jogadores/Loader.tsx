export default function Loader({ text = "Carregando..." }) {
  return (
    <div className="flex justify-center items-center py-12">
      <span className="animate-spin mr-2 text-xl">⏳</span>
      <span>{text}</span>
    </div>
  );
}