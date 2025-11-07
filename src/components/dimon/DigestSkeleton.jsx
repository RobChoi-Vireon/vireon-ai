import React from 'react';
import { motion } from 'framer-motion';

const ShimmerCard = ({ children, className = "" }) => (
  <motion.div 
    className={`rounded-2xl p-6 backdrop-blur-xl border border-white/10 ${className}`}
    style={{ 
      background: 'rgba(18, 20, 25, 0.4)',
    }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const ShimmerLine = ({ width, height = "h-4", className = "" }) => (
  <motion.div
    className={`${height} ${width} rounded-lg ${className}`}
    style={{
      background: `
        linear-gradient(90deg, 
          rgba(255, 255, 255, 0.05) 0%, 
          rgba(255, 255, 255, 0.15) 50%, 
          rgba(255, 255, 255, 0.05) 100%
        )`,
      backgroundSize: '200% 100%'
    }}
    animate={{
      backgroundPosition: ['200% 0%', '-200% 0%']
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'linear'
    }}
  />
);

export default function DigestSkeleton() {
  return (
    <div className="space-y-8 md:space-y-12">
      {/* Priority Signals Skeleton */}
      <ShimmerCard>
        <div className="flex items-center mb-6">
          <ShimmerLine width="w-8" height="h-8" className="rounded-lg mr-3" />
          <div>
            <ShimmerLine width="w-32" height="h-5" className="mb-2" />
            <ShimmerLine width="w-48" height="h-3" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-white/5">
              <div className="flex items-center space-x-3">
                <ShimmerLine width="w-4" height="h-4" />
                <ShimmerLine width="w-20" height="h-4" />
                <ShimmerLine width="w-16" height="h-3" />
              </div>
              <ShimmerLine width="w-full" height="h-4" className="mt-3" />
            </div>
          ))}
        </div>
      </ShimmerCard>

      {/* Executive Takeaway Skeleton */}
      <ShimmerCard>
        <div className="mb-6">
          <ShimmerLine width="w-40" height="h-6" className="mb-2" />
          <ShimmerLine width="w-64" height="h-4" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 rounded-xl border border-white/5">
              <div className="flex items-center space-x-3 mb-4">
                <ShimmerLine width="w-8" height="h-8" className="rounded-lg" />
                <ShimmerLine width="w-16" height="h-4" />
              </div>
              <ShimmerLine width="w-full" height="h-5" className="mb-3" />
              <ShimmerLine width="w-3/4" height="h-4" />
            </div>
          ))}
        </div>
      </ShimmerCard>

      {/* Consensus & Divergences Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Consensus Skeleton */}
        <ShimmerCard className="lg:col-span-4">
          <div className="text-center">
            <ShimmerLine width="w-32" height="h-6" className="mx-auto mb-4" />
            <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-white/10" />
            <ShimmerLine width="w-24" height="h-8" className="mx-auto mb-2" />
            <ShimmerLine width="w-40" height="h-4" className="mx-auto" />
          </div>
        </ShimmerCard>

        {/* Divergences Skeleton */}
        <ShimmerCard className="lg:col-span-8">
          <div className="mb-6">
            <ShimmerLine width="w-28" height="h-6" className="mb-2" />
            <ShimmerLine width="w-48" height="h-4" />
          </div>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="p-3 rounded-lg border border-white/5">
                <ShimmerLine width="w-full" height="h-4" className="mb-2" />
                <ShimmerLine width="w-2/3" height="h-3" />
              </div>
            ))}
          </div>
        </ShimmerCard>
      </div>

      {/* Additional Sections */}
      {[...Array(4)].map((_, i) => (
        <ShimmerCard key={i}>
          <div className="mb-6">
            <ShimmerLine width="w-36" height="h-6" className="mb-2" />
            <ShimmerLine width="w-56" height="h-4" />
          </div>
          <div className="space-y-4">
            <ShimmerLine width="w-full" height="h-4" />
            <ShimmerLine width="w-5/6" height="h-4" />
            <ShimmerLine width="w-3/4" height="h-4" />
          </div>
        </ShimmerCard>
      ))}
    </div>
  );
}