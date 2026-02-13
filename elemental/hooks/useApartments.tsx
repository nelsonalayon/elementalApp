import { useState, useEffect } from 'react';
import { getApartments } from '@/utils/api';
import { Apartment } from '@/types/apartment';

export function useApartments() {
  const [ apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  
    useEffect(() => {
    async function loadApartments() {
      try {
        setLoading(true);   
        setError(null);
        const data = await getApartments();
        setApartments(data);
      } catch (err: unknown) {
        if(err && typeof err === 'object' && 'status' in err && err.status === 403) {
          setError('Sin permisos, configurar permisos publicos en strapi.');
        } else {
          setError('Error al cargar los apartamentos.');
        }
      } finally {
        setLoading(false);
      } 
    }

    loadApartments();
  }, []);

  return { apartments, loading, error };
}   