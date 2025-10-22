
import React from 'react';

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  textSize?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  iconClassName = 'w-8 h-8', 
  textClassName = '', 
  textSize = 'text-2xl sm:text-3xl' 
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg className={iconClassName} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
            <linearGradient id="eyeGradient" x1="0" y1="24" x2="48" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0D9488"/>
                <stop offset="1" stopColor="#22D3EE"/>
            </linearGradient>
        </defs>
        <path 
            d="M24 8C12.95 8 4 17.95 4 24C4 30.05 12.95 40 24 40C35.05 40 44 30.05 44 24C44 17.95 35.05 8 24 8Z" 
            stroke="url(#eyeGradient)" 
            strokeWidth="4" 
            strokeLinejoin="round"
        />
        <path 
            d="M20 18L30 24L20 30V18Z" 
            fill="url(#eyeGradient)"
        />
      </svg>
      <span className={`${textSize} font-bold tracking-wider ${textClassName}`}>
        talvri
      </span>
    </div>
  );
};
