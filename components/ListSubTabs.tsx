import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface ListSubTabsProps {
  activeTab: 'movies' | 'tvshows';
  setActiveTab: (tab: 'movies' | 'tvshows') => void;
}

const SubTabItem: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => {
  const activeClasses = "bg-violet-600 text-white";
  const inactiveClasses = "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700";
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${isActive ? activeClasses : inactiveClasses}`}
    >
      {label}
    </button>
  );
};

export const ListSubTabs: React.FC<ListSubTabsProps> = ({ activeTab, setActiveTab }) => {
    const { t } = useTranslation();
    return (
        <div className="flex justify-center space-x-4 rtl:space-x-reverse mb-8">
            <SubTabItem 
                label={t('movies')}
                isActive={activeTab === 'movies'}
                onClick={() => setActiveTab('movies')}
            />
            <SubTabItem 
                label={t('tvShows')}
                isActive={activeTab === 'tvshows'}
                onClick={() => setActiveTab('tvshows')}
            />
        </div>
    );
};
