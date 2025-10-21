
import React from 'react';

const SkeletonCard: React.FC = () => (
  <div className="flex-shrink-0 w-36 sm:w-48">
    <div className="bg-slate-200 dark:bg-slate-800 rounded-lg shadow-lg animate-pulse">
      <div className="aspect-[2/3] w-full"></div>
    </div>
  </div>
);

export const MovieSliderSkeleton: React.FC = () => {
  return (
    <div className="mb-12">
      <div className="h-7 w-48 bg-slate-200 dark:bg-slate-700 rounded-md mb-4 animate-pulse"></div>
      <div className="flex space-x-4 overflow-hidden">
        {Array.from({ length: 7 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
};
