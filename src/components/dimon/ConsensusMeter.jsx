// 🔒 DESIGN LOCKED — OS HORIZON V5.0 SIGNAL LENS REDESIGN
// Last Updated: 2025-01-20
// OS HORIZON CERTIFIED — 16/16 PILLARS + CINEMATIC MOTION SYSTEM
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import YinYangIcon from './YinYangIcon';

// OS Horizon Motion Curves (Cinematic Motion DNA)
const MOTION = {
  CURVES: {
    primary: [0.22, 0.61, 0.36, 1],      // Hero components (orb)
    secondary: [0.25, 0.46, 0.45, 0.94], // Chips, labels
    tertiary: [0.20, 0.60, 0.35, 1]      // Metadata, icons
  },
  DURATIONS: {
    fast: 0.11,
    base: 0.15,
    slow: 0.22,
    breathing: 5
  }
};

// Category Colors (OS Horizon muted palette)
const CATEGORY_COLORS = {
  'Policy': { accent: 'rgba(242, 106, 106, 0.50)', glow: 'rgba(242, 106, 106, 0.15)', dot: '#F26A6A', tint: 'rgba(242, 106, 106, 0.02)' },
  'Credit': { accent: 'rgba(94, 167, 255, 0.50)', glow: 'rgba(94, 167, 255, 0.15)', dot: '#5EA7FF', tint: 'rgba(94, 167, 255, 0.02)' },
  'Equities': { accent: 'rgba(43, 198, 134, 0.50)', glow: 'rgba(43, 198, 134, 0.15)', dot: '#2BC686', tint: 'rgba(43, 198, 134, 0.02)' },
  'Global': { accent: 'rgba(255, 176, 32, 0.50)', glow: 'rgba(255, 176, 32, 0.15)', dot: '#FFB020', tint: 'rgba(255, 176, 32, 0.02)' }
};

// ============================================================================
// SIGNAL LENS NODE — Hero Object with Cinematic Motion
// ============================================================================
const SignalLensNode = ({ score, isHovered, parentRef, isAnyChipHovered, hoveredChipColor }) => {
  const [wavePhase, setWavePhase] = useState(0);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [isLowPower, setIsLowPower] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring-based parallax
  const springConfig = { stiffness: 150, damping: 30, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [1.5, -1.5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-1.5, 1.5]), springConfig);
  
  // Subsurface light shift with parallax
  const lightShiftX = useTransform(mouseX, [-100, 100], [-8, 8]);
  const lightShiftY = useTransform(mouseY, [-100, 100], [-8, 8]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    // Detect low power mode
    const checkLowPower = () => {
      if ('getBattery' in navigator) {
        navigator.getBattery().then((battery) => {
          setIsLowPower(battery.level < 0.2 && !battery.charging);
        });
      }
    };
    checkLowPower();
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion || isLowPower) return;
    
    let rafId;
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setWavePhase(elapsed);
      setBreathingPhase(elapsed);
      rafId = requestAnimationFrame(animate);
    };
    
    rafId = requestAnimationFrame(animate);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [shouldReduceMotion, isLowPower]);

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
      const y = 80 + Math.sin((t * Math.PI * 2.5) + offset + (wavePhase * 0.10)) * 2.5;
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
    if (s < 40) return 'Cautious';
    if (s < 70) return 'Mixed';
    return 'Optimistic';
  };

  const getTrendIcon = (s) => {
    if (s < 40) return <TrendingDown className="w-2.5 h-2.5" strokeWidth={3} />;
    if (s > 70) return <TrendingUp className="w-2.5 h-2.5" strokeWidth={3} />;
    return <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />;
  };

  const scoreColor = getZoneColor(score);
  const scoreLabel = getZoneLabel(score);
  
  // Cinematic breathing motion (4-6 seconds, 3-6% intensity)
  const breathingScale = 1 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.DURATIONS.breathing)) * 0.01;
  const breathingOpacity = 0.03 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.DURATIONS.breathing)) * 0.03;
  const internalGradientShift = Math.sin(breathingPhase * (2 * Math.PI / 6)) * 3;

  // Interaction choreography: orb brightness when chips are hovered
  const orbBrightness = isAnyChipHovered ? 0.97 : 1;

  return (
    <div className="relative flex items-center justify-center" style={{ minHeight: '170px' }}>
      {/* Ultra-Subtle Background Wavefield */}
      <svg 
        width="160" 
        height="160" 
        viewBox="0 0 160 160"
        className="absolute"
        style={{
          opacity: isHovered ? 0.065 : 0.045,
          transition: `opacity ${MOTION.DURATIONS.base}s cubic-bezier(${MOTION.CURVES.primary.join(',')})`
        }}
      >
        <defs>
          <filter id="wave-blur-fine">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
          
          <linearGradient id="wave-grad-subtle-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8EBBFF" stopOpacity="0" />
            <stop offset="38%" stopColor="#8EBBFF" stopOpacity="0.28" />
            <stop offset="62%" stopColor="#B3D4FF" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#B3D4FF" stopOpacity="0" />
          </linearGradient>
          
          <linearGradient id="wave-grad-subtle-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B3D4FF" stopOpacity="0" />
            <stop offset="38%" stopColor="#B3D4FF" stopOpacity="0.20" />
            <stop offset="62%" stopColor="#8EBBFF" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#8EBBFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {!shouldReduceMotion && [0, 1, 2].map((i) => (
          <motion.polyline
            key={i}
            points={generateWavePath(i * Math.PI * 0.6)}
            fill="none"
            stroke={i % 2 === 0 ? 'url(#wave-grad-subtle-1)' : 'url(#wave-grad-subtle-2)'}
            strokeWidth="0.9"
            strokeLinecap="round"
            filter="url(#wave-blur-fine)"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ 
              duration: 0.9, 
              delay: 0.1 + (i * 0.06),
              ease: MOTION.CURVES.primary
            }}
          />
        ))}
      </svg>

      {/* === 3-LAYER SUBSURFACE LIGHTING SYSTEM === */}
      
      {/* LAYER 1: Bottom Subsurface Glow (choreographed with chip hover) */}
      <motion.div
        className="absolute"
        style={{
          width: '230px',
          height: '95px',
          top: '53%',
          left: '50%',
          x: '-50%',
          y: '-34%',
          background: hoveredChipColor 
            ? `radial-gradient(ellipse, ${hoveredChipColor} 0%, transparent 70%)`
            : `radial-gradient(ellipse, rgba(142, 187, 255, 0.055) 0%, transparent 70%)`,
          filter: 'blur(32px)',
          pointerEvents: 'none',
          opacity: breathingOpacity
        }}
        animate={{
          opacity: isHovered ? breathingOpacity + 0.015 : breathingOpacity,
          scale: breathingScale
        }}
        transition={{
          opacity: { duration: 0.22, ease: MOTION.CURVES.primary },
          scale: { duration: MOTION.DURATIONS.breathing, ease: 'easeInOut' },
          background: { duration: 0.4, ease: MOTION.CURVES.secondary }
        }}
      />
      
      {/* LAYER 2: Mid-Layer Light Diffusion (shifts with parallax) */}
      <motion.div
        className="absolute"
        style={{
          width: '210px',
          height: '210px',
          borderRadius: '50%',
          background: `
            radial-gradient(circle at ${50 + internalGradientShift}% ${48 + internalGradientShift * 0.5}%, 
              rgba(179, 212, 255, 0.048) 0%, 
              rgba(142, 187, 255, 0.032) 45%,
              transparent 68%)
          `,
          filter: 'blur(20px)',
          pointerEvents: 'none',
          x: lightShiftX,
          y: lightShiftY
        }}
        animate={{
          opacity: isHovered ? 0.88 : 0.72,
          scale: breathingScale * 1.015
        }}
        transition={{
          opacity: { duration: 0.2, ease: MOTION.CURVES.primary },
          scale: { duration: MOTION.DURATIONS.breathing, ease: 'easeInOut' }
        }}
      />

      {/* Signal Lens Glass Panel - Enhanced with choreographed brightness */}
      <motion.div
        className="absolute signal-orb-outer"
        style={{
          width: '160px',
          height: '160px',
          borderRadius: '80px',
          background: `
            linear-gradient(145deg, 
              rgba(142, 187, 255, 0.135) 0%, 
              rgba(179, 212, 255, 0.17) 50%,
              rgba(142, 187, 255, 0.135) 100%
            )
          `,
          backdropFilter: 'blur(22px) saturate(148%)',
          WebkitBackdropFilter: 'blur(22px) saturate(148%)',
          border: '1px solid rgba(255, 255, 255, 0.20)',
          boxShadow: `
            inset 0 2px 12px rgba(255, 255, 255, 0.16),
            inset 0 -3px 10px rgba(0, 0, 0, 0.15),
            0 0 45px rgba(142, 187, 255, 0.095),
            0 0 0 1px rgba(255, 255, 255, 0.045)
          `,
          willChange: 'transform',
          rotateX: 0,
          rotateY: 0
        }}
        animate={{
          scale: isHovered ? 1.025 : breathingScale,
          filter: `brightness(${isHovered ? 1.06 : orbBrightness})`,
          boxShadow: isHovered
            ? `
              inset 0 2px 12px rgba(255, 255, 255, 0.16),
              inset 0 -3px 10px rgba(0, 0, 0, 0.15),
              0 0 60px rgba(142, 187, 255, 0.14),
              0 0 0 1px rgba(255, 255, 255, 0.045)
            `
            : `
              inset 0 2px 12px rgba(255, 255, 255, 0.16),
              inset 0 -3px 10px rgba(0, 0, 0, 0.15),
              0 0 45px rgba(142, 187, 255, 0.095),
              0 0 0 1px rgba(255, 255, 255, 0.045)
            `,
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY
        }}
        transition={{
          scale: { duration: isHovered ? MOTION.DURATIONS.base : MOTION.DURATIONS.breathing, ease: MOTION.CURVES.primary },
          filter: { duration: MOTION.DURATIONS.base, ease: MOTION.CURVES.primary },
          boxShadow: { duration: MOTION.DURATIONS.base, ease: MOTION.CURVES.primary }
        }}
      >
        {/* Inner Layer */}
        <div
          className="absolute inset-[8px] rounded-full"
          style={{
            background: `
              linear-gradient(145deg, 
                rgba(179, 212, 255, 0.08) 0%, 
                rgba(142, 187, 255, 0.10) 50%,
                rgba(179, 212, 255, 0.08) 100%
              )
            `,
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)'
          }}
        />

        {/* LAYER 3: Top Reflective Highlight */}
        <div 
          className="absolute top-[8px] left-[8px] w-[70px] h-[70px] rounded-full"
          style={{
            background: 'radial-gradient(circle at 22% 22%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.08) 40%, transparent 60%)',
            filter: 'blur(14px)',
            pointerEvents: 'none'
          }}
        />

        {/* Micro-specular highlight with shimmer on hover */}
        <motion.div 
          className="absolute top-[4px] left-[15px] w-[35px] h-[18px] rounded-full"
          style={{
            background: 'linear-gradient(125deg, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.12) 50%, transparent 90%)',
            filter: 'blur(6px)',
            pointerEvents: 'none',
            transform: 'rotate(-28deg)'
          }}
          animate={{
            opacity: isHovered ? [1, 0.85, 1] : 1
          }}
          transition={{
            duration: 1.2,
            repeat: isHovered ? Infinity : 0,
            ease: 'easeInOut'
          }}
        />

        {/* Enhanced edge reflectivity */}
        <div 
          className="absolute inset-[2px] rounded-full"
          style={{
            background: `
              radial-gradient(circle at 72% 28%, transparent 42%, rgba(255, 255, 255, 0.145) 82%, rgba(255, 255, 255, 0.08) 92%, transparent 100%)
            `,
            pointerEvents: 'none'
          }}
        />

        {/* Bottom-right reflection */}
        <div 
          className="absolute bottom-[14px] right-[14px] w-[48px] h-[48px] rounded-full"
          style={{
            background: 'radial-gradient(circle at 62% 62%, rgba(255, 255, 255, 0.12) 0%, transparent 65%)',
            filter: 'blur(8px)',
            pointerEvents: 'none'
          }}
        />

        {/* Halo with enhanced breathing (+10% on hover) */}
        <motion.div
          className="absolute inset-[-10px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${scoreColor}16 0%, transparent 70%)`,
            filter: 'blur(26px)',
            opacity: 0
          }}
          animate={{
            opacity: isHovered ? breathingOpacity + 0.10 : (isAnyChipHovered ? breathingOpacity + 0.03 : breathingOpacity),
            scale: isHovered ? 1.16 : 1.07
          }}
          transition={{
            opacity: { duration: isHovered ? MOTION.DURATIONS.slow : MOTION.DURATIONS.breathing, ease: MOTION.CURVES.primary },
            scale: { duration: isHovered ? MOTION.DURATIONS.slow : MOTION.DURATIONS.breathing, ease: 'easeInOut' }
          }}
        />
      </motion.div>

      {/* Score Stack */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.div
          className="mb-5"
          style={{
            width: '32px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.13), transparent)',
            borderRadius: '999px'
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.3, ease: MOTION.CURVES.tertiary }}
        />

        <motion.div
          className="mb-5 relative"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 0.65, y: 0 }}
          transition={{ delay: 0.35, duration: 0.25, ease: MOTION.CURVES.tertiary }}
        >
          <div
            className="absolute inset-[-10px] rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.035)',
              backdropFilter: 'blur(3.5px)',
              WebkitBackdropFilter: 'blur(3.5px)',
              opacity: 0.12
            }}
          />
          
          <div style={{ color: scoreColor, position: 'relative', zIndex: 1 }}>
            {getTrendIcon(score)}
          </div>
        </motion.div>

        <motion.div className="relative mb-3.5">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle, ${scoreColor}10 0%, transparent 75%)`,
              filter: 'blur(20px)',
              transform: 'scale(1.5)'
            }}
          />
          
          <motion.span
            className="text-[46px] font-bold relative z-10"
            style={{ 
              color: scoreColor,
              textShadow: isHovered 
                ? `0 0 24px ${scoreColor}40, 0 2px 6px rgba(0,0,0,0.26)` 
                : `0 0 16px ${scoreColor}30, 0 2px 6px rgba(0,0,0,0.26)`,
              letterSpacing: '-0.03em',
              lineHeight: '1',
              filter: 'brightness(1.10) contrast(1.10)'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.35, ease: MOTION.CURVES.primary }}
          >
            {score}
          </motion.span>
        </motion.div>

        <motion.div
          className="text-center mb-1 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.25, ease: MOTION.CURVES.secondary }}
        >
          <div
            className="absolute inset-x-[-16px] inset-y-[-6px] rounded-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.022)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              opacity: 0.11
            }}
          />
          
          <div 
            className="text-[17px] font-semibold mb-1 relative z-10" 
            style={{ color: 'rgba(255,255,255,0.98)', letterSpacing: '-0.01em' }}
          >
            {scoreLabel} View
          </div>
          <div 
            className="text-[11px] font-medium relative z-10" 
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            Confidence: Moderate
          </div>
        </motion.div>

        <motion.div
          className="mt-5"
          style={{
            width: '32px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.13), transparent)',
            borderRadius: '999px'
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.65, duration: 0.3, ease: MOTION.CURVES.tertiary }}
        />
      </div>
    </div>
  );
};

// ============================================================================
// MINI GLASS CHIPS — 2×2 Grid Layout (Apple-Grade Spatial Balance)
// ============================================================================
const CategoryGlassChips = ({ segments, isHovered, onChipHover, onChipLeave }) => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [hoveredChip, setHoveredChip] = useState(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleChipHover = (segmentName, colors) => {
    setHoveredChip(segmentName);
    onChipHover(colors);
  };

  const handleChipLeave = () => {
    setHoveredChip(null);
    onChipLeave();
  };

  return (
    <div 
      className="grid grid-cols-2 gap-x-5 gap-y-3.5 max-w-[360px] mx-auto mb-8"
      style={{
        rowGap: '14px',
        columnGap: '20px'
      }}
    >
      {segments.map((segment, index) => {
        const colors = CATEGORY_COLORS[segment.name] || { 
          accent: 'rgba(170, 177, 184, 0.50)', 
          glow: 'rgba(170, 177, 184, 0.15)', 
          dot: '#AAB1B8',
          tint: 'rgba(170, 177, 184, 0.02)'
        };
        const value = (segment.weight || 0) * 100;
        const isChipHovered = hoveredChip === segment.name;
        const isOtherChipHovered = hoveredChip && hoveredChip !== segment.name;
        
        return (
          <motion.div
            key={segment.name}
            className="relative"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ 
              opacity: isOtherChipHovered ? 0.75 : 1,
              y: 0, 
              scale: 1 
            }}
            transition={{ 
              delay: 0.75 + (index * 0.05), 
              duration: 0.25,
              ease: MOTION.CURVES.secondary,
              opacity: { duration: 0.15 }
            }}
            onHoverStart={() => handleChipHover(segment.name, colors)}
            onHoverEnd={handleChipLeave}
          >
            <motion.div
              className="px-3 py-1.5 rounded-xl flex items-center gap-2 relative overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(21px)',
                WebkitBackdropFilter: 'blur(21px)',
                border: '1px solid rgba(255, 255, 255, 0.085)',
                boxShadow: `
                  inset 0 1px 2px rgba(255, 255, 255, 0.095),
                  inset 0 0 7px ${colors.glow}18,
                  0 2px 6px rgba(0, 0, 0, 0.04)
                `,
                cursor: 'default',
                justifyContent: 'center'
              }}
              animate={{
                y: isChipHovered ? -2 : 0,
                background: isChipHovered ? 'rgba(255, 255, 255, 0.065)' : 'rgba(255, 255, 255, 0.04)',
                backdropFilter: isChipHovered ? 'blur(23px)' : 'blur(21px)',
                boxShadow: isChipHovered
                  ? `
                    inset 0 1px 2px rgba(255, 255, 255, 0.095),
                    inset 0 0 12px ${colors.glow}35,
                    0 5px 14px rgba(0, 0, 0, 0.08)
                  `
                  : `
                    inset 0 1px 2px rgba(255, 255, 255, 0.095),
                    inset 0 0 7px ${colors.glow}18,
                    0 2px 6px rgba(0, 0, 0, 0.04)
                  `
              }}
              transition={{
                duration: 0.11,
                ease: MOTION.CURVES.secondary
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: colors.dot,
                  boxShadow: `0 0 10px ${colors.glow}, inset 0 0 3px rgba(255,255,255,0.35)`
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

              {/* Moving highlight (left → right, 4-6% opacity) */}
              {isChipHovered && !shouldReduceMotion && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${colors.accent} 50%, transparent 100%)`,
                    opacity: 0
                  }}
                  animate={{
                    x: ['-100%', '100%'],
                    opacity: [0, 0.05, 0]
                  }}
                  transition={{
                    duration: 1,
                    ease: 'linear'
                  }}
                />
              )}

              {/* Refraction shimmer */}
              {isChipHovered && !shouldReduceMotion && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `linear-gradient(120deg, transparent 0%, ${colors.accent} 50%, transparent 100%)`,
                    opacity: 0
                  }}
                  animate={{
                    x: ['-150%', '150%'],
                    opacity: [0, 0.15, 0]
                  }}
                  transition={{
                    duration: 0.9,
                    ease: 'easeOut',
                    delay: 0.1
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
// MAIN CONSENSUS COMPONENT — Cinematic Choreography System
// ============================================================================
export default function ConsensusMeter({ score, breakdown, onOpenDrawer }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isHintHovered, setIsHintHovered] = useState(false);
  const [isAnyChipHovered, setIsAnyChipHovered] = useState(false);
  const [hoveredChipColor, setHoveredChipColor] = useState(null);
  const [backgroundDrift, setBackgroundDrift] = useState(0);
  const [isLowPower, setIsLowPower] = useState(false);
  const containerRef = useRef(null);

  // Ambient background drift (8-10 seconds, 1-2px)
  useEffect(() => {
    if (isLowPower) return;
    
    let rafId;
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const drift = Math.sin(elapsed * (2 * Math.PI / 9)) * 1.5;
      setBackgroundDrift(drift);
      rafId = requestAnimationFrame(animate);
    };
    
    rafId = requestAnimationFrame(animate);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isLowPower]);

  // Detect low power mode
  useEffect(() => {
    const checkLowPower = () => {
      if ('getBattery' in navigator) {
        navigator.getBattery().then((battery) => {
          setIsLowPower(battery.level < 0.2 && !battery.charging);
        });
      }
    };
    checkLowPower();
  }, []);

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

  const handleChipHover = (colors) => {
    setIsAnyChipHovered(true);
    setHoveredChipColor(colors.tint);
  };

  const handleChipLeave = () => {
    setIsAnyChipHovered(false);
    setHoveredChipColor(null);
  };

  return (
    <motion.div
      ref={containerRef}
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="h-full rounded-[30px] flex flex-col cursor-pointer relative overflow-hidden consensus-lens"
      style={{
        padding: '24px 24px 20px 24px',
        background: `
          linear-gradient(180deg, 
            rgba(20, 24, 32, 0.88) 0%,
            rgba(19, 23, 31, 0.895) 45%,
            rgba(18, 22, 30, 0.91) 100%
          )
        `,
        backdropFilter: 'blur(28px) saturate(154%)',
        WebkitBackdropFilter: 'blur(28px) saturate(154%)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        boxShadow: `
          0 0 0 1px rgba(255, 255, 255, 0.032) inset,
          0 0 28px rgba(142, 187, 255, 0.075),
          0 24px 48px rgba(0, 0, 0, 0.22),
          inset 0 1px 0 rgba(255, 255, 255, 0.095),
          inset 0 0 3px rgba(142, 187, 255, 0.045)
        `,
        willChange: 'transform',
        transform: `translateY(${backgroundDrift}px)`
      }}
      animate={{
        y: isHovered ? -6 : 0,
        filter: `brightness(${isHovered ? 1.03 : (isAnyChipHovered ? 0.98 : 1)})`,
        boxShadow: isHovered
          ? `
            0 0 0 1px rgba(255, 255, 255, 0.032) inset,
            0 0 36px rgba(142, 187, 255, 0.12),
            0 26px 56px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.095),
            inset 0 0 3px rgba(142, 187, 255, 0.045)
          `
          : `
            0 0 0 1px rgba(255, 255, 255, 0.032) inset,
            0 0 28px rgba(142, 187, 255, 0.075),
            0 24px 48px rgba(0, 0, 0, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.095),
            inset 0 0 3px rgba(142, 187, 255, 0.045)
          `
      }}
      transition={{
        y: { duration: MOTION.DURATIONS.base, ease: MOTION.CURVES.primary },
        filter: { duration: MOTION.DURATIONS.base, ease: MOTION.CURVES.primary },
        boxShadow: { duration: MOTION.DURATIONS.base, ease: MOTION.CURVES.primary }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleOpenDrawer}
    >
      {/* Choreographed gradient shift */}
      <motion.div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: hoveredChipColor 
            ? `linear-gradient(180deg, ${hoveredChipColor} 0%, transparent 100%)`
            : 'linear-gradient(180deg, rgba(255,255,255,0.032) 0%, transparent 100%)',
          pointerEvents: 'none',
          borderRadius: '30px 30px 0 0'
        }}
        animate={{
          y: isHovered ? -2 : 0
        }}
        transition={{
          duration: 0.3,
          ease: MOTION.CURVES.secondary
        }}
      />

      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.042) 100%)',
        pointerEvents: 'none',
        borderRadius: '0 0 30px 30px'
      }} />

      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '30px',
        boxShadow: 'inset 0 0 3.5px rgba(142, 187, 255, 0.095)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        right: '20%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
        filter: 'blur(1.5px)',
        pointerEvents: 'none'
      }} />

      {/* Ultra-low opacity noise with movement (2%) */}
      {!isLowPower && (
        <motion.div 
          className="absolute inset-0 rounded-[30px] pointer-events-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.88\' numOctaves=\'3\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
            backgroundSize: '200px 200px',
            opacity: 0.02,
            mixBlendMode: 'overlay'
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      )}

      <div className="flex items-center justify-between mb-5" style={{ position: 'relative', zIndex: 10 }}>
        <motion.h2 
          className="text-[16px] font-semibold"
          style={{ 
            color: 'rgba(255,255,255,0.96)',
            letterSpacing: '-0.01em'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08, ease: MOTION.CURVES.tertiary }}
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
          transition={{ delay: 0.18, ease: MOTION.CURVES.secondary }}
        >
          {score}%
        </motion.div>
      </div>

      <div className="mb-6" style={{ position: 'relative', zIndex: 10 }}>
        <SignalLensNode 
          score={score} 
          isHovered={isHovered} 
          parentRef={containerRef}
          isAnyChipHovered={isAnyChipHovered}
          hoveredChipColor={hoveredChipColor}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        <CategoryGlassChips 
          segments={segments} 
          isHovered={isHovered}
          onChipHover={handleChipHover}
          onChipLeave={handleChipLeave}
        />
      </div>

      {/* Choreographed metadata */}
      <motion.p
        className="text-xs text-center"
        style={{ 
          color: 'rgba(255,255,255,0.57)', 
          position: 'relative', 
          zIndex: 10,
          fontSize: '10px',
          letterSpacing: '-0.015em',
          marginTop: '8px'
        }}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isHovered ? 0.55 : (isAnyChipHovered ? 0.52 : 0.58)
        }}
        transition={{ 
          delay: 1.0,
          opacity: { duration: 0.2, ease: MOTION.CURVES.tertiary }
        }}
      >
        Based on {sourcesCount} sources • Updated {updatedAgo}
      </motion.p>

      {/* Interactive breakdown hint */}
      <motion.div 
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center text-xs pointer-events-none"
        style={{ color: 'rgba(255,255,255,0.50)', zIndex: 10 }}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          y: isHintHovered ? -1 : 0
        }}
        transition={{ 
          opacity: { duration: 0.2, ease: MOTION.CURVES.tertiary },
          y: { duration: 0.04, ease: MOTION.CURVES.primary }
        }}
        onHoverStart={() => setIsHintHovered(true)}
        onHoverEnd={() => setIsHintHovered(false)}
      >
        <motion.div
          animate={{
            rotate: isHintHovered ? [0, 3, 0] : 0
          }}
          transition={{
            duration: 0.04,
            ease: 'easeOut'
          }}
        >
          <YinYangIcon className="w-3 h-3 mr-1.5" strokeWidth={2.0} />
        </motion.div>
        <motion.span
          animate={{
            textShadow: isHintHovered 
              ? '0 0 8px rgba(255,255,255,0.4)'
              : '0 0 0px rgba(255,255,255,0)'
          }}
          transition={{
            duration: 0.15
          }}
        >
          View detailed breakdown
        </motion.span>
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

        /* Mobile adaptations: reduced gaps */
        @media (max-width: 768px) {
          .consensus-lens {
            padding: 28px 24px 24px 24px;
          }
          
          .signal-orb-outer {
            transform: scale(0.95);
          }
        }
      `}</style>
    </motion.div>
  );
}