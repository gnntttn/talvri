
import React from 'react';

export const HeroSliderSkeleton: React.FC = () => {
  return (
    <div className="relative w-full aspect-[16/9] sm:aspect-[16/7] bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg animate-pulse mb-12">
      <div className="absolute bottom-0 left-0 p-4 sm:p-8 md:p-12 w-full sm:w-3/4 md:w-1/2">
        <div className="h-8 sm:h-12 bg-slate-300 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
        <div className="hidden sm:block h-4 bg-slate-300 dark:bg-slate-700 rounded w-full mb-2"></div>
        <div className="hidden sm:block h-4 bg-slate-300 dark:bg-slate-700 rounded w-5/6 mb-6"></div>
        <div className="h-12 bg-slate-300 dark:bg-slate-700 rounded w-40"></div>
      </div>
    </div>
  );
};
