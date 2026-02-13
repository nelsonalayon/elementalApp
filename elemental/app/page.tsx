'use client';

import { useApartmentsWithPayments } from "@/hooks/usePayments";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Building2, ArrowRight, Users, Calendar, TrendingUp, Settings, Bell, LogOut, User } from 'lucide-react';

export default function Home() {
  const { apartments, loading, error } = useApartmentsWithPayments();
  

  console.log({ apartments });

  // Calcular estadísticas totales
  const totalApartments = apartments.length;
  const totalIncome = apartments.reduce((sum, apt) => {
    const paid = apt.monthly?.reduce((paymentSum, payment) => {
      if (payment.Paid) {
        return paymentSum + parseFloat(payment.downpaymentamount || '0');
      }
      return paymentSum;
    }, 0) || 0;
    return sum + paid;
  }, 0);
  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-white">Cargando apartamentos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Bienvenido al Dashboard
          </h2>
          <p className="text-blue-300/70">
            Gestiona y monitorea tus apartamentos desde un solo lugar
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300/70 text-sm mb-1">Total Apartamentos</p>
                <p className="text-2xl font-bold text-white">{totalApartments}</p>
              </div>
              <Building2 className="h-10 w-10 text-teal-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300/70 text-sm mb-1">Total pagado de ambos aptos</p>
                <p className="text-2xl font-bold text-white">${totalIncome.toLocaleString('es-ES')}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-teal-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300/70 text-sm mb-1">Numero de cuotas de los dos aptos</p>
                <p className="text-2xl font-bold text-white">
                  {apartments.reduce((sum, apt) => sum + (apt.monthly?.length || 0), 0)}
                </p>
              </div>
              <Users className="h-10 w-10 text-teal-400" />
            </div>
          </div>
        </div>

        {/* Apartments Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">
              Mis Apartamentos
            </h3>
          </div>

          {/* Apartment Cards - Datos reales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {apartments.map((apt) => {
              // Cálculos originales
              const totalToPay = apt.monthly?.reduce((sum, payment) => {
                return sum + parseFloat(payment.downpaymentamount || '0');
              }, 0) || 0;

              const paid = apt.monthly?.reduce((sum, payment) => {
                if (payment.Paid) {
                  return sum + parseFloat(payment.downpaymentamount || '0');
                }
                return sum;
              }, 0) || 0;

              const percentagePaid = totalToPay > 0 ? (paid / totalToPay) * 100 : 0;
              const percenttageTotalPaid = totalToPay > 0 && apt.apartmentvalue ? (paid / apt.apartmentvalue) * 100 : 0;

              return (
                <Link key={apt.id} href={`/apartment/${apt.id}`}>
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl hover:shadow-2xl hover:border-teal-500/50 transition-all duration-300 group cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="bg-teal-500/20 p-3 rounded-lg mr-4">
                          <Building2 className="h-6 w-6 text-teal-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white group-hover:text-teal-300 transition-colors">
                            {apt.name}
                          </h4>
                          <p className="text-blue-300/70 text-sm">ID: {apt.idapto}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-teal-400 group-hover:translate-x-1 transition-transform" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-blue-300/70 text-xs mb-1">Valor Total</p>
                        <p className="text-white font-semibold">
                          {apt.apartmentvalue ? `$${apt.apartmentvalue.toLocaleString('es-ES')}` : 'No especificado'}
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-300/70 text-xs mb-1">Progreso</p>
                        <p className="text-teal-400 font-semibold">{percenttageTotalPaid.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-blue-300/70 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Fecha entrega: {apt.deliverDate ? new Date(apt.deliverDate).toLocaleDateString() : 'No definida'}</span>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                          {apt.monthly?.length || 0} pagos
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl hover:shadow-2xl hover:border-teal-500/50 transition-all duration-300 text-left group">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <ArrowRight className="h-5 w-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="text-white font-semibold mb-1">Ver Reportes</h4>
            <p className="text-blue-300/70 text-sm">Análisis detallado de ingresos</p>
          </button>

          <button className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl hover:shadow-2xl hover:border-teal-500/50 transition-all duration-300 text-left group">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-400" />
              </div>
              <ArrowRight className="h-5 w-5 text-green-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="text-white font-semibold mb-1">Gestionar Pagos</h4>
            <p className="text-blue-300/70 text-sm">Administrar cuotas y fechas</p>
          </button>

          <button className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl hover:shadow-2xl hover:border-teal-500/50 transition-all duration-300 text-left group">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <Settings className="h-6 w-6 text-purple-400" />
              </div>
              <ArrowRight className="h-5 w-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="text-white font-semibold mb-1">Configuración</h4>
            <p className="text-blue-300/70 text-sm">Personalizar preferencias</p>
          </button>
        </div> */}
      </main>
    </div>
  );
}
