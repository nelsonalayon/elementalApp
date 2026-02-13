'use client';

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, ArrowLeft, Bell, Settings } from 'lucide-react';
import { memo } from 'react';
import UserMenu from './UserMenu';

const MainNavigation = memo(() => {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();

  // No mostrar la navegación en páginas de auth
  if (!isAuthenticated || pathname === '/login' || pathname === '/register') {
    return null;
  }

  const isApartmentPage = pathname.startsWith('/apartment/');

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 shadow-lg border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Back Button - Solo en páginas de apartamento */}
            {isApartmentPage && (
              <Link 
                href="/" 
                className="flex items-center text-blue-300 hover:text-white transition-colors group mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Volver</span>
              </Link>
            )}
            
            {/* Logo y Título */}
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-teal-400 mr-3" />
              <div>
                <Link href="/" className="text-xl font-semibold text-white hover:text-teal-300 transition-colors">
                  Elemental App
                </Link>
                {user && (
                  <p className="text-sm text-blue-300/70">
                    Bienvenido, {user.username}
                  </p>
                )}
              </div>
            </div>

            {/* Breadcrumb - Solo en páginas de apartamento */}
            {isApartmentPage && (
              <div className="hidden md:flex items-center space-x-2 text-sm text-blue-300/70 ml-8">
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
                <span>/</span>
                <span className="text-white">Apartamentos</span>
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            <button className="p-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-full transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-full transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
});

MainNavigation.displayName = 'MainNavigation';

export default MainNavigation;