import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import type { Theme, ActiveTab } from '../App';
import { useTranslation } from '../contexts/LanguageContext';

interface HeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
    </svg>
);

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
    </svg>
);

const LanguageSelector: React.FC = () => {
    const { language, setLanguage } = useTranslation();

    return (
        <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
            className="block appearance-none bg-transparent border-0 text-slate-800 dark:text-white py-2 pl-3 pr-8 rtl:pr-3 rtl:pl-8 rounded-full leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Select language"
        >
            <option value="en" className="bg-white dark:bg-slate-800">EN</option>
            <option value="ar" className="bg-white dark:bg-slate-800">AR</option>
        </select>
    );
};

const NavItem: React.FC<{label: string, isActive: boolean, onClick: () => void}> = ({ label, isActive, onClick }) => (
    <button onClick={onClick} className={`transition-colors duration-200 px-3 py-2 rounded-md text-sm font-semibold ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
        {label}
    </button>
);

export const Header: React.FC<HeaderProps> = ({ onMenuClick, onSearchClick, theme, setTheme, activeTab, setActiveTab }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navItems: { id: ActiveTab; label: string }[] = [
      { id: 'discover', label: t('discover') },
      { id: 'movies', label: t('movies') },
      { id: 'tvshows', label: t('tvShows') },
      { id: 'trending', label: t('trending') },
      { id: 'my_library', label: t('myLibrary') },
  ];

  return (
      <header className={`fixed top-0 left-0 right-0 z-40 h-[var(--header-height)] transition-all duration-300 ${isScrolled ? 'bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800' : 'bg-transparent'}`}>
        <div className="flex items-center justify-between h-full px-4 sm:px-6">
            <div className="flex items-center gap-4">
                <button 
                  onClick={onMenuClick} 
                  className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" 
                  aria-label={t('menu')}
                >
                    <MenuIcon className="w-6 h-6" />
                </button>
                <Logo textClassName="text-slate-800 dark:text-white" />
                <nav className="hidden lg:flex items-center gap-2">
                    {navItems.map(item => (
                        <NavItem 
                            key={item.id}
                            label={item.label}
                            isActive={activeTab === item.id}
                            onClick={() => setActiveTab(item.id)}
                        />
                    ))}
                </nav>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
                 <button 
                  onClick={onSearchClick} 
                  className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" 
                  aria-label={t('search')}
                >
                    <SearchIcon className="w-5 h-5" />
                </button>
                <ThemeToggle theme={theme} setTheme={setTheme} />
                <div className="hidden sm:block">
                    <LanguageSelector />
                </div>
            </div>
        </div>
      </header>
  );
};