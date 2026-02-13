'use client";'

import Link from "next/link";

export default function IncomeCard({link}: {link?: string}) {
  return (
    <div className="relative w-full max-w-sm bg-linear-to-r from-slate-800 via-slate-700 to-slate-600 rounded-xl p-4 overflow-hidden shadow-lg">
      {/* Círculo decorativo de fondo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      <div className="absolute -top-8 -right-8 w-20 h-20 bg-blue-400/10 rounded-full blur-xl"></div>
      
      {/* Contenido */}
      <div className="relative z-10 flex items-center gap-4">
        {/* Icono */}
      <a href={link || "/monthlyFee"}
         target="_blank"
         rel="noopener noreferrer"
         className="flex items-center gap-4"
      >
        <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </a>
        {/* Información */}
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-bold text-white mb-1">Pagar cuota</h3>          
        </div>
      </div>
    </div>
  );
}