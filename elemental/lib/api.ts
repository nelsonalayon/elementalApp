import axios from 'axios';
import Cookies from 'js-cookie';

const DEFAULT_PROD_API_URL = 'https://elementalapp-production.up.railway.app/api';

const normalizeApiBaseURL = (url: string): string => {
  const trimmed = url.trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

// Función para obtener la URL base según el entorno
const getBaseURL = (): string => {
  const envBaseURL = process.env.NEXT_PUBLIC_API_URL;
  const isProduction = process.env.NODE_ENV === 'production';

  if (envBaseURL) {
    return normalizeApiBaseURL(envBaseURL);
  }

  if (isProduction) {
    return normalizeApiBaseURL(DEFAULT_PROD_API_URL);
  }

  // En desarrollo (SSR), usar localhost
  return 'http://localhost:1337/api';
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
    const token = Cookies.get('auth-token');
    const requestUrl = error?.config?.url || '';
    const isAuthEndpoint = requestUrl.includes('/auth/local') || requestUrl.includes('/auth/local/register');

    // Si el token expira, limpiar cookies y redirigir solo cuando había sesión activa
    if (error.response?.status === 401 && token && !isAuthEndpoint) {
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