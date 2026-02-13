'use client';
import React from 'react';
import { Calendar, TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'neutral',
  color = 'blue'
}: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-slate-900 border-blue-500/30',
    green: 'from-emerald-500/20 to-slate-900 border-emerald-500/30',
    yellow: 'from-yellow-500/20 to-slate-900 border-yellow-500/30',
    red: 'from-red-500/20 to-slate-900 border-red-500/30',
    purple: 'from-purple-500/20 to-slate-900 border-purple-500/30',
  };

  const iconColors = {
    blue: 'text-blue-400',
    green: 'text-emerald-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
  };

  const changeColors = {
    positive: 'text-emerald-400',
    negative: 'text-red-400',
    neutral: 'text-slate-400',
  };

  return (
    <div className={`relative bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6 overflow-hidden group hover:border-opacity-60 transition-all duration-300 hover:scale-105`}>
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2 rounded-lg bg-white/10 ${iconColors[color]}`}>
            {icon}
          </div>
          {change && (
            <span className={`text-sm font-medium ${changeColors[changeType]} flex items-center`}>
              {changeType === 'positive' && <TrendingUp className="w-3 h-3 mr-1" />}
              {changeType === 'negative' && <TrendingUp className="w-3 h-3 mr-1 rotate-180" />}
              {change}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          <p className="text-slate-300 text-sm font-medium">{title}</p>
        </div>
      </div>
    </div>
  );
}