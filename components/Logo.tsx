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
            <linearGradient id="logoGradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8B5CF6"/>
                <stop offset="1" stopColor="#6366F1"/>
            </linearGradient>
        </defs>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M40,8 C42.2091,8 44,9.79086 44,12 V16 H4 V12 C4,9.79086 5.79086,8 8,8 H40 Z M21,20 H15 C13.3431,20 12,21.3431 12,23 V38 C12,39.6569 13.3431,41 15,41 H21 V20 Z M33,20 H27 V41 H33 C34.6569,41 36,39.6569 36,38 V23 C36,21.3431 34.6569,20 33,20 Z"
          fill="url(#logoGradient)"
        />
      </svg>
      <span className={`${textSize} font-bold tracking-wider ${textClassName}`}>
        Talvri
      </span>
    </div>
  );
};
