'use client';

import { Apartment } from '@/types/apartment';

// Componente de presentación - solo recibe y muestra datos
interface ApartmentListProps {
  apartments: Apartment[];
  loading: boolean;
  error: string | null;
}

export default function ApartmentList({ apartments, loading, error }: ApartmentListProps) {
  if (loading) return <div>Cargando apartamentos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Apartamentos ({apartments.length})</h2>
      {apartments.length === 0 ? (
        <p>No hay apartamentos</p>
      ) : (
        <div className="space-y-2">
          {apartments.map((apt) => (
            <div key={apt.id} className="p-3 border rounded">
              <p><strong>ID:</strong> {apt.idapto}</p>
              <p><strong>Nombre:</strong> {apt.name}</p>
              <p><strong>Valor:</strong> ${apt.apartmentvalue?.toLocaleString() || 'No especificado'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}