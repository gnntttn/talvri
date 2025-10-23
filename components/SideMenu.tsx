import React from 'react';
import type { ActiveTab } from '../App';
import { useTranslation } from '../contexts/LanguageContext';

// --- Icons ---
const WatchlistIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M7.5 3.75A1.75 1.75 0 0 0 5.75 5.5v10.5a.75.75 0 0 0 1.28.53L10 13.62l2.97 2.91a.75.75 0 0 0 1.28-.53V5.5A1.75 1.75 0 0 0 12.5 3.75h-5Z" />
    </svg>
);
const FavoritesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9A22.045 22.045 0 0 1 3.302 12.5c-1.143-1.35-1.143-3.414-.002-4.763a5.5 5.5 0 0 1 7.778 0l.002.002.002.002.002-.002.002-.002a5.5 5.5 0 0 1 7.778 0c1.141 1.35 1.141 3.414 0 4.763a22.045 22.045 0 0 1-2.582 1.9 22.045 22.045 0 0 1-2.582 1.9 20.759 20.759 0 0 1-1.162.682c-.006.003-.012.007-.019.01Zm.347-1.422a20.537 20.537 0 0 0 2.23-1.656 20.537 20.537 0 0 0 2.23-1.656c.966-1.141.966-2.827 0-3.968a3.996 3.996 0 0 0-5.652 0l-.348.347a.75.75 0 0 1-1.06 0l-.348-.347a3.996 3.996 0 0 0-5.652 0c-.966 1.141-.966 2.827 0 3.968a20.537 20.537 0 0 0 2.23 1.656 20.537 20.537 0 0 0 2.23 1.656Z" />
    </svg>
);
const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7 9a7 7 0 1 1 14 0H3Z" clipRule="evenodd" />
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
  const baseClasses = 'flex items-center gap-4 w-full px-3 py-3 rounded-lg text-md font-semibold transition-colors duration-200 text-left rtl:text-right';
  const activeClasses = 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400';
  const inactiveClasses = 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10';

  return (
    <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      <span className="w-6 h-6 flex-shrink-0">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  
  const listNavItems: { id: ActiveTab; label: string, icon: React.ReactNode }[] = [
    { id: 'watchlist', label: t('watchlist'), icon: <WatchlistIcon /> },
    { id: 'favorites', label: t('favorites'), icon: <FavoritesIcon /> },
  ];
  
  return (
    <>
      <div 
        onClick={onClose} 
        className={`side-drawer-backdrop md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        aria-hidden="true"
      />
      
      <div 
        className={`side-drawer md:hidden bg-white dark:bg-slate-900 ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center mb-8">
            <div className="w-10 h-10 rounded-full mr-3 bg-slate-200 dark:bg-gray-700 flex items-center justify-center">
                <UserIcon className="w-7 h-7 text-slate-500 dark:text-gray-400"/>
            </div>
            <div>
                <p className="font-bold text-lg">{t('appName')}</p>
                <p className="text-sm text-slate-500 dark:text-gray-400">Welcome</p>
            </div>
        </div>
        
        <nav className="flex flex-col space-y-2 flex-grow">
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
        
        <div className="mt-auto">
            {/* Could add settings, etc. here */}
        </div>
      </div>
    </>
  );
};