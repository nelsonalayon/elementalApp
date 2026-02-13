'use client';
import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Tipos
interface JwtPayload {
  exp: number;
  iat?: number;
  sub?: string;
  [key: string]: unknown;
}

interface User {
  id: number;
  username: string;
  email: string;
  role?: {
    id: number;
    name: string;
    description: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  checkAuth: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
}

// Context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
 

  const isAuthenticated = !!user && !!token;

  // Función para validar token
  const isTokenValid = useCallback((token: string): boolean => {
    try {
      const decoded: JwtPayload = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch {
      return false;
    }
  }, []);

  // Función para obtener información del usuario
  const fetchUserInfo = useCallback(async (authToken: string): Promise<User | null> => {
    try {
      const response = await fetch('http://localhost:1337/api/users/me?populate=role', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:1337/api/auth/local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const { jwt, user: userData } = data;
        
        // Guardar token en cookies
        Cookies.set('auth-token', jwt, { expires: 7, secure: process.env.NODE_ENV === 'production' });
        
        setToken(jwt);
        setUser(userData);
        
        // Redirigir al dashboard o a la página que intentaba acceder
        const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get('redirect') || '/';
        router.push(redirect);
        
        return { success: true };
      } else {
        const errorMessage = data.error?.message || 'Error en el inicio de sesión';
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Error de conexión. Inténtalo de nuevo.' };
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Register function
  const register = useCallback(async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:1337/api/auth/local/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const { jwt, user: userData } = data;
        
        // Guardar token en cookies
        Cookies.set('auth-token', jwt, { expires: 7, secure: process.env.NODE_ENV === 'production' });
        
        setToken(jwt);
        setUser(userData);
        
        // Redirigir al dashboard después del registro exitoso
        router.push('/');
        
        return { success: true };
      } else {
        const errorMessage = data.error?.message || 'Error en el registro';
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Error de conexión. Inténtalo de nuevo.' };
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Change password function
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      const response = await fetch('http://localhost:1337/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          password: newPassword,
          passwordConfirmation: newPassword,
        }),
      });

      if (response.ok) {
        return { success: true, message: 'Contraseña actualizada correctamente' };
      } else {
        const data = await response.json();
        const errorMessage = data.error?.message || data.message || 'Error al cambiar la contraseña';
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, message: 'Error de conexión. Inténtalo de nuevo.' };
    }
  }, [token]);

  // Logout function
  const logout = useCallback(() => {
    // Limpiar cookies y estado
    Cookies.remove('auth-token');
    setToken(null);
    setUser(null);
    
    // Redirigir al login
    router.push('/login');
  }, [router]);

  // Check authentication on mount
  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    const savedToken = Cookies.get('auth-token');
    
    if (savedToken && isTokenValid(savedToken)) {
      const userData = await fetchUserInfo(savedToken);
      if (userData) {
        setToken(savedToken);
        setUser(userData);
      } else {
        // Token inválido, limpiar
        Cookies.remove('auth-token');
      }
    } else {
      // Token expirado o no existe
      Cookies.remove('auth-token');
    }
    
    setIsLoading(false);
  }, [isTokenValid, fetchUserInfo]);

  // Effect para verificar auth al cargar
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value: AuthContextType = useMemo(() => ({
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
    changePassword,
  }), [user, token, isLoading, isAuthenticated, login, register, logout, checkAuth, changePassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para usar el context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}
