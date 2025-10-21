import React from 'react';
import type { ActiveTab } from '../App';
import { useTranslation } from '../contexts/LanguageContext';

interface DesktopNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

// --- Icon Components ---
const MoviesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M2.25 4.5A2.25 2.25 0 0 1 4.5 2.25h11A2.25 2.25 0 0 1 17.75 4.5v11a2.25 2.25 0 0 1-2.25 2.25h-11A2.25 2.25 0 0 1 2.25 15.5v-11ZM4.5 4.5v11h11V4.5h-11Z" />
    <path d="M5.023 6.22a.75.75 0 0 1 .75-.75h2.477a.75.75 0 0 1 0 1.5H5.773a.75.75 0 0 1-.75-.75Zm0 3.25a.75.75 0 0 1 .75-.75h2.477a.75.75 0 0 1 0 1.5H5.773a.75.75 0 0 1-.75-.75Zm0 3.25a.75.75 0 0 1 .75-.75h2.477a.75.75 0 0 1 0 1.5H5.773a.75.75 0 0 1-.75-.75Zm4.25-6.5a.75.75 0 0 1 .75-.75h2.477a.75.75 0 0 1 0 1.5H10.023a.75.75 0 0 1-.75-.75Zm0 3.25a.75.75 0 0 1 .75-.75h2.477a.75.75 0 0 1 0 1.5H10.023a.75.75 0 0 1-.75-.75Zm0 3.25a.75.75 0 0 1 .75-.75h2.477a.75.75 0 0 1 0 1.5H10.023a.75.75 0 0 1-.75-.75Z" />
    <path d="M14.977 6.22a.75.75 0 0 1 .75-.75h.023a.75.75 0 0 1 0 1.5h-.023a.75.75 0 0 1-.75-.75Zm0 3.25a.75.75 0 0 1 .75-.75h.023a.75.75 0 0 1 0 1.5h-.023a.75.75 0 0 1-.75-.75Zm0 3.25a.75.75 0 0 1 .75-.75h.023a.75.75 0 0 1 0 1.5h-.023a.75.75 0 0 1-.75-.75Z" />
  </svg>
);

const TvShowsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M3 4.25A2.25 2.25 0 0 1 5.25 2h9.5A2.25 2.25 0 0 1 17 4.25v8.5A2.25 2.25 0 0 1 14.75 15h-9.5A2.25 2.25 0 0 1 3 12.75v-8.5ZM5.25 3.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75v-8.5a.75.75 0 0 0-.75-.75h-9.5Z" />
      <path d="M10 18a.75.75 0 0 1-.75-.75V16a.75.75 0 0 1 1.5 0v1.25a.75.75 0 0 1-.75.75ZM6.5 16.5a.75.75 0 0 0 0-1.5h7a.75.75 0 0 0 0 1.5h-7Z" />
    </svg>
);

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
  </svg>
);

const StarIconFilled: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.83 3.751 4.145.604c.731.107 1.023 1.005.494 1.521l-2.998 2.922.708 4.129c.125.728-.638 1.285-1.29.948L10 14.85l-3.713 1.952c-.652.337-1.415-.22-1.29-.948l.708-4.129-2.998-2.922c-.529-.516-.237-1.414.494-1.521l4.145-.604 1.83-3.751Z" clipRule="evenodd" />
  </svg>
);

const BookmarkIconFilled: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="m5.223 2.25.534 1.06a.75.75 0 0 0 .633.42h2.203a.75.75 0 0 1 .585 1.21l-1.784 1.784a.75.75 0 0 0-.212.723l.63 2.476a.75.75 0 0 1-1.09.805l-2.221-1.168a.75.75 0 0 0-.698 0L3.63 10.733a.75.75 0 0 1-1.09-.805l.63-2.476a.75.75 0 0 0-.212-.723L1.174 5.943a.75.75 0 0 1 .585-1.21h2.203a.75.75 0 0 0 .633-.42L5.127 2.25a.75.75 0 0 1 1.096 0l.534 1.06a.75.75 0 0 0 .633.42h2.203a.75.75 0 0 1 .585 1.21l-1.784 1.784a.75.75 0 0 0-.212.723l.63 2.476a.75.75 0 0 1-1.09.805L10 9.566l-.002.001a.752.752 0 0 0-.696 0l-2.221 1.168a.75.75 0 0 1-1.09-.805l.63-2.476a.75.75 0 0 0-.212-.723L4.574 5.943a.75.75 0 0 1 .585-1.21h2.203a.75.75 0 0 0 .633-.42l.534-1.061a.75.75 0 0 1 1.096 0Z" />
      <path fillRule="evenodd" d="M3.75 2.25a.75.75 0 0 0-.75.75v14.25a.75.75 0 0 0 1.28.53L10 13.06l5.72 4.72a.75.75 0 0 0 1.28-.53V3a.75.75 0 0 0-.75-.75H3.75Z" clipRule="evenodd" />
    </svg>
);


const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = "text-violet-600 dark:text-violet-400 border-violet-500";
  const inactiveClasses = "text-slate-600 dark:text-slate-300 border-transparent hover:text-slate-800 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700";
  return (
    <button
      onClick={onClick}
      className={`group inline-flex items-center gap-2 px-3 pt-3 pb-3 border-b-2 text-sm font-medium transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500 dark:focus-visible:ring-offset-slate-900 rounded-t-sm ${isActive ? activeClasses : inactiveClasses}`}
    >
      <span className="transition-transform duration-300 group-hover:scale-110">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
};

export const DesktopNav: React.FC<DesktopNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  const navItems: { id: ActiveTab, label: string, icon: React.ReactNode }[] = [
    { id: 'movies', label: t('movies'), icon: <MoviesIcon className="w-5 h-5" /> },
    { id: 'tvshows', label: t('tvShows'), icon: <TvShowsIcon className="w-5 h-5" /> },
    { id: 'search', label: t('search'), icon: <SearchIcon className="w-5 h-5" /> },
    { id: 'watchlist', label: t('watchlist'), icon: <BookmarkIconFilled className="w-5 h-5" /> },
    { id: 'favorites', label: t('favorites'), icon: <StarIconFilled className="w-5 h-5" /> },
  ];

  return (
    <nav className="hidden sm:block bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-8 rtl:space-x-reverse h-12">
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
    </nav>
  );
};