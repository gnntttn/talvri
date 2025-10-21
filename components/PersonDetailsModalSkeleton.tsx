
import React from 'react';

export const PersonDetailsModalSkeleton: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white dark:bg-slate-800 rounded-lg max-h-[90vh] shadow-xl max-w-4xl w-full relative animate-pulse">
            <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="sm:col-span-1">
                        <div className="w-full aspect-[2/3] bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                    </div>
                    <div className="sm:col-span-2">
                        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
                        <div className="space-y-3">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                        </div>
                        <div className="mt-6 space-y-2">
                            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                     <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                             <div key={i} className="aspect-[2/3] bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                        ))}
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
};
