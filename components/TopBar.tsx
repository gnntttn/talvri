import React from 'react';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';
import type { Theme, ActiveTab } from '../App';
import { useTranslation } from '../contexts/LanguageContext';

interface TopBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const LanguageSelector: React.FC = () => {
    const { language, setLanguage } = useTranslation();

    return (
        <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
            className="block appearance-none w-full bg-slate-100 dark:bg-slate-700/50 border-0 text-slate-800 dark:text-white py-2 px-3 rounded-full leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Select language"
        >
            <option value="en" className="bg-white dark:bg-slate-800">EN</option>
            <option value="ar" className="bg-white dark:bg-slate-800">AR</option>
        </select>
    );
};

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7 9a7 7 0 1 1 14 0H3Z" clipRule="evenodd" />
    </svg>
);


export const TopBar: React.FC<TopBarProps> = ({ activeTab, setActiveTab, searchQuery, setSearchQuery, theme, setTheme }) => {
    const isSearchFocused = activeTab === 'search';

    const handleSearchFocus = () => {
      if (activeTab !== 'search') {
        setActiveTab('search');
      }
    };

    return (
        <div className="top-bar flex items-center justify-between gap-8">
            <div className={`transition-all duration-300 ${isSearchFocused ? 'w-full max-w-xl' : 'w-full max-w-sm'}`}>
                <SearchBar searchTerm={searchQuery} setSearchTerm={setSearchQuery} onFocus={handleSearchFocus} />
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle theme={theme} setTheme={setTheme} />
                <div className="w-24">
                  <LanguageSelector />
                </div>
                <button className="w-10 h-10 flex-shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                    <UserIcon className="w-6 h-6 text-slate-500 dark:text-slate-400"/>
                </button>
            </div>
        </div>
    );
};