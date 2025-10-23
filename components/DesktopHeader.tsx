import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import type { ActiveTab } from '../App';
import { useTranslation } from '../contexts/LanguageContext';

interface DesktopHeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
    </svg>
);

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7 9a7 7 0 1 1 14 0H3Z" clipRule="evenodd" />
    </svg>
);

const NavItem: React.FC<{label: string, isActive: boolean, onClick: () => void}> = ({ label, isActive, onClick }) => (
    <button onClick={onClick} className={`transition-colors duration-200 ${isActive ? 'font-semibold text-white' : 'text-gray-300 hover:text-gray-100'}`}>
        {label}
    </button>
);

const LanguageSelector: React.FC = () => {
    const { language, setLanguage } = useTranslation();
    return (
        <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
            className="w-full bg-transparent text-white py-2 px-3 leading-tight focus:outline-none"
            aria-label="Select language"
        >
            <option value="en" className="bg-gray-800">English</option>
            <option value="ar" className="bg-gray-800">العربية</option>
        </select>
    );
};


export const DesktopHeader: React.FC<DesktopHeaderProps> = ({ activeTab, setActiveTab, searchQuery, setSearchQuery }) => {
    const { t } = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchActive(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navItems: { id: ActiveTab; label: string }[] = [
        { id: 'discover', label: t('discover') },
        { id: 'movies', label: t('movies') },
        { id: 'tvshows', label: t('tvShows') },
        { id: 'trending', label: t('trending') },
        { id: 'watchlist', label: t('myWatchlist') },
    ];
    
    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 hidden lg:flex items-center justify-between px-[4%] h-[68px] ${isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/70 to-transparent'}`}>
            <div className="flex items-center gap-8">
                <Logo textClassName="text-red-600" iconClassName="w-7 h-7" textSize="text-3xl" />
                <nav className="flex items-center gap-5">
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

            <div className="flex items-center gap-5">
                <div ref={searchRef} className={`flex items-center transition-all duration-300 ${isSearchActive ? 'bg-black/80 border border-white' : ''}`}>
                    <button onClick={() => setIsSearchActive(true)} className="p-1" aria-label="Search">
                        <SearchIcon className="w-6 h-6" />
                    </button>
                    {isSearchActive && (
                        <div className="w-64">
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setActiveTab('search')}
                                autoFocus
                                className="w-full bg-transparent border-0 focus:ring-0 text-white placeholder-gray-400"
                            />
                        </div>
                    )}
                </div>
                
                <div className="relative">
                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2">
                        <UserIcon className="w-8 h-8 rounded bg-gray-700 p-1" />
                    </button>
                    {isProfileOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-black/80 border border-gray-700 rounded-md shadow-lg py-1">
                           <button onClick={() => {setActiveTab('favorites'); setIsProfileOpen(false);}} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">{t('favorites')}</button>
                           <button onClick={() => {setActiveTab('people'); setIsProfileOpen(false);}} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">{t('people')}</button>
                           <div className="border-t border-gray-700 my-1"></div>
                           <LanguageSelector />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
