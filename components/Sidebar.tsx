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
const LibraryIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H10v-2h8v2zm-4-4H10V8h4v2z"/></svg>;

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const baseClasses = 'flex items-center gap-4 w-full px-4 py-3 rounded-lg text-md font-semibold transition-colors duration-200 text-left rtl:text-right';
  const activeClasses = 'bg-indigo-600 text-white';
  const inactiveClasses = 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  
  const menuItems: { id: ActiveTab, label: string, icon: React.ReactNode }[] = [
    { id: 'discover', label: t('discover'), icon: <BrowseIcon /> },
    { id: 'trending', label: t('trending'), icon: <TrendingIcon /> },
    { id: 'movies', label: t('movies'), icon: <MoviesIcon /> },
    { id: 'tvshows', label: t('tvShows'), icon: <TvShowsIcon /> },
    { id: 'people', label: t('people'), icon: <PeopleIcon /> },
  ];

  const libraryItems: { id: ActiveTab, label: string, icon: React.ReactNode }[] = [
    { id: 'my_library', label: t('myLibrary'), icon: <LibraryIcon /> },
  ];

  return (
    <aside className="fixed top-0 left-0 rtl:left-auto rtl:right-0 h-full w-64 bg-slate-50 border-r border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-4 hidden lg:flex flex-col z-30">
      <div className="px-2 mb-8">
        <Logo textClassName="text-slate-800 dark:text-white" textSize="text-3xl" />
      </div>
      
      <div className="flex-grow overflow-y-auto pr-2">
          <nav className="space-y-4">
            <div>
              <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('menu')}</h3>
              <div className="space-y-1">
                {menuItems.map(item => (
                    <NavItem
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    isActive={activeTab === item.id}
                    onClick={() => setActiveTab(item.id)}
                    />
                ))}
              </div>
            </div>
            <div>
              <h3 className="px-3 my-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('myLibrary')}</h3>
              <div className="space-y-1">
                {libraryItems.map(item => (
                    <NavItem
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    isActive={activeTab === item.id}
                    onClick={() => setActiveTab(item.id)}
                    />
                ))}
              </div>
            </div>
          </nav>
      </div>
    </aside>
  );
};