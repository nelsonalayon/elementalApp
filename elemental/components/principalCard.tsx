import React from 'react';

interface ApartmentCardProps {
  apartmentName?: string;
  apartmentPrice?: string;
  initialQuota?: number;
  totalValue?: number;
  imageUrl?: string;
}

export default function ApartmentCard({
  apartmentName = "Nombre Apartamento",
  apartmentPrice = "Precio apartamento",
  initialQuota = 45,
  totalValue = 45,
  imageUrl
}: ApartmentCardProps) {
  return (
    <div className="relative w-full max-w-2xl bg-linear-to-br from-gray-50 to-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Contenido principal */}
      <div className="flex">
        {/* Lado izquierdo - Información */}
        <div className="flex-1 p-8">
          {/* Icono de casa */}
          <div className="mb-6">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <svg 
                className="w-7 h-7 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
              </svg>
            </div>
          </div>

          {/* Título y subtítulo */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {apartmentName}
            </h2>
            <p className="text-gray-500 text-sm">
              {apartmentPrice}
            </p>
          </div>

          {/* Métricas */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-blue-500 text-sm font-medium">
                % cuota inicial: {initialQuota}%
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-500 text-sm font-medium">
                % valor total: {totalValue}%
              </span>
            </div>
          </div>
        </div>

        {/* Lado derecho - Imagen */}
        <div className="shrink-0 w-80 h-72">
          {imageUrl ? (
            <div 
              className="w-full h-full bg-cover bg-center rounded-r-2xl"
              style={{
                backgroundImage: `url("${imageUrl}")`
              }}
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-blue-100 to-blue-200 rounded-r-2xl flex items-center justify-center">
              <div className="text-center">
                <svg 
                  className="w-16 h-16 text-blue-400 mx-auto mb-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0a2 2 0 01-2 2H7a2 2 0 01-2-2m14-10V8a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m6 0V8a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m6 0V8a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m6 0V8a1 1 0 00-1-1h-4a1 1 0 00-1 1v3" 
                  />
                </svg>
                <p className="text-blue-600 text-sm font-medium">Imagen del apartamento</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Elemento decorativo opcional */}
      <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-blue-400 to-blue-600 rounded-l-2xl"></div>
    </div>
  );
}

