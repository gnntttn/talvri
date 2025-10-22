
import React from 'react';
import type { ActiveTab } from '../App';
import { useTranslation } from '../contexts/LanguageContext';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

// --- Icon Components ---
const BrowseIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M4 11h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1Zm10 0h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1ZM4 21h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1Zm10 0h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1Z"/></svg>;
const TrendingIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M16 6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4Zm-6 4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h4Zm12-2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h4Z"/></svg>;
const MoviesIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M18 4v16H6V4h12ZM6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6Zm1 5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7Zm0 5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-2Z"/></svg>;
const TvShowsIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M21 5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-2 0H5v11h14V5Zm-3 13H8v2h10v-2Z"/></svg>;
const LiveIcon = (p: React.SVGProps<SVGSVGElement>) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M7 11a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-8Zm2 0v8h6v-8H9Zm-4-8a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-2v-2H7v2H5a1 1 0 0 1-1-1V3Z"/></svg>;

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = "text-white bg-white/10";
  const inactiveClasses = "text-slate-400 hover:text-white hover:bg-white/5";
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive ? activeClasses : inactiveClasses}`}
    >
      <span className="w-5 h-5">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  
  // Fix: Type '"live_broadcasts"' is not assignable to type 'ActiveTab'.
  const menuItems: { id: ActiveTab, label: string, icon: React.ReactNode }[] = [
    { id: 'movies', label: t('browse'), icon: <BrowseIcon /> },
    { id: 'trending', label: t('trending'), icon: <TrendingIcon /> },
    { id: 'tvshows', label: t('tvShows'), icon: <TvShowsIcon /> },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-[#191919] text-white p-6 hidden sm:flex flex-col space-y-8 z-50">
      <h1 className="text-3xl font-bold tracking-wider text-white">watchog</h1>
      
      <div className="flex-grow">
          <nav className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('menu')}</h3>
            {menuItems.map(item => (
                <NavItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                isActive={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
                />
            ))}
          </nav>
      </div>

    </aside>
  );
};
