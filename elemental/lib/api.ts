import axios from 'axios';
import Cookies from 'js-cookie';

// Función para obtener la URL base según el entorno
const getBaseURL = (): string => {
  // En el cliente, usar la variable de entorno del build
  if (typeof window !== 'undefined') {
    // Si estamos en producción (dominio no es localhost), usar URL de producción
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      // Detectar automáticamente o usar variable de entorno
      return process.env.NEXT_PUBLIC_API_URL || 'https://elementalapp-production.up.railway.app/api';
    }
  }
  
  // En desarrollo o servidor, usar variable de entorno o localhost
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';
};

// Crear instancia de axios
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
});

// Interceptor para añadir token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el token expira, limpiar cookies y redirigir
    if (error.response?.status === 401) {
      Cookies.remove('auth-token');
      // Solo redirigir si estamos en el cliente
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;