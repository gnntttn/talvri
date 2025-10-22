
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
          <linearGradient id="projectorGradient" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8B5CF6"/>
            <stop offset="1" stopColor="#38BDF8"/>
          </linearGradient>
        </defs>
        <path 
          d="M4 8C4 5.79086 5.79086 4 8 4H40C42.2091 4 44 5.79086 44 8V12H28L38 44H10L20 12H4V8Z" 
          fill="url(#projectorGradient)"
        />
      </svg>
      <span className={`${textSize} font-bold tracking-wider ${textClassName}`}>
        talvri
      </span>
    </div>
  );
};