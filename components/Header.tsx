import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { Logo } from './Logo';

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7 9a7 7 0 1 1 14 0H3Z" clipRule="evenodd" />
    </svg>
);

interface HeaderProps {
  onMenuClick: () => void;
}


export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { t } = useTranslation();

  return (
      <header className="mobile-header lg:hidden">
        <Logo textClassName="text-slate-800 dark:text-white" iconClassName="w-7 h-7" textSize='text-3xl' />
        <button 
          onClick={onMenuClick} 
          className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" 
          aria-label={t('menu')}
        >
            <UserIcon className="w-7 h-7" />
        </button>
      </header>
  );
};