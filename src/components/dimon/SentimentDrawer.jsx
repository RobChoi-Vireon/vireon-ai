// 🔒 DESIGN LOCKED — OS HORIZON LIQUID GLASS V8.0
// Last Updated: 2025-01-20
// macOS Tahoe Inspired • Apple HIG Compliant • Vireon Emotional Intelligence
// Unified Glass System • Subsurface Lighting • Zero Harsh Edges
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { X, Activity } from 'lucide-react';

// OS Horizon Motion Physics (Apple-Grade)
const MOTION = {
  CURVES: {
    liquid: [0.25, 0.1, 0, 1.0],
    silk: [0.22, 0.61, 0.36, 1],
    breathe: [0.33, 0, 0.4, 1]
  },
  DURATIONS: {
    drawer: 0.22,
    card: 0.19,
    morph: 0.24,
    breath: 3.6
  }
};

// SF Symbol Icons
const Icons = {
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

// Zone Data (Reduced Saturation 15%)
const ZONES = {
  Policy: { summary: "Regulatory tightening intensifies.", color: '#5E91D4', tint: 'rgba(94, 145, 212, 0.024)' },
  Credit: { summary: "Spreads widening in high-yield.", color: '#A278D6', tint: 'rgba(162, 120, 214, 0.024)' },
  Equities: { summary: "Concentration risk in mega-cap.", color: '#2BB578', tint: 'rgba(43, 181, 120, 0.024)' },
  Global: { summary: "China slowdown weighs on trade.", color: '#D9A851', tint: 'rgba(217, 168, 81, 0.024)' }
};

// ============================================================================
// TAHOE ALIGNMENT ORB (Enhanced Pulse, Depth Shadow, Light Source)
// ============================================================================
const TahoeAlignmentOrb = ({ score }) => {
  const [phase, setPhase] = useState(0);
  const [shouldReduce, setShouldReduce] = useState(false);
  const orbRef = useRef(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spring = { stiffness: 60, damping: 32, mass: 1.4 };
  const pX = useSpring(useTransform(mouseX, [-100, 100], [-0.8, 0.8]), spring);
  const pY = useSpring(useTransform(mouseY, [-100, 100], [-0.8, 0.8]), spring);

  const color = score < 40 ? '#E86565' : score < 70 ? '#5E91D4' : '#2BB578';

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduce(mq.matches);
    const h = (e) => setShouldReduce(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  useEffect(() => {
    if (shouldReduce) return;
    let raf, t = Date.now();
    const loop = () => {
      setPhase((Date.now() - t) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => raf && cancelAnimationFrame(raf);
  }, [shouldReduce]);

  useEffect(() => {
    if (shouldReduce || !orbRef?.current) return;
    const move = (e) => {
      const r = orbRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - (r.left + r.width / 2));
      mouseY.set(e.clientY - (r.top + r.height / 2));
    };
    const p = orbRef.current.parentElement;
    if (p) {
      p.addEventListener('mousemove', move);
      return () => p.removeEventListener('mousemove', move);
    }
  }, [shouldReduce, mouseX, mouseY]);

  const pulse = 1 + Math.sin(phase * (2 * Math.PI / MOTION.DURATIONS.breath)) * 0.016;
  const luminance = 1 + Math.sin(phase * (2 * Math.PI / MOTION.DURATIONS.breath)) * 0.012;

  return (
    <motion.div 
      ref={orbRef}
      className="relative flex items-center justify-center mx-auto"
      style={{ width: '240px', height: '240px', x: pX, y: pY }}
      initial={{ scale: 0.82, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.78, ease: MOTION.CURVES.liquid }}
    >
      {/* Multi-Layer Halos */}
      
      {/* Environmental Halo (1-2% spread) */}
      <motion.div
        style={{
          position: 'absolute',
          width: '640px',
          height: '200px',
          top: '-25%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${color}04 0%, ${color}01 58%, transparent 84%)`,
          filter: 'blur(76px)',
          pointerEvents: 'none'
        }}
        animate={{ opacity: 0.014 + Math.sin(phase * 0.35) * 0.008 }}
      />

      {/* Secondary Bloom (2-3%) */}
      <motion.div
        style={{
          position: 'absolute',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}07 0%, ${color}03 62%, transparent 88%)`,
          filter: 'blur(52px)',
          pointerEvents: 'none'
        }}
        animate={{ scale: pulse * 1.24, opacity: 0.026 + Math.sin(phase * 0.55) * 0.014 }}
        transition={{ duration: MOTION.DURATIONS.breath, ease: MOTION.CURVES.breathe }}
      />

      {/* Inner Core Glow (3-4%) */}
      <motion.div
        style={{
          position: 'absolute',
          width: '235px',
          height: '235px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}0E 0%, ${color}06 65%, transparent 90%)`,
          filter: 'blur(38px)',
          pointerEvents: 'none'
        }}
        animate={{ scale: pulse * 1.10, opacity: 0.036 + Math.sin(phase * 0.8) * 0.020 }}
        transition={{ duration: MOTION.DURATIONS.breath, ease: MOTION.CURVES.breathe }}
      />

      {/* Depth Shadow */}
      <div style={{
        position: 'absolute',
        width: '185px',
        height: '10px',
        top: '195px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.16)',
        filter: 'blur(9px)',
        pointerEvents: 'none'
      }} />

      {/* Liquid Glass Orb */}
      <motion.div
        style={{
          position: 'absolute',
          width: '185px',
          height: '185px',
          borderRadius: '50%',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(44px) saturate(168%)',
          WebkitBackdropFilter: 'blur(44px) saturate(168%)',
          border: '1px solid rgba(255,255,255,0.22)',
          boxShadow: `
            inset 0 3.5px 24px rgba(255,255,255,0.18),
            inset 0 -3.5px 20px rgba(0,0,0,0.28),
            0 0 76px ${color}26,
            0 0 0 1px rgba(255,255,255,0.11)
          `
        }}
        animate={{ 
          scale: pulse,
          filter: `brightness(${luminance})`
        }}
        transition={{ duration: MOTION.DURATIONS.breath, ease: MOTION.CURVES.breathe }}
      >
        {/* Refraction Shimmer */}
        <motion.div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle at ${52 + Math.sin(phase * 0.15) * 12}% ${44 + Math.cos(phase * 0.15) * 9}%, ${color}18 0%, transparent 74%)`,
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          top: '13px',
          left: '13px',
          width: '84px',
          height: '84px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 36% 36%, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.22) 52%, transparent 78%)',
          filter: 'blur(21px)',
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          boxShadow: 'inset 0 0 2px 1px rgba(255,255,255,0.18)',
          pointerEvents: 'none'
        }} />
      </motion.div>

      {/* Text Stack (Increased Contrast) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-[9px] font-medium uppercase tracking-widest mb-4"
          style={{ color: 'rgba(255,255,255,0.76)', letterSpacing: '0.24em' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42, duration: 0.48 }}
        >
          Alignment
        </motion.span>
        
        <motion.span
          className="text-[64px] mb-3"
          style={{ 
            color,
            textShadow: `0 0 42px ${color}54, 0 5px 20px rgba(0,0,0,0.38), 0 1px 3px rgba(255,255,255,0.22)`,
            filter: 'brightness(1.20) contrast(1.16)',
            letterSpacing: '-0.058em',
            fontWeight: 580
          }}
          initial={{ opacity: 0, scale: 0.78 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.54, duration: 0.64, ease: MOTION.CURVES.liquid }}
        >
          {score}
        </motion.span>
        
        <motion.div
          className="text-[10px] font-medium"
          style={{ color: 'rgba(255,255,255,0.70)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.80, duration: 0.42 }}
        >
          Medium Weight
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// LIQUID GLASS CATEGORY CARD (Unified Glass Profile)
// ============================================================================
const LiquidGlassCard = ({ segment, weight, isExpanded, onToggle, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const info = ZONES[segment.name] || {};
  const Icon = Icons[segment.name] || Icons.Global;

  return (
    <motion.div
      className="relative cursor-pointer"
      onClick={onToggle}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: MOTION.DURATIONS.card, ease: MOTION.CURVES.liquid }}
      layout
    >
      <motion.div
        className="relative overflow-hidden"
        style={{
          padding: '24px',
          borderRadius: '20px',
          background: `
            radial-gradient(ellipse at 50% -38%, ${info.tint} 0%, transparent 100%),
            rgba(255, 255, 255, 0.020)
          `,
          backdropFilter: 'blur(34px) saturate(148%)',
          WebkitBackdropFilter: 'blur(34px) saturate(148%)',
          boxShadow: `
            0 0 0 4px ${info.color}05,
            inset 0 1.5px 0 rgba(255,255,255,0.14),
            inset 0 0 24px rgba(255,255,255,0.012),
            0 6px 18px rgba(0,0,0,0.10),
            0 0 0 0.5px rgba(255,255,255,0.09)
          `,
          minHeight: isExpanded ? 'auto' : '172px'
        }}
        animate={{
          scale: isHovered ? 1.018 : 1,
          y: isHovered ? -1.5 : 0,
          filter: `brightness(${isHovered ? 1.03 : 1})`,
          background: isHovered || isExpanded
            ? `radial-gradient(ellipse at 50% -38%, ${info.color}06 0%, transparent 100%), rgba(255, 255, 255, 0.028)`
            : `radial-gradient(ellipse at 50% -38%, ${info.tint} 0%, transparent 100%), rgba(255, 255, 255, 0.020)`,
          boxShadow: isHovered
            ? `
              0 0 0 6px ${info.color}08,
              inset 0 1.5px 0 rgba(255,255,255,0.16),
              inset 0 0 28px rgba(255,255,255,0.016),
              0 8px 24px rgba(0,0,0,0.14),
              0 0 0 0.5px rgba(255,255,255,0.09)
            `
            : `
              0 0 0 4px ${info.color}05,
              inset 0 1.5px 0 rgba(255,255,255,0.14),
              inset 0 0 24px rgba(255,255,255,0.012),
              0 6px 18px rgba(0,0,0,0.10),
              0 0 0 0.5px rgba(255,255,255,0.09)
            `
        }}
        transition={{ duration: 0.19, ease: MOTION.CURVES.silk }}
        layout
      >
        {/* Internal Radiance Gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.022) 0%, rgba(0,0,0,0.018) 100%)',
          borderRadius: '20px',
          pointerEvents: 'none'
        }} />

        {/* Micro-Refraction Corner Ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '20px',
          boxShadow: 'inset 0 0 1px 1px rgba(255,255,255,0.10)',
          pointerEvents: 'none'
        }} />

        {/* Header */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-10 h-10 rounded-[14px] flex items-center justify-center relative"
              style={{
                background: `${info.color}10`,
                boxShadow: `0 0 0 0.5px ${info.color}16, inset 0 1px 0 rgba(255,255,255,0.08)`
              }}
            >
              <div style={{
                position: 'absolute',
                inset: -7,
                borderRadius: '16px',
                background: `radial-gradient(circle, ${info.color}16 0%, transparent 78%)`,
                filter: 'blur(11px)',
                pointerEvents: 'none'
              }} />
              <Icon style={{ color: info.color, filter: 'brightness(1.24)' }} />
            </div>
            <span className="text-[14px] font-semibold" style={{ color: 'rgba(255,255,255,0.98)', letterSpacing: '-0.010em' }}>
              {segment.name}
            </span>
          </div>
          <span className="text-[17px] font-bold" style={{ color: info.color, filter: 'brightness(1.22) contrast(1.10)' }}>
            {Math.round(weight)}%
          </span>
        </div>

        {/* Summary */}
        <p className="text-[12px] mb-5 relative z-10" style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.52' }}>
          {info.summary}
        </p>

        {/* Subsurface-Lit Bar */}
        <div className="relative">
          <div style={{
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '112%',
            height: '16px',
            background: `radial-gradient(ellipse, ${info.color}0A 0%, transparent 88%)`,
            filter: 'blur(8px)',
            pointerEvents: 'none'
          }} />
          
          <div className="w-full h-[4px] rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.26)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ 
                background: `linear-gradient(90deg, ${info.color}9E, ${info.color}FE)`,
                boxShadow: `0 0 14px ${info.color}38, inset 0 1px 0 rgba(255,255,255,0.16)`
              }}
              initial={{ width: '0%' }}
              animate={{ 
                width: `${weight}%`,
                boxShadow: isHovered ? `0 0 20px ${info.color}48, inset 0 1px 0 rgba(255,255,255,0.16)` : `0 0 14px ${info.color}38, inset 0 1px 0 rgba(255,255,255,0.16)`
              }}
              transition={{ duration: 0.36, delay: delay + 0.32, ease: MOTION.CURVES.liquid }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// FLOATING PILL BAR (Barely-There Accessory)
// ============================================================================
const FloatingPillBar = ({ segments, activeSegment, onPillClick }) => {
  return (
    <motion.div
      className="absolute bottom-5 left-1/2 z-20"
      style={{
        transform: 'translateX(-50%)',
        padding: '7px 16px',
        background: 'rgba(18, 20, 28, 0.48)',
        backdropFilter: 'blur(62px) saturate(192%)',
        WebkitBackdropFilter: 'blur(62px) saturate(192%)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 8px 22px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08)'
      }}
      initial={{ y: 28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.3, duration: 0.52, ease: MOTION.CURVES.liquid }}
    >
      <div className="flex items-center gap-2.5">
        {segments.map((seg) => {
          const info = ZONES[seg.name] || {};
          const isActive = activeSegment === seg.name;

          return (
            <motion.button
              key={seg.name}
              className="px-3.5 py-2 rounded-full text-[10px] font-semibold relative"
              style={{
                background: isActive ? `${info.color}22` : 'rgba(255,255,255,0.038)',
                color: isActive ? info.color : 'rgba(255,255,255,0.76)',
                opacity: isActive ? 1 : 0.70,
                boxShadow: isActive ? `inset 0 1px 0 rgba(255,255,255,0.10)` : 'inset 0 -1px 2px rgba(0,0,0,0.10)'
              }}
              onClick={() => onPillClick(seg.name)}
              animate={{ 
                y: isActive ? -1 : 0,
                boxShadow: isActive ? `0 0 20px ${info.color}18, inset 0 1px 0 rgba(255,255,255,0.10)` : 'inset 0 -1px 2px rgba(0,0,0,0.10)'
              }}
              whileHover={{ scale: 1.07, opacity: 1, y: -0.5 }}
              whileTap={{ scale: 0.94 }}
              transition={{ duration: 0.17 }}
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
// MAIN DRAWER — TAHOE UNIFIED LIGHTFIELD PANEL
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ paddingTop: '80px' }}
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(32px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.40, ease: MOTION.CURVES.liquid }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.76)' }}
          onClick={onClose}
        />

        <motion.div
          className="relative w-full max-w-4xl rounded-[32px] overflow-hidden flex flex-col"
          style={{
            background: `
              linear-gradient(180deg, 
                rgba(18, 20, 28, 0.96) 0%,
                rgba(16, 18, 26, 0.98) 100%
              )
            `,
            backdropFilter: 'blur(76px) saturate(228%)',
            WebkitBackdropFilter: 'blur(76px) saturate(228%)',
            boxShadow: `
              0 50px 100px -28px rgba(0, 0, 0, 0.92),
              0 0 76px rgba(142, 187, 255, 0.13),
              inset 0 2.5px 0 rgba(255, 255, 255, 0.17),
              inset 0 0 52px rgba(142, 187, 255, 0.020),
              0 0 0 0.5px rgba(255,255,255,0.08)
            `,
            maxHeight: 'calc(100vh - 100px)',
            height: '90vh'
          }}
          initial={{ opacity: 0, scale: 0.88, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 28 }}
          transition={{ duration: MOTION.DURATIONS.drawer, ease: MOTION.CURVES.liquid }}
        >
          {/* Tahoe Environmental Layers */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '25%',
            background: 'linear-gradient(180deg, rgba(142, 187, 255, 0.030) 0%, transparent 100%)',
            pointerEvents: 'none',
            borderRadius: '32px 32px 0 0'
          }} />

          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.072) 0%, transparent 54%, rgba(0,0,0,0.036) 100%)',
            pointerEvents: 'none',
            borderRadius: '32px'
          }} />

          <div style={{
            position: 'absolute',
            top: '-12%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '88%',
            height: '76%',
            background: 'radial-gradient(ellipse at 50% 24%, rgba(142, 187, 255, 0.020) 0%, transparent 92%)',
            pointerEvents: 'none'
          }} />

          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '32px',
            boxShadow: 'inset 0 0 2.5px 0.5px rgba(255,255,255,0.11)',
            pointerEvents: 'none'
          }} />

          {/* Header */}
          <div 
            className="relative flex-shrink-0" 
            style={{ 
              padding: '22px 30px 18px 30px',
              borderBottom: '1px solid rgba(255,255,255,0.07)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div 
                  className="w-11 h-11 rounded-[14px] flex items-center justify-center relative"
                  style={{
                    background: 'rgba(142, 187, 255, 0.13)',
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.16), 0 4px 22px rgba(142, 187, 255, 0.26)'
                  }}
                >
                  <Activity className="w-6 h-6 relative z-10" style={{ color: '#8EBBFF', filter: 'brightness(1.20)' }} strokeWidth={1.6} />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.98)', letterSpacing: '-0.022em' }}>
                    Street Alignment
                  </h2>
                  <p className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.80)' }}>
                    Consensus & Segment Breakdown
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="w-9 h-9 rounded-[14px] flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.13)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.11)'
                }}
                whileHover={{ scale: 1.10, background: 'rgba(255,255,255,0.18)' }}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.16 }}
              >
                <X className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.88)' }} />
              </motion.button>
            </div>
          </div>

          {/* UNIFIED TAHOE GLASS CANVAS */}
          <div 
            className="flex-1 overflow-y-auto px-12 pt-10 pb-24"
            style={{ scrollBehavior: 'smooth' }}
          >
            <motion.div
              className="relative rounded-[28px] overflow-hidden"
              style={{
                padding: '56px 40px',
                background: `radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.026) 100%)`,
                backdropFilter: 'blur(40px) saturate(155%)',
                WebkitBackdropFilter: 'blur(40px) saturate(155%)',
                boxShadow: `
                  inset 0 2.5px 0 rgba(255,255,255,0.14),
                  inset 0 0 40px rgba(142, 187, 255, 0.020),
                  0 10px 30px rgba(0,0,0,0.16),
                  0 0 0 0.5px rgba(255,255,255,0.09)
                `
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.20, duration: 0.60, ease: MOTION.CURVES.liquid }}
            >
              {/* Orb (Hero Anchor) */}
              <TahoeAlignmentOrb score={consensusScore} />
              
              <motion.p
                className="text-[9px] text-center mb-10"
                style={{ color: 'rgba(255,255,255,0.56)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.90, duration: 0.38 }}
              >
                Based on 5 sources • Updated 2m ago
              </motion.p>

              {/* Summary Pill (Lighter Glass, 20% Reduced Height) */}
              <motion.div
                className="relative rounded-[16px] overflow-hidden mb-14 mx-auto"
                style={{
                  padding: '13px 26px',
                  maxWidth: '78%',
                  background: 'rgba(255, 255, 255, 0.032)',
                  backdropFilter: 'blur(38px) saturate(145%)',
                  WebkitBackdropFilter: 'blur(38px) saturate(145%)',
                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,0.12),
                    0 0 22px rgba(142, 187, 255, 0.08),
                    0 4px 14px rgba(0,0,0,0.08)
                  `
                }}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.98, duration: 0.44 }}
                whileHover={{ 
                  y: -1,
                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,0.14),
                    0 0 26px rgba(142, 187, 255, 0.12),
                    0 5px 16px rgba(0,0,0,0.10)
                  `
                }}
              >
                <p 
                  className="text-[13px] font-medium leading-relaxed text-center"
                  style={{ 
                    color: 'rgba(255,255,255,0.94)',
                    letterSpacing: '-0.018em',
                    lineHeight: '1.56'
                  }}
                >
                  Markets show mixed sentiment across policy, credit, and global conditions.
                </p>
              </motion.div>

              {/* Breathing Space */}
              <div style={{ height: '40px' }} />

              {/* Lightfield Zones (2x2 Grid) */}
              <div className="grid grid-cols-2 gap-7">
                {segments.map((segment, idx) => (
                  <LiquidGlassCard
                    key={segment.name}
                    segment={segment}
                    weight={(segment?.weight || 0) * 100}
                    isExpanded={expandedSegment === segment.name}
                    onToggle={() => {
                      setExpandedSegment(expandedSegment === segment.name ? null : segment.name);
                      onOpenDetail?.(segment);
                    }}
                    delay={1.14 + idx * 0.08}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Floating Pill Bar */}
          <FloatingPillBar 
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