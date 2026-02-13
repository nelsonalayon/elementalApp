'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Obtener redirect URL si existe
  const redirectTo = searchParams.get('redirect') || '/';

  // Si ya está autenticado, redirigir
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.message || 'Error en el inicio de sesión');
    }
    // No necesitamos redirigir manualmente, el contexto se encarga
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-8 w-8 text-teal-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Iniciar Sesión
          </h1>
          <p className="text-blue-300/70 mt-2">
            Accede a tu cuenta para gestionar tus apartamentos
          </p>
        </div>

        {/* Form */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 shadow-xl border border-slate-700">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-300/70 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300/50 h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-colors"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-300/70 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300/50 h-5 w-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300/50 hover:text-teal-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 px-4 rounded-lg font-medium hover:from-teal-700 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <Link 
              href="/register"
              className="text-teal-400 hover:text-teal-300 text-sm transition-colors"
            >
              ¿No tienes cuenta? Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}