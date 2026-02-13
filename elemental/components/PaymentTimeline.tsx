'use client';
import React from 'react';
import { Check, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/functions';

interface Payment {
  id: number;
  whomustpay?: string;
  downpaymentamount?: string;
  paymentDate: string;
  Paid: boolean;
}

interface PaymentTimelineProps {
  payments: Payment[];
}

export default function PaymentTimeline({ payments }: PaymentTimelineProps) {
  const sortedPayments = [...payments].sort((a, b) => 
    new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime()
  );

  const getPaymentStatus = (payment: Payment) => {
    const paymentDate = new Date(payment.paymentDate);
    const today = new Date();
    
    if (payment.Paid) {
      return { status: 'paid', icon: Check, color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
    } else if (paymentDate < today) {
      return { status: 'overdue', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/20' };
    } else {
      return { status: 'pending', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <div className="flex items-center mb-6">
        <Calendar className="w-5 h-5 text-blue-400 mr-2" />
        <h3 className="text-lg font-semibold text-white">Timeline de Pagos</h3>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {sortedPayments.map((payment, index) => {
          const { status, icon: Icon, color, bg } = getPaymentStatus(payment);
          
          return (
            <div key={payment.id} className="relative flex items-start space-x-4">
              {/* Timeline line */}
              {index < sortedPayments.length - 1 && (
                <div className="absolute left-4 top-8 w-0.5 h-12 bg-slate-700"></div>
              )}
              
              {/* Status icon */}
              <div className={`flex-shrink-0 w-8 h-8 ${bg} rounded-full flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              
              {/* Payment info */}
              <div className="flex-1 min-w-0 bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">
                    {payment.whomustpay || 'Sin asignar'}
                  </h4>
                  <span className={`text-sm font-medium ${color}`}>
                    {status === 'paid' && 'Pagado'}
                    {status === 'overdue' && 'Vencido'}
                    {status === 'pending' && 'Pendiente'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">
                    {formatDate(new Date(payment.paymentDate))}
                  </span>
                  <span className="text-white font-semibold">
                    {formatCurrency(parseFloat(payment.downpaymentamount || '0'))}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}