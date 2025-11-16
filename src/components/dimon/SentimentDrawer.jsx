// 🔒 DESIGN LOCKED — OS HORIZON V6.0 INSIGHT STRATA ARCHITECTURE
// Last Updated: 2025-01-20
// VIREON CERTIFIED — Insight Strata Model (3-Layer System)
// Apple macOS Tahoe + VisionOS Design Language
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { X, TrendingUp, TrendingDown, ArrowRight, Activity } from 'lucide-react';

// OS Horizon Motion DNA
const MOTION = {
  CURVES: {
    primary: [0.22, 0.61, 0.36, 1],
    secondary: [0.25, 0.46, 0.45, 0.94],
    breathe: [0.33, 0, 0.4, 1]
  },
  DURATIONS: {
    fast: 0.08,
    base: 0.12,
    slow: 0.18,
    breathing: 9
  }
};

// SF Symbol-Style Outline Icons
const OutlineIcons = {
  Policy: ({ style }) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={style}>
      <path 
        d="M10 3.5L5 5.5V9C5 12 7.5 14.5 10 15.5C12.5 14.5 15 12 15 9V5.5L10 3.5Z" 
        stroke="currentColor" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  ),
  Credit: ({ style }) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={style}>
      <rect x="4.5" y="5.5" width="11" height="3" rx="0.6" stroke="currentColor" strokeWidth="1.2" />
      <rect x="4.5" y="11.5" width="11" height="3" rx="0.6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  Equities: ({ style }) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={style}>
      <path d="M6 14V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M10 14V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M14 14V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  Global: ({ style }) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={style}>
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 3.5C10 3.5 12.5 6 12.5 10C12.5 14 10 16.5 10 16.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M4 10H16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
};

// Narrative Content
const NARRATIVE_MAP = {
  Policy: {
    summary: "Regulators tightening oversight in medium-term policy environment.",
    support: "Heightened scrutiny raising compliance costs across sectors."
  },
  Credit: {
    summary: "Spreads widening as stress pockets form in credit markets.",
    support: "Early-stage deterioration signaling caution on issuance."
  },
  Equities: {
    summary: "Market breadth remains flat with limited participation.",
    support: "Narrow leadership offers weaker support to risk assets."
  },
  Global: {
    summary: "China slowdown weighing on global momentum and trade flows.",
    support: "Softer demand dragging macro outlook into H1 2026."
  }
};

// ============================================================================
// STRATUM 1 — LUMINOUS ALIGNMENT ORB (VisionOS Hero Signal)
// ============================================================================
const LuminousAlignmentOrb = ({ score }) => {
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const orbRef = useRef(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 100, damping: 22, mass: 0.7 };
  const parallaxX = useSpring(useTransform(mouseX, [-100, 100], [-3, 3]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [-100, 100], [-3, 3]), springConfig);
  
  const lightDriftX = useTransform(mouseX, [-100, 100], [-8, 8]);
  const lightDriftY = useTransform(mouseY, [-100, 100], [-8, 8]);

  const getZoneColor = (s) => {
    if (s < 40) return '#E86565';
    if (s < 70) return '#70A8E8';
    return '#32C288';
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
    if (shouldReduceMotion || !orbRef?.current) return;

    const handleMouseMove = (e) => {
      const rect = orbRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    const parent = orbRef.current.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      return () => parent.removeEventListener('mousemove', handleMouseMove);
    }
  }, [shouldReduceMotion, mouseX, mouseY]);

  const breathingScale = 1 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.DURATIONS.breathing)) * 0.009;
  const breathingOpacity = 0.04 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.DURATIONS.breathing)) * 0.018;
  const crescentRotation = breathingPhase * 0.5;

  return (
    <motion.div 
      ref={orbRef}
      className="relative flex items-center justify-center mx-auto"
      style={{
        width: '220px',
        height: '220px',
        marginTop: '42px',
        marginBottom: '38px',
        x: parallaxX,
        y: parallaxY
      }}
    >
      {/* Volumetric Halo (Light-field Background) */}
      <motion.div
        className="absolute"
        style={{
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}12 0%, ${color}06 45%, transparent 72%)`,
          filter: 'blur(36px)',
          pointerEvents: 'none'
        }}
        animate={{
          opacity: breathingOpacity + 0.05,
          scale: breathingScale * 1.22
        }}
        transition={{
          duration: MOTION.DURATIONS.breathing,
          ease: MOTION.CURVES.breathe
        }}
      />

      {/* Light-field Crescent (VisionOS Alignment Indicator) */}
      <motion.div
        className="absolute"
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: `
            conic-gradient(
              from ${crescentRotation}deg,
              ${color}20 0deg,
              ${color}35 ${score * 3.6}deg,
              transparent ${score * 3.6}deg,
              transparent 360deg
            )
          `,
          filter: 'blur(22px)',
          pointerEvents: 'none',
          x: lightDriftX,
          y: lightDriftY
        }}
        animate={{
          scale: breathingScale * 1.12,
          opacity: [0.48, 0.62, 0.48]
        }}
        transition={{
          scale: { duration: MOTION.DURATIONS.breathing, ease: MOTION.CURVES.breathe },
          opacity: { duration: MOTION.DURATIONS.breathing * 1.2, repeat: Infinity, ease: MOTION.CURVES.breathe }
        }}
      />

      {/* Liquid Glass Orb Container */}
      <motion.div
        className="absolute"
        style={{
          width: '155px',
          height: '155px',
          borderRadius: '50%',
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.09) 0%, 
              rgba(255, 255, 255, 0.03) 100%
            )
          `,
          backdropFilter: 'blur(28px) saturate(140%)',
          WebkitBackdropFilter: 'blur(28px) saturate(140%)',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: `
            inset 0 2px 14px rgba(255,255,255,0.12),
            inset 0 -2px 10px rgba(0,0,0,0.18),
            0 0 40px ${color}14
          `
        }}
        animate={{
          scale: breathingScale
        }}
        transition={{
          duration: MOTION.DURATIONS.breathing,
          ease: MOTION.CURVES.breathe
        }}
      >
        {/* Subsurface Luminance */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle at 42% 38%, ${color}08 0%, transparent 68%)`,
          pointerEvents: 'none'
        }} />

        {/* Top Rim Highlight */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '65px',
          height: '65px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 32% 32%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.12) 42%, transparent 68%)',
          filter: 'blur(14px)',
          pointerEvents: 'none'
        }} />

        {/* Micro Specular Highlight */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '22px',
          width: '36px',
          height: '18px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.12) 52%, transparent 100%)',
          filter: 'blur(5px)',
          transform: 'rotate(-22deg)',
          pointerEvents: 'none'
        }} />
      </motion.div>

      {/* Hero Text Stack */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-[11px] font-medium uppercase tracking-wide mb-4"
          style={{ 
            color: 'rgba(255,255,255,0.70)',
            letterSpacing: '0.14em',
            fontWeight: 500
          }}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4, ease: MOTION.CURVES.primary }}
        >
          Street Alignment
        </motion.span>
        
        <motion.span
          className="text-5xl font-bold mb-2.5"
          style={{ 
            color,
            textShadow: `0 0 20px ${color}38, 0 2px 10px rgba(0,0,0,0.26)`,
            filter: 'brightness(1.10) contrast(1.08)',
            letterSpacing: '-0.04em'
          }}
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.38, ease: MOTION.CURVES.primary }}
        >
          {score}
        </motion.span>
        
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.32 }}
        >
          <div className="text-[16px] font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.98)' }}>
            {label}
          </div>
          <div className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.60)' }}>
            Weight: Medium
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// STRATUM 2 — NARRATIVE INSIGHT ROW (Apple Weather-Style)
// ============================================================================
const NarrativeInsightRow = ({ segment, index, onOpenDetail }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const weight = (segment?.weight || 0) * 100;
  const name = segment?.name || 'Unknown';
  const narrative = NARRATIVE_MAP[name] || { 
    summary: String(segment?.note || 'No insights'), 
    support: '' 
  };

  const getIconColor = (n) => {
    switch (n) {
      case 'Policy': return '#70A8E8';
      case 'Credit': return '#B88AED';
      case 'Equities': return '#32C288';
      case 'Global': return '#EDB859';
      default: return '#A8B1BA';
    }
  };

  const getStatePill = () => {
    const stressMap = {
      high: { label: 'High Stress', icon: '↓', color: '#E86565' },
      moderate: { label: 'Moderate', icon: '↑', color: '#EDB859' },
      stable: { label: 'Stable', icon: '→', color: '#32C288' }
    };
    return stressMap[segment?.stress_level] || stressMap.stable;
  };

  const iconColor = getIconColor(name);
  const Icon = OutlineIcons[name] || OutlineIcons.Global;
  const statePill = getStatePill();

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.75 + (index * 0.07), duration: 0.38, ease: MOTION.CURVES.primary }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onOpenDetail?.(segment)}
    >
      <motion.div
        className="relative rounded-2xl cursor-pointer overflow-hidden"
        style={{
          padding: '20px 22px',
          background: 'rgba(255, 255, 255, 0.032)',
          backdropFilter: 'blur(26px) saturate(125%)',
          WebkitBackdropFilter: 'blur(26px) saturate(125%)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 2px 8px rgba(0,0,0,0.04)',
          willChange: 'transform'
        }}
        animate={{
          y: isHovered ? -2 : 0,
          boxShadow: isHovered
            ? `inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 14px rgba(0,0,0,0.08), 0 0 22px ${iconColor}05`
            : 'inset 0 1px 0 rgba(255,255,255,0.07), 0 2px 8px rgba(0,0,0,0.04)',
          borderColor: isHovered ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.09)'
        }}
        transition={{ duration: MOTION.DURATIONS.base, ease: MOTION.CURVES.secondary }}
      >
        {/* Top Edge Rim Light */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '14%',
          right: '14%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
          pointerEvents: 'none'
        }} />

        {/* Subsurface Color Tint */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% -25%, ${iconColor}03 0%, transparent 100%)`,
          borderRadius: '16px',
          pointerEvents: 'none'
        }} />

        {/* Section Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center relative"
              style={{
                background: `${iconColor}06`,
                border: `1px solid ${iconColor}14`
              }}
            >
              <Icon style={{ color: iconColor, filter: 'brightness(1.12)' }} />
            </div>
            <span className="text-[15px] font-semibold tracking-tight" style={{ color: 'rgba(255,255,255,0.98)' }}>
              {name}
            </span>
          </div>
          <span className="text-lg font-bold tracking-tight" style={{ color: iconColor, filter: 'brightness(1.10)' }}>
            {Math.round(weight)}%
          </span>
        </div>

        {/* One-Line Narrative Summary */}
        <p 
          className="text-[14px] font-medium mb-1.5"
          style={{ 
            color: 'rgba(255,255,255,0.96)',
            letterSpacing: '-0.008em',
            lineHeight: '1.4'
          }}
        >
          {narrative.summary}
        </p>

        {/* Supporting Micro-Insight */}
        <p 
          className="text-[12px] mb-3.5" 
          style={{ 
            color: 'rgba(255,255,255,0.65)', 
            lineHeight: '1.5',
            letterSpacing: '-0.004em'
          }}
        >
          {narrative.support}
        </p>

        {/* Trend Strip (State Pill) */}
        <div className="flex items-center gap-2.5 mb-3.5">
          <div
            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1.5"
            style={{
              background: `${statePill.color}08`,
              border: `1px solid ${statePill.color}16`,
              color: statePill.color,
              letterSpacing: '0.02em'
            }}
          >
            <span>{statePill.label}</span>
            <span className="text-[13px]">{statePill.icon}</span>
          </div>
        </div>

        {/* Visual Signal Bar */}
        <div className="relative">
          <div style={{
            position: 'absolute',
            top: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            height: '14px',
            background: `radial-gradient(ellipse, ${iconColor}05 0%, transparent 78%)`,
            filter: 'blur(7px)',
            pointerEvents: 'none'
          }} />
          
          <div 
            className="w-full h-[3px] rounded-full overflow-hidden relative" 
            style={{ background: 'rgba(0,0,0,0.18)' }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05), transparent)',
              pointerEvents: 'none'
            }} />
            
            <motion.div
              className="h-full rounded-full"
              style={{ 
                background: `linear-gradient(90deg, ${iconColor}95, ${iconColor}f5)`,
                boxShadow: `0 0 8px ${iconColor}28`
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${weight}%` }}
              transition={{ 
                duration: 0.75, 
                delay: 0.85 + (index * 0.07), 
                ease: 'easeOut' 
              }}
            />
          </div>
        </div>

        {/* View Analysis Hint */}
        <motion.div 
          className="flex items-center justify-end text-[11px] font-medium mt-3.5"
          style={{ color: 'rgba(255,255,255,0.52)' }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 2
          }}
          transition={{ duration: MOTION.DURATIONS.base }}
        >
          <span>View Analysis</span>
          <ArrowRight className="w-3 h-3 ml-1.5" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// MAIN DRAWER — INSIGHT STRATA ARCHITECTURE
// ============================================================================
const SentimentDrawer = ({ isOpen, onClose, score, breakdown, onOpenDetail }) => {
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
        animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.28, ease: MOTION.CURVES.primary }}
      >
        {/* Stabilized Background Scrim */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.65)' }}
          onClick={onClose}
        />

        {/* Drawer Panel */}
        <motion.div
          className="relative w-full max-w-4xl rounded-[34px] overflow-hidden border"
          style={{
            background: `
              linear-gradient(180deg, 
                rgba(18, 20, 28, 0.82) 0%,
                rgba(17, 19, 27, 0.86) 100%
              )
            `,
            backdropFilter: 'blur(48px) saturate(185%)',
            WebkitBackdropFilter: 'blur(48px) saturate(185%)',
            borderColor: 'rgba(255,255,255,0.13)',
            boxShadow: `
              0 32px 64px -14px rgba(0, 0, 0, 0.78),
              0 0 45px rgba(142, 187, 255, 0.07),
              inset 0 1px 0 rgba(255, 255, 255, 0.11),
              inset 0 0 0 1px rgba(255, 255, 255, 0.026)
            `,
            maxHeight: 'calc(100vh - 100px)'
          }}
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 16 }}
          transition={{ duration: 0.24, ease: MOTION.CURVES.primary }}
        >
          {/* Liquid Glass Layers */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '70%',
            height: '55%',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(142, 187, 255, 0.020) 0%, transparent 75%)',
            pointerEvents: 'none',
            borderRadius: '34px 34px 0 0'
          }} />

          <div style={{
            position: 'absolute',
            top: 0,
            left: '12%',
            right: '12%',
            height: '1.5px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.24), transparent)',
            filter: 'blur(0.8px)',
            pointerEvents: 'none'
          }} />

          {/* Header */}
          <div 
            className="relative border-b" 
            style={{ 
              borderColor: 'rgba(255,255,255,0.08)',
              padding: '28px 32px 24px 32px',
              background: 'rgba(255, 255, 255, 0.010)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-14 h-14 rounded-xl border flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'rgba(142, 187, 255, 0.08)',
                    borderColor: 'rgba(142, 187, 255, 0.20)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.10), 0 2px 12px rgba(142, 187, 255, 0.16)'
                  }}
                >
                  <Activity className="w-7 h-7 relative z-10" style={{ color: '#8EBBFF', filter: 'brightness(1.10)' }} strokeWidth={1.6} />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.98)' }}>
                    Street Alignment
                  </h2>
                  <p className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.76)' }}>
                    Consensus & Segment Breakdown
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.10)'
                }}
                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.13)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: MOTION.DURATIONS.fast }}
              >
                <X className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.78)' }} />
              </motion.button>
            </div>
          </div>

          {/* Body */}
          <div className="px-12 pt-4 pb-12 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
            {/* STRATUM 1: Luminous Alignment Orb */}
            <LuminousAlignmentOrb score={consensusScore} />

            {/* Metadata */}
            <motion.p
              className="text-xs text-center mb-12"
              style={{ color: 'rgba(255,255,255,0.54)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.3 }}
            >
              Based on 5 sources • Updated 2m ago
            </motion.p>

            {/* STRATUM 2: Narrative Insight Rows (2-column) */}
            {segments.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-12">
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
              <div className="text-center py-16">
                <Activity className="w-11 h-11 mx-auto mb-3.5" style={{ color: 'rgba(255,255,255,0.26)' }} />
                <p style={{ color: 'rgba(255,255,255,0.56)' }}>No segment data available</p>
              </div>
            )}

            {/* STRATUM 3: Deep Dive Access */}
            <motion.button
              className="w-full py-5 px-7 rounded-2xl flex items-center justify-center gap-2.5"
              style={{
                background: 'rgba(255,255,255,0.032)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: 'rgba(255,255,255,0.76)',
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '-0.006em'
              }}
              whileHover={{
                background: 'rgba(255,255,255,0.052)',
                borderColor: 'rgba(255,255,255,0.13)',
                y: -2
              }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: MOTION.DURATIONS.base }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.32 }}
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