import { useState, useEffect } from 'react';
import { getApartmentsWithPayments } from '@/utils/api';
import { Apartment } from '@/types/apartment';
import { useAuth } from '@/context/AuthContext';

export function useApartmentsWithPayments() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    async function loadApartments() {
      // Solo cargar si está autenticado y tiene token
      if (!isAuthenticated || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);   
        setError(null);
        const data = await getApartmentsWithPayments();
        setApartments(data);
      } catch (err: any) {
        console.error('Error loading apartments:', err);
        
        if (err.response?.status === 403) {
          setError('Sin permisos para ver apartamentos. Configura permisos en Strapi.');
        } else if (err.response?.status === 401) {
          setError('Token de autenticación inválido. Inicia sesión de nuevo.');
        } else {
          setError('Error al cargar los apartamentos.');
        }
      } finally {
        setLoading(false);
      } 
    }

    loadApartments();
  }, [isAuthenticated, token]); // Re-cargar cuando cambie el estado de auth

  return { apartments, loading, error };
}   