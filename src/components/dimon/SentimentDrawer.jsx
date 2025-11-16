// 🔒 DESIGN LOCKED — OS HORIZON INSIGHT STRATA V1 ARCHITECTURE
// Last Updated: 2025-01-20
// VIREON CERTIFIED — 3-Layer Story/Force/Trajectory System
// Apple macOS Tahoe + VisionOS Design Language
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Activity } from 'lucide-react';

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

// Segment Narratives
const SEGMENT_INSIGHTS = {
  Policy: {
    summary: "Regulators tightening oversight in medium-term policy environment.",
    trend: "Rising"
  },
  Credit: {
    summary: "Spreads widening as stress pockets form in credit markets.",
    trend: "Moderate"
  },
  Equities: {
    summary: "Market breadth remains flat with limited participation.",
    trend: "Moderate"
  },
  Global: {
    summary: "China slowdown weighing on global momentum and trade flows.",
    trend: "Softening"
  }
};

// ============================================================================
// STRATUM 1 — LUMINOUS ALIGNMENT ORB + STORY LAYER
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
        width: '200px',
        height: '200px',
        x: parallaxX,
        y: parallaxY
      }}
    >
      {/* Volumetric Halo */}
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

      {/* Light-field Crescent */}
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

      {/* Liquid Glass Orb */}
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

        {/* Micro Specular */}
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

      {/* Text Stack */}
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
          transition={{ delay: 0.2, duration: 0.4, ease: MOTION.CURVES.primary }}
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
          transition={{ delay: 0.3, duration: 0.38, ease: MOTION.CURVES.primary }}
        >
          {score}
        </motion.span>
        
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.32 }}
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
// STORY INSIGHT SENTENCE (Top-Level Narrative)
// ============================================================================
const StoryInsight = ({ segments }) => {
  const generateStory = () => {
    const hasPolicyRising = segments.find(s => s.name === 'Policy')?.trend === '+';
    const hasCreditStress = segments.find(s => s.name === 'Credit')?.stress_level === 'high';
    
    if (hasPolicyRising && hasCreditStress) {
      return "Markets show mild upward pressure driven by policy tightening and early credit stress signals.";
    }
    return "Markets show mixed sentiment across policy, credit, and global conditions.";
  };

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden mb-8"
      style={{
        padding: '24px 28px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(28px) saturate(135%)',
        WebkitBackdropFilter: 'blur(28px) saturate(135%)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 3px 12px rgba(0,0,0,0.06)'
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.35, ease: MOTION.CURVES.primary }}
    >
      {/* Tahoe Spotlight Lighting */}
      <div style={{
        position: 'absolute',
        top: '-30%',
        left: '30%',
        width: '50%',
        height: '80%',
        background: 'radial-gradient(ellipse, rgba(142, 187, 255, 0.045) 0%, transparent 65%)',
        filter: 'blur(24px)',
        pointerEvents: 'none'
      }} />

      {/* Top Rim */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '14%',
        right: '14%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
        pointerEvents: 'none'
      }} />

      <p 
        className="text-[15px] font-medium leading-relaxed text-center relative z-10"
        style={{ 
          color: 'rgba(255,255,255,0.94)',
          letterSpacing: '-0.008em',
          lineHeight: '1.55'
        }}
      >
        {generateStory()}
      </p>
    </motion.div>
  );
};

// ============================================================================
// STRATUM 2 — FORCE GROUP (Macro Forces / Market Conditions)
// ============================================================================
const ForceGroup = ({ title, segments, delay }) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  const getIconColor = (n) => {
    switch (n) {
      case 'Policy': return '#70A8E8';
      case 'Credit': return '#B88AED';
      case 'Equities': return '#32C288';
      case 'Global': return '#EDB859';
      default: return '#A8B1BA';
    }
  };

  return (
    <motion.div
      className="relative rounded-3xl overflow-hidden mb-6"
      style={{
        background: 'rgba(255, 255, 255, 0.028)',
        backdropFilter: 'blur(32px) saturate(145%)',
        WebkitBackdropFilter: 'blur(32px) saturate(145%)',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 4px 16px rgba(0,0,0,0.05)',
        padding: '28px 26px'
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: MOTION.CURVES.primary }}
    >
      {/* Top Rim Light */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '12%',
        right: '12%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.17), transparent)',
        pointerEvents: 'none'
      }} />

      {/* Tahoe Gradient Backdrop */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% -20%, rgba(142, 187, 255, 0.018) 0%, transparent 100%)',
        borderRadius: '24px',
        pointerEvents: 'none'
      }} />

      {/* Group Title */}
      <motion.h3 
        className="text-[11px] font-semibold uppercase tracking-wide mb-5"
        style={{ 
          color: 'rgba(255,255,255,0.66)',
          letterSpacing: '0.12em'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.1, duration: 0.3 }}
      >
        {title}
      </motion.h3>

      {/* Segment Insights */}
      <div className="space-y-5">
        {segments.map((segment, idx) => {
          const iconColor = getIconColor(segment.name);
          const Icon = OutlineIcons[segment.name] || OutlineIcons.Global;
          const weight = (segment?.weight || 0) * 100;
          const narrative = SEGMENT_INSIGHTS[segment.name] || { summary: 'No insights', trend: 'Stable' };
          const isHovered = hoveredSegment === segment.name;

          return (
            <motion.div
              key={segment.name}
              className="relative"
              onHoverStart={() => setHoveredSegment(segment.name)}
              onHoverEnd={() => setHoveredSegment(null)}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.2 + (idx * 0.06), duration: 0.32, ease: MOTION.CURVES.secondary }}
            >
              <motion.div
                className="relative"
                animate={{
                  y: isHovered ? -1 : 0
                }}
                transition={{ duration: MOTION.DURATIONS.base, ease: MOTION.CURVES.primary }}
              >
                {/* Icon + Name + Weight */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{
                        background: `${iconColor}05`,
                        border: `1px solid ${iconColor}12`
                      }}
                    >
                      <Icon style={{ color: iconColor, filter: 'brightness(1.14)' }} />
                    </div>
                    <span className="text-[14px] font-semibold" style={{ color: 'rgba(255,255,255,0.98)' }}>
                      {segment.name}
                    </span>
                  </div>
                  <span className="text-[16px] font-bold" style={{ color: iconColor, filter: 'brightness(1.12)' }}>
                    {Math.round(weight)}%
                  </span>
                </div>

                {/* Narrative Summary */}
                <p 
                  className="text-[13px] mb-2.5"
                  style={{ 
                    color: 'rgba(255,255,255,0.88)',
                    letterSpacing: '-0.006em',
                    lineHeight: '1.45'
                  }}
                >
                  {narrative.summary}
                </p>

                {/* Trend Pill */}
                <div className="flex items-center mb-2.5">
                  <div
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold"
                    style={{
                      background: `${iconColor}07`,
                      border: `1px solid ${iconColor}14`,
                      color: iconColor,
                      letterSpacing: '0.015em'
                    }}
                  >
                    {narrative.trend}
                  </div>
                </div>

                {/* Signal Bar */}
                <div className="relative">
                  <div style={{
                    position: 'absolute',
                    top: '-4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    height: '12px',
                    background: `radial-gradient(ellipse, ${iconColor}04 0%, transparent 80%)`,
                    filter: 'blur(6px)',
                    pointerEvents: 'none'
                  }} />
                  
                  <div 
                    className="w-full h-[2.5px] rounded-full overflow-hidden relative" 
                    style={{ background: 'rgba(0,0,0,0.16)' }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ 
                        background: `linear-gradient(90deg, ${iconColor}92, ${iconColor}f2)`,
                        boxShadow: `0 0 7px ${iconColor}26`
                      }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${weight}%` }}
                      transition={{ 
                        duration: 0.7, 
                        delay: delay + 0.3 + (idx * 0.06), 
                        ease: 'easeOut' 
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// ============================================================================
// STRATUM 3 — SIGNAL TRAJECTORY BAR (Unified Brainstem Output)
// ============================================================================
const SignalTrajectoryBar = ({ segments, delay }) => {
  const getIconColor = (n) => {
    switch (n) {
      case 'Policy': return '#70A8E8';
      case 'Credit': return '#B88AED';
      case 'Equities': return '#32C288';
      case 'Global': return '#EDB859';
      default: return '#A8B1BA';
    }
  };

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.028)',
        backdropFilter: 'blur(28px) saturate(135%)',
        WebkitBackdropFilter: 'blur(28px) saturate(135%)',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 3px 12px rgba(0,0,0,0.05)',
        padding: '24px 26px'
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: MOTION.CURVES.primary }}
    >
      {/* Top Rim */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '12%',
        right: '12%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
        pointerEvents: 'none'
      }} />

      <div className="flex items-center justify-between gap-4">
        {segments.map((segment, idx) => {
          const iconColor = getIconColor(segment.name);
          const weight = (segment?.weight || 0) * 100;
          const Icon = OutlineIcons[segment.name] || OutlineIcons.Global;

          return (
            <div key={segment.name} className="flex-1">
              <div className="flex items-center gap-2 mb-2.5">
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{
                    background: `${iconColor}05`,
                    border: `1px solid ${iconColor}10`
                  }}
                >
                  <Icon style={{ color: iconColor, filter: 'brightness(1.14)' }} />
                </div>
                <span className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.88)' }}>
                  {segment.name}
                </span>
              </div>

              <div className="relative">
                <div 
                  className="w-full h-[3px] rounded-full overflow-hidden relative" 
                  style={{ background: 'rgba(0,0,0,0.18)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ 
                      background: `linear-gradient(90deg, ${iconColor}90, ${iconColor}f0)`,
                      boxShadow: `0 0 6px ${iconColor}24`
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${weight}%` }}
                    transition={{ 
                      duration: 0.12, 
                      delay: delay + 0.15 + (idx * 0.03), 
                      ease: 'easeOut' 
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN DRAWER — INSIGHT STRATA V1
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

  const macroForces = segments.filter(s => ['Policy', 'Global'].includes(s.name));
  const marketConditions = segments.filter(s => ['Credit', 'Equities'].includes(s.name));

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
        {/* Stabilized Background */}
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
          <div className="px-10 pt-8 pb-10 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
            {/* STRATUM 1: Orb + Story */}
            <LuminousAlignmentOrb score={consensusScore} />
            
            <motion.p
              className="text-xs text-center mb-10"
              style={{ color: 'rgba(255,255,255,0.54)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              Based on 5 sources • Updated 2m ago
            </motion.p>

            <StoryInsight segments={segments} />

            {/* STRATUM 2: Force Groups */}
            <div className="mb-8">
              {macroForces.length > 0 && (
                <ForceGroup title="Macro Forces" segments={macroForces} delay={0.65} />
              )}
              {marketConditions.length > 0 && (
                <ForceGroup title="Market Conditions" segments={marketConditions} delay={0.75} />
              )}
            </div>

            {/* STRATUM 3: Signal Trajectory Bar */}
            <SignalTrajectoryBar segments={segments} delay={0.9} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(SentimentDrawer);