'use client';
import React from 'react';
import { Building, MapPin, Calendar, User, DollarSign, Clock } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/functions';

interface ApartmentInfo {
  id: number;
  name?: string;
  apartmentvalue?: number;
  deliverDate?: string;
  link?: string;
  createdAt?: string;
  monthly?: Array<{
    whomustpay?: string;
    downpaymentamount?: string;
    paymentDate: string;
    Paid: boolean;
  }>;
}

interface ApartmentDetailsProps {
  apartment: ApartmentInfo;
}

export default function ApartmentDetails({ apartment }: ApartmentDetailsProps) {
  const totalPayments = apartment.monthly?.length || 0;
  const paidPayments = apartment.monthly?.filter(p => p.Paid).length || 0;
  const overduePayments = apartment.monthly?.filter(p => {
    const paymentDate = new Date(p.paymentDate);
    const today = new Date();
    return !p.Paid && paymentDate < today;
  }).length || 0;

  const details = [
    {
      label: 'Nombre del Apartamento',
      value: apartment.name || 'No especificado',
      icon: Building,
      color: 'text-blue-400'
    },
    {
      label: 'Valor Total',
      value: formatCurrency(apartment.apartmentvalue || 0),
      icon: DollarSign,
      color: 'text-emerald-400'
    },
    {
      label: 'Fecha de Entrega',
      value: apartment.deliverDate ? formatDate(new Date(apartment.deliverDate)) : 'No especificada',
      icon: Calendar,
      color: 'text-purple-400'
    },
    {
      label: 'Fecha de Registro',
      value: apartment.createdAt ? formatDate(new Date(apartment.createdAt)) : 'No disponible',
      icon: Clock,
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
        <Building className="w-5 h-5 text-blue-400 mr-2" />
        Detalles del Apartamento
      </h3>

      {/* Main info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {details.map((detail, index) => (
          <div key={index} className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <detail.icon className={`w-4 h-4 ${detail.color} mr-2`} />
              <span className="text-slate-300 text-sm">{detail.label}</span>
            </div>
            <p className="text-white font-medium">{detail.value}</p>
          </div>
        ))}
      </div>

      {/* Payment summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
          <div className="text-2xl font-bold text-emerald-400">{paidPayments}</div>
          <div className="text-emerald-300 text-sm">Pagados</div>
        </div>
        
        <div className="text-center p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
          <div className="text-2xl font-bold text-yellow-400">{totalPayments - paidPayments}</div>
          <div className="text-yellow-300 text-sm">Pendientes</div>
        </div>
        
        <div className="text-center p-3 bg-red-500/20 rounded-lg border border-red-500/30">
          <div className="text-2xl font-bold text-red-400">{overduePayments}</div>
          <div className="text-red-300 text-sm">Vencidos</div>
        </div>
      </div>

      {/* Link section */}
      {apartment.link && (
        <div className="mt-6 p-4 bg-teal-500/20 border border-teal-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-teal-300 font-medium mb-1">Enlace del Apartamento</h4>
              <a 
                href={apartment.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-teal-400 hover:text-teal-300 text-sm break-all transition-colors"
              >
                {apartment.link}
              </a>
            </div>
            <svg className="w-5 h-5 text-teal-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}