
import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="py-6 mt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('tmdbAttribution')}
        </p>
      </div>
    </footer>
  );
};
