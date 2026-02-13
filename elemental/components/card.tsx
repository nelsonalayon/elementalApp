import { formatDate, formatCurrency } from '../utils/functions';

export default function EarningsCard({ monthlyFee, title }: { monthlyFee?: number | Date, title?: string }) {




  return (
    <div className="relative w-full max-w-md bg-linear-to-br from-slate-900 via-teal-900 to-slate-900 rounded-2xl p-6 overflow-hidden">
      {/* Círculos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>

      {/* Contenido */}
      <div className="relative z-10">
        {/* Icono superior izquierdo */}
        <div className="mb-8">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        {/* Monto */}
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-3xl sm:text-4xl lg:text-3xl font-bold text-white">{typeof monthlyFee === 'string' ? formatCurrency(parseFloat(monthlyFee)) : monthlyFee instanceof Date ? formatDate(monthlyFee) : monthlyFee}</h2>
          <span className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </span>
        </div>

        {/* Texto descriptivo */}
        <p className="text-blue-300/80 text-sm font-medium">{title}</p>
      </div>

      {/* Botón menú superior derecho */}
      <button className="absolute top-6 right-6 w-10 h-10 bg-slate-800/50 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-slate-800/70 transition-colors">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
    </div>
  );
}