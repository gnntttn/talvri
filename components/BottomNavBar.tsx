import React from 'react';
import type { ActiveTab } from '../App';
import { useTranslation } from '../contexts/LanguageContext';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.69Z" />
    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
  </svg>
);

const TvIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M3.75 6A2.25 2.25 0 0 1 6 3.75h12A2.25 2.25 0 0 1 20.25 6v8.25A2.25 2.25 0 0 1 18 16.5h-2.25a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 1 0 1.5H7.5a.75.75 0 0 1 0-1.5h.75a.75.75 0 0 0 0-1.5H6A2.25 2.25 0 0 1 3.75 14.25V6ZM6 5.25A.75.75 0 0 0 5.25 6v8.25c0 .414.336.75.75.75h12a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.75-.75H6Z" />
    </svg>
);


const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M11.645 20.91a.75.75 0 0 1-1.29 0C8.631 18.7 2.25 12.553 2.25 8.517 2.25 5.42 4.887 3 7.875 3c1.725 0 3.323.805 4.125 2.088C12.823 3.805 14.42 3 16.125 3c2.988 0 5.625 2.42 5.625 5.517 0 4.036-6.382 10.183-8.135 12.393Z" />
  </svg>
);


const PlaylistIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M3 6a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6Zm0 6a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 6a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 18Z" clipRule="evenodd" />
    </svg>
);


const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = "text-violet-600 dark:text-violet-400";
  const inactiveClasses = "text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400";
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}>
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};


export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  const navItems: { id: ActiveTab, label: string, icon: React.ReactNode }[] = [
    { id: 'movies', label: t('movies'), icon: <HomeIcon className="w-6 h-6" /> },
    { id: 'tvshows', label: t('tvShows'), icon: <TvIcon className="w-6 h-6" /> },
    { id: 'search', label: t('search'), icon: <SearchIcon className="w-6 h-6" /> },
    { id: 'watchlist', label: t('watchlist'), icon: <PlaylistIcon className="w-6 h-6" /> },
    { id: 'favorites', label: t('favorites'), icon: <HeartIcon className="w-6 h-6" /> },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-40">
        <div className="flex justify-around items-stretch h-full">
            {navItems.map(item => (
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
  );
};