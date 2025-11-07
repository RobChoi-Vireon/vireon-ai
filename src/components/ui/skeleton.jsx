import React from "react";

const Skeleton = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`animate-shimmer rounded-md ${className}`}
      {...props}
    />
  );
});

Skeleton.displayName = "Skeleton";

const SkeletonText = ({ lines = 3, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    {[...Array(lines)].map((_, i) => (
      <Skeleton 
        key={i} 
        className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} 
      />
    ))}
  </div>
);

const SkeletonCard = ({ className = "" }) => (
  <div className={`p-6 rounded-2xl elevation-1 ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
    <SkeletonText lines={3} />
  </div>
);

const SkeletonWatchlistItem = ({ className = "" }) => (
  <div className={`flex items-center justify-between p-6 ${className}`}>
    <div className="flex items-center space-x-6">
      <Skeleton className="w-3 h-3 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <div className="flex items-center space-x-8">
      <Skeleton className="w-32 h-12 rounded-xl" />
      <div className="text-right space-y-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex space-x-2">
        <Skeleton className="w-11 h-11 rounded-xl" />
        <Skeleton className="w-11 h-11 rounded-xl" />
      </div>
    </div>
  </div>
);

const SkeletonChart = ({ className = "" }) => (
  <div className={`elevation-1 rounded-2xl p-6 ${className}`}>
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-8 w-24 rounded-lg" />
    </div>
    <div className="space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  </div>
);

export { Skeleton, SkeletonText, SkeletonCard, SkeletonWatchlistItem, SkeletonChart };