
import React from 'react';
import type { ActiveTab } from '../App';
import { useTranslation } from '../contexts/LanguageContext';
import { Logo } from './Logo';

// --- Icons (copied from Header & BottomNavBar for consistency) ---
const MoviesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M3.25 4A2.25 2.25 0 0 0 1 6.25v7.5A2.25 2.25 0 0 0 3.25 16h13.5A2.25 2.25 0 0 0 19 13.75v-7.5A2.25 2.25 0 0 0 16.75 4H3.25ZM2 9.5v-1h1.5v1H2Zm1.5 1.5H2v1h1.5v-1ZM2 12.5v-1h1.5v1H2Zm1.5 1.5H2v1h1.5v-1Zm13-5.5h1.5v1H16.5v-1Zm1.5 1.5H16.5v1h1.5v-1Zm-1.5 3h1.5v1H16.5v-1Zm1.5 1.5H16.5v1h1.5v-1Zm-10-5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75-.75h-4.5a.75.75 0 0 1-.75-.75v-4.5Z" />
  </svg>
);
const TvIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M3.25 5A2.25 2.25 0 0 0 1 7.25v6.5A2.25 2.25 0 0 0 3.25 16h13.5A2.25 2.25 0 0 0 19 13.75v-6.5A2.25 2.25 0 0 0 16.75 5H3.25ZM2.5 7.25c0-.414.336-.75.75-.75h13.5c.414 0 .75.336.75.75v6.5c0 .414-.336.75-.75.75H3.25a.75.75 0 0 1-.75-.75v-6.5Z" />
    </svg>
);
const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
    </svg>
);
const WatchlistIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M6.22 3.22a.75.75 0 0 1 1.06 0l3.682 3.682a.75.75 0 0 0 1.06 0l3.682-3.682a.75.75 0 0 1 1.06 1.06l-3.682 3.682a.75.75 0 0 0 0 1.06l3.682 3.682a.75.75 0 0 1-1.06 1.06l-3.682-3.682a.75.75 0 0 0-1.06 0l-3.682 3.682a.75.75 0 0 1-1.06-1.06l3.682-3.682a.75.75 0 0 0 0-1.06L6.22 4.28a.75.75 0 0 1 0-1.06Z" />
        <path d="M2.5 5.243a3.5 3.5 0 0 1 6.36-2.209l-3.148 3.148a.75.75 0 0 0 0 1.061l3.148 3.148A3.501 3.501 0 0 1 2.5 14.757V5.243Z" />
    </svg>
);
const FavoritesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9-22.045 22.045 0 0 1-2.582-1.9 20.759 20.759 0 0 1-1.162-.682c-.006-.003-.012-.007-.019-.01L1.965 12.13a2.25 2.25 0 0 1 0-3.182l4.47-4.47a2.25 2.25 0 0 1 3.182 0l.53.53.53-.53a2.25 2.25 0 0 1 3.182 0l4.47 4.47a2.25 2.25 0 0 1 0 3.182l-1.965 1.965c-.006.003-.012.007-.019.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582 1.9-22.045 22.045 0 0 1-2.582 1.9 20.759 20.759 0 0 1-1.162.682zM10 11.915a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5z" clipRule="evenodd" />
    </svg>
);
const CompassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-2.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z" clipRule="evenodd" />
      <path d="m11.158 6.445 3.133 3.133a.75.75 0 1 1-1.06 1.06l-2.403-2.402-1.34 1.34a.75.75 0 0 1-1.06-1.06l3.132-3.133a.75.75 0 0 1 1.598.062Z" />
    </svg>
);
const FireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M12.237 3.974c.24-.633-.113-1.34-.746-1.58a7.994 7.994 0 0 0-8.91 3.556.75.75 0 0 0 1.342.671 6.494 6.494 0 0 1 7.23-2.903c.31.096.488.423.384.73l-1.538 4.54a.75.75 0 0 0 .616.89l5.22-1.741a.75.75 0 0 0 .538-1.026l-3.08-5.137Z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M5.385 6.53a.75.75 0 0 0-1.127.172 9.493 9.493 0 0 0-1.5 8.283c.381 1.43 1.568 2.51 3.013 2.768a9.5 9.5 0 0 0 9.22-2.395.75.75 0 1 0-1.13-1.004 8.002 8.002 0 0 1-7.734 2.12c-.99-.17-1.81-.828-2.072-1.789a8 8 0 0 1 1.282-7.005.75.75 0 0 0-.254-.928Z" clipRule="evenodd" />
    </svg>
);
const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
);

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const SideMenuItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const baseClasses = 'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 text-left rtl:text-right';
  const activeClasses = 'bg-violet-600 text-white';
  const inactiveClasses = 'text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700';

  return (
    <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      <span className="w-5 h-5 flex-shrink-0">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, activeTab, setActiveTab }) => {
  const { t, language } = useTranslation();
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const navItems: { id: ActiveTab; label: string, icon: React.ReactNode }[] = [
    { id: 'movies', label: t('movies'), icon: <MoviesIcon /> },
    { id: 'tvshows', label: t('tvShows'), icon: <TvIcon /> },
    { id: 'discover', label: t('discover'), icon: <CompassIcon /> },
    { id: 'trending', label: t('trending'), icon: <FireIcon /> },
    { id: 'search', label: t('search'), icon: <SearchIcon /> },
  ];
  
  const listNavItems: { id: ActiveTab; label: string, icon: React.ReactNode }[] = [
    { id: 'watchlist', label: t('watchlist'), icon: <WatchlistIcon /> },
    { id: 'favorites', label: t('favorites'), icon: <FavoritesIcon /> },
  ];
  
  const panelPosition = dir === 'rtl'
    ? (isOpen ? 'translate-x-0' : 'translate-x-full')
    : (isOpen ? 'translate-x-0' : '-translate-x-full');
  const panelClasses = dir === 'rtl' ? 'right-0' : 'left-0';

  return (
    <div role="dialog" aria-modal="true" className={`fixed inset-0 z-50 ${!isOpen && 'pointer-events-none'}`}>
      <div 
        onClick={onClose} 
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        aria-hidden="true"
      />
      
      <div 
        className={`fixed top-0 bottom-0 ${panelClasses} w-72 bg-slate-100 dark:bg-[#0F172A] shadow-lg p-4 transition-transform duration-300 ease-in-out ${panelPosition}`}
      >
        <div className="flex justify-between items-center mb-6">
          <Logo textClassName="text-slate-900 dark:text-white" textSize="text-2xl" />
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex flex-col space-y-1">
          {navItems.map(item => (
            <SideMenuItem 
              key={item.id}
              label={item.label}
              icon={item.icon}
              isActive={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
          <hr className="my-2 border-slate-200 dark:border-slate-700" />
          {listNavItems.map(item => (
            <SideMenuItem 
              key={item.id}
              label={item.label}
              icon={item.icon}
              isActive={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </nav>
      </div>
    </div>
  );
};
