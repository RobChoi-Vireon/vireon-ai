// 🔒 DESIGN LOCKED — OS HORIZON V4.0
// Last Updated: 2025-01-20
// Do not modify visual design without explicit assignment
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, DollarSign, Globe, ExternalLink, TrendingUp, TrendingDown, BarChart3, Building, Briefcase, AlertTriangle, Users, Factory, Landmark } from 'lucide-react';

const icons = { TrendingUp, TrendingDown, BarChart3, DollarSign, Building, Briefcase, AlertTriangle, Users, Globe, Scale, Factory, Landmark };

const TakeawayItem = ({ item, onOpenMemo, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isNearCursor, setIsNearCursor] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const buttonRef = React.useRef(null);
  
  // Safe data access
  const Icon = icons[item?.icon] || Globe;
  const type = String(item?.type || 'Analysis');
  const headline = String(item?.headline || 'No headline available');

  // Signal metadata from live contract data
  const signalMeta = {
    sentiment: item?.sentiment || 'MIXED',
    timeframe: item?.timeframe || 'SHORT-TERM',
    impact: item?.impact || 'MEDIUM',
    summary: item?.drawer?.simplified?.mood || ''
  };

  // Cursor proximity detection + parallax tilt
  React.useEffect(() => {
    const handleMouseMove = (e) => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
        );
        setIsNearCursor(distance < 60);

        // Parallax tilt calculation (2-3° max, very subtle)
        if (isHovered && distance < rect.width) {
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          const percentX = (mouseX / rect.width - 0.5) * 2; // -1 to 1
          const percentY = (mouseY / rect.height - 0.5) * 2; // -1 to 1
          
          // Apple-grade subtle tilt: max 2.5°
          setTiltX(percentY * -2.5);
          setTiltY(percentX * 2.5);
        } else {
          setTiltX(0);
          setTiltY(0);
        }
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  const handleClick = (e) => {
    try {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 130);
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

  const isPrimary = index === 0; // Markets card is subtly more primary

  return (
    <motion.div
      ref={buttonRef}
      className="group relative"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.46,
        delay: index * 0.08,
        ease: [0.22, 0.61, 0.36, 1]
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
      {/* OS Horizon Tahoe Liquid-Glass Panel with Parallax */}
      <motion.div
        className="relative cursor-pointer rounded-[28px] backdrop-blur-xl overflow-hidden"
        style={{
          background: `linear-gradient(145deg, 
            rgba(255, 255, 255, ${isPrimary ? '0.105' : '0.095'}) 0%, 
            rgba(255, 255, 255, ${isPrimary ? '0.088' : '0.082'}) 100%)`,
          border: '1px solid rgba(255, 255, 255, 0.11)',
          boxShadow: isPrimary 
            ? `
              0 ${isPressed ? 10 : 24}px ${isPressed ? 36 : 52}px -8px rgba(0, 0, 0, ${isPressed ? '0.28' : '0.32'}),
              inset 0 1.5px 0 rgba(255,255,255,0.08),
              inset 0 -1px 1px rgba(0,0,0,0.03)
            `
            : `
              0 ${isPressed ? 8 : 20}px ${isPressed ? 32 : 44}px -8px rgba(0, 0, 0, ${isPressed ? '0.24' : '0.28'}),
              inset 0 1.5px 0 rgba(255,255,255,0.07),
              inset 0 -1px 1px rgba(0,0,0,0.03)
            `,
          minHeight: '220px',
          padding: '26px 28px',
          transformStyle: 'preserve-3d',
          perspective: '1200px'
        }}
        animate={{
          y: isPressed ? 2 : (isHovered ? -2 : 0),
          scale: isPressed ? 0.99 : (isHovered ? 1.01 : 1),
          rotateX: tiltX,
          rotateY: tiltY,
          background: isPressed 
            ? `linear-gradient(145deg, rgba(255, 255, 255, 0.072) 0%, rgba(255, 255, 255, 0.058) 100%)`
            : (isHovered 
              ? `linear-gradient(145deg, rgba(255, 255, 255, ${isPrimary ? '0.118' : '0.108'}) 0%, rgba(255, 255, 255, ${isPrimary ? '0.098' : '0.092'}) 100%)`
              : `linear-gradient(145deg, rgba(255, 255, 255, ${isPrimary ? '0.105' : '0.095'}) 0%, rgba(255, 255, 255, ${isPrimary ? '0.088' : '0.082'}) 100%)`),
          boxShadow: isPressed
            ? (isPrimary 
              ? `0 10px 36px -8px rgba(0, 0, 0, 0.28), inset 0 2px 5px rgba(0,0,0,0.12)`
              : `0 8px 32px -8px rgba(0, 0, 0, 0.24), inset 0 2px 4px rgba(0,0,0,0.10)`)
            : (isHovered
              ? (isPrimary
                ? `0 30px 60px -8px rgba(0, 0, 0, 0.38), 0 0 30px rgba(86, 156, 235, 0.16), inset 0 1.5px 0 rgba(255,255,255,0.10)`
                : `0 26px 52px -8px rgba(0, 0, 0, 0.34), 0 0 26px rgba(86, 156, 235, 0.12), inset 0 1.5px 0 rgba(255,255,255,0.09)`)
              : (isPrimary 
                ? `0 24px 52px -8px rgba(0, 0, 0, 0.32), inset 0 1.5px 0 rgba(255,255,255,0.08)`
                : `0 20px 44px -8px rgba(0, 0, 0, 0.28), inset 0 1.5px 0 rgba(255,255,255,0.07)`))
        }}
        transition={{
          type: "spring",
          stiffness: 290,
          damping: 28,
          mass: 1
        }}
      >
        {/* Micro-grain texture (1.2%) */}
        <div 
          className="absolute inset-0 opacity-[0.012] pointer-events-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            mixBlendMode: 'overlay',
            borderRadius: '28px'
          }}
          aria-hidden="true"
        />

        {/* Directional subsurface lighting (Tahoe key light simulation) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isPrimary
              ? 'radial-gradient(ellipse at 22% 18%, rgba(255, 255, 255, 0.13) 0%, rgba(0, 0, 0, 0.01) 100%)'
              : 'radial-gradient(ellipse at 22% 18%, rgba(255, 255, 255, 0.10) 0%, rgba(0, 0, 0, 0.007) 100%)',
            borderRadius: '28px'
          }}
          aria-hidden="true"
        />

        {/* Soft upward glow to prevent bottom heaviness */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 100%, rgba(255, 255, 255, 0.015) 0%, transparent 60%)',
            borderRadius: '28px'
          }}
          aria-hidden="true"
        />

        {/* Enhanced 1px Inner Rim Glow (top + left edges, feathered) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(to bottom, rgba(86, 156, 235, ${isPrimary ? '0.24' : '0.22'}) 0%, transparent 28%),
              linear-gradient(to right, rgba(86, 156, 235, ${isPrimary ? '0.24' : '0.22'}) 0%, transparent 28%)
            `,
            borderRadius: '28px',
            opacity: isHovered ? 0.72 : 0.62,
            filter: 'blur(0.5px)'
          }}
          aria-hidden="true"
        />

        {/* Soft upward glow (prevents bottom visual heaviness) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 105%, rgba(255, 255, 255, 0.018) 0%, transparent 55%)',
            borderRadius: '28px'
          }}
          aria-hidden="true"
        />

        {/* Tahoe Ambient Bloom - desaturated sapphire */}
        <motion.div
          className="absolute inset-0 rounded-[28px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 40% 25%, rgba(86, 156, 235, 0.14) 0%, transparent 65%)'
          }}
          animate={{
            opacity: isPressed ? 0.08 : (isHovered ? 0.18 : 0.12)
          }}
          transition={{ duration: isPressed ? 0.08 : 0.20, ease: [0.22, 0.61, 0.36, 1] }}
          aria-hidden="true"
        />

        {/* Cursor proximity halo (4–6%) */}
        <motion.div
          className="absolute -inset-2 rounded-[30px] pointer-events-none blur-xl"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(86, 156, 235, 0.20) 0%, transparent 70%)'
          }}
          animate={{
            opacity: isNearCursor ? 0.06 : 0
          }}
          transition={{ duration: 0.20 }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Enhanced Icon Tile with Glass Treatment */}
          <motion.div 
            className="relative flex items-center justify-center rounded-[18px] mb-4 overflow-hidden"
            style={{
              width: '48px',
              height: '48px',
              background: `linear-gradient(180deg, rgba(255, 255, 255, ${isPrimary ? '0.12' : '0.10'}) 0%, rgba(255, 255, 255, ${isPrimary ? '0.08' : '0.07'}) 100%)`,
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08)`
            }}
            animate={{
              scale: isPressed ? 0.96 : (isHovered ? 1.03 : 1),
              background: isHovered 
                ? `linear-gradient(180deg, rgba(255, 255, 255, ${isPrimary ? '0.15' : '0.13'}) 0%, rgba(255, 255, 255, ${isPrimary ? '0.11' : '0.10'}) 100%)`
                : `linear-gradient(180deg, rgba(255, 255, 255, ${isPrimary ? '0.12' : '0.10'}) 0%, rgba(255, 255, 255, ${isPrimary ? '0.08' : '0.07'}) 100%)`
            }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            {/* Inner glow of accent blue */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 50%, rgba(86, 156, 235, 0.08) 0%, transparent 70%)',
                borderRadius: '18px'
              }}
              aria-hidden="true"
            />

            {/* Icon with enhanced styling */}
            <div className="relative">
              {/* Enhanced sapphire halo (6-10px radius) */}
              <motion.div 
                style={{
                  position: 'absolute',
                  inset: '-9px',
                  background: 'radial-gradient(circle, rgba(86, 156, 235, 0.26) 0%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(9px)',
                  pointerEvents: 'none'
                }}
                animate={{
                  opacity: isHovered ? 0.22 : 0.02
                }}
                transition={{ duration: 0.20, ease: [0.22, 0.61, 0.36, 1] }}
              />

              {/* 2% refraction line at 1.5° */}
              <div
                style={{
                  position: 'absolute',
                  top: '-2px',
                  left: '20%',
                  right: '20%',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.02), transparent)',
                  transform: 'rotate(1.5deg)',
                  pointerEvents: 'none'
                }}
              />

              <motion.div
                animate={{
                  opacity: isPressed ? 0.70 : (isHovered ? 0.92 : 0.80),
                  filter: isHovered 
                    ? 'brightness(1.12) drop-shadow(0 0 10px rgba(86, 156, 235, 0.32))'
                    : 'brightness(1.02)'
                }}
                transition={{ duration: 0.20, ease: [0.22, 0.61, 0.36, 1] }}
              >
                <Icon 
                  className="w-6 h-6 relative z-10"
                  style={{ 
                    color: 'rgba(86, 156, 235, 1)',
                    strokeWidth: 2.2
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
          
          {/* Micro-signal tags (calmer glass pills) */}
          <div className="flex items-center gap-2 mb-4" style={{ marginTop: '10px' }}>
            <div
              className="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                color: 'rgba(255, 255, 255, 0.64)',
                letterSpacing: '0.06em'
              }}
            >
              {signalMeta.sentiment}
            </div>
            <div
              className="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                color: 'rgba(255, 255, 255, 0.64)',
                letterSpacing: '0.06em'
              }}
            >
              {signalMeta.timeframe}
            </div>
            <div
              className="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider flex items-center gap-1"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                color: 'rgba(255, 255, 255, 0.64)',
                letterSpacing: '0.06em'
              }}
            >
              <div style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: signalMeta.impact === 'HIGH' ? '#E6A84E' : (signalMeta.impact === 'MEDIUM' ? '#9BA8B8' : '#6BCAB8'),
                opacity: 0.72
              }} />
              {signalMeta.impact}
            </div>
          </div>

          {/* Category label */}
          <span 
            className="block font-semibold mb-2.5"
            style={{
              fontSize: '15px',
              color: 'rgba(255, 255, 255, 0.90)',
              letterSpacing: '-0.01em'
            }}
          >
            {type}
          </span>

          {/* Headline - 2-line clamp */}
          <motion.p 
            className="font-semibold mb-2.5"
            style={{
              fontSize: '22px',
              lineHeight: '1.25',
              color: 'rgba(255, 255, 255, 0.96)',
              letterSpacing: '-0.02em',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.5em'
            }}
            animate={{
              y: isHovered ? -1 : 0,
              color: isHovered ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.96)'
            }}
            transition={{ duration: 0.18 }}
          >
            {headline}
          </motion.p>

          {/* Micro-signal summary line */}
          <motion.p
            className="text-sm font-medium mb-4"
            style={{
              color: 'rgba(255, 255, 255, 0.72)',
              lineHeight: '1.45',
              letterSpacing: '0.003em'
            }}
            animate={{
              opacity: isHovered ? 0.95 : 0.80
            }}
            transition={{ duration: 0.16 }}
          >
            {signalMeta.summary}
          </motion.p>

          {/* CTA row - "View analysis" link */}
          <div className="flex items-center justify-between mt-5">
            <motion.span 
              className="font-medium relative"
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.78)'
              }}
              animate={{
                y: isHovered ? -2 : 0,
                opacity: isHovered ? 1.0 : 0.78,
                letterSpacing: isHovered ? '0.012em' : '0em'
              }}
              transition={{ duration: 0.20, ease: [0.22, 0.61, 0.36, 1] }}
            >
              View analysis
              {/* Soft underline glow on text hover */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(86, 156, 235, 0.32), transparent)',
                  filter: 'blur(0.5px)'
                }}
                animate={{
                  opacity: isHovered ? 0.10 : 0
                }}
                transition={{ duration: 0.18 }}
              />
            </motion.span>

            <motion.div
              style={{
                position: 'absolute',
                right: '28px',
                bottom: '26px'
              }}
              animate={{
                opacity: isHovered ? 1 : 0.62,
                x: isHovered ? 2 : 0
              }}
              transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <ExternalLink 
                className="w-4 h-4"
                style={{ color: 'rgba(86, 156, 235, 0.78)' }}
                strokeWidth={2}
                aria-hidden="true"
              />
            </motion.div>
          </div>
        </div>

        {/* Periodic shimmer line (every 10–14s) */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
            borderRadius: '28px'
          }}
          animate={{
            x: ['-110%', '110%'],
            opacity: [0, 0.06, 0]
          }}
          transition={{
            duration: 1.4,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatDelay: 10 + index * 1.8
          }}
        />

        {/* Focus ring for keyboard navigation */}
        <motion.div
          className="absolute inset-0 rounded-[28px] pointer-events-none"
          style={{
            boxShadow: '0 0 0 2px rgba(86, 156, 235, 0.6)',
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

export default function ExecutiveTakeaway({ businessMarkets, onOpenMemo, isLoading = false }) {
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
            Clear, fast insights anyone can understand.
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

  const cards = businessMarkets?.cards ? Object.values(businessMarkets.cards) : [];

  if (cards.length === 0) {
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
            Clear, fast insights anyone can understand.
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
      <div className="mb-6 pl-2">
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
      
      {/* OS Horizon Section Plate - subtle translucent group layer */}
      <div 
        className="relative rounded-[32px] overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(13, 15, 18, 0.06) 0%, rgba(21, 27, 34, 0.08) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '6px',
          boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.02)'
        }}
      >
        {/* Soft edge vignette */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.04) 100%)',
          borderRadius: '32px',
          pointerEvents: 'none'
        }} />

        {/* Responsive grid with Horizon OS spacing */}
        <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2 xl:grid-cols-3 relative z-10">
          {cards.slice(0, 3).map((item, index) => (
            <TakeawayItem 
              key={index} 
              item={item}
              index={index}
              onOpenMemo={onOpenMemo}
            />
          ))}
        </div>
      </div>

      {/* Enhanced CSS for keyboard focus and animations */}
      <style jsx>{`
        [role="button"]:focus-visible {
          outline: 2px solid transparent;
          outline-offset: 2px;
        }

        [role="button"]:focus-visible > div {
          box-shadow: 0 28px 56px -8px rgba(0, 0, 0, 0.38), 
                      0 0 0 2px rgba(86, 156, 235, 0.6) !important;
          border-color: rgba(86, 156, 235, 0.4) !important;
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