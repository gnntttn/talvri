
import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="w-full text-center p-4 mt-8 border-t border-slate-200 dark:border-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {t('tmdbAttribution')}
      </p>
    </footer>
  );
};
