'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si no está cargando y no está autenticado, redirigir
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Mostrar loading mientras verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 shadow-xl border border-slate-700">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
            <span className="text-white text-lg">Verificando autenticación...</span>
          </div>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar fallback o null
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 shadow-xl border border-slate-700 text-center">
          <h2 className="text-xl font-bold text-white mb-4">Acceso Denegado</h2>
          <p className="text-blue-300/70 mb-6">Necesitas iniciar sesión para acceder a esta página.</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 rounded-lg font-medium hover:from-teal-700 hover:to-teal-800 transition-all"
          >
            Ir a Login
          </button>
        </div>
      </div>
    );
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>;
}