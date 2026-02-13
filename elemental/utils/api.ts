import { Apartment } from '@/types/apartment';
import api from '@/lib/api'; // Usar la instancia con autenticación

// Función para obtener apartamentos con payments (AUTENTICADA)
export async function getApartmentsWithPayments(): Promise<Apartment[]> {
  try {
    // Usar la instancia api que incluye automáticamente el token
    const response = await api.get('/apartments?populate=*');
    
    console.log('Apartamentos con payments:', response.data);
    return response.data.data; // Axios wrappea la respuesta en .data
  } catch (error) {
    console.error('Error obteniendo apartamentos con payments:', error);
    // Re-lanzar el error para que usePayments lo pueda manejar
    throw error;
  }
}

// Función para obtener solo apartamentos básicos (AUTENTICADA)
export async function getApartments(): Promise<Apartment[]> {
  try {
    const response = await api.get('/apartments');
    
    return response.data.data;
  } catch (error) {
    console.error('Error obteniendo apartamentos:', error);
    throw error;
  }
}