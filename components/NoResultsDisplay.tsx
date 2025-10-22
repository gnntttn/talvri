import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface NoResultsDisplayProps {
  query: string;
  onDiscoverClick: () => void;
}

const MagnifyingGlassSlashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM3 3l18 18" />
  </svg>
);

export const NoResultsDisplay: React.FC<NoResultsDisplayProps> = ({ query, onDiscoverClick }) => {
  const { t } = useTranslation();

  return (
    <div className="text-center mt-12 animate-fade-in flex flex-col items-center">
      <MagnifyingGlassSlashIcon className="w-16 h-16 text-slate-400 dark:text-slate-500 mb-4" />
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t('noResultsFoundFor', { query })}</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6">{t('tryCheckingSpelling')}</p>
      <button
        onClick={onDiscoverClick}
        className="px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75 transition-transform duration-200 hover:scale-105"
      >
        {t('discoverSomethingNew')}
      </button>
       <style>{`
            @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        `}</style>
    </div>
  );
};