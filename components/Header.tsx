
import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import type { Theme } from '../App';
import { useTranslation } from '../contexts/LanguageContext';

interface HeaderProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onSurpriseMe: () => void;
}

const PlayIcon3D: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clipRule="evenodd" />
    </svg>
);


const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" clipRule="evenodd" />
        <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.517 3.744 3.744 0 0 1-1.517-3.008 3.744 3.744 0 0 1 1.517-3.008Z" />
    </svg>
);

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useTranslation();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <button
            onClick={toggleLanguage}
            className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-200 font-semibold text-sm"
            aria-label="Toggle language"
        >
            {language === 'en' ? 'ع' : 'EN'}
        </button>
    );
};


export const Header: React.FC<HeaderProps> = ({ theme, setTheme, onSurpriseMe }) => {
  const { t } = useTranslation();
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm w-full border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <PlayIcon3D className="h-8 w-8 text-indigo-500" />
            <h1 className="text-3xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-indigo-600 dark:from-violet-400 dark:to-indigo-500" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.1)'}}>
              {t('appName')}
            </h1>
          </div>
          <div className="flex-1 flex items-center justify-end space-x-2 sm:space-x-4 rtl:space-x-reverse">
            <button
                onClick={onSurpriseMe}
                className="flex items-center gap-2 p-2 sm:pr-4 rtl:sm:pr-2 rtl:sm:pl-4 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-200 flex-shrink-0 text-sm font-medium hover:text-slate-800 dark:hover:text-slate-200"
                aria-label={t('surpriseMe')}
            >
                <SparklesIcon className="h-6 w-6" />
                <span className="hidden sm:inline">{t('surpriseMe')}</span>
            </button>
            <LanguageSwitcher />
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </div>
      </div>
    </header>
  );
};