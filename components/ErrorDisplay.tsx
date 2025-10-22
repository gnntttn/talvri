
import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface ErrorDisplayProps {
  message: string;
  title?: string;
  onRetry?: () => void;
}

const ExclamationTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.007H12v-.007Z" />
  </svg>
);

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, title, onRetry }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4">
      <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mb-4" />
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
        {title || t('errorOccurred')}
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75 transition-transform duration-200 hover:scale-105"
        >
          Retry
        </button>
      )}
    </div>
  );
};
