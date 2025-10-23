import React from 'react';
import type { ActiveTab } from '../App';
import { useTranslation } from '../contexts/LanguageContext';
import { Logo } from './Logo';

// --- Icon Components ---
const BrowseIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M4 11h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1Zm10 0h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1ZM4 21h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1Zm10 0h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1Z"/></svg>;
const TrendingIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M16 6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4Zm-6 4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h4Zm12-2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h4Z"/></svg>;
const MoviesIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M18 4v16H6V4h12ZM6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6Zm1 5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7Zm0 5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-2Z"/></svg>;
const TvShowsIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M21 5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-2 0H5v11h14V5Zm-3 13H8v2h10v-2Z"/></svg>;
const PeopleIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;
const FavoritesIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>;
const WatchlistIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>;

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
  const baseClasses = 'flex items-center gap-4 w-full px-4 py-3 rounded-lg text-md font-semibold transition-colors duration-200 text-left rtl:text-right';
  const activeClasses = 'bg-indigo-600 text-white';
  const inactiveClasses = 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';

  return (
    <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      <span className="w-6 h-6 flex-shrink-0">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  
  const handleItemClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    onClose();
  };

  const menuItems: { id: ActiveTab, label: string, icon: React.ReactNode }[] = [
    { id: 'discover', label: t('discover'), icon: <BrowseIcon /> },
    { id: 'trending', label: t('trending'), icon: <TrendingIcon /> },
    { id: 'movies', label: t('movies'), icon: <MoviesIcon /> },
    { id: 'tvshows', label: t('tvShows'), icon: <TvShowsIcon /> },
    { id: 'people', label: t('people'), icon: <PeopleIcon /> },
  ];

  const libraryItems: { id: ActiveTab, label: string, icon: React.ReactNode }[] = [
    { id: 'favorites', label: t('favorites'), icon: <FavoritesIcon /> },
    { id: 'watchlist', label: t('watchlist'), icon: <WatchlistIcon /> },
  ];
  
  return (
    <>
      <div 
        onClick={onClose} 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        aria-hidden="true"
      />
      
      <div 
        className={`fixed top-0 left-0 bottom-0 w-4/5 max-w-xs bg-slate-50 dark:bg-slate-900 z-50 transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'} rtl:left-auto rtl:right-0 ${isOpen ? 'rtl:translate-x-0' : 'rtl:translate-x-full'}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4 flex flex-col h-full">
            <div className="px-2 mb-8">
                <Logo textClassName="text-slate-800 dark:text-white" textSize="text-3xl" />
            </div>
            
            <nav className="flex-grow overflow-y-auto pr-2">
                <div>
                    <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('menu')}</h3>
                    <div className="space-y-1">
                        {menuItems.map(item => (
                            <SideMenuItem 
                            key={item.id}
                            label={item.label}
                            icon={item.icon}
                            isActive={activeTab === item.id}
                            onClick={() => handleItemClick(item.id)}
                            />
                        ))}
                    </div>
                </div>
                <div className="mt-6">
                    <h3 className="px-3 my-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('myLibrary')}</h3>
                    <div className="space-y-1">
                        {libraryItems.map(item => (
                            <SideMenuItem 
                            key={item.id}
                            label={item.label}
                            icon={item.icon}
                            isActive={activeTab === item.id}
                            onClick={() => handleItemClick(item.id)}
                            />
                        ))}
                    </div>
                </div>
            </nav>
        </div>
      </div>
    </>
  );
};
