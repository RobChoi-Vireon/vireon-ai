// 🔒 DESIGN LOCKED — OS HORIZON V6.0 INSIGHT STRATA ARCHITECTURE
// Last Updated: 2025-01-20
// VIREON CERTIFIED — Insight Strata Model (3-Layer System)
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Minus, Activity, ArrowRight } from 'lucide-react';

// OS Horizon Motion DNA
const MOTION = {
  CURVES: {
    primary: [0.22, 0.61, 0.36, 1],
    secondary: [0.25, 0.46, 0.45, 0.94],
    breathe: [0.33, 0, 0.4, 1]
  },
  DURATIONS: {
    fast: 0.11,
    base: 0.18,
    slow: 0.22,
    breathing: 8
  }
};

// Minimal Outline Icons (Apple-tier)
const OutlineIcons = {
  Policy: ({ className, style }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={className} style={style}>
      <path 
        d="M9 3L4 5V8.5C4 11.5 6.5 14 9 15C11.5 14 14 11.5 14 8.5V5L9 3Z" 
        stroke="currentColor" 
        strokeWidth="1.3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  ),
  Credit: ({ className, style }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={className} style={style}>
      <rect x="4" y="5" width="10" height="2.5" rx="0.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="4" y="10.5" width="10" height="2.5" rx="0.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  Equities: ({ className, style }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={className} style={style}>
      <path d="M5 13V10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M9 13V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M13 13V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  Global: ({ className, style }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={className} style={style}>
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M9 3C9 3 11.5 5.5 11.5 9C11.5 12.5 9 15 9 15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M3.5 9H14.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
};

// Narrative Content
const NARRATIVE_MAP = {
  Policy: {
    headline: "Oversight tightening",
    insight: "Regulators are increasing scrutiny, raising medium-term policy pressure."
  },
  Credit: {
    headline: "Stress pockets forming",
    insight: "Spreads are widening, signaling early-stage deterioration in credit conditions."
  },
  Equities: {
    headline: "Breadth remains flat",
    insight: "Market participation is limited, offering weaker support to risk assets."
  },
  Global: {
    headline: "China slowdown weighing",
    insight: "Global momentum is softening as China drags the macro outlook."
  }
};

// ============================================================================
// STRATUM 1 — HERO SIGNAL (Luminous Alignment Field)
// ============================================================================
const HeroAlignmentField = ({ score }) => {
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const fieldRef = useRef(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 120, damping: 25, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-40, 40], [0.8, -0.8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-40, 40], [-0.8, 0.8]), springConfig);
  
  const lightShiftX = useTransform(mouseX, [-40, 40], [-4, 4]);
  const lightShiftY = useTransform(mouseY, [-40, 40], [-4, 4]);

  const getZoneColor = (s) => {
    if (s < 40) return '#E86565';
    if (s < 70) return '#6BA9F0';
    return '#2BC285';
  };

  const getZoneLabel = (s) => {
    if (s < 40) return 'Bearish';
    if (s < 70) return 'Mildly Bullish';
    return 'Bullish';
  };

  const color = getZoneColor(score);
  const label = getZoneLabel(score);

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
      setBreathingPhase(elapsed);
      rafId = requestAnimationFrame(animate);
    };
    
    rafId = requestAnimationFrame(animate);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion || !fieldRef?.current) return;

    const handleMouseMove = (e) => {
      const rect = fieldRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    const parent = fieldRef.current;
    parent.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      parent.removeEventListener('mousemove', handleMouseMove);
    };
  }, [shouldReduceMotion, mouseX, mouseY]);

  const breathingScale = 1 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.DURATIONS.breathing)) * 0.008;
  const breathingOpacity = 0.03 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.DURATIONS.breathing)) * 0.015;
  const crescentRotation = Math.sin(breathingPhase * (2 * Math.PI / 12)) * 3;

  return (
    <div 
      ref={fieldRef} 
      className="relative flex items-center justify-center mx-auto"
      style={{
        width: '200px',
        height: '200px',
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        marginTop: '32px',
        marginBottom: '32px'
      }}
    >
      {/* Volumetric Glow Base */}
      <motion.div
        className="absolute"
        style={{
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}14 0%, ${color}08 40%, transparent 70%)`,
          filter: 'blur(32px)',
          pointerEvents: 'none'
        }}
        animate={{
          opacity: breathingOpacity + 0.04,
          scale: breathingScale * 1.18
        }}
        transition={{
          duration: MOTION.DURATIONS.breathing,
          ease: MOTION.CURVES.breathe
        }}
      />

      {/* Luminous Crescent Field (VisionOS-style) */}
      <motion.div
        className="absolute"
        style={{
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: `
            conic-gradient(
              from ${crescentRotation}deg,
              ${color}18 0deg,
              ${color}28 ${score * 3.6}deg,
              transparent ${score * 3.6}deg,
              transparent 360deg
            )
          `,
          filter: 'blur(18px)',
          pointerEvents: 'none',
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY
        }}
        animate={{
          scale: breathingScale * 1.08,
          opacity: [0.45, 0.55, 0.45]
        }}
        transition={{
          scale: { duration: MOTION.DURATIONS.breathing, ease: MOTION.CURVES.breathe },
          opacity: { duration: MOTION.DURATIONS.breathing, repeat: Infinity, ease: MOTION.CURVES.breathe }
        }}
      />

      {/* Inner Liquid Glass Orb */}
      <motion.div
        className="absolute"
        style={{
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.08) 0%, 
              rgba(255, 255, 255, 0.02) 100%
            )
          `,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: `
            inset 0 2px 12px rgba(255,255,255,0.10),
            inset 0 -2px 8px rgba(0,0,0,0.15),
            0 0 36px ${color}12
          `,
          x: lightShiftX,
          y: lightShiftY
        }}
        animate={{
          scale: breathingScale
        }}
        transition={{
          duration: MOTION.DURATIONS.breathing,
          ease: MOTION.CURVES.breathe
        }}
      >
        {/* Top Rim Light */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 28% 28%, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.10) 40%, transparent 65%)',
          filter: 'blur(12px)',
          pointerEvents: 'none'
        }} />

        {/* Micro Specular Highlight */}
        <div style={{
          position: 'absolute',
          top: '6px',
          left: '18px',
          width: '32px',
          height: '16px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.10) 50%, transparent 100%)',
          filter: 'blur(4px)',
          transform: 'rotate(-25deg)',
          pointerEvents: 'none'
        }} />
      </motion.div>

      {/* Hero Text Stack */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-[10px] font-medium uppercase tracking-wide mb-3"
          style={{ 
            color: 'rgba(255,255,255,0.68)',
            letterSpacing: '0.12em'
          }}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4, ease: MOTION.CURVES.primary }}
        >
          Street Alignment
        </motion.span>
        
        <motion.span
          className="text-5xl font-bold mb-2"
          style={{ 
            color,
            textShadow: `0 0 18px ${color}35, 0 2px 8px rgba(0,0,0,0.24)`,
            filter: 'brightness(1.08) contrast(1.06)',
            letterSpacing: '-0.03em'
          }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.35, ease: MOTION.CURVES.primary }}
        >
          {score}
        </motion.span>
        
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          <div className="text-[15px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.98)' }}>
            {label}
          </div>
          <div className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.62)' }}>
            Weight: Medium
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================================================
// STRATUM 2 — NARRATIVE INSIGHT ROW
// ============================================================================
const NarrativeInsightRow = ({ segment, index, onOpenDetail }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const weight = (segment?.weight || 0) * 100;
  const name = segment?.name || 'Unknown';
  const narrative = NARRATIVE_MAP[name] || { 
    headline: String(segment?.note || 'No insights'), 
    insight: '' 
  };

  const getIconColor = (n) => {
    switch (n) {
      case 'Policy': return '#6BA9F0';
      case 'Credit': return '#B77FED';
      case 'Equities': return '#2BC285';
      case 'Global': return '#EDB74A';
      default: return '#A5ACB5';
    }
  };

  const getTrendData = () => {
    const stressMap = {
      high: { label: 'High Stress', color: '#E86565' },
      moderate: { label: 'Moderate', color: '#EDB74A' },
      stable: { label: 'Stable', color: '#2BC285' }
    };
    const trendMap = {
      worsening: { label: 'Worsening', Icon: TrendingDown },
      rising: { label: 'Rising', Icon: TrendingUp },
      stable: { label: 'Stable', Icon: Minus }
    };
    return {
      stress: stressMap[segment?.stress_level] || stressMap.stable,
      trend: trendMap[segment?.trend_indicator] || trendMap.stable
    };
  };

  const iconColor = getIconColor(name);
  const Icon = OutlineIcons[name] || OutlineIcons.Global;
  const trendData = getTrendData();

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 + (index * 0.06), duration: 0.35, ease: MOTION.CURVES.primary }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onOpenDetail?.(segment)}
    >
      <motion.div
        className="relative rounded-2xl cursor-pointer overflow-hidden"
        style={{
          padding: '22px 24px',
          background: 'rgba(255, 255, 255, 0.035)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 3px 10px rgba(0,0,0,0.05)',
          willChange: 'transform, opacity'
        }}
        animate={{
          y: isHovered ? -1.5 : 0,
          boxShadow: isHovered
            ? `inset 0 1px 0 rgba(255,255,255,0.08), 0 5px 16px rgba(0,0,0,0.09), 0 0 20px ${iconColor}06`
            : 'inset 0 1px 0 rgba(255,255,255,0.06), 0 3px 10px rgba(0,0,0,0.05)',
          borderColor: isHovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)'
        }}
        transition={{ duration: MOTION.DURATIONS.base, ease: MOTION.CURVES.secondary }}
      >
        {/* Top Rim Light */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '12%',
          right: '12%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
          pointerEvents: 'none'
        }} />

        {/* Subsurface Tint */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% -20%, ${iconColor}04 0%, transparent 100%)`,
          borderRadius: '16px',
          pointerEvents: 'none'
        }} />

        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-lg flex items-center justify-center relative"
              style={{
                background: `${iconColor}08`,
                border: `1px solid ${iconColor}18`,
                boxShadow: `inset 0 1px 1px rgba(255,255,255,0.06), 0 2px 6px ${iconColor}10`
              }}
            >
              <Icon style={{ color: iconColor, filter: 'brightness(1.10)' }} />
            </div>
            <span className="text-[15px] font-semibold" style={{ color: 'rgba(255,255,255,0.98)' }}>
              {name}
            </span>
          </div>
          <span className="text-lg font-bold" style={{ color: iconColor, filter: 'brightness(1.08)' }}>
            {Math.round(weight)}%
          </span>
        </div>

        {/* Narrative */}
        <div className="mb-3.5">
          <div 
            className="text-[14px] font-semibold mb-1"
            style={{ 
              color: 'rgba(255,255,255,0.96)',
              letterSpacing: '-0.005em',
              lineHeight: '1.3'
            }}
          >
            {narrative.headline}
          </div>
          <p 
            className="text-[12px]" 
            style={{ 
              color: 'rgba(255,255,255,0.68)', 
              lineHeight: '1.5',
              letterSpacing: '-0.003em'
            }}
          >
            {narrative.insight}
          </p>
        </div>

        {/* Micro-Trend Row */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wide flex items-center gap-1"
            style={{
              background: `${trendData.stress.color}0A`,
              border: `1px solid ${trendData.stress.color}18`,
              color: trendData.stress.color,
              letterSpacing: '0.06em'
            }}
          >
            {trendData.stress.label}
          </div>
          <div
            className="px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wide flex items-center gap-1"
            style={{
              background: `${trendData.stress.color}0A`,
              border: `1px solid ${trendData.stress.color}18`,
              color: trendData.stress.color,
              letterSpacing: '0.06em'
            }}
          >
            {React.cloneElement(<trendData.trend.Icon />, { className: "w-2.5 h-2.5" })}
            {trendData.trend.label}
          </div>
        </div>

        {/* Signal Bar */}
        <div className="relative">
          <div style={{
            position: 'absolute',
            top: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            height: '16px',
            background: `radial-gradient(ellipse, ${iconColor}06 0%, transparent 75%)`,
            filter: 'blur(8px)',
            pointerEvents: 'none'
          }} />
          
          <div 
            className="w-full h-1 rounded-full overflow-hidden relative" 
            style={{ background: 'rgba(0,0,0,0.20)' }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.06), transparent)',
              pointerEvents: 'none'
            }} />
            
            <motion.div
              className="h-full rounded-full"
              style={{ 
                background: `linear-gradient(90deg, ${iconColor}a0, ${iconColor}f8)`,
                boxShadow: `0 0 8px ${iconColor}30`
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${weight}%` }}
              transition={{ 
                duration: 0.7, 
                delay: 0.9 + (index * 0.06), 
                ease: 'easeOut' 
              }}
            />
          </div>
        </div>

        {/* View Analysis Hint */}
        <motion.div 
          className="flex items-center justify-end text-[11px] font-medium mt-3"
          style={{ color: 'rgba(255,255,255,0.55)' }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 2
          }}
          transition={{ duration: MOTION.DURATIONS.base }}
        >
          <span>View Analysis</span>
          <ArrowRight className="w-3 h-3 ml-1" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// MAIN DRAWER — INSIGHT STRATA ARCHITECTURE
// ============================================================================
const SentimentDrawer = ({ isOpen, onClose, score, breakdown, onOpenDetail }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose?.();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const consensusScore = useMemo(() => (typeof score === 'number' ? score : 0), [score]);
  const segments = useMemo(() => (Array.isArray(breakdown?.segments) ? breakdown.segments : []), [breakdown]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ paddingTop: '80px' }}
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(18px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.3, ease: MOTION.CURVES.primary }}
      >
        {/* Stabilized Background */}
        <motion.div
          className="absolute left-0 right-0 bottom-0"
          style={{ 
            top: '80px',
            background: 'rgba(0,0,0,0.60)',
            willChange: 'opacity'
          }}
          animate={{ opacity: 1 }}
          onClick={onClose}
        />

        {/* Drawer Panel */}
        <motion.div
          className="relative w-full max-w-3xl rounded-[32px] overflow-hidden border"
          style={{
            background: `
              linear-gradient(180deg, 
                rgba(18, 20, 28, 0.85) 0%,
                rgba(17, 19, 27, 0.88) 100%
              )
            `,
            backdropFilter: 'blur(42px) saturate(178%)',
            WebkitBackdropFilter: 'blur(42px) saturate(178%)',
            borderColor: 'rgba(255,255,255,0.12)',
            boxShadow: `
              0 30px 60px -12px rgba(0, 0, 0, 0.75),
              0 0 42px rgba(142, 187, 255, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.10),
              inset 0 0 0 1px rgba(255, 255, 255, 0.028)
            `
          }}
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 12 }}
          transition={{ duration: 0.22, ease: MOTION.CURVES.primary }}
        >
          {/* Liquid Glass Layers */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '65%',
            height: '50%',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(142, 187, 255, 0.022) 0%, transparent 72%)',
            pointerEvents: 'none',
            borderRadius: '32px 32px 0 0'
          }} />

          <div style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '1.5px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
            filter: 'blur(0.8px)',
            pointerEvents: 'none'
          }} />

          {/* Header */}
          <div 
            className="relative border-b" 
            style={{ 
              borderColor: 'rgba(255,255,255,0.08)',
              padding: '26px 28px 22px 28px',
              background: 'rgba(255, 255, 255, 0.012)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-13 h-13 rounded-xl border flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'rgba(142, 187, 255, 0.08)',
                    borderColor: 'rgba(142, 187, 255, 0.20)',
                    backdropFilter: 'blur(14px)',
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.09), 0 2px 10px rgba(142, 187, 255, 0.14)'
                  }}
                >
                  <Activity className="w-6 h-6 relative z-10" style={{ color: '#8EBBFF', filter: 'brightness(1.08)' }} strokeWidth={1.8} />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.98)' }}>
                    Street Alignment
                  </h2>
                  <p className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.78)' }}>
                    Consensus & Segment Breakdown
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.10)'
                }}
                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.12)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: MOTION.DURATIONS.fast }}
              >
                <X className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.76)' }} />
              </motion.button>
            </div>
          </div>

          {/* Body */}
          <div className="p-10 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
            {/* STRATUM 1: Hero Signal */}
            <HeroAlignmentField score={consensusScore} />

            {/* Metadata */}
            <motion.p
              className="text-xs text-center mb-10"
              style={{ color: 'rgba(255,255,255,0.56)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              Based on 5 sources • Updated 2m ago
            </motion.p>

            {/* STRATUM 2: Narrative Insights (2-column grid) */}
            {segments.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                {segments.map((segment, index) => (
                  <NarrativeInsightRow
                    key={segment.name}
                    segment={segment}
                    index={index}
                    onOpenDetail={onOpenDetail}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="w-10 h-10 mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.28)' }} />
                <p style={{ color: 'rgba(255,255,255,0.58)' }}>No segment data available</p>
              </div>
            )}

            {/* STRATUM 3: Deep Dive (Minimal Button) */}
            <motion.button
              className="w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-2"
              style={{
                background: 'rgba(255,255,255,0.035)',
                backdropFilter: 'blur(18px)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.78)',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '-0.005em'
              }}
              whileHover={{
                background: 'rgba(255,255,255,0.055)',
                borderColor: 'rgba(255,255,255,0.12)',
                y: -1
              }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: MOTION.DURATIONS.base }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.3 }}
            >
              View Full Segment Analysis
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(SentimentDrawer);