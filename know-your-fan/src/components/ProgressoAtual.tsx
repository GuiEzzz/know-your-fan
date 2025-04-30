type Props = {
  etapaAtual: number; // 0 ou 1
  totalEtapas: number;
};

export default function ProgressoAtual({ etapaAtual, totalEtapas }: Props) {
  const progresso = ((etapaAtual + 1) / totalEtapas) * 100;

  return (
    <div className="w-full max-w-md mb-6">
      <div className="w-full bg-gray-200 h-2 rounded">
        <div
          className="h-full bg-yellow-500 rounded transition-all duration-300"
          style={{ width: `${progresso}%` }}
        ></div>
      </div>
    </div>
  );
}
