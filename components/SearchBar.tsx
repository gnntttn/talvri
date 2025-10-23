import React, { useEffect, useCallback } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onFocus?: () => void;
}

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
    </svg>
);

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, onFocus }) => {
  const { t } = useTranslation();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'q') {
      event.preventDefault();
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto flex items-center pl-4 rtl:pr-4 rtl:pl-0">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder={t('searchPlaceholder')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={onFocus}
        className="block w-full rounded-full border-0 bg-slate-100 dark:bg-slate-700/50 py-2.5 pl-11 pr-12 rtl:pr-11 rtl:pl-12 text-slate-900 dark:text-white ring-1 ring-inset ring-transparent placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition"
      />
      <div className="pointer-events-none absolute inset-y-0 right-0 rtl:left-0 rtl:right-auto flex items-center pr-3 rtl:pl-3 rtl:pr-0">
          <kbd className="hidden sm:inline-flex items-center rounded border border-slate-300 dark:border-slate-600 px-2 font-sans text-xs text-slate-500 dark:text-slate-400">
            Ctrl+Q
          </kbd>
      </div>
    </div>
  );
};