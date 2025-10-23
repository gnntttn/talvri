

import React from 'react';

interface RatingCircleProps {
  rating: number;
}

export const RatingCircle: React.FC<RatingCircleProps> = ({ rating }) => {
  if (!rating || rating <= 0) {
    return (
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center" title="No rating available">
            <span className="text-slate-600 dark:text-slate-200 font-bold text-xs">NR</span>
        </div>
    );
  }

  const getRatingColor = () => {
    if (rating >= 7.5) return 'text-green-500';
    if (rating >= 5) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
      <span className={`font-bold text-lg ${getRatingColor()}`}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
};