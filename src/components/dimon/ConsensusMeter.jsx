// 🔒 DESIGN LOCKED — OS HORIZON V5.0 SIGNAL LENS REDESIGN
// Last Updated: 2025-01-20
// Complete redesign: Signal Lens Node + Mini Glass Chips + OS Horizon aesthetics
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

// OS Horizon Motion Tokens
const MOTION = {
  CURVES: {
    horizonIn: [0.22, 0.61, 0.36, 1],
    horizonSpring: [0.16, 1, 0.3, 1]
  },
  DURATIONS: {
    fast: 0.08,
    base: 0.11,
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
// SIGNAL LENS NODE — Central Visual Anchor with Enhanced Lighting & Motion
// ============================================================================
const SignalLensNode = ({ score, isHovered, parentRef }) => {
  const [wavePhase, setWavePhase] = useState(0);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState(0);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-100, 100], [1.5, -1.5]);
  const rotateY = useTransform(mouseX, [-100, 100], [-1.5, 1.5]);

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
      setBreathingPhase(elapsed);
      rafId = requestAnimationFrame(animate);
    };
    
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [shouldReduceMotion]);

  // Mouse parallax effect
  useEffect(() => {
    if (shouldReduceMotion || !parentRef?.current) return;

    const handleMouseMove = (e) => {
      const rect = parentRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    const parent = parentRef.current;
    parent.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      parent.removeEventListener('mousemove', handleMouseMove);
    };
  }, [shouldReduceMotion, parentRef, mouseX, mouseY]);

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
    if (s < 40) return <TrendingDown className="w-3.5 h-3.5" strokeWidth={2.5} />;
    if (s > 70) return <TrendingUp className="w-3.5 h-3.5" strokeWidth={2.5} />;
    return <div className="w-2 h-2 rounded-full" style={{ background: 'currentColor' }} />;
  };

  const scoreColor = getZoneColor(score);
  const scoreLabel = getZoneLabel(score);
  
  const breathingScale = 1 + Math.sin(breathingPhase * (2 * Math.PI / 3.5)) * 0.015;

  return (
    <div className="relative flex items-center justify-center" style={{ minHeight: '200px' }}>
      {/* Background Wavefield */}
      <svg 
        width="160" 
        height="160" 
        viewBox="0 0 160 160"
        className="absolute"
        style={{
          opacity: isHovered ? 0.09 : 0.07,
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

      {/* Subsurface Lighting Beneath Orb */}
      <motion.div
        className="absolute"
        style={{
          width: '200px',
          height: '80px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -30%)',
          background: `radial-gradient(ellipse, rgba(123, 184, 255, 0.12) 0%, transparent 70%)`,
          filter: 'blur(24px)',
          pointerEvents: 'none'
        }}
        animate={{
          opacity: isHovered ? 0.8 : 0.6,
          scale: breathingScale
        }}
        transition={{
          opacity: { duration: 0.2 },
          scale: { duration: 3.5, ease: 'easeInOut' }
        }}
      />

      {/* Signal Lens Glass Panel - Outer Layer */}
      <motion.div
        className="absolute signal-orb-outer"
        style={{
          width: '180px',
          height: '180px',
          borderRadius: '90px',
          background: `
            linear-gradient(145deg, 
              rgba(123, 184, 255, 0.10) 0%, 
              rgba(167, 209, 255, 0.14) 50%,
              rgba(123, 184, 255, 0.10) 100%
            )
          `,
          backdropFilter: 'blur(18px) saturate(140%)',
          WebkitBackdropFilter: 'blur(18px) saturate(140%)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          boxShadow: `
            inset 0 2px 8px rgba(255, 255, 255, 0.10),
            inset 0 -2px 6px rgba(0, 0, 0, 0.12),
            0 0 40px rgba(123, 184, 255, 0.08)
          `,
          willChange: 'transform, filter',
          rotateX: 0,
          rotateY: 0
        }}
        animate={{
          scale: isHovered ? 1.03 : breathingScale,
          filter: isHovered ? 'brightness(1.05)' : 'brightness(1)',
          boxShadow: isHovered
            ? `
              inset 0 2px 8px rgba(255, 255, 255, 0.10),
              inset 0 -2px 6px rgba(0, 0, 0, 0.12),
              0 0 52px rgba(123, 184, 255, 0.14)
            `
            : `
              inset 0 2px 8px rgba(255, 255, 255, 0.10),
              inset 0 -2px 6px rgba(0, 0, 0, 0.12),
              0 0 40px rgba(123, 184, 255, 0.08)
            `,
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY
        }}
        transition={{
          scale: { duration: isHovered ? MOTION.DURATIONS.base : 3.5, ease: MOTION.CURVES.horizonIn },
          filter: { duration: MOTION.DURATIONS.base },
          boxShadow: { duration: MOTION.DURATIONS.base },
          rotateX: { duration: 0.15, ease: 'easeOut' },
          rotateY: { duration: 0.15, ease: 'easeOut' }
        }}
      >
        {/* Inner Layer with Faint Blur */}
        <div
          className="absolute inset-[8px] rounded-full"
          style={{
            background: `
              linear-gradient(145deg, 
                rgba(167, 209, 255, 0.06) 0%, 
                rgba(123, 184, 255, 0.08) 50%,
                rgba(167, 209, 255, 0.06) 100%
              )
            `,
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)'
          }}
        />

        {/* Top-left Specular Highlight */}
        <div 
          className="absolute top-[14px] left-[14px] w-[52px] h-[52px] rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.16) 0%, transparent 60%)',
            filter: 'blur(8px)',
            pointerEvents: 'none'
          }}
        />

        {/* Bottom-right Specular Highlight */}
        <div 
          className="absolute bottom-[18px] right-[18px] w-[40px] h-[40px] rounded-full"
          style={{
            background: 'radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.10) 0%, transparent 60%)',
            filter: 'blur(6px)',
            pointerEvents: 'none'
          }}
        />

        {/* Top subsurface lighting */}
        <div 
          className="absolute top-0 left-[15%] right-[15%] h-[24px] rounded-full"
          style={{
            background: 'linear-gradient(180deg, rgba(167, 209, 255, 0.14) 0%, transparent 100%)',
            filter: 'blur(10px)'
          }}
        />

        {/* Halo pulse on hover with breathing */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${scoreColor}22 0%, transparent 70%)`,
            filter: 'blur(20px)',
            opacity: 0
          }}
          animate={{
            opacity: isHovered ? 0.7 : (breathingScale - 1) * 15,
            scale: isHovered ? 1.12 : 1.05
          }}
          transition={{
            opacity: { duration: isHovered ? MOTION.DURATIONS.slow : 3.5 },
            scale: { duration: isHovered ? MOTION.DURATIONS.slow : 3.5, ease: 'easeInOut' }
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
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
            borderRadius: '999px'
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        />

        {/* Trend Indicator with Glass Chip */}
        <motion.div
          className="mb-3 relative"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 0.65, y: 0 }}
          transition={{ delay: 0.35, duration: 0.25 }}
        >
          {/* Glass chip behind icon */}
          <div
            className="absolute inset-[-6px] rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              opacity: 0.15
            }}
          />
          
          <div style={{ color: scoreColor, position: 'relative', zIndex: 1 }}>
            {getTrendIcon(score)}
          </div>
        </motion.div>

        {/* Primary Score with Enhanced Contrast & Light Diffusion */}
        <motion.div className="relative mb-3">
          {/* Light diffusion behind score */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle, ${scoreColor}18 0%, transparent 70%)`,
              filter: 'blur(16px)',
              transform: 'scale(1.3)'
            }}
          />
          
          <motion.span
            className="text-[52px] font-bold relative z-10"
            style={{ 
              color: scoreColor,
              textShadow: isHovered 
                ? `0 0 20px ${scoreColor}35, 0 2px 4px rgba(0,0,0,0.22)` 
                : `0 0 12px ${scoreColor}25, 0 2px 4px rgba(0,0,0,0.22)`,
              letterSpacing: '-0.03em',
              lineHeight: '1',
              filter: 'brightness(1.08) contrast(1.06)'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.35, ease: MOTION.CURVES.horizonSpring }}
          >
            {score}
          </motion.span>
        </motion.div>

        {/* Label with Glass Strip */}
        <motion.div
          className="text-center mb-1 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.25 }}
        >
          {/* Soft glass strip behind label */}
          <div
            className="absolute inset-x-[-12px] inset-y-[-4px] rounded-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              opacity: 0.4
            }}
          />
          
          <div 
            className="text-[17px] font-semibold mb-1 relative z-10" 
            style={{ color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.01em' }}
          >
            {scoreLabel} Consensus
          </div>
          <div 
            className="text-[12px] font-medium relative z-10" 
            style={{ color: 'rgba(255,255,255,0.70)' }}
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
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
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
// MINI GLASS CHIPS — Category Weight Breakdown with Enhanced Polish
// ============================================================================
const CategoryGlassChips = ({ segments, isHovered }) => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
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
              className="px-3.5 py-2 rounded-xl flex items-center gap-2 relative overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.08), 0 2px 6px rgba(0, 0, 0, 0.08)',
                cursor: 'default'
              }}
              animate={{
                y: isChipHovered ? -2 : 0,
                background: isChipHovered ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.04)',
                boxShadow: isChipHovered
                  ? `inset 0 1px 2px rgba(255, 255, 255, 0.08), inset 0 0 8px ${colors.glow}, 0 4px 12px rgba(0, 0, 0, 0.12)`
                  : 'inset 0 1px 2px rgba(255, 255, 255, 0.08), 0 2px 6px rgba(0, 0, 0, 0.08)'
              }}
              transition={{
                duration: 0.11,
                ease: MOTION.CURVES.horizonIn
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: colors.dot,
                  boxShadow: `0 0 8px ${colors.glow}, inset 0 0 3px rgba(255,255,255,0.3)`
                }}
              />

              <span 
                className="text-[11px] font-medium" 
                style={{ 
                  color: 'rgba(255,255,255,0.75)',
                  letterSpacing: '0.01em'
                }}
              >
                {segment.name}
              </span>

              <span 
                className="text-[12px] font-bold ml-1" 
                style={{ color: colors.dot }}
              >
                {Math.round(value)}%
              </span>

              {/* Glass refraction shimmer on hover */}
              {isChipHovered && !shouldReduceMotion && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${colors.accent} 50%, transparent 100%)`,
                    opacity: 0
                  }}
                  animate={{
                    x: ['-100%', '100%'],
                    opacity: [0, 0.2, 0]
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
// MAIN CONSENSUS COMPONENT with Enhanced Container & Polish
// ============================================================================
export default function ConsensusMeter({ score, breakdown, onOpenDrawer }) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

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
      ref={containerRef}
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="h-full rounded-[30px] flex flex-col cursor-pointer relative overflow-hidden consensus-lens"
      style={{
        padding: '32px 28px 28px 28px',
        // Enhanced gradient with subtle depth
        background: `
          linear-gradient(180deg, 
            rgba(20, 24, 32, 0.88) 0%,
            rgba(18, 22, 30, 0.90) 50%,
            rgba(18, 22, 30, 0.93) 100%
          )
        `,
        backdropFilter: 'blur(22px) saturate(150%)',
        WebkitBackdropFilter: 'blur(22px) saturate(150%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: `
          0 0 0 1px rgba(255, 255, 255, 0.03) inset,
          0 0 24px rgba(123, 184, 255, 0.06),
          0 20px 40px rgba(0, 0, 0, 0.18),
          inset 0 1px 0 rgba(255, 255, 255, 0.08)
        `,
        willChange: 'transform, filter, box-shadow'
      }}
      whileHover={{ 
        y: -1.5,
        filter: 'brightness(1.03)',
        boxShadow: `
          0 0 0 1px rgba(255, 255, 255, 0.03) inset,
          0 0 28px rgba(123, 184, 255, 0.10),
          0 22px 48px rgba(0, 0, 0, 0.24),
          inset 0 1px 0 rgba(255, 255, 255, 0.08)
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
      {/* Enhanced subsurface gradient lighting (top) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.028) 0%, transparent 100%)',
        pointerEvents: 'none',
        borderRadius: '30px 30px 0 0'
      }} />

      {/* Enhanced subsurface gradient lighting (bottom) */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.038) 100%)',
        pointerEvents: 'none',
        borderRadius: '0 0 30px 30px'
      }} />

      {/* Enhanced edge inner-glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '30px',
        boxShadow: 'inset 0 0 4px rgba(123, 184, 255, 0.08)',
        pointerEvents: 'none'
      }} />

      {/* Soft edge bloom */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        right: '20%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
        filter: 'blur(1.5px)',
        pointerEvents: 'none'
      }} />

      {/* Enhanced gradient noise texture */}
      <div 
        className="absolute inset-0 rounded-[30px] pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
          backgroundSize: '200px 200px',
          opacity: 0.03,
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
        <SignalLensNode score={score} isHovered={isHovered} parentRef={containerRef} />
      </div>

      {/* LOWER: Category Glass Chips */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <CategoryGlassChips segments={segments} isHovered={isHovered} />
      </div>

      {/* FOOTER: Enhanced Metadata */}
      <motion.p
        className="text-xs text-center"
        style={{ 
          color: 'rgba(255,255,255,0.60)', 
          opacity: 0.62, 
          position: 'relative', 
          zIndex: 10,
          fontSize: '11px',
          letterSpacing: '0.01em',
          marginTop: '10px'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.62 }}
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

        .signal-orb-outer {
          perspective: 1000px;
          transform-style: preserve-3d;
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