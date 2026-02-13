'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut, ChevronDown, Settings } from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleConfigClick = () => {
    setIsOpen(false);
    setShowPasswordModal(true);
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-slate-700/50 hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors"
      >
        <div className="bg-teal-500/20 p-1 rounded-full">
          <User className="h-4 w-4 text-teal-400" />
        </div>
        <span className="text-white text-sm font-medium hidden md:block">
          {user.username}
        </span>
        <ChevronDown className={`h-4 w-4 text-blue-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-20">
            <div className="py-1">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-slate-700">
                <p className="text-sm font-medium text-white">{user.username}</p>
                <p className="text-xs text-blue-300/70">{user.email}</p>
                {user.role && (
                  <p className="text-xs text-teal-400 mt-1">{user.role.name}</p>
                )}
              </div>

              {/* Menu Items */}
              <button className="w-full text-left px-4 py-2 text-sm text-blue-300 hover:text-white hover:bg-slate-700 transition-colors">
                Mi Perfil
              </button>
              
              <button 
                onClick={handleConfigClick}
                className="w-full text-left px-4 py-2 text-sm text-blue-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Configuración</span>
              </button>
              
              <div className="border-t border-slate-700 mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
    </div>
  );
}