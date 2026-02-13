import axios from 'axios';
import Cookies from 'js-cookie';

// Crear instancia de axios
const api = axios.create({
  baseURL: 'http://localhost:1337/api',
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