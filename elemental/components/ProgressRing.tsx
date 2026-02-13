'use client';
import React from 'react';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  children?: React.ReactNode;
}

export default function ProgressRing({ 
  percentage, 
  size = 120, 
  strokeWidth = 8, 
  color = "#10b981",
  children 
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          stroke="currentColor"
          className="text-slate-700"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        
        {/* Progress circle */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
      
      {/* Content in the center */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {Math.round(percentage)}%
            </div>
            <div className="text-xs text-slate-400">
              Completado
            </div>
          </div>
        )}
      </div>
    </div>
  );
}