// 🔒 DESIGN LOCKED — OS HORIZON V5.0 SIGNAL LENS REDESIGN
// Last Updated: 2025-01-20
// Complete redesign: Signal Lens Node + Mini Glass Chips + OS Horizon aesthetics
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

// OS Horizon Motion Tokens
const MOTION = {
  CURVES: {
    horizonIn: [0.22, 0.61, 0.36, 1],
    horizonSpring: [0.16, 1, 0.3, 1]
  },
  DURATIONS: {
    fast: 0.08,
    base: 0.12,
    slow: 0.18
  }
};

// Category Colors (OS Horizon muted palette)
const CATEGORY_COLORS = {
  'Policy': { accent: 'rgba(242, 106, 106, 0.50)', glow: 'rgba(242, 106, 106, 0.15)', dot: '#F26A6A' },
  'Credit': { accent: 'rgba(94, 167, 255, 0.50)', glow: 'rgba(94, 167, 255, 0.15)', dot: '#5EA7FF' },
  'Equities': { accent: 'rgba(43, 198, 134, 0.50)', glow: 'rgba(43, 198, 134, 0.15)', dot: '#2BC686' },
  'Global': { accent: 'rgba(255, 176, 32, 0.50)', glow: 'rgba(255, 176, 32, 0.15)', dot: '#FFB020' }
};

// ============================================================================
// SIGNAL LENS NODE — Central Visual Anchor
// ============================================================================
const SignalLensNode = ({ score, isHovered }) => {
  const [wavePhase, setWavePhase] = useState(0);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    
    let rafId;
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setWavePhase(elapsed);
      rafId = requestAnimationFrame(animate);
    };
    
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [shouldReduceMotion]);

  // Generate subtle wave paths
  const generateWavePath = (offset) => {
    const points = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const x = t * 160;
      const y = 80 + Math.sin((t * Math.PI * 2.5) + offset + (wavePhase * 0.2)) * 4;
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  };

  const getZoneColor = (s) => {
    if (s < 40) return '#F26A6A';
    if (s < 70) return '#5EA7FF';
    return '#2ECF8D';
  };

  const getZoneLabel = (s) => {
    if (s < 40) return 'Risk-Tilt';
    if (s < 70) return 'Mixed';
    return 'Constructive';
  };

  const getTrendIcon = (s) => {
    if (s < 40) return <TrendingDown className="w-4 h-4" />;
    if (s > 70) return <TrendingUp className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const scoreColor = getZoneColor(score);
  const scoreLabel = getZoneLabel(score);

  return (
    <div className="relative flex items-center justify-center" style={{ minHeight: '200px' }}>
      {/* Background Wavefield */}
      <svg 
        width="160" 
        height="160" 
        viewBox="0 0 160 160"
        className="absolute"
        style={{
          opacity: isHovered ? 0.08 : 0.06,
          transition: `opacity ${MOTION.DURATIONS.base}s ${MOTION.CURVES.horizonIn.join(',')}`
        }}
      >
        <defs>
          <filter id="wave-blur">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
          
          <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7BB8FF" stopOpacity="0" />
            <stop offset="30%" stopColor="#7BB8FF" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#A7D1FF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#A7D1FF" stopOpacity="0" />
          </linearGradient>
          
          <linearGradient id="wave-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A7D1FF" stopOpacity="0" />
            <stop offset="30%" stopColor="#A7D1FF" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#7BB8FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7BB8FF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 1, 2].map((i) => (
          <motion.polyline
            key={i}
            points={generateWavePath(i * Math.PI * 0.6)}
            fill="none"
            stroke={i % 2 === 0 ? 'url(#wave-grad-1)' : 'url(#wave-grad-2)'}
            strokeWidth="1.2"
            strokeLinecap="round"
            filter="url(#wave-blur)"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ 
              duration: 0.7, 
              delay: 0.1 + (i * 0.06),
              ease: MOTION.CURVES.horizonIn
            }}
          />
        ))}
      </svg>

      {/* Signal Lens Glass Panel */}
      <motion.div
        className="absolute"
        style={{
          width: '180px',
          height: '180px',
          borderRadius: '90px',
          background: `
            linear-gradient(145deg, 
              rgba(123, 184, 255, 0.08) 0%, 
              rgba(167, 209, 255, 0.12) 50%,
              rgba(123, 184, 255, 0.08) 100%
            )
          `,
          backdropFilter: 'blur(18px) saturate(140%)',
          WebkitBackdropFilter: 'blur(18px) saturate(140%)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          boxShadow: `
            inset 0 2px 8px rgba(255, 255, 255, 0.08),
            inset 0 -2px 6px rgba(0, 0, 0, 0.12),
            0 0 40px rgba(123, 184, 255, 0.06)
          `,
          willChange: 'transform, filter'
        }}
        animate={{
          scale: isHovered ? 1.025 : 1,
          filter: isHovered ? 'brightness(1.05)' : 'brightness(1)',
          boxShadow: isHovered
            ? `
              inset 0 2px 8px rgba(255, 255, 255, 0.08),
              inset 0 -2px 6px rgba(0, 0, 0, 0.12),
              0 0 48px rgba(123, 184, 255, 0.12)
            `
            : `
              inset 0 2px 8px rgba(255, 255, 255, 0.08),
              inset 0 -2px 6px rgba(0, 0, 0, 0.12),
              0 0 40px rgba(123, 184, 255, 0.06)
            `
        }}
        transition={{
          duration: MOTION.DURATIONS.base,
          ease: MOTION.CURVES.horizonIn
        }}
      >
        {/* Top subsurface lighting */}
        <div 
          className="absolute top-0 left-[15%] right-[15%] h-[24px] rounded-full"
          style={{
            background: 'linear-gradient(180deg, rgba(167, 209, 255, 0.12) 0%, transparent 100%)',
            filter: 'blur(10px)'
          }}
        />

        {/* Halo pulse on hover */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${scoreColor}20 0%, transparent 70%)`,
            filter: 'blur(20px)',
            opacity: 0
          }}
          animate={{
            opacity: isHovered ? 0.6 : 0,
            scale: isHovered ? 1.1 : 1
          }}
          transition={{
            duration: MOTION.DURATIONS.slow,
            ease: MOTION.CURVES.horizonIn
          }}
        />
      </motion.div>

      {/* Score Stack */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Micro separator line */}
        <motion.div
          className="mb-3"
          style={{
            width: '32px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
            borderRadius: '999px'
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        />

        {/* Trend Indicator */}
        <motion.div
          className="mb-2"
          style={{ color: scoreColor }}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 0.75, y: 0 }}
          transition={{ delay: 0.35, duration: 0.25 }}
        >
          {getTrendIcon(score)}
        </motion.div>

        {/* Primary Score */}
        <motion.span
          className="text-[52px] font-bold mb-2"
          style={{ 
            color: scoreColor,
            textShadow: isHovered 
              ? `0 0 20px ${scoreColor}30, 0 2px 4px rgba(0,0,0,0.20)` 
              : `0 0 12px ${scoreColor}20, 0 2px 4px rgba(0,0,0,0.20)`,
            letterSpacing: '-0.03em',
            lineHeight: '1'
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.35, ease: MOTION.CURVES.horizonSpring }}
        >
          {score}
        </motion.span>

        {/* Label */}
        <motion.div
          className="text-center mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.25 }}
        >
          <div 
            className="text-[15px] font-semibold mb-1" 
            style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em' }}
          >
            {scoreLabel} Consensus
          </div>
          <div 
            className="text-[12px] font-medium" 
            style={{ color: 'rgba(255,255,255,0.60)' }}
          >
            Conviction: Medium
          </div>
        </motion.div>

        {/* Bottom separator line */}
        <motion.div
          className="mt-3"
          style={{
            width: '32px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
            borderRadius: '999px'
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.65, duration: 0.3 }}
        />
      </div>
    </div>
  );
};

// ============================================================================
// MINI GLASS CHIPS — Category Weight Breakdown
// ============================================================================
const CategoryGlassChips = ({ segments, isHovered }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2.5 mb-7">
      {segments.map((segment, index) => {
        const colors = CATEGORY_COLORS[segment.name] || { 
          accent: 'rgba(170, 177, 184, 0.50)', 
          glow: 'rgba(170, 177, 184, 0.15)', 
          dot: '#AAB1B8' 
        };
        const value = (segment.weight || 0) * 100;
        const [isChipHovered, setIsChipHovered] = useState(false);
        
        return (
          <motion.div
            key={segment.name}
            className="relative"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.75 + (index * 0.05), 
              duration: 0.25,
              ease: MOTION.CURVES.horizonIn
            }}
            onHoverStart={() => setIsChipHovered(true)}
            onHoverEnd={() => setIsChipHovered(false)}
          >
            <motion.div
              className="px-3.5 py-2 rounded-xl flex items-center gap-2"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.06)',
                cursor: 'default'
              }}
              animate={{
                y: isChipHovered ? -2 : 0,
                background: isChipHovered ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.04)',
                boxShadow: isChipHovered
                  ? `inset 0 1px 2px rgba(255, 255, 255, 0.06), 0 0 16px ${colors.glow}`
                  : 'inset 0 1px 2px rgba(255, 255, 255, 0.06)'
              }}
              transition={{
                duration: MOTION.DURATIONS.fast,
                ease: MOTION.CURVES.horizonIn
              }}
            >
              {/* Color Dot */}
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: colors.dot,
                  boxShadow: `0 0 8px ${colors.glow}`
                }}
              />

              {/* Label */}
              <span 
                className="text-[11px] font-medium" 
                style={{ 
                  color: 'rgba(255,255,255,0.75)',
                  letterSpacing: '0.01em'
                }}
              >
                {segment.name}
              </span>

              {/* Value */}
              <span 
                className="text-[12px] font-bold ml-1" 
                style={{ color: colors.dot }}
              >
                {Math.round(value)}%
              </span>

              {/* Shimmer effect on hover */}
              {isChipHovered && !shouldReduceMotion && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${colors.accent} 50%, transparent 100%)`,
                    opacity: 0
                  }}
                  animate={{
                    x: ['-100%', '100%'],
                    opacity: [0, 0.15, 0]
                  }}
                  transition={{
                    duration: 0.8,
                    ease: 'linear'
                  }}
                />
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

// ============================================================================
// MAIN CONSENSUS COMPONENT
// ============================================================================
export default function ConsensusMeter({ score, breakdown, onOpenDrawer }) {
  const [isHovered, setIsHovered] = useState(false);

  if (typeof score !== 'number') {
    return null;
  }

  const segments = breakdown?.segments || [];
  const sourcesCount = 5;
  const updatedAgo = "2m ago";

  const handleOpenDrawer = () => {
    try {
      onOpenDrawer();
    } catch (error) {
      console.error('Error opening sentiment drawer:', error);
    }
  };

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="h-full rounded-[30px] flex flex-col cursor-pointer relative overflow-hidden consensus-lens"
      style={{
        padding: '32px 28px 28px 28px',
        // Liquid glass with OS Horizon translucency
        background: `
          linear-gradient(180deg, 
            rgba(20, 24, 32, 0.88) 0%,
            rgba(18, 22, 30, 0.92) 100%
          )
        `,
        backdropFilter: 'blur(22px) saturate(150%)',
        WebkitBackdropFilter: 'blur(22px) saturate(150%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: `
          0 0 24px rgba(123, 184, 255, 0.06),
          0 20px 40px rgba(0, 0, 0, 0.18),
          inset 0 1px 0 rgba(255, 255, 255, 0.06)
        `,
        willChange: 'transform, filter, box-shadow'
      }}
      whileHover={{ 
        y: -1.5,
        filter: 'brightness(1.03)',
        boxShadow: `
          0 0 28px rgba(123, 184, 255, 0.10),
          0 22px 48px rgba(0, 0, 0, 0.24),
          inset 0 1px 0 rgba(255, 255, 255, 0.06)
        `,
        transition: { 
          duration: MOTION.DURATIONS.base, 
          ease: MOTION.CURVES.horizonIn 
        }
      }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleOpenDrawer}
    >
      {/* Subsurface gradient lighting (top) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 100%)',
        pointerEvents: 'none',
        borderRadius: '30px 30px 0 0'
      }} />

      {/* Subsurface gradient lighting (bottom) */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.035) 100%)',
        pointerEvents: 'none',
        borderRadius: '0 0 30px 30px'
      }} />

      {/* Soft edge bloom */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        right: '20%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        filter: 'blur(1.5px)',
        pointerEvents: 'none'
      }} />

      {/* Gradient noise texture */}
      <div 
        className="absolute inset-0 rounded-[30px] pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
          backgroundSize: '200px 200px',
          opacity: 0.045,
          mixBlendMode: 'overlay'
        }}
      />

      {/* TOP: Title Row */}
      <div className="flex items-center justify-between mb-8" style={{ position: 'relative', zIndex: 10 }}>
        <motion.h2 
          className="text-[17px] font-semibold"
          style={{ 
            color: 'rgba(255,255,255,0.96)',
            letterSpacing: '-0.01em'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08 }}
        >
          Consensus
        </motion.h2>
        <motion.div
          className="px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            color: 'rgba(255,255,255,0.70)',
            fontSize: '11px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18 }}
        >
          {score}%
        </motion.div>
      </div>

      {/* MIDDLE: Signal Lens Node */}
      <div className="mb-8" style={{ position: 'relative', zIndex: 10 }}>
        <SignalLensNode score={score} isHovered={isHovered} />
      </div>

      {/* LOWER: Category Glass Chips */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <CategoryGlassChips segments={segments} isHovered={isHovered} />
      </div>

      {/* FOOTER: Metadata */}
      <motion.p
        className="text-xs text-center"
        style={{ 
          color: 'rgba(255,255,255,0.60)', 
          opacity: 0.85, 
          position: 'relative', 
          zIndex: 10,
          fontSize: '11px'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{ delay: 1.0 }}
      >
        Based on {sourcesCount} sources • Updated {updatedAgo}
      </motion.p>

      {/* Hover Hint */}
      <motion.div 
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center text-xs pointer-events-none"
        style={{ color: 'rgba(255,255,255,0.50)', zIndex: 10 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <Activity className="w-3 h-3 mr-1.5" />
        View detailed breakdown
      </motion.div>

      <style jsx>{`
        .consensus-lens {
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .consensus-lens * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }

        /* Responsive scaling */
        @media (max-width: 768px) {
          .consensus-lens {
            padding: 28px 24px 24px 24px;
          }
        }
      `}</style>
    </motion.div>
  );
}