// 🔒 DESIGN LOCKED — OS HORIZON TAHOE UNIFIED CANVAS V6.0
// Last Updated: 2025-01-20
// VIREON CERTIFIED — Atmospheric Canvas, Zero-Box Philosophy, Light Zones
// Apple macOS Tahoe + VisionOS Unified Surface Design
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { X, Activity } from 'lucide-react';

// OS Horizon Motion DNA (Liquid Silk + Morphing)
const MOTION = {
  CURVES: {
    silk: [0.25, 0.1, 0, 1.0],
    breathe: [0.33, 0, 0.4, 1],
    morph: [0.22, 0.61, 0.36, 1]
  },
  DURATIONS: {
    fast: 0.18,
    base: 0.24,
    morph: 0.26,
    breathing: 42
  }
};

// SF Symbol-Style Outline Icons
const OutlineIcons = {
  Policy: ({ style }) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={style}>
      <path d="M10 3.5L5 5.5V9C5 12 7.5 14.5 10 15.5C12.5 14.5 15 12 15 9V5.5L10 3.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M6 14V11M10 14V8M14 14V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  Global: ({ style }) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={style}>
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 3.5C10 3.5 12.5 6 12.5 10C12.5 14 10 16.5 10 16.5M4 10H16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
};

// Segment Data
const SEGMENTS = {
  Policy: { summary: "Regulators tightening oversight in medium-term policy environment.", detail: "Bipartisan push on content/privacy expands audit scope Y/Y. Capex guidance reflects regulatory friction across major platforms.", trend: "Rising", color: '#70A8E8', lightTint: 'rgba(112, 168, 232, 0.035)' },
  Credit: { summary: "Spreads widening as stress pockets form in credit markets.", detail: "EM HY spreads widen 35bps WoW. Issuance windows shorten. Banks tighten underwriting standards.", trend: "Moderate", color: '#B88AED', lightTint: 'rgba(184, 138, 237, 0.035)' },
  Equities: { summary: "Market breadth remains flat with limited participation.", detail: "Recent gains concentrated in large-cap. Underlying fragility despite headline resilience.", trend: "Moderate", color: '#32C288', lightTint: 'rgba(50, 194, 136, 0.035)' },
  Global: { summary: "China slowdown weighing on global momentum and trade flows.", detail: "Exports normalize. Household confidence lags. Local infra offsets narrow in 2H.", trend: "Softening", color: '#EDB859', lightTint: 'rgba(237, 184, 89, 0.035)' }
};

// ============================================================================
// LUMINOUS ALIGNMENT ORB (18% Larger, Layered Halos, Subsurface Shimmer)
// ============================================================================
const LuminousAlignmentOrb = ({ score }) => {
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const orbRef = useRef(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 70, damping: 28, mass: 1 };
  const parallaxX = useSpring(useTransform(mouseX, [-100, 100], [-1.5, 1.5]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [-100, 100], [-1.5, 1.5]), springConfig);

  const getZoneColor = (s) => s < 40 ? '#E86565' : s < 70 ? '#70A8E8' : '#32C288';
  const color = getZoneColor(score);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    let rafId, startTime = Date.now();
    const animate = () => {
      setBreathingPhase((Date.now() - startTime) / 1000);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => rafId && cancelAnimationFrame(rafId);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion || !orbRef?.current) return;
    const handleMouseMove = (e) => {
      const rect = orbRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - (rect.left + rect.width / 2));
      mouseY.set(e.clientY - (rect.top + rect.height / 2));
    };
    const parent = orbRef.current.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      return () => parent.removeEventListener('mousemove', handleMouseMove);
    }
  }, [shouldReduceMotion, mouseX, mouseY]);

  const breathingScale = 1 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.DURATIONS.breathing)) * 0.022;
  const shimmerPhase = (breathingPhase % 38) / 38;

  return (
    <motion.div 
      ref={orbRef}
      className="relative flex items-center justify-center mx-auto"
      style={{ width: '225px', height: '225px', x: parallaxX, y: parallaxY }}
      initial={{ scale: 0.86, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.7, ease: MOTION.CURVES.silk }}
    >
      {/* Outer Halo (Wide radius, 1-2% opacity) */}
      <motion.div
        style={{
          position: 'absolute',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}05 0%, ${color}02 52%, transparent 78%)`,
          filter: 'blur(58px)',
          pointerEvents: 'none'
        }}
        animate={{ scale: breathingScale * 1.35, opacity: 0.015 + Math.sin(breathingPhase * 0.5) * 0.008 }}
        transition={{ duration: MOTION.DURATIONS.breathing, ease: MOTION.CURVES.breathe }}
      />

      {/* Inner Halo (Small radius, 3-4% opacity) */}
      <motion.div
        style={{
          position: 'absolute',
          width: '290px',
          height: '290px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}0A 0%, ${color}04 58%, transparent 82%)`,
          filter: 'blur(42px)',
          pointerEvents: 'none'
        }}
        animate={{ scale: breathingScale * 1.18, opacity: 0.038 + Math.sin(breathingPhase * 0.8) * 0.015 }}
        transition={{ duration: MOTION.DURATIONS.breathing, ease: MOTION.CURVES.breathe }}
      />

      {/* Liquid Glass Orb (18% larger = 177px) */}
      <motion.div
        style={{
          position: 'absolute',
          width: '177px',
          height: '177px',
          borderRadius: '50%',
          background: 'linear-gradient(138deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
          backdropFilter: 'blur(40px) saturate(160%)',
          WebkitBackdropFilter: 'blur(40px) saturate(160%)',
          border: '1px solid rgba(255,255,255,0.19)',
          boxShadow: `
            inset 0 2.5px 20px rgba(255,255,255,0.16),
            inset 0 -2.5px 16px rgba(0,0,0,0.24),
            0 0 68px ${color}22,
            0 0 0 0.8px rgba(255,255,255,0.09)
          `
        }}
        animate={{ scale: breathingScale }}
        transition={{ duration: MOTION.DURATIONS.breathing, ease: MOTION.CURVES.breathe }}
      >
        {/* Shallow Subsurface Refraction Shimmer */}
        <motion.div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle at ${48 + Math.sin(shimmerPhase * Math.PI * 2) * 9}% ${40 + Math.cos(shimmerPhase * Math.PI * 2) * 7}%, ${color}14 0%, transparent 70%)`,
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '75px',
          height: '75px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 32% 32%, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.18) 48%, transparent 74%)',
          filter: 'blur(19px)',
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          boxShadow: 'inset 0 0 1.5px 0.8px rgba(255,255,255,0.16)',
          pointerEvents: 'none'
        }} />
      </motion.div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-[10px] font-medium uppercase tracking-widest mb-3.5"
          style={{ color: 'rgba(255,255,255,0.70)', letterSpacing: '0.20em' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          Alignment
        </motion.span>
        
        <motion.span
          className="text-[60px] mb-2"
          style={{ 
            color,
            textShadow: `0 0 36px ${color}48, 0 4px 16px rgba(0,0,0,0.34)`,
            filter: 'brightness(1.16) contrast(1.12)',
            letterSpacing: '-0.05em',
            fontWeight: 560
          }}
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, duration: 0.55, ease: MOTION.CURVES.silk }}
        >
          {score}
        </motion.span>
        
        <motion.div
          className="text-[11px] font-medium"
          style={{ color: 'rgba(255,255,255,0.64)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.35 }}
        >
          Medium Weight
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// LIGHT ZONE (Replaces Cards with Illuminated Regions)
// ============================================================================
const LightZone = ({ segment, weight, isExpanded, onToggle, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const info = SEGMENTS[segment.name] || {};
  const Icon = OutlineIcons[segment.name] || OutlineIcons.Global;

  return (
    <motion.div
      className="relative cursor-pointer"
      onClick={onToggle}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.42, ease: MOTION.CURVES.silk }}
      layout
    >
      <motion.div
        className="relative overflow-hidden"
        style={{
          padding: isExpanded ? '26px 24px' : '22px 20px',
          borderRadius: '20px',
          background: `
            radial-gradient(ellipse at 50% -30%, ${info.lightTint} 0%, transparent 100%),
            rgba(255, 255, 255, 0.022)
          `
        }}
        animate={{
          y: isHovered ? -2 : 0,
          background: isHovered 
            ? `radial-gradient(ellipse at 50% -30%, ${info.color}06 0%, transparent 100%), rgba(255, 255, 255, 0.030)`
            : `radial-gradient(ellipse at 50% -30%, ${info.lightTint} 0%, transparent 100%), rgba(255, 255, 255, 0.022)`
        }}
        transition={{ duration: 0.20, ease: MOTION.CURVES.morph }}
        layout
      >
        {/* Soft Glow on Hover */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '20px',
            background: `radial-gradient(circle at 50% 50%, ${info.color}08 0%, transparent 75%)`,
            opacity: 0,
            pointerEvents: 'none'
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.18 }}
        />

        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-10 h-10 rounded-[14px] flex items-center justify-center relative"
              style={{
                background: `${info.color}08`,
                boxShadow: `0 0 0 0.5px ${info.color}12, inset 0 1px 0 rgba(255,255,255,0.06)`
              }}
            >
              <div style={{
                position: 'absolute',
                inset: -5,
                borderRadius: '16px',
                background: `radial-gradient(circle, ${info.color}12 0%, transparent 74%)`,
                filter: 'blur(9px)',
                pointerEvents: 'none'
              }} />
              <Icon style={{ color: info.color, filter: 'brightness(1.20)' }} />
            </div>
            <span className="text-[15px] font-semibold" style={{ color: 'rgba(255,255,255,0.98)' }}>
              {segment.name}
            </span>
          </div>
          <span className="text-[17px] font-bold" style={{ color: info.color, filter: 'brightness(1.18)' }}>
            {Math.round(weight)}%
          </span>
        </div>

        {/* Summary */}
        <p className="text-[13px] mb-3.5" style={{ color: 'rgba(255,255,255,0.86)', lineHeight: '1.50' }}>
          {info.summary}
        </p>

        {/* Trend Pill */}
        <div className="flex items-center justify-between mb-4">
          <div
            className="px-3 py-1.5 rounded-lg text-[10px] font-semibold"
            style={{
              background: `${info.color}10`,
              color: info.color,
              letterSpacing: '0.03em'
            }}
          >
            {info.trend}
          </div>
        </div>

        {/* Bar with Subsurface Glow */}
        <div className="relative">
          <div style={{
            position: 'absolute',
            bottom: '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '105%',
            height: '12px',
            background: `radial-gradient(ellipse, ${info.color}08 0%, transparent 84%)`,
            filter: 'blur(6px)',
            pointerEvents: 'none'
          }} />
          
          <div className="w-full h-[5px] rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.22)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ 
                background: `linear-gradient(90deg, ${info.color}9A, ${info.color}FA)`,
                boxShadow: `0 0 12px ${info.color}34, inset 0 1px 0 rgba(255,255,255,0.14)`
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${weight}%` }}
              transition={{ duration: 0.32, delay: delay + 0.25, ease: MOTION.CURVES.silk }}
            />
          </div>
        </div>

        {/* Expanded Details (Morphing In Place) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: MOTION.DURATIONS.morph, ease: MOTION.CURVES.morph }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255,255,255,0.06)'
              }}>
                {/* Luminous Top Separator */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '16%',
                  right: '16%',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
                  filter: 'blur(0.8px)',
                  pointerEvents: 'none'
                }} />

                <div className="px-2">
                  <div 
                    className="inline-block px-3 py-1.5 rounded-lg text-[10px] font-semibold mb-3.5"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.76)',
                      letterSpacing: '0.05em'
                    }}
                  >
                    TL;DR
                  </div>

                  <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.92)', lineHeight: '1.60' }}>
                    <strong style={{ fontWeight: 600, color: 'rgba(255,255,255,0.98)' }}>
                      {info.detail.split('.')[0]}.
                    </strong>
                    {info.detail.substring(info.detail.indexOf('.') + 1)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// FEATHER-LIGHT PILL BAR (40% Height Reduction, 30% More Blur)
// ============================================================================
const FeatherPillBar = ({ segments, activeSegment, onPillClick }) => {
  return (
    <motion.div
      className="sticky bottom-0 left-0 right-0 z-10 relative"
      style={{
        padding: '8px 16px',
        background: 'rgba(18, 20, 28, 0.68)',
        backdropFilter: 'blur(54px) saturate(180%)',
        WebkitBackdropFilter: 'blur(54px) saturate(180%)',
        borderTop: '1px solid rgba(255,255,255,0.08)'
      }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.1, duration: 0.45, ease: MOTION.CURVES.silk }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: '18%',
        right: '18%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
        filter: 'blur(1px)',
        pointerEvents: 'none'
      }} />

      <div className="flex items-center justify-around gap-2">
        {segments.map((seg) => {
          const info = SEGMENTS[seg.name] || {};
          const isActive = activeSegment === seg.name;

          return (
            <motion.button
              key={seg.name}
              className="flex-1 px-3 py-2 rounded-full text-[11px] font-semibold relative"
              style={{
                background: isActive ? `${info.color}18` : 'rgba(255,255,255,0.04)',
                color: isActive ? info.color : 'rgba(255,255,255,0.76)',
                opacity: isActive ? 1 : 0.72
              }}
              onClick={() => onPillClick(seg.name)}
              animate={{ 
                y: isActive ? -2 : 0,
                boxShadow: isActive ? `0 0 16px ${info.color}14` : 'none'
              }}
              whileHover={{ scale: 1.05, y: -1, opacity: 1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.16 }}
            >
              {seg.name}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN DRAWER — UNIFIED ATMOSPHERIC CANVAS
// ============================================================================
const SentimentDrawer = ({ isOpen, onClose, score, breakdown, onOpenDetail }) => {
  const [expandedSegment, setExpandedSegment] = useState(null);
  const consensusScore = useMemo(() => (typeof score === 'number' ? score : 0), [score]);
  const segments = useMemo(() => (Array.isArray(breakdown?.segments) ? breakdown.segments : []), [breakdown]);

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

  const handlePillClick = (segmentName) => {
    setExpandedSegment(expandedSegment === segmentName ? null : segmentName);
  };

  const generateStory = () => {
    const hasPolicyRising = segments.find(s => s.name === 'Policy')?.trend === '+';
    const hasCreditStress = segments.find(s => s.name === 'Credit')?.stress_level === 'high';
    if (hasPolicyRising && hasCreditStress) {
      return "Markets show mild upward pressure driven by policy tightening and early credit stress signals.";
    }
    return "Markets show mixed sentiment across policy, credit, and global conditions.";
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ paddingTop: '80px' }}
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(28px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.36, ease: MOTION.CURVES.silk }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.72)' }}
          onClick={onClose}
        />

        <motion.div
          className="relative w-full max-w-4xl rounded-[32px] overflow-hidden border flex flex-col"
          style={{
            background: `
              linear-gradient(180deg, 
                rgba(18, 20, 28, 0.92) 0%,
                rgba(16, 18, 26, 0.96) 100%
              )
            `,
            backdropFilter: 'blur(68px) saturate(212%)',
            WebkitBackdropFilter: 'blur(68px) saturate(212%)',
            borderColor: 'rgba(255,255,255,0.16)',
            boxShadow: `
              0 42px 84px -20px rgba(0, 0, 0, 0.88),
              0 0 68px rgba(142, 187, 255, 0.11),
              inset 0 1.5px 0 rgba(255, 255, 255, 0.15),
              inset 0 0 0 1px rgba(255, 255, 255, 0.045)
            `,
            maxHeight: 'calc(100vh - 100px)',
            height: '90vh'
          }}
          initial={{ opacity: 0, scale: 0.92, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 24 }}
          transition={{ duration: 0.32, ease: MOTION.CURVES.silk }}
        >
          {/* Ambient Light Beam (Top → Bottom) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.065) 0%, transparent 48%, rgba(0,0,0,0.028) 100%)',
            pointerEvents: 'none',
            borderRadius: '32px'
          }} />

          {/* Atmospheric Fog (Top 25%) */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '25%',
            background: 'linear-gradient(180deg, rgba(142, 187, 255, 0.022) 0%, transparent 100%)',
            pointerEvents: 'none',
            borderRadius: '32px 32px 0 0'
          }} />

          {/* Faint Bokeh Particles (1% opacity) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence baseFrequency=\'0.65\' numOctaves=\'2\'/%3E%3C/filter%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            backgroundSize: '140px 140px',
            opacity: 0.008,
            mixBlendMode: 'soft-light',
            pointerEvents: 'none',
            borderRadius: '32px'
          }} />

          {/* Depth-Field Gradient */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 20%, rgba(142, 187, 255, 0.015) 0%, transparent 88%)',
            pointerEvents: 'none',
            borderRadius: '32px'
          }} />

          {/* Top Rim Light */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '14%',
            right: '14%',
            height: '1.8px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent)',
            filter: 'blur(1.5px)',
            pointerEvents: 'none'
          }} />

          {/* Header */}
          <div 
            className="relative border-b flex-shrink-0" 
            style={{ 
              borderColor: 'rgba(255,255,255,0.10)',
              padding: '20px 28px 16px 28px',
              background: 'rgba(255, 255, 255, 0.018)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div 
                  className="w-12 h-12 rounded-[14px] border flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'rgba(142, 187, 255, 0.11)',
                    borderColor: 'rgba(142, 187, 255, 0.26)',
                    backdropFilter: 'blur(22px)',
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.14), 0 4px 18px rgba(142, 187, 255, 0.22)'
                  }}
                >
                  <Activity className="w-6 h-6 relative z-10" style={{ color: '#8EBBFF', filter: 'brightness(1.16)' }} strokeWidth={1.7} />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.98)', letterSpacing: '-0.018em' }}>
                    Street Alignment
                  </h2>
                  <p className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.76)' }}>
                    Consensus & Segment Breakdown
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="w-10 h-10 rounded-[14px] flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.11)',
                  border: '1px solid rgba(255,255,255,0.13)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.09)'
                }}
                whileHover={{ scale: 1.08, background: 'rgba(255,255,255,0.16)' }}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.84)' }} />
              </motion.button>
            </div>
          </div>

          {/* UNIFIED ATMOSPHERIC CANVAS */}
          <div 
            className="flex-1 overflow-y-auto px-10 pt-6 pb-3"
            style={{
              scrollBehavior: 'smooth',
              background: `
                linear-gradient(180deg, 
                  rgba(255,255,255,0.008) 0%, 
                  transparent 100%
                )
              `
            }}
          >
            {/* ONE CONTINUOUS GLASS PANEL */}
            <motion.div
              className="relative rounded-[24px] overflow-hidden"
              style={{
                padding: '32px 28px',
                background: `
                  radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.038) 0%, rgba(255,255,255,0.022) 100%)
                `,
                backdropFilter: 'blur(36px) saturate(148%)',
                WebkitBackdropFilter: 'blur(36px) saturate(148%)',
                border: '1px solid rgba(255,255,255,0.11)',
                boxShadow: `
                  inset 0 1.5px 0 rgba(255,255,255,0.12),
                  inset 0 0 32px rgba(142, 187, 255, 0.015),
                  0 6px 22px rgba(0,0,0,0.12),
                  0 0 0 0.8px rgba(255,255,255,0.045)
                `
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: MOTION.CURVES.silk }}
            >
              {/* Ambient Edge Highlights */}
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '24px',
                boxShadow: 'inset 0 0 1.5px 0.8px rgba(255,255,255,0.08)',
                pointerEvents: 'none'
              }} />

              {/* Hero: Orb */}
              <LuminousAlignmentOrb score={consensusScore} />
              
              <motion.p
                className="text-[10px] text-center mb-5"
                style={{ color: 'rgba(255,255,255,0.52)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.3 }}
              >
                Based on 5 sources • Updated 2m ago
              </motion.p>

              {/* Summary (Inside Canvas) */}
              <motion.div
                className="relative rounded-[16px] overflow-hidden mb-8 mx-auto"
                style={{
                  padding: '16px 26px',
                  maxWidth: '74%',
                  background: 'rgba(255, 255, 255, 0.032)'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85, duration: 0.4 }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '20%',
                  right: '20%',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
                  pointerEvents: 'none'
                }} />

                <p 
                  className="text-[14px] font-medium leading-relaxed text-center"
                  style={{ 
                    color: 'rgba(255,255,255,0.94)',
                    letterSpacing: '-0.014em',
                    lineHeight: '1.52'
                  }}
                >
                  {generateStory()}
                </p>
              </motion.div>

              {/* Section Label */}
              <motion.h3 
                className="text-[11px] font-semibold uppercase tracking-wider mb-6 text-center"
                style={{ color: 'rgba(255,255,255,0.58)', letterSpacing: '0.15em' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.95, duration: 0.35 }}
              >
                Macro Forces Contribution
              </motion.h3>

              {/* Light Zones Grid (Illuminated Pockets, Not Cards) */}
              <div className="grid grid-cols-2 gap-5">
                {segments.map((segment, idx) => (
                  <LightZone
                    key={segment.name}
                    segment={segment}
                    weight={(segment?.weight || 0) * 100}
                    isExpanded={expandedSegment === segment.name}
                    onToggle={() => {
                      setExpandedSegment(expandedSegment === segment.name ? null : segment.name);
                      onOpenDetail?.(segment);
                    }}
                    delay={1.05 + idx * 0.10}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Feather-Light Pill Bar */}
          <FeatherPillBar 
            segments={segments} 
            activeSegment={expandedSegment}
            onPillClick={handlePillClick}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(SentimentDrawer);