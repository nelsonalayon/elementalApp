'use client';
import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios, { AxiosError } from 'axios';
import api from '@/lib/api';

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

interface FetchUserResult {
  user: User | null;
  shouldLogout: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: { message?: string }; message?: string }>;
    return axiosError.response?.data?.error?.message ?? axiosError.response?.data?.message ?? fallback;
  }
  return fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!token;

  const isTokenValid = useCallback((currentToken: string): boolean => {
    try {
      const decoded: JwtPayload = jwtDecode(currentToken);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch {
      return false;
    }
  }, []);

  const fetchUserInfo = useCallback(async (authToken: string): Promise<FetchUserResult> => {
    try {
      const response = await api.get('/users/me?populate=role', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      return {
        user: response.data as User,
        shouldLogout: false,
      };
    } catch (error) {
      console.error('Error fetching user info:', error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          return {
            user: null,
            shouldLogout: true,
          };
        }
      }

      return {
        user: null,
        shouldLogout: false,
      };
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await api.post('/auth/local', {
        identifier: email,
        password,
      });

      const { jwt, user: userData } = response.data;

      Cookies.set('auth-token', jwt, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
      });

      setToken(jwt);
      setUser(userData);

      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: getApiErrorMessage(error, 'Error de conexión. Inténtalo de nuevo.') };
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const register = useCallback(async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await api.post('/auth/local/register', {
        username,
        email,
        password,
      });

      const { jwt, user: userData } = response.data;

      Cookies.set('auth-token', jwt, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
      });

      setToken(jwt);
      setUser(userData);
      router.push('/');

      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: getApiErrorMessage(error, 'Error de conexión. Inténtalo de nuevo.') };
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      const response = await api.post(
        '/auth/change-password',
        {
          currentPassword,
          password: newPassword,
          passwordConfirmation: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        return { success: true, message: 'Contraseña actualizada correctamente' };
      }

      return { success: false, message: 'Error al cambiar la contraseña' };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, message: getApiErrorMessage(error, 'Error de conexión. Inténtalo de nuevo.') };
    }
  }, [token]);

  const logout = useCallback(() => {
    Cookies.remove('auth-token');
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    const savedToken = Cookies.get('auth-token');

    if (savedToken && isTokenValid(savedToken)) {
      const result = await fetchUserInfo(savedToken);
      if (result.user) {
        setToken(savedToken);
        setUser(result.user);
      } else if (result.shouldLogout) {
        Cookies.remove('auth-token');
        setToken(null);
        setUser(null);
      } else {
        setToken(savedToken);
      }
    } else {
      Cookies.remove('auth-token');
      setToken(null);
      setUser(null);
    }

    setIsLoading(false);
  }, [fetchUserInfo, isTokenValid]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value: AuthContextType = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated,
      login,
      register,
      logout,
      checkAuth,
      changePassword,
    }),
    [user, token, isLoading, isAuthenticated, login, register, logout, checkAuth, changePassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}
