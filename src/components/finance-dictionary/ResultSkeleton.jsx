import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ResultSkeleton({ theme }) {
  const CardSkeleton = () => (
    <div className="p-6 rounded-2xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center mb-4">
        <Skeleton className={`w-8 h-8 rounded-lg mr-3 ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
        <Skeleton className={`h-6 w-32 rounded-md ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
      </div>
      <div className="space-y-3">
        <Skeleton className={`h-4 w-full rounded-md ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
        <Skeleton className={`h-4 w-5/6 rounded-md ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
        <Skeleton className={`h-4 w-full rounded-md mt-4 ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
        <Skeleton className={`h-4 w-1/2 rounded-md ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="hidden lg:block space-y-8">
        <div className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <Skeleton className={`h-6 w-2/5 mb-4 rounded-md ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
          <div className="space-y-3">
            <Skeleton className={`h-8 w-full rounded-md ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
            <Skeleton className={`h-8 w-full rounded-md ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
            <Skeleton className={`h-8 w-full rounded-md ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
          </div>
        </div>
        <div className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <Skeleton className={`h-6 w-1/2 mb-4 rounded-md ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
          <div className="flex flex-wrap gap-2">
            <Skeleton className={`h-7 w-20 rounded-md ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
            <Skeleton className={`h-7 w-24 rounded-md ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
            <Skeleton className={`h-7 w-16 rounded-md ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}