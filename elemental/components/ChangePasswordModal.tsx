'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Eye, EyeOff, Lock } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const { changePassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Todos los campos son requeridos' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }

    if (currentPassword === newPassword) {
      setMessage({ type: 'error', text: 'La nueva contraseña debe ser diferente a la actual' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await changePassword(currentPassword, newPassword);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Contraseña actualizada correctamente' });
        
        // Limpiar formulario después de 2 segundos y cerrar modal
        setTimeout(() => {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setMessage({ type: '', text: '' });
          onClose();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Error al cambiar la contraseña' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage({ type: '', text: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-teal-400" />
              <h2 className="text-xl font-semibold text-white">Cambiar Contraseña</h2>
            </div>
            <button 
              onClick={handleClose}
              className="text-blue-300 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">
                Contraseña Actual
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none pr-10"
                  placeholder="Ingresa tu contraseña actual"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none pr-10"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none pr-10"
                  placeholder="Repite tu nueva contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Message */}
            {message.text && (
              <div className={`p-3 rounded-lg text-sm ${
                message.type === 'success' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {message.text}
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isLoading ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}