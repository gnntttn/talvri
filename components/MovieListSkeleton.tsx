
import React from 'react';

const SkeletonCard: React.FC = () => (
  <div className="bg-slate-200 dark:bg-slate-800 rounded-lg shadow-lg animate-pulse">
    <div className="aspect-[2/3] w-full"></div>
  </div>
);

export const MovieListSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};
