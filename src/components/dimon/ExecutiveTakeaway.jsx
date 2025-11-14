
// 🔒 DESIGN LOCKED — OS HORIZON V4.0
// Last Updated: 2025-01-20
// Do not modify visual design without explicit assignment
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, DollarSign, Globe, ExternalLink } from 'lucide-react';

const icons = { Scale, DollarSign, Globe };

const TakeawayItem = ({ item, onOpenMemo, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Safe data access
  const Icon = icons[item?.icon] || Globe;
  const type = String(item?.type || 'Analysis');
  const headline = String(item?.headline || 'No headline available');

  const handleClick = () => {
    try {
      if (item && onOpenMemo) {
        onOpenMemo(item);
      }
    } catch (error) {
      console.error('Error opening memo:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.23, 1, 0.32, 1]
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Open ${type}: ${headline}`}
      style={{
        willChange: 'transform, filter'
      }}
    >
      <motion.div
        className="relative cursor-pointer rounded-3xl p-6 backdrop-blur-2xl overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 6px rgba(115, 230, 210, 0.08)',
          minHeight: '180px'
        }}
        whileHover={{
          y: -2,
          boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.16), 0 0 8px rgba(115, 230, 210, 0.12)',
          borderColor: 'rgba(255, 255, 255, 0.16)',
          backdropFilter: 'blur(26px)',
          WebkitBackdropFilter: 'blur(26px)',
          transition: {
            type: 'spring',
            stiffness: 360,
            damping: 34,
            mass: 0.8
          }
        }}
        whileTap={{
          scale: 0.995,
          transition: { duration: 0.1 }
        }}
      >
        {/* Subsurface noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
            mixBlendMode: 'overlay'
          }}
          aria-hidden="true"
        />

        {/* Enhanced glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(86, 180, 255, 0.15) 0%, transparent 60%)',
            opacity: 0
          }}
          animate={{
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Icon capsule with inner gradient */}
          <motion.div 
            className="relative flex items-center justify-center rounded-2xl mb-4 overflow-hidden"
            style={{
              width: '48px',
              height: '48px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.10)'
            }}
            whileHover={{
              scale: 1.05,
              background: 'rgba(255, 255, 255, 0.12)',
              transition: { duration: 0.2 }
            }}
          >
            {/* Inner gradient mask */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, transparent 100%)',
                borderRadius: '16px'
              }}
              aria-hidden="true"
            />
            <Icon 
              className="w-6 h-6 relative z-10"
              style={{ 
                color: 'rgba(86, 180, 255, 0.8)',
                strokeWidth: 2
              }}
            />
          </motion.div>
          
          {/* Category label */}
          <span 
            className="block font-semibold mb-3"
            style={{
              fontSize: '15px',
              color: 'rgba(255, 255, 255, 0.88)',
              letterSpacing: '-0.01em'
            }}
          >
            {type}
          </span>

          {/* Headline - 2-line clamp */}
          <p 
            className="font-semibold mb-3"
            style={{
              fontSize: '22px',
              lineHeight: '1.25',
              color: 'rgba(255, 255, 255, 0.95)',
              letterSpacing: '-0.02em',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.5em'
            }}
          >
            {headline}
          </p>

          {/* CTA row */}
          <div className="flex items-center justify-between mt-4">
            <motion.span 
              className="font-medium"
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.72)'
              }}
              animate={{
                color: isHovered ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.72)'
              }}
              transition={{ duration: 0.14 }}
            >
              View analysis
            </motion.span>

            <motion.div
              style={{
                position: 'absolute',
                right: '24px',
                bottom: '24px'
              }}
              animate={{
                opacity: isHovered ? 1 : 0.6,
                x: isHovered ? 2 : 0
              }}
              transition={{ duration: 0.14, ease: 'easeOut' }}
            >
              <ExternalLink 
                className="w-4 h-4"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                aria-hidden="true"
              />
            </motion.div>
          </div>
        </div>

        {/* Focus ring for keyboard navigation */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(86, 180, 255, 0.4) 0%, rgba(167, 116, 255, 0.4) 100%)',
            opacity: 0
          }}
          animate={{
            opacity: 0
          }}
          aria-hidden="true"
        />
      </motion.div>
    </motion.div>
  );
};

// Loading skeleton component
const TakeawayItemSkeleton = ({ index }) => (
  <motion.div
    className="relative rounded-3xl p-6 backdrop-blur-2xl"
    style={{
      background: 'rgba(255, 255, 255, 0.06)',
      border: '1px solid rgba(255, 255, 255, 0.10)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      minHeight: '180px'
    }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.5,
      delay: index * 0.1,
      ease: [0.23, 1, 0.32, 1]
    }}
  >
    {/* Icon capsule skeleton */}
    <div 
      className="rounded-2xl mb-4 animate-pulse"
      style={{
        width: '48px',
        height: '48px',
        background: 'rgba(255, 255, 255, 0.08)'
      }}
    />
    
    {/* Text skeletons */}
    <div 
      className="h-4 w-24 rounded mb-3 animate-pulse"
      style={{ background: 'rgba(255, 255, 255, 0.08)' }}
    />
    <div 
      className="h-6 w-full rounded mb-2 animate-pulse"
      style={{ background: 'rgba(255, 255, 255, 0.08)' }}
    />
    <div 
      className="h-6 w-3/5 rounded animate-pulse"
      style={{ background: 'rgba(255, 255, 255, 0.08)' }}
    />
  </motion.div>
);

// Empty state component
const EmptyState = () => (
  <motion.div
    className="col-span-full flex flex-col items-center justify-center py-16 px-6 rounded-3xl backdrop-blur-2xl"
    style={{
      background: 'rgba(255, 255, 255, 0.04)',
      border: '2px dashed rgba(255, 255, 255, 0.12)',
      minHeight: '240px'
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <Globe 
      className="w-12 h-12 mb-4"
      style={{ 
        color: 'rgba(255, 255, 255, 0.3)',
        strokeWidth: 1.5
      }}
    />
    <p 
      className="text-lg font-semibold mb-2"
      style={{ color: 'rgba(255, 255, 255, 0.7)' }}
    >
      No insights yet — sources refreshing
    </p>
    <motion.button
      className="mt-3 px-4 py-2 rounded-xl text-sm font-medium"
      style={{
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        color: 'rgba(255, 255, 255, 0.8)'
      }}
      whileHover={{
        background: 'rgba(255, 255, 255, 0.10)',
        scale: 1.02
      }}
      whileTap={{ scale: 0.98 }}
    >
      Refresh
    </motion.button>
  </motion.div>
);

export default function ExecutiveTakeaway({ digest, onOpenMemo, isLoading = false }) {
  if (isLoading) {
    return (
      <motion.section 
        className="relative group"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      >
        {/* Section header */}
        <div className="mb-4 pl-2">
          <h2 
            className="font-semibold mb-2"
            style={{ 
              fontSize: '34px',
              lineHeight: '1.2',
              color: 'rgba(255, 255, 255, 0.95)',
              letterSpacing: '-0.02em'
            }}
          >
            U.S. Business & Markets
          </h2>
          <p 
            className="text-sm"
            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            High-conviction insights delivered for immediate strategic review.
          </p>
        </div>
        
        {/* Grid with loading skeletons */}
        <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <TakeawayItemSkeleton key={i} index={i} />
          ))}
        </div>
      </motion.section>
    );
  }

  if (!digest?.executive_takeaway || !Array.isArray(digest.executive_takeaway) || digest.executive_takeaway.length === 0) {
    return (
      <motion.section 
        className="relative group"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      >
        {/* Section header */}
        <div className="mb-4 pl-2">
          <h2 
            className="font-semibold mb-2"
            style={{ 
              fontSize: '34px',
              lineHeight: '1.2',
              color: 'rgba(255, 255, 255, 0.95)',
              letterSpacing: '-0.02em'
            }}
          >
            U.S. Business & Markets
          </h2>
          <p 
            className="text-sm"
            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            High-conviction insights delivered for immediate strategic review.
          </p>
        </div>
        
        {/* Grid with empty state */}
        <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2 xl:grid-cols-3">
          <EmptyState />
        </div>
      </motion.section>
    );
  }
  
  return (
    <motion.section 
      className="relative group"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    >
      {/* Section header */}
      <div className="mb-4 pl-2">
        <h2 
          className="font-semibold mb-2"
          style={{ 
            fontSize: '34px',
            lineHeight: '1.2',
            color: 'rgba(255, 255, 255, 0.95)',
            letterSpacing: '-0.02em'
          }}
        >
          U.S. Business & Markets
        </h2>
        <p 
          className="text-sm"
          style={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          High-conviction insights delivered for immediate strategic review.
        </p>
      </div>
      
      {/* Responsive grid with Horizon OS spacing */}
      <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2 xl:grid-cols-3">
        {digest.executive_takeaway.map((item, index) => (
          <TakeawayItem 
            key={index} 
            item={item}
            index={index}
            onOpenMemo={onOpenMemo}
          />
        ))}
      </div>

      {/* Enhanced CSS for keyboard focus */}
      <style jsx>{`
        [role="button"]:focus-visible {
          outline: 2px solid transparent;
          outline-offset: 2px;
        }

        [role="button"]:focus-visible > div {
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.35), 
                      0 0 0 2px rgba(86, 180, 255, 0.6),
                      0 0 0 4px rgba(167, 116, 255, 0.3) !important;
        }

        /* Ensure touch targets are adequate */
        @media (hover: none) and (pointer: coarse) {
          [role="button"] {
            min-height: 44px;
          }
        }

        /* Performance optimization */
        @supports (backdrop-filter: blur(24px)) {
          .backdrop-blur-2xl {
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </motion.section>
  );
}
