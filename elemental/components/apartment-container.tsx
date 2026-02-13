'use client';

import ApartmentList from './apartment-list';
import { useApartments } from '@/hooks/useApartments';

// Componente contenedor - maneja la lógica de datos
export default function ApartmentContainer() {
  const { apartments, loading, error } = useApartments();
  
  // Pasa los datos al componente de presentación
  return (
    <ApartmentList 
      apartments={apartments} 
      loading={loading} 
      error={error} 
    />
  );
}