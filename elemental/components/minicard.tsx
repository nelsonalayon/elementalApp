interface Installment {
  labelName?: string;
  value?: string | number | Date;
  isProfit: boolean;
  description?: string;
}

export default function WhoPays({installments}: {installments?: Installment}) {

  installments = installments || {
    labelName: "Siguiente cuota",
    value: "$200.00",
    isProfit: true,
    description: "10% Profit"
  };

  const formatValue = (val: string | number | Date | undefined) => {
    if (!val) return "";
    if (val instanceof Date) {
      return val.toLocaleDateString();
    }
    if (typeof val === "number") {
      return `$${val.toLocaleString()}`;
    }
    return val.toString();
  };
  

  return (
    <div className="w-full max-w-md bg-slate-800 rounded-xl p-4 space-y-1">
      
        <div className="flex items-center justify-between py-3 border-b border-slate-700 last:border-b-0">
          {/* Información del lado izquierdo */}
          <div className="flex flex-col">
            <h3 className="text-white font-medium text-base">{installments.labelName}</h3>
            <p className={`text-sm font-medium ${
              installments.isProfit ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {installments.description}
            </p>
          </div>

          {/* Información del lado derecho */}
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-lg">{formatValue(installments.value)}</span>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              installments.isProfit ? 'bg-emerald-500' : 'bg-red-500'
            }`}>
              {installments.isProfit ? '✓' : '✗'}
            </div>
          </div>
        </div>
     
    </div>
  );
}