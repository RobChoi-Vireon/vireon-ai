// 🔒 DESIGN LOCKED — OS HORIZON V5.0 FULL CERTIFICATION (16/16 PILLARS)
// Last Updated: 2025-01-20
// OS HORIZON CERTIFIED — Unified with Consensus Orb Material System
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Minus, Activity, ArrowRight, AlertTriangle } from 'lucide-react';

// OS Horizon Motion DNA (Unified with Consensus Orb)
const MOTION = {
  CURVES: {
    primary: [0.22, 0.61, 0.36, 1],      // Hero animations (Orb DNA)
    secondary: [0.25, 0.46, 0.45, 0.94], // Card interactions
    tertiary: [0.20, 0.60, 0.35, 1],     // Micro-interactions
    breathe: [0.33, 0, 0.4, 1]           // Breathing curve
  },
  DURATIONS: {
    fast: 0.11,
    base: 0.15,
    slow: 0.22,
    breathing: 6.5                       // Matched to orb breathing
  }
};

// OS HORIZON MINIMAL ICON SYSTEM — Unified Visual Language
const MinimalIcons = {
  Policy: ({ className, style }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} style={style}>
      <path 
        d="M8 2L3 4.5V7.5C3 10.5 5.5 13 8 14C10.5 13 13 10.5 13 7.5V4.5L8 2Z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  ),
  Credit: ({ className, style }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} style={style}>
      <rect x="3" y="4" width="10" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="3" y="9" width="10" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Equities: ({ className, style }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} style={style}>
      <path d="M4 12V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 12V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 12V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Global: ({ className, style }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} style={style}>
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 2.5C8 2.5 10.5 5 10.5 8C10.5 11 8 13.5 8 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
};

// Enhanced Radial Gauge — Unified with Consensus Orb Material System
const RadialGauge = ({ score }) => {
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const gaugeRef = useRef(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 150, damping: 30, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-50, 50], [1, -1]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-50, 50], [-1, 1]), springConfig);
  
  const gradientShiftX = useTransform(mouseX, [-50, 50], [-2, 2]);
  const gradientShiftY = useTransform(mouseY, [-50, 50], [-2, 2]);

  // Arc dimensions (slimmed by 15% for elegance)
  const radius = 58;
  const strokeWidth = 8.5;  // Reduced from 10
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getZoneColor = (s) => {
    if (s < 40) return '#F26A6A';
    if (s < 70) return '#5EA7FF';
    return '#2ECF8D';
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

  // Breathing animation (6-8% amplitude)
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

  // Parallax effect
  useEffect(() => {
    if (shouldReduceMotion || !gaugeRef?.current) return;

    const handleMouseMove = (e) => {
      const rect = gaugeRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    const parent = gaugeRef.current;
    parent.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      parent.removeEventListener('mousemove', handleMouseMove);
    };
  }, [shouldReduceMotion, mouseX, mouseY]);

  // Breathing scale (7% amplitude)
  const breathingScale = 1 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.DURATIONS.breathing)) * 0.007;
  const breathingOpacity = 0.025 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.DURATIONS.breathing)) * 0.015;
  const internalGradientShift = Math.sin(breathingPhase * (2 * Math.PI / 7)) * 2;

  return (
    <div ref={gaugeRef} className="relative flex items-center justify-center w-[136px] h-[136px] mx-auto" style={{
      perspective: '1000px',
      transformStyle: 'preserve-3d',
      marginTop: '20px',
      marginBottom: '16px'
    }}>
      {/* LAYER 1: Subsurface Volumetric Glow (Orb DNA) */}
      <motion.div
        className="absolute"
        style={{
          width: '165px',
          height: '165px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}12 0%, ${color}06 40%, transparent 70%)`,
          filter: 'blur(26px)',
          pointerEvents: 'none'
        }}
        animate={{
          opacity: breathingOpacity + 0.025,
          scale: breathingScale * 1.12
        }}
        transition={{
          opacity: { duration: MOTION.DURATIONS.breathing, ease: MOTION.CURVES.breathe },
          scale: { duration: MOTION.DURATIONS.breathing, ease: MOTION.CURVES.breathe }
        }}
      />

      {/* LAYER 2: Mid-layer Diffusion with Vertical Luminance Gradient */}
      <motion.div
        className="absolute"
        style={{
          width: '148px',
          height: '148px',
          borderRadius: '50%',
          background: `
            radial-gradient(ellipse at ${50 + internalGradientShift}% ${45 + internalGradientShift * 0.5}%, 
              ${color}0E 0%, 
              ${color}05 35%,
              ${color}02 60%,
              transparent 75%)
          `,
          filter: 'blur(20px)',
          pointerEvents: 'none',
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY
        }}
        animate={{
          scale: breathingScale * 1.025
        }}
        transition={{
          scale: { duration: MOTION.DURATIONS.breathing, ease: MOTION.CURVES.breathe }
        }}
      />

      {/* LAYER 3: Internal Depth Shading (Orb Glass Translucency) */}
      <motion.div
        className="absolute"
        style={{
          width: '125px',
          height: '125px',
          borderRadius: '50%',
          background: `
            radial-gradient(circle at 50% 35%, 
              rgba(255, 255, 255, 0.04) 0%, 
              transparent 60%)
          `,
          filter: 'blur(12px)',
          pointerEvents: 'none',
          x: gradientShiftX,
          y: gradientShiftY
        }}
        animate={{
          opacity: [0.4, 0.6, 0.4],
          scale: [1, 1.04, 1]
        }}
        transition={{
          duration: MOTION.DURATIONS.breathing,
          repeat: Infinity,
          ease: MOTION.CURVES.breathe
        }}
      />

      <svg width="136" height="136" className="transform -rotate-90 relative z-10">
        <defs>
          {/* Enhanced glow filter (Orb DNA, reduced brightness by 10%) */}
          <filter id="gauge-glow-unified" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.8" result="coloredBlur"/>
            <feColorMatrix 
              in="coloredBlur" 
              type="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.15 0"
            />
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background ring with glass translucency */}
        <circle
          cx="68"
          cy="68"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        
        {/* Foreground arc with Orb rim-highlight logic (10% less bright) */}
        <motion.circle
          cx="68"
          cy="68"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          filter="url(#gauge-glow-unified)"
          style={{
            filter: `drop-shadow(0 0 7px ${color}38)`,
            opacity: 0.90
          }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ 
            strokeDashoffset: offset,
            opacity: [0.90, 0.86, 0.90]
          }}
          transition={{ 
            strokeDashoffset: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
            opacity: { 
              duration: MOTION.DURATIONS.breathing, 
              repeat: Infinity, 
              ease: MOTION.CURVES.breathe 
            }
          }}
        />
      </svg>
      
      {/* Decluttered Content Stack */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Label above (10% smaller) */}
        <motion.span
          className="text-[9px] font-medium uppercase tracking-wide mb-2 relative z-10"
          style={{ 
            color: 'rgba(255,255,255,0.70)',
            letterSpacing: '0.09em'
          }}
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3, ease: MOTION.CURVES.tertiary }}
        >
          Overall Street Alignment
        </motion.span>
        
        {/* Score (hero) */}
        <motion.span
          className="text-3xl font-bold relative z-10"
          style={{ 
            color,
            textShadow: `0 0 16px ${color}40, 0 2px 6px rgba(0,0,0,0.28)`,
            filter: 'brightness(1.08) contrast(1.08)'
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3, ease: MOTION.CURVES.primary }}
        >
          {score}
        </motion.span>
        
        {/* Sentiment label (ONLY) */}
        <motion.div
          className="text-center relative z-10 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.3, ease: MOTION.CURVES.secondary }}
        >
          <div className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.98)' }}>
            {label}
          </div>
        </motion.div>
      </div>
      
      {/* Weight caption OUTSIDE circle */}
      <motion.div
        className="absolute"
        style={{
          bottom: '-32px',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85, duration: 0.25, ease: MOTION.CURVES.tertiary }}
      >
        <div className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Weight: Medium
        </div>
      </motion.div>
    </div>
  );
};

// Narrative Content Map — Clear Headlines + Sentences
const NARRATIVE_MAP = {
  Policy: {
    headline: "Oversight tightening",
    sentence: "Regulators are increasing scrutiny, raising medium-term policy pressure."
  },
  Credit: {
    headline: "Stress pockets forming",
    sentence: "Spreads are widening, signaling early-stage deterioration in credit conditions."
  },
  Equities: {
    headline: "Breadth remains flat",
    sentence: "Market participation is limited, offering weaker support to risk assets."
  },
  Global: {
    headline: "China slowdown weighing",
    sentence: "Global momentum is softening as China drags the macro outlook."
  }
};

const SentimentDrawer = ({ isOpen, onClose, score, breakdown, onOpenDetail }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const cardRefs = useRef({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose?.();
        }
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

  const getStressChip = (level) => {
    const config = {
      high: { label: 'High Stress', bg: 'rgba(239, 68, 68, 0.09)', border: 'rgba(239, 68, 68, 0.24)', text: '#F26A6A' },
      moderate: { label: 'Moderate', bg: 'rgba(251, 191, 36, 0.09)', border: 'rgba(251, 191, 36, 0.24)', text: '#FFB020' },
      stable: { label: 'Stable', bg: 'rgba(46, 207, 141, 0.09)', border: 'rgba(46, 207, 141, 0.24)', text: '#2ECF8D' }
    };
    return config[level] || config.stable;
  };

  const getTrendChip = (indicator) => {
    const config = {
      worsening: { label: 'Worsening', Icon: TrendingDown, color: '#F26A6A' },
      rising: { label: 'Rising', Icon: TrendingUp, color: '#FFB020' },
      stable: { label: 'Stable', Icon: Minus, color: '#5EA7FF' }
    };
    return config[indicator] || config.stable;
  };

  const getScoreColor = (s) => {
    if (s >= 70) return '#2ECF8D';
    if (s >= 40) return '#5EA7FF';
    return '#F26A6A';
  };

  const getSegmentIconColor = (name) => {
    switch (name) {
      case 'Policy': return '#5EA7FF';
      case 'Credit': return '#C084FC';
      case 'Equities': return '#2ECF8D';
      case 'Global': return '#FFB020';
      default: return '#AAB1B8';
    }
  };

  const getSegmentTint = (name) => {
    switch (name) {
      case 'Policy': return 'rgba(94, 167, 255, 0.04)';
      case 'Credit': return 'rgba(192, 132, 252, 0.04)';
      case 'Equities': return 'rgba(46, 207, 141, 0.04)';
      case 'Global': return 'rgba(255, 176, 32, 0.04)';
      default: return 'rgba(170, 177, 184, 0.04)';
    }
  };

  const getSegmentIcon = (name) => {
    return MinimalIcons[name] || MinimalIcons.Global;
  };

  if (!isOpen) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { 
      opacity: 1, 
      backdropFilter: 'blur(16px)',
      transition: { duration: 0.3, ease: MOTION.CURVES.primary }
    }
  };

  const drawerVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.96, 
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.22,
        ease: MOTION.CURVES.primary
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.98, 
      y: 12,
      transition: { duration: 0.25, ease: MOTION.CURVES.secondary }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: MOTION.CURVES.primary }
    },
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        style={{ paddingTop: '80px' }}
      >
        {/* STABILIZED: Static background overlay - only opacity changes */}
        <motion.div
          className="absolute left-0 right-0 bottom-0"
          style={{ 
            top: '80px',
            background: 'rgba(0,0,0,0.55)',
            willChange: 'opacity'
          }}
          animate={{
            opacity: hoveredCard ? 0.98 : 1
          }}
          transition={{ duration: 0.25, ease: MOTION.CURVES.primary }}
          onClick={onClose}
        />

        <motion.div
          className="relative w-full max-w-2xl rounded-[30px] overflow-hidden border"
          style={{
            background: `
              linear-gradient(180deg, 
                rgba(18, 20, 28, 0.88) 0%,
                rgba(19, 23, 31, 0.90) 45%,
                rgba(18, 22, 30, 0.92) 100%
              )
            `,
            backdropFilter: 'blur(36px) saturate(170%)',
            WebkitBackdropFilter: 'blur(36px) saturate(170%)',
            borderColor: 'rgba(255,255,255,0.14)',
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.75),
              0 0 40px rgba(142, 187, 255, 0.10),
              inset 0 1px 0 rgba(255, 255, 255, 0.10),
              inset 0 0 3px rgba(142, 187, 255, 0.05),
              inset 0 0 0 1px rgba(255, 255, 255, 0.032)
            `,
            willChange: 'transform'
          }}
          variants={drawerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* 3-LAYER LIQUID GLASS SYSTEM (STABILIZED - No Dynamic Updates) */}
          
          {/* Layer 1: Subsurface Lighting from Top Center (STATIC) */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '45%',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(142, 187, 255, 0.025) 0%, transparent 70%)',
            pointerEvents: 'none',
            borderRadius: '30px 30px 0 0'
          }} />

          {/* Layer 2: Ambient Haze (STATIC) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(142, 187, 255, 0.015) 0%, transparent 65%)',
            pointerEvents: 'none',
            opacity: 0.7,
            borderRadius: '30px'
          }} />

          {/* Layer 3: Surface Reflection Highlight (STATIC) */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '8%',
            right: '8%',
            height: '1.5px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.24), transparent)',
            filter: 'blur(0.8px)',
            pointerEvents: 'none'
          }} />

          {/* 1-2px Inner Glow for Depth (STATIC) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '30px',
            boxShadow: 'inset 0 0 2px rgba(142, 187, 255, 0.08)',
            pointerEvents: 'none'
          }} />

          {/* 2% Noise Texture (STATIC) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '30px',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulance type=\'fractalNoise\' baseFrequency=\'0.92\' numOctaves=\'3\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
            backgroundSize: '150px 150px',
            opacity: 0.02,
            mixBlendMode: 'overlay',
            pointerEvents: 'none'
          }} />

          {/* Header with Enhanced Padding (+4px vertical) */}
          <motion.div 
            variants={itemVariants} 
            className="relative border-b" 
            style={{ 
              borderColor: 'rgba(255,255,255,0.08)',
              padding: '24px 24px 20px 24px',
              background: 'rgba(255, 255, 255, 0.015)'
            }}
          >
            {/* 1px Bottom Divider with 5% Opacity Gradient Fade */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: '10%',
              right: '10%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
              pointerEvents: 'none'
            }} />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-xl border flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'rgba(142, 187, 255, 0.08)',
                    borderColor: 'rgba(142, 187, 255, 0.22)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.10), 0 2px 8px rgba(142, 187, 255, 0.15)'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '3px',
                    left: '3px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '6px',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.18), transparent)',
                    pointerEvents: 'none'
                  }} />
                  <Activity className="w-6 h-6 relative z-10" style={{ color: '#8EBBFF', filter: 'brightness(1.06)' }} strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.98)' }}>
                    Street Alignment
                  </h2>
                  <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.80)' }}>
                    Consensus & Segment Breakdown
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.10)'
                }}
                whileHover={{ 
                  scale: 1.05, 
                  background: 'rgba(255,255,255,0.12)',
                  transition: { duration: MOTION.DURATIONS.fast, ease: MOTION.CURVES.secondary }
                }}
                whileTap={{ 
                  scale: 0.95,
                  transition: { duration: 0.08 }
                }}
              >
                <X className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.76)' }} />
              </motion.button>
            </div>
          </motion.div>

          {/* Body */}
          <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
            {/* Top Section: Gauge */}
            <motion.div variants={itemVariants} className="flex flex-col items-center mb-6">
              <RadialGauge score={consensusScore} />
              
              {/* Metadata with reduced opacity (58%) and enhanced spacing */}
              <motion.p
                className="text-xs text-center"
                style={{ 
                  color: 'rgba(255,255,255,0.58)',
                  marginTop: '24px'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, ease: MOTION.CURVES.tertiary }}
              >
                Based on 5 sources • Updated 2m ago
              </motion.p>
            </motion.div>

            {/* Bottom Section: Segment Tiles */}
            <div style={{ marginTop: '8px' }}>
              {segments.length > 0 ? (
                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {segments.map((segment, index) => {
                    const weight = (segment?.weight || 0) * 100;
                    const iconColor = getSegmentIconColor(segment?.name);
                    const segmentTint = getSegmentTint(segment?.name);
                    const stressChip = getStressChip(segment?.stress_level);
                    const trendChip = getTrendChip(segment?.trend_indicator);
                    const isHovered = hoveredCard === segment.name;
                    const isSibling = hoveredCard && hoveredCard !== segment.name;
                    const Icon = getSegmentIcon(segment?.name);
                    const narrative = NARRATIVE_MAP[segment?.name] || { 
                      headline: String(segment?.note || 'No insights'), 
                      sentence: '' 
                    };

                    const handleOpenDetail = () => onOpenDetail && onOpenDetail(segment);

                    return (
                      <motion.div
                        key={segment.name}
                        ref={el => cardRefs.current[segment.name] = el}
                        variants={itemVariants}
                        className="relative cursor-pointer group overflow-hidden segment-card"
                        style={{
                          padding: '28px',
                          borderRadius: '24px',
                          background: `
                            linear-gradient(180deg, 
                              rgba(255, 255, 255, 0.065) 0%, 
                              rgba(255, 255, 255, 0.045) 100%
                            )
                          `,
                          border: '1px solid rgba(255,255,255,0.12)',
                          boxShadow: `
                            inset 0 1px 0 rgba(255,255,255,0.08), 
                            0 4px 12px rgba(0,0,0,0.07)
                          `,
                          backdropFilter: 'blur(26px)',
                          WebkitBackdropFilter: 'blur(26px)',
                          willChange: 'transform, opacity, filter'
                        }}
                        data-hovered={isHovered ? 'true' : 'false'}
                        onHoverStart={() => setHoveredCard(segment.name)}
                        onHoverEnd={() => setHoveredCard(null)}
                        animate={{
                          y: isHovered ? -1.5 : 0,
                          opacity: isSibling ? 0.97 : 1,
                          filter: isSibling ? 'brightness(0.985) blur(0.5px)' : 'brightness(1)',
                          scale: isHovered ? 1.005 : 1
                        }}
                        transition={{
                          duration: MOTION.DURATIONS.base,
                          ease: MOTION.CURVES.secondary
                        }}
                        onClick={handleOpenDetail}
                      >
                        {/* 1px Top-edge Rim-light (Premium Horizon Depth) */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: '10%',
                          right: '10%',
                          height: '1px',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
                          pointerEvents: 'none'
                        }} />

                        {/* Subtle Category Tint (STATIC BASE) */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: `
                              radial-gradient(circle at 50% 0%, ${segmentTint} 0%, transparent 100%)
                            `,
                            borderRadius: '24px',
                            opacity: 0.7
                          }}
                        />

                        {/* Slow Shadow Bloom on Hover (Soft-focus Glow < 0.1 opacity) */}
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at 50% 0%, ${iconColor}10 0%, transparent 65%)`,
                            borderRadius: '24px',
                            willChange: 'opacity'
                          }}
                          animate={{ 
                            opacity: isHovered ? 0.08 : 0
                          }}
                          transition={{ duration: 0.35, ease: MOTION.CURVES.primary }}
                        />

                        {/* Row 1: Icon + Title + Weight */}
                        <div className="flex items-center justify-between mb-3.5 relative z-10">
                          <div className="flex items-center gap-2.5">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center relative"
                              style={{
                                background: `${iconColor}10`,
                                border: `1px solid ${iconColor}26`,
                                boxShadow: `inset 0 1px 1px rgba(255,255,255,0.10), 0 2px 5px ${iconColor}16`
                              }}
                            >
                              <div style={{
                                position: 'absolute',
                                top: '2px',
                                left: '2px',
                                width: '12px',
                                height: '12px',
                                borderRadius: '4px',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)',
                                pointerEvents: 'none'
                              }} />
                              <Icon className="w-4 h-4 relative z-10" style={{ color: iconColor, filter: 'brightness(1.07)' }} />
                            </div>
                            <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.98)' }}>
                              {String(segment?.name || 'Unknown')}
                            </span>
                          </div>
                          <span className="text-lg font-bold" style={{ color: iconColor, filter: 'brightness(1.06)' }}>
                            {Math.round(weight)}%
                          </span>
                        </div>
                        
                        {/* Row 2: Narrative — Headline + Sentence */}
                        <div className="mb-4 relative z-10">
                          <div 
                            className="text-[15px] font-semibold mb-1.5"
                            style={{ 
                              color: 'rgba(255,255,255,0.96)',
                              letterSpacing: '-0.01em',
                              lineHeight: '1.3'
                            }}
                          >
                            {narrative.headline}
                          </div>
                          
                          <p 
                            className="text-[13px]" 
                            style={{ 
                              color: 'rgba(255,255,255,0.70)', 
                              lineHeight: '1.5',
                              letterSpacing: '-0.005em'
                            }}
                          >
                            {narrative.sentence}
                          </p>
                        </div>

                        {/* Row 3: Simplified Tags + Mini Bar */}
                        <div className="space-y-2.5 relative z-10">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div
                              className="relative px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
                              style={{
                                background: stressChip.bg,
                                border: `1px solid ${stressChip.border}`,
                                color: stressChip.text,
                                letterSpacing: '0.05em',
                                borderRadius: '10px',
                                boxShadow: `inset 0 1px 1px rgba(255,255,255,0.06), 0 2px 4px rgba(0,0,0,0.12)`,
                                overflow: 'hidden'
                              }}
                            >
                              <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(255,255,255,0.015)',
                                backdropFilter: 'blur(4px)',
                                pointerEvents: 'none'
                              }} />
                              <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: `radial-gradient(circle, ${stressChip.text}06 0%, transparent 70%)`,
                                pointerEvents: 'none'
                              }} />
                              <AlertTriangle className="w-3 h-3 relative z-10" />
                              <span className="relative z-10">{stressChip.label}</span>
                            </div>

                            <div
                              className="relative px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
                              style={{
                                background: `${trendChip.color}0E`,
                                border: `1px solid ${trendChip.color}24`,
                                color: trendChip.color,
                                letterSpacing: '0.05em',
                                borderRadius: '10px',
                                boxShadow: `inset 0 1px 1px rgba(255,255,255,0.06), 0 2px 4px rgba(0,0,0,0.12)`,
                                overflow: 'hidden'
                              }}
                            >
                              <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(255,255,255,0.015)',
                                backdropFilter: 'blur(4px)',
                                pointerEvents: 'none'
                              }} />
                              {React.cloneElement(<trendChip.Icon />, { className: "w-3 h-3 relative z-10" })}
                              <span className="relative z-10">{trendChip.label}</span>
                            </div>
                          </div>

                          <div className="relative">
                            <div style={{
                              position: 'absolute',
                              top: '-8px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: '120%',
                              height: '24px',
                              background: `radial-gradient(ellipse, ${getScoreColor(weight)}08 0%, transparent 70%)`,
                              filter: 'blur(8px)',
                              pointerEvents: 'none'
                            }} />
                            
                            <div 
                              className="w-full h-1.5 rounded-full overflow-hidden relative" 
                              style={{ background: 'rgba(0,0,0,0.26)' }}
                            >
                              <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '50%',
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.09), transparent)',
                                pointerEvents: 'none'
                              }} />
                              
                              <motion.div
                                className="h-full rounded-full relative"
                                style={{ 
                                  background: `linear-gradient(90deg, ${getScoreColor(weight)}a8, ${getScoreColor(weight)}ff)`,
                                  boxShadow: `0 0 10px ${getScoreColor(weight)}38`
                                }}
                                initial={{ width: '0%' }}
                                animate={{ width: `${weight}%` }}
                                transition={{ 
                                  duration: 0.6, 
                                  delay: 0.3 + index * 0.05, 
                                  ease: 'easeOut' 
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <motion.div 
                          className="flex items-center justify-end text-xs font-medium mt-3 relative z-10"
                          style={{ color: 'rgba(255,255,255,0.60)' }}
                          animate={{ 
                            opacity: isHovered ? 1 : 0,
                            y: isHovered ? 0 : 2
                          }}
                          transition={{ 
                            duration: MOTION.DURATIONS.base,
                            ease: MOTION.CURVES.primary
                          }}
                        >
                          <span>View Analysis</span>
                          <ArrowRight className="w-3 h-3 ml-1.5" />
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div variants={itemVariants} className="text-center py-8">
                  <Zap className="w-8 h-8 mx-auto mb-2" style={{ color: 'rgba(255,255,255,0.30)' }} />
                  <p style={{ color: 'rgba(255,255,255,0.60)' }}>No segment data available</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(SentimentDrawer);