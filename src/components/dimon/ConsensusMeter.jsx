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
    fast: 0.11,
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
      const y = 80 + Math.sin((t * Math.PI * 2.5) + offset + (wavePhase * 0.15)) * 3;
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
    if (s < 40) return <TrendingDown className="w-3 h-3" strokeWidth={2.8} />;
    if (s > 70) return <TrendingUp className="w-3 h-3" strokeWidth={2.8} />;
    return <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />;
  };

  const scoreColor = getZoneColor(score);
  const scoreLabel = getZoneLabel(score);
  
  const breathingScale = 1 + Math.sin(breathingPhase * (2 * Math.PI / 5)) * 0.012;
  const breathingOpacity = 0.04 + Math.sin(breathingPhase * (2 * Math.PI / 5)) * 0.015;

  return (
    <div className="relative flex items-center justify-center" style={{ minHeight: '200px' }}>
      {/* Background Wavefield - Ultra Subtle */}
      <svg 
        width="160" 
        height="160" 
        viewBox="0 0 160 160"
        className="absolute"
        style={{
          opacity: isHovered ? 0.07 : 0.05,
          transition: `opacity ${MOTION.DURATIONS.base}s ${MOTION.CURVES.horizonIn.join(',')}`
        }}
      >
        <defs>
          <filter id="wave-blur">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          
          <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8EBBFF" stopOpacity="0" />
            <stop offset="35%" stopColor="#8EBBFF" stopOpacity="0.35" />
            <stop offset="65%" stopColor="#B3D4FF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#B3D4FF" stopOpacity="0" />
          </linearGradient>
          
          <linearGradient id="wave-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B3D4FF" stopOpacity="0" />
            <stop offset="35%" stopColor="#B3D4FF" stopOpacity="0.25" />
            <stop offset="65%" stopColor="#8EBBFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#8EBBFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 1, 2].map((i) => (
          <motion.polyline
            key={i}
            points={generateWavePath(i * Math.PI * 0.6)}
            fill="none"
            stroke={i % 2 === 0 ? 'url(#wave-grad-1)' : 'url(#wave-grad-2)'}
            strokeWidth="1"
            strokeLinecap="round"
            filter="url(#wave-blur)"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.1 + (i * 0.06),
              ease: MOTION.CURVES.horizonIn
            }}
          />
        ))}
      </svg>

      {/* 3-Layer Subsurface Lighting System */}
      
      {/* Layer 1: Bottom subsurface glow (4-6% intensity) */}
      <motion.div
        className="absolute"
        style={{
          width: '220px',
          height: '90px',
          top: '52%',
          left: '50%',
          transform: 'translate(-50%, -32%)',
          background: `radial-gradient(ellipse, rgba(142, 187, 255, 0.08) 0%, transparent 68%)`,
          filter: 'blur(28px)',
          pointerEvents: 'none',
          opacity: breathingOpacity
        }}
        animate={{
          opacity: isHovered ? breathingOpacity + 0.04 : breathingOpacity,
          scale: breathingScale
        }}
        transition={{
          opacity: { duration: 0.25 },
          scale: { duration: 5, ease: 'easeInOut' }
        }}
      />
      
      {/* Layer 2: Mid-layer light diffusion (gentle blue-slate) */}
      <motion.div
        className="absolute"
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(179, 212, 255, 0.05) 0%, transparent 65%)`,
          filter: 'blur(18px)',
          pointerEvents: 'none'
        }}
        animate={{
          opacity: isHovered ? 0.85 : 0.7,
          scale: breathingScale * 1.02
        }}
        transition={{
          opacity: { duration: 0.2 },
          scale: { duration: 5, ease: 'easeInOut' }
        }}
      />

      {/* Signal Lens Glass Panel - Enhanced Outer Layer */}
      <motion.div
        className="absolute signal-orb-outer"
        style={{
          width: '180px',
          height: '180px',
          borderRadius: '90px',
          background: `
            linear-gradient(145deg, 
              rgba(142, 187, 255, 0.12) 0%, 
              rgba(179, 212, 255, 0.16) 50%,
              rgba(142, 187, 255, 0.12) 100%
            )
          `,
          backdropFilter: 'blur(20px) saturate(145%)',
          WebkitBackdropFilter: 'blur(20px) saturate(145%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: `
            inset 0 2px 10px rgba(255, 255, 255, 0.14),
            inset 0 -3px 8px rgba(0, 0, 0, 0.14),
            0 0 42px rgba(142, 187, 255, 0.09),
            0 0 0 1px rgba(255, 255, 255, 0.04)
          `,
          willChange: 'transform, filter',
          rotateX: 0,
          rotateY: 0
        }}
        animate={{
          scale: isHovered ? 1.025 : breathingScale,
          filter: isHovered ? 'brightness(1.06)' : 'brightness(1)',
          boxShadow: isHovered
            ? `
              inset 0 2px 10px rgba(255, 255, 255, 0.14),
              inset 0 -3px 8px rgba(0, 0, 0, 0.14),
              0 0 56px rgba(142, 187, 255, 0.13),
              0 0 0 1px rgba(255, 255, 255, 0.04)
            `
            : `
              inset 0 2px 10px rgba(255, 255, 255, 0.14),
              inset 0 -3px 8px rgba(0, 0, 0, 0.14),
              0 0 42px rgba(142, 187, 255, 0.09),
              0 0 0 1px rgba(255, 255, 255, 0.04)
            `,
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY
        }}
        transition={{
          scale: { duration: isHovered ? MOTION.DURATIONS.base : 5, ease: MOTION.CURVES.horizonIn },
          filter: { duration: MOTION.DURATIONS.base },
          boxShadow: { duration: MOTION.DURATIONS.base },
          rotateX: { duration: 0.15, ease: 'easeOut' },
          rotateY: { duration: 0.15, ease: 'easeOut' }
        }}
      >
        {/* Inner Layer with Deeper Blur */}
        <div
          className="absolute inset-[8px] rounded-full"
          style={{
            background: `
              linear-gradient(145deg, 
                rgba(179, 212, 255, 0.07) 0%, 
                rgba(142, 187, 255, 0.09) 50%,
                rgba(179, 212, 255, 0.07) 100%
              )
            `,
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)'
          }}
        />

        {/* Layer 3: Top reflective highlight (soft, high blur, low opacity) */}
        <div 
          className="absolute top-[10px] left-[10px] w-[62px] h-[62px] rounded-full"
          style={{
            background: 'radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.20) 0%, transparent 58%)',
            filter: 'blur(12px)',
            pointerEvents: 'none'
          }}
        />

        {/* Micro-specular highlight (top-left edge - Apple glass signature) */}
        <div 
          className="absolute top-[6px] left-[18px] w-[28px] h-[14px] rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.28) 0%, transparent 85%)',
            filter: 'blur(5px)',
            pointerEvents: 'none',
            transform: 'rotate(-25deg)'
          }}
        />

        {/* Edge reflectivity enhancement (12% stronger) */}
        <div 
          className="absolute inset-[3px] rounded-full"
          style={{
            background: `
              radial-gradient(circle at 70% 30%, transparent 45%, rgba(255, 255, 255, 0.12) 85%, transparent 100%)
            `,
            pointerEvents: 'none'
          }}
        />

        {/* Bottom-right Specular Highlight */}
        <div 
          className="absolute bottom-[16px] right-[16px] w-[44px] h-[44px] rounded-full"
          style={{
            background: 'radial-gradient(circle at 65% 65%, rgba(255, 255, 255, 0.11) 0%, transparent 62%)',
            filter: 'blur(7px)',
            pointerEvents: 'none'
          }}
        />

        {/* Halo with enhanced breathing (3-5% intensity) */}
        <motion.div
          className="absolute inset-[-8px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${scoreColor}18 0%, transparent 68%)`,
            filter: 'blur(24px)',
            opacity: 0
          }}
          animate={{
            opacity: isHovered ? 0.05 + breathingOpacity : breathingOpacity,
            scale: isHovered ? 1.14 : 1.06
          }}
          transition={{
            opacity: { duration: isHovered ? MOTION.DURATIONS.slow : 5 },
            scale: { duration: isHovered ? MOTION.DURATIONS.slow : 5, ease: 'easeInOut' }
          }}
        />
      </motion.div>

      {/* Score Stack */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Micro separator line */}
        <motion.div
          className="mb-4"
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

        {/* Trend Indicator with Glass Chip (25-35% smaller) */}
        <motion.div
          className="mb-4 relative"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 0.67, y: 0 }}
          transition={{ delay: 0.35, duration: 0.25 }}
        >
          {/* Micro glass chip behind icon (2-4px blur, 12-15% opacity) */}
          <div
            className="absolute inset-[-8px] rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              opacity: 0.13
            }}
          />
          
          <div style={{ color: scoreColor, position: 'relative', zIndex: 1 }}>
            {getTrendIcon(score)}
          </div>
        </motion.div>

        {/* Primary Score with Enhanced Contrast (6-10%) & Light Diffusion */}
        <motion.div className="relative mb-3">
          {/* Faint diffusion glow behind score (extremely subtle) */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle, ${scoreColor}12 0%, transparent 72%)`,
              filter: 'blur(18px)',
              transform: 'scale(1.4)'
            }}
          />
          
          <motion.span
            className="text-[52px] font-bold relative z-10"
            style={{ 
              color: scoreColor,
              textShadow: isHovered 
                ? `0 0 22px ${scoreColor}38, 0 2px 5px rgba(0,0,0,0.24)` 
                : `0 0 14px ${scoreColor}28, 0 2px 5px rgba(0,0,0,0.24)`,
              letterSpacing: '-0.03em',
              lineHeight: '1',
              filter: 'brightness(1.10) contrast(1.08)'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.35, ease: MOTION.CURVES.horizonSpring }}
          >
            {score}
          </motion.span>
        </motion.div>

        {/* Label with Soft Translucent Strip (8-12% larger, 8-12% opacity strip) */}
        <motion.div
          className="text-center mb-1 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.25 }}
        >
          {/* Soft translucent strip behind label (barely visible) */}
          <div
            className="absolute inset-x-[-14px] inset-y-[-5px] rounded-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.025)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              opacity: 0.1
            }}
          />
          
          <div 
            className="text-[19px] font-semibold mb-1 relative z-10" 
            style={{ color: 'rgba(255,255,255,0.97)', letterSpacing: '-0.01em' }}
          >
            {scoreLabel} Consensus
          </div>
          <div 
            className="text-[12px] font-medium relative z-10" 
            style={{ color: 'rgba(255,255,255,0.67)' }}
          >
            Conviction: Medium
          </div>
        </motion.div>

        {/* Bottom separator line */}
        <motion.div
          className="mt-4"
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
    <div className="flex flex-wrap justify-center gap-3.5 mb-9">
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
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: `
                  inset 0 1px 2px rgba(255, 255, 255, 0.09),
                  inset 0 0 6px ${colors.glow}20,
                  0 3px 8px rgba(0, 0, 0, 0.06)
                `,
                cursor: 'default'
              }}
              animate={{
                y: isChipHovered ? -2 : 0,
                background: isChipHovered ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.04)',
                boxShadow: isChipHovered
                  ? `
                    inset 0 1px 2px rgba(255, 255, 255, 0.09),
                    inset 0 0 10px ${colors.glow}30,
                    0 6px 16px rgba(0, 0, 0, 0.10)
                  `
                  : `
                    inset 0 1px 2px rgba(255, 255, 255, 0.09),
                    inset 0 0 6px ${colors.glow}20,
                    0 3px 8px rgba(0, 0, 0, 0.06)
                  `
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
                  boxShadow: `0 0 9px ${colors.glow}, inset 0 0 3px rgba(255,255,255,0.32)`
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

              {/* Light plane activation on hover (3-5% intensity) */}
              {isChipHovered && (
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${colors.glow}08 0%, transparent 70%)`,
                    opacity: 0
                  }}
                  animate={{
                    opacity: [0, 0.04, 0]
                  }}
                  transition={{
                    duration: 0.6,
                    ease: 'easeInOut'
                  }}
                />
              )}

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
                    opacity: [0, 0.18, 0]
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
        // Enhanced vertical gradient (2-3% difference)
        background: `
          linear-gradient(180deg, 
            rgba(20, 24, 32, 0.88) 0%,
            rgba(19, 23, 31, 0.90) 50%,
            rgba(18, 22, 30, 0.91) 100%
          )
        `,
        backdropFilter: 'blur(25px) saturate(152%)',
        WebkitBackdropFilter: 'blur(25px) saturate(152%)',
        border: '1px solid rgba(255, 255, 255, 0.13)',
        boxShadow: `
          0 0 0 1px rgba(255, 255, 255, 0.03) inset,
          0 0 26px rgba(142, 187, 255, 0.07),
          0 22px 44px rgba(0, 0, 0, 0.20),
          inset 0 1px 0 rgba(255, 255, 255, 0.09),
          inset 0 0 3px rgba(142, 187, 255, 0.04)
        `,
        willChange: 'transform, filter, box-shadow'
      }}
      whileHover={{ 
        y: -1.5,
        filter: 'brightness(1.03)',
        boxShadow: `
          0 0 0 1px rgba(255, 255, 255, 0.03) inset,
          0 0 32px rgba(142, 187, 255, 0.11),
          0 24px 52px rgba(0, 0, 0, 0.26),
          inset 0 1px 0 rgba(255, 255, 255, 0.09),
          inset 0 0 3px rgba(142, 187, 255, 0.04)
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
        background: 'linear-gradient(180deg, rgba(255,255,255,0.030) 0%, transparent 100%)',
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
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.040) 100%)',
        pointerEvents: 'none',
        borderRadius: '0 0 30px 30px'
      }} />

      {/* Ultra-soft inner glow around edges (2-4px) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '30px',
        boxShadow: 'inset 0 0 3px rgba(142, 187, 255, 0.09)',
        pointerEvents: 'none'
      }} />

      {/* Soft edge bloom */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        right: '20%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
        filter: 'blur(1.5px)',
        pointerEvents: 'none'
      }} />

      {/* Enhanced noise texture (2-3% opacity) */}
      <div 
        className="absolute inset-0 rounded-[30px] pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
          backgroundSize: '200px 200px',
          opacity: 0.025,
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

      {/* FOOTER: Enhanced Metadata (55-65% opacity, tighter letter-spacing, more spacing) */}
      <motion.p
        className="text-xs text-center"
        style={{ 
          color: 'rgba(255,255,255,0.58)', 
          opacity: 0.60, 
          position: 'relative', 
          zIndex: 10,
          fontSize: '11px',
          letterSpacing: '-0.01em',
          marginTop: '12px'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.60 }}
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