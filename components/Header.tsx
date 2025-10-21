
import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import type { Theme, ActiveTab } from '../App';
import { useTranslation } from '../contexts/LanguageContext';

// --- Icons ---
const MoviesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M3.25 4A2.25 2.25 0 0 0 1 6.25v7.5A2.25 2.25 0 0 0 3.25 16h13.5A2.25 2.25 0 0 0 19 13.75v-7.5A2.25 2.25 0 0 0 16.75 4H3.25ZM2 9.5v-1h1.5v1H2Zm1.5 1.5H2v1h1.5v-1ZM2 12.5v-1h1.5v1H2Zm1.5 1.5H2v1h1.5v-1Zm13-5.5h1.5v1H16.5v-1Zm1.5 1.5H16.5v1h1.5v-1Zm-1.5 3h1.5v1H16.5v-1Zm1.5 1.5H16.5v1h1.5v-1Zm-10-5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-4.5Z" />
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
        <path fillRule="evenodd" d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9-22.045 22.045 0 0 1-2.582-1.9 20.759 20.759 0 0 1-1.162-.682c-.006-.003-.012-.007-.019-.01L1.965 12.13a2.25 2.25 0 0 1 0-3.182l4.47-4.47a2.25 2.25 0 0 1 3.182 0l.53.53.53-.53a2.25 2.25 0 0 1 3.182 0l4.47 4.47a2.25 2.25 0 0 1 0 3.182l-1.965 1.965c-.006.003-.012.007-.019.01a20.759 20.759 0 0 1-1.162.682 22.045 22.045 0 0 1-2.582 1.9-22.045 22.045 0 0 1-2.582 1.9 20.759 20.759 0 0 1-1.162.682zM10 11.915a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5z" clipRule="evenodd" />
    </svg>
);
const RocketIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M11.31 2.25c.29-.441.91-.441 1.2 0l1.013 1.528a.75.75 0 0 0 .736.422h1.705a.75.75 0 0 1 .67.923l-.842 2.246a.75.75 0 0 0 .17.768l1.488 1.487a.75.75 0 0 1-.223 1.22l-2.22.833a.75.75 0 0 0-.577.577l-.833 2.22a.75.75 0 0 1-1.22.223l-1.487-1.488a.75.75 0 0 0-.768-.17L7.02 16.27a.75.75 0 0 1-.923-.67V13.896a.75.75 0 0 0-.422-.736L4.15 12.147a.75.75 0 0 1-.295-1.152l1.353-2.029a.75.75 0 0 0-.154-.836L3.385 6.464a.75.75 0 0 1 .616-1.18l2.392.4a.75.75 0 0 0 .81-.154l2.029-1.353a.75.75 0 0 1 1.152.295l1.013 1.528a.75.75 0 0 0 .736.422h1.705a.75.75 0 0 1 .67.923l-.842 2.246a.75.75 0 0 0 .17.768l1.488 1.487a.75.75 0 0 1-.223 1.22l-2.22.833a.75.75 0 0 0-.577.577l-.833 2.22a.75.75 0 0 1-1.22-.223l-1.487-1.488a.75.75 0 0 0-.768-.17l-2.246.842a.75.75 0 0 1-.923-.67V9.75a.75.75 0 0 0-.422-.736L4.15 8.001a.75.75 0 0 1-.295-1.152l1.353-2.03a.75.75 0 0 0-.154-.835L3.385 2.32a.75.75 0 0 1 .616-1.18l2.392.4a.75.75 0 0 0 .81-.154l2.029-1.353a.75.75 0 0 1 1.152.295Z" clipRule="evenodd" />
    </svg>
);

interface HeaderProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onSurpriseMe: () => void;
  isSurpriseLoading: boolean;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            isActive
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
};


export const Header: React.FC<HeaderProps> = ({ theme, setTheme, activeTab, setActiveTab, onSurpriseMe, isSurpriseLoading }) => {
  const { t, language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const navItems: { id: ActiveTab; label: string, icon: React.ReactNode }[] = [
    { id: 'movies', label: t('movies'), icon: <MoviesIcon className="w-5 h-5" /> },
    { id: 'tvshows', label: t('tvShows'), icon: <TvIcon className="w-5 h-5" /> },
    { id: 'search', label: t('search'), icon: <SearchIcon className="w-5 h-5" /> },
    { id: 'watchlist', label: t('watchlist'), icon: <WatchlistIcon className="w-5 h-5" /> },
    { id: 'favorites', label: t('favorites'), icon: <FavoritesIcon className="w-5 h-5" /> },
  ];

  return (
    <header className="absolute top-0 z-30 w-full p-4 sm:p-6 bg-gradient-to-b from-black/50 to-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-wider text-white">
                    <span className="text-violet-400">t</span>alvri
                </h1>
            </div>
            <nav className="hidden md:flex items-center gap-1 bg-slate-800/50 backdrop-blur-sm p-1 rounded-full">
                {navItems.map(item => (
                    <NavItem 
                        key={item.id}
                        label={item.label}
                        icon={item.icon}
                        isActive={activeTab === item.id}
                        onClick={() => setActiveTab(item.id)}
                    />
                ))}
            </nav>
            <div className="flex items-center gap-1">
                <button 
                  onClick={onSurpriseMe}
                  disabled={isSurpriseLoading}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RocketIcon className={`w-5 h-5 ${isSurpriseLoading ? 'animate-spin' : ''}`} />
                    <span className="hidden lg:inline">{t('surpriseMe')}</span>
                </button>
                <button onClick={toggleLanguage} className="p-2 rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition-colors text-sm font-bold w-9 h-9 flex items-center justify-center">
                    {language.toUpperCase()}
                </button>
                <ThemeToggle theme={theme} setTheme={setTheme} />
            </div>
        </div>
      </div>
    </header>
  );
};
