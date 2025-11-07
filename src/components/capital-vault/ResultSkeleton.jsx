import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export default function ResultSkeleton({ theme }) {
  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header Skeleton */}
      <div className="relative overflow-hidden rounded-3xl p-8 md:p-10 backdrop-blur-2xl border border-white/10 shadow-2xl"
           style={{
             background: 'linear-gradient(135deg, rgba(26, 29, 41, 0.4) 0%, rgba(18, 20, 28, 0.4) 100%)'
           }}>
        
        {/* Shimmer effect overlay */}
        <motion.div
          className="absolute inset-0 -translate-x-full"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.1), transparent)',
            zIndex: 1
          }}
          animate={{ x: ['0%', '200%'] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-14 h-14 rounded-2xl" style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }} />
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" style={{ backgroundColor: 'rgba(167, 139, 250, 0.15)' }} />
                <Skeleton className="h-4 w-48" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }} />
              </div>
            </div>
            <Skeleton className="w-12 h-12 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
          </div>

          {/* Definition Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-5 h-5 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.3)' }} />
              <Skeleton className="h-6 w-24" style={{ backgroundColor: 'rgba(167, 139, 250, 0.2)' }} />
            </div>
            <div className="pl-6 space-y-3">
              <Skeleton className="h-5 w-full" style={{ backgroundColor: 'rgba(156, 163, 175, 0.2)' }} />
              <Skeleton className="h-5 w-4/5" style={{ backgroundColor: 'rgba(156, 163, 175, 0.15)' }} />
              <Skeleton className="h-5 w-3/4" style={{ backgroundColor: 'rgba(156, 163, 175, 0.1)' }} />
            </div>
          </div>

          {/* Example Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-5 h-5 rounded" style={{ backgroundColor: 'rgba(34, 197, 94, 0.3)' }} />
              <Skeleton className="h-6 w-20" style={{ backgroundColor: 'rgba(167, 139, 250, 0.2)' }} />
            </div>
            <div className="p-6 rounded-2xl border border-white/10 space-y-3"
                 style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <Skeleton className="h-4 w-full" style={{ backgroundColor: 'rgba(156, 163, 175, 0.2)' }} />
              <Skeleton className="h-4 w-5/6" style={{ backgroundColor: 'rgba(156, 163, 175, 0.15)' }} />
              <Skeleton className="h-4 w-4/5" style={{ backgroundColor: 'rgba(156, 163, 175, 0.1)' }} />
              <Skeleton className="h-4 w-3/4" style={{ backgroundColor: 'rgba(156, 163, 175, 0.08)' }} />
            </div>
          </div>

          {/* Formula Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-5 h-5 rounded" style={{ backgroundColor: 'rgba(139, 92, 246, 0.3)' }} />
              <Skeleton className="h-6 w-36" style={{ backgroundColor: 'rgba(167, 139, 250, 0.2)' }} />
            </div>
            <div className="space-y-4">
              <div className="p-6 rounded-2xl border border-purple-500/20 space-y-4"
                   style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.02) 100%)' }}>
                <Skeleton className="h-5 w-32" style={{ backgroundColor: 'rgba(196, 181, 253, 0.3)' }} />
                <div className="bg-black/30 p-4 rounded-xl border border-purple-500/30">
                  <Skeleton className="h-6 w-48" style={{ backgroundColor: 'rgba(196, 181, 253, 0.4)' }} />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" style={{ backgroundColor: 'rgba(156, 163, 175, 0.2)' }} />
                  <div className="grid grid-cols-2 gap-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white/5 space-y-1">
                        <Skeleton className="h-4 w-8" style={{ backgroundColor: 'rgba(196, 181, 253, 0.4)' }} />
                        <Skeleton className="h-3 w-24" style={{ backgroundColor: 'rgba(156, 163, 175, 0.2)' }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating accent elements */}
        <motion.div 
          className="absolute top-8 right-8 w-24 h-24 rounded-full opacity-[0.02] blur-2xl pointer-events-none"
          style={{ background: 'linear-gradient(45deg, #8B5CF6, #3B82F6)' }}
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </div>
    </motion.div>
  );
}