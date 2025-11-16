// 🔒 DESIGN LOCKED — TAHOE UNIFIED LIGHTFIELD PANEL V7.0
// Last Updated: 2025-01-20
// Pure macOS Tahoe + VisionOS Unified Surface Design
// Zero-Box Philosophy • Atmospheric Canvas • Morphing Light Zones
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { X, Activity } from 'lucide-react';

// Tahoe Motion DNA (Liquid Physics)
const TAHOE = {
  CURVES: {
    liquid: [0.25, 0.1, 0, 1.0],
    breathe: [0.33, 0, 0.4, 1],
    morph: [0.22, 0.61, 0.36, 1]
  },
  DURATIONS: {
    fast: 0.18,
    base: 0.22,
    morph: 0.24,
    breath: 50
  }
};

// Minimal SF Symbol Icons
const Icons = {
  Policy: ({ style }) => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={style}>
      <path d="M10 3.5L5 5.5V9C5 12 7.5 14.5 10 15.5C12.5 14.5 15 12 15 9V5.5L10 3.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Credit: ({ style }) => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={style}>
      <rect x="4.5" y="5.5" width="11" height="3" rx="0.6" stroke="currentColor" strokeWidth="1.2" />
      <rect x="4.5" y="11.5" width="11" height="3" rx="0.6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  Equities: ({ style }) => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={style}>
      <path d="M6 14V11M10 14V8M14 14V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  Global: ({ style }) => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={style}>
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 3.5C10 3.5 12.5 6 12.5 10C12.5 14 10 16.5 10 16.5M4 10H16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
};

// Lightfield Zone Data
const ZONES = {
  Policy: { summary: "Regulatory tightening intensifies.", color: '#6B9FE8', tint: 'rgba(107, 159, 232, 0.028)' },
  Credit: { summary: "Spreads widening in high-yield.", color: '#B88AED', tint: 'rgba(184, 138, 237, 0.028)' },
  Equities: { summary: "Concentration risk in mega-cap.", color: '#32C288', tint: 'rgba(50, 194, 136, 0.028)' },
  Global: { summary: "China slowdown weighs on trade.", color: '#EDB859', tint: 'rgba(237, 184, 89, 0.028)' }
};

// ============================================================================
// TAHOE LUMINOUS ORB (Multi-Layer Halos, Refraction Shimmer)
// ============================================================================
const TahoeOrb = ({ score }) => {
  const [phase, setPhase] = useState(0);
  const [shouldReduce, setShouldReduce] = useState(false);
  const orbRef = useRef(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spring = { stiffness: 65, damping: 30, mass: 1.2 };
  const parallaxX = useSpring(useTransform(mouseX, [-100, 100], [-1, 1]), spring);
  const parallaxY = useSpring(useTransform(mouseY, [-100, 100], [-1, 1]), spring);

  const color = score < 40 ? '#E86565' : score < 70 ? '#6B9FE8' : '#32C288';

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

  const breathe = 1 + Math.sin(phase * (2 * Math.PI / TAHOE.DURATIONS.breath)) * 0.024;
  const shimmer = (phase % 52) / 52;

  return (
    <motion.div 
      ref={orbRef}
      className="relative flex items-center justify-center mx-auto"
      style={{ width: '240px', height: '240px', x: parallaxX, y: parallaxY }}
      initial={{ scale: 0.84, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.75, ease: TAHOE.CURVES.liquid }}
    >
      {/* Environmental Halo (1-2% spread across top) */}
      <motion.div
        style={{
          position: 'absolute',
          width: '600px',
          height: '180px',
          top: '-30%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${color}04 0%, ${color}01 55%, transparent 82%)`,
          filter: 'blur(72px)',
          pointerEvents: 'none'
        }}
        animate={{ opacity: 0.012 + Math.sin(phase * 0.4) * 0.006 }}
      />

      {/* Secondary Bloom (2-3%) */}
      <motion.div
        style={{
          position: 'absolute',
          width: '340px',
          height: '340px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}06 0%, ${color}02 60%, transparent 85%)`,
          filter: 'blur(48px)',
          pointerEvents: 'none'
        }}
        animate={{ scale: breathe * 1.22, opacity: 0.024 + Math.sin(phase * 0.6) * 0.012 }}
        transition={{ duration: TAHOE.DURATIONS.breath, ease: TAHOE.CURVES.breathe }}
      />

      {/* Inner Core Glow (3-4%) */}
      <motion.div
        style={{
          position: 'absolute',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}0C 0%, ${color}05 62%, transparent 88%)`,
          filter: 'blur(36px)',
          pointerEvents: 'none'
        }}
        animate={{ scale: breathe * 1.08, opacity: 0.038 + Math.sin(phase * 0.9) * 0.018 }}
        transition={{ duration: TAHOE.DURATIONS.breath, ease: TAHOE.CURVES.breathe }}
      />

      {/* Liquid Glass Orb */}
      <motion.div
        style={{
          position: 'absolute',
          width: '185px',
          height: '185px',
          borderRadius: '50%',
          background: 'linear-gradient(142deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 100%)',
          backdropFilter: 'blur(42px) saturate(165%)',
          WebkitBackdropFilter: 'blur(42px) saturate(165%)',
          border: '1px solid rgba(255,255,255,0.20)',
          boxShadow: `
            inset 0 3px 22px rgba(255,255,255,0.17),
            inset 0 -3px 18px rgba(0,0,0,0.26),
            0 0 72px ${color}24,
            0 0 0 1px rgba(255,255,255,0.10)
          `
        }}
        animate={{ scale: breathe }}
        transition={{ duration: TAHOE.DURATIONS.breath, ease: TAHOE.CURVES.breathe }}
      >
        {/* Refraction Shimmer (40-60s loop) */}
        <motion.div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle at ${50 + Math.sin(shimmer * Math.PI * 2) * 10}% ${42 + Math.cos(shimmer * Math.PI * 2) * 8}%, ${color}16 0%, transparent 72%)`,
          pointerEvents: 'none'
        }} />

        {/* Soft Color Separation */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 34% 34%, rgba(255,255,255,0.40) 0%, rgba(255,255,255,0.20) 50%, transparent 76%)',
          filter: 'blur(20px)',
          pointerEvents: 'none'
        }} />

        {/* Inner Highlight Ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          boxShadow: 'inset 0 0 2px 1px rgba(255,255,255,0.17)',
          pointerEvents: 'none'
        }} />
      </motion.div>

      {/* Text Stack */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-[9px] font-medium uppercase tracking-widest mb-4"
          style={{ color: 'rgba(255,255,255,0.72)', letterSpacing: '0.22em' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.40, duration: 0.45 }}
        >
          Alignment
        </motion.span>
        
        <motion.span
          className="text-[64px] mb-2.5"
          style={{ 
            color,
            textShadow: `0 0 40px ${color}50, 0 5px 18px rgba(0,0,0,0.36)`,
            filter: 'brightness(1.18) contrast(1.14)',
            letterSpacing: '-0.055em',
            fontWeight: 560
          }}
          initial={{ opacity: 0, scale: 0.80 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.50, duration: 0.60, ease: TAHOE.CURVES.liquid }}
        >
          {score}
        </motion.span>
        
        <motion.div
          className="text-[10px] font-medium"
          style={{ color: 'rgba(255,255,255,0.66)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.40 }}
        >
          Medium Weight
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// LIGHTFIELD ZONE (Illuminated Patch, No Borders)
// ============================================================================
const LightfieldZone = ({ segment, weight, isExpanded, onToggle, delay }) => {
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
      transition={{ delay, duration: 0.48, ease: TAHOE.CURVES.liquid }}
      layout
    >
      <motion.div
        className="relative overflow-hidden"
        style={{
          padding: isExpanded ? '28px 24px' : '24px 20px',
          borderRadius: '20px',
          background: `
            radial-gradient(ellipse at 50% -35%, ${info.tint} 0%, transparent 100%),
            rgba(255, 255, 255, 0.018)
          `
        }}
        animate={{
          y: isHovered ? -1.5 : 0,
          background: isHovered || isExpanded
            ? `radial-gradient(ellipse at 50% -35%, ${info.color}05 0%, transparent 100%), rgba(255, 255, 255, 0.026)`
            : `radial-gradient(ellipse at 50% -35%, ${info.tint} 0%, transparent 100%), rgba(255, 255, 255, 0.018)`
        }}
        transition={{ duration: 0.22, ease: TAHOE.CURVES.morph }}
        layout
      >
        {/* Ambient Glow (Intensifies on Expand) */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '20px',
            background: `radial-gradient(circle at 50% 50%, ${info.color}10 0%, transparent 78%)`,
            opacity: 0,
            pointerEvents: 'none'
          }}
          animate={{ opacity: isExpanded ? 0.48 : isHovered ? 0.32 : 0 }}
          transition={{ duration: 0.22 }}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-[12px] flex items-center justify-center relative"
              style={{
                background: `${info.color}08`,
                boxShadow: `0 0 0 0.5px ${info.color}14`
              }}
            >
              <div style={{
                position: 'absolute',
                inset: -6,
                borderRadius: '14px',
                background: `radial-gradient(circle, ${info.color}14 0%, transparent 76%)`,
                filter: 'blur(10px)',
                pointerEvents: 'none'
              }} />
              <Icon style={{ color: info.color, filter: 'brightness(1.22)' }} />
            </div>
            <span className="text-[14px] font-semibold" style={{ color: 'rgba(255,255,255,0.98)', letterSpacing: '-0.008em' }}>
              {segment.name}
            </span>
          </div>
          <span className="text-[16px] font-bold" style={{ color: info.color, filter: 'brightness(1.20)' }}>
            {Math.round(weight)}%
          </span>
        </div>

        {/* Summary */}
        <p className="text-[12px] mb-4" style={{ color: 'rgba(255,255,255,0.88)', lineHeight: '1.48' }}>
          {info.summary}
        </p>

        {/* Subsurface-Lit Bar */}
        <div className="relative">
          <div style={{
            position: 'absolute',
            bottom: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '108%',
            height: '14px',
            background: `radial-gradient(ellipse, ${info.color}09 0%, transparent 86%)`,
            filter: 'blur(7px)',
            pointerEvents: 'none'
          }} />
          
          <div className="w-full h-[4px] rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.24)' }}>
            <motion.div
              className="h-full rounded-full relative"
              style={{ 
                background: `linear-gradient(90deg, ${info.color}9C, ${info.color}FC)`,
                boxShadow: `0 0 13px ${info.color}36`
              }}
              initial={{ width: '0%' }}
              animate={{ 
                width: `${weight}%`,
                boxShadow: isHovered ? `0 0 18px ${info.color}46` : `0 0 13px ${info.color}36`
              }}
              transition={{ duration: 0.34, delay: delay + 0.28, ease: TAHOE.CURVES.liquid }}
            />
          </div>
        </div>

        {/* Expanded Details (Morph In Place) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: TAHOE.DURATIONS.morph, ease: TAHOE.CURVES.morph }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ marginTop: '28px', paddingTop: '28px' }}>
                {/* Luminous Separator */}
                <div style={{
                  position: 'absolute',
                  left: '14%',
                  right: '14%',
                  height: '1px',
                  background: `linear-gradient(90deg, transparent, ${info.color}18, transparent)`,
                  filter: 'blur(1px)',
                  pointerEvents: 'none',
                  marginTop: '-28px'
                }} />

                <div className="px-2">
                  <div 
                    className="inline-block px-3 py-1.5 rounded-xl text-[9px] font-semibold mb-4"
                    style={{
                      background: `${info.color}12`,
                      color: info.color,
                      letterSpacing: '0.06em',
                      boxShadow: `0 0 16px ${info.color}10`
                    }}
                  >
                    TL;DR
                  </div>

                  <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.94)', lineHeight: '1.64' }}>
                    Regulatory tightening raises compliance costs → downside for Big Tech multiples. Margins pressured as capex shifts from innovation to compliance.
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
// FLOATING PILL BAR (Barely-There Accessory)
// ============================================================================
const FloatingPillBar = ({ segments, activeSegment, onPillClick }) => {
  return (
    <motion.div
      className="absolute bottom-4 left-1/2 z-20"
      style={{
        transform: 'translateX(-50%)',
        padding: '6px 14px',
        background: 'rgba(18, 20, 28, 0.52)',
        backdropFilter: 'blur(58px) saturate(185%)',
        WebkitBackdropFilter: 'blur(58px) saturate(185%)',
        borderRadius: '18px',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 6px 18px rgba(0,0,0,0.24)'
      }}
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.48, ease: TAHOE.CURVES.liquid }}
    >
      <div className="flex items-center gap-2">
        {segments.map((seg) => {
          const info = ZONES[seg.name] || {};
          const isActive = activeSegment === seg.name;

          return (
            <motion.button
              key={seg.name}
              className="px-3 py-1.5 rounded-full text-[10px] font-semibold relative"
              style={{
                background: isActive ? `${info.color}20` : 'transparent',
                color: isActive ? info.color : 'rgba(255,255,255,0.74)',
                opacity: isActive ? 1 : 0.68
              }}
              onClick={() => onPillClick(seg.name)}
              animate={{ 
                y: isActive ? -1 : 0,
                boxShadow: isActive ? `0 0 18px ${info.color}16` : 'none'
              }}
              whileHover={{ scale: 1.06, opacity: 1 }}
              whileTap={{ scale: 0.95 }}
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
        animate={{ opacity: 1, backdropFilter: 'blur(30px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.38, ease: TAHOE.CURVES.liquid }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.74)' }}
          onClick={onClose}
        />

        <motion.div
          className="relative w-full max-w-4xl rounded-[32px] overflow-hidden flex flex-col"
          style={{
            background: `
              linear-gradient(180deg, 
                rgba(18, 20, 28, 0.94) 0%,
                rgba(16, 18, 26, 0.98) 100%
              )
            `,
            backdropFilter: 'blur(72px) saturate(220%)',
            WebkikBackdropFilter: 'blur(72px) saturate(220%)',
            border: 'none',
            boxShadow: `
              0 46px 92px -24px rgba(0, 0, 0, 0.90),
              0 0 72px rgba(142, 187, 255, 0.12),
              inset 0 2px 0 rgba(255, 255, 255, 0.16),
              inset 0 0 48px rgba(142, 187, 255, 0.018)
            `,
            maxHeight: 'calc(100vh - 100px)',
            height: '90vh'
          }}
          initial={{ opacity: 0, scale: 0.90, y: 36 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 26 }}
          transition={{ duration: 0.34, ease: TAHOE.CURVES.liquid }}
        >
          {/* Tahoe Environmental Fog (Top 25%) */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '25%',
            background: 'linear-gradient(180deg, rgba(142, 187, 255, 0.026) 0%, transparent 100%)',
            pointerEvents: 'none',
            borderRadius: '32px 32px 0 0'
          }} />

          {/* Top-Down Luminance Gradient */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.068) 0%, transparent 52%, rgba(0,0,0,0.032) 100%)',
            pointerEvents: 'none',
            borderRadius: '32px'
          }} />

          {/* Ambient Light Bleed */}
          <div style={{
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '85%',
            height: '72%',
            background: 'radial-gradient(ellipse at 50% 22%, rgba(142, 187, 255, 0.018) 0%, transparent 90%)',
            pointerEvents: 'none'
          }} />

          {/* Soft Inner Glow */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '32px',
            boxShadow: 'inset 0 0 2px 0.5px rgba(255,255,255,0.10)',
            pointerEvents: 'none'
          }} />

          {/* Header (Minimal) */}
          <div 
            className="relative flex-shrink-0" 
            style={{ 
              padding: '22px 30px 18px 30px',
              borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div 
                  className="w-11 h-11 rounded-[13px] flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'rgba(142, 187, 255, 0.12)',
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.15), 0 4px 20px rgba(142, 187, 255, 0.24)'
                  }}
                >
                  <Activity className="w-6 h-6 relative z-10" style={{ color: '#8EBBFF', filter: 'brightness(1.18)' }} strokeWidth={1.6} />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.98)', letterSpacing: '-0.020em' }}>
                    Street Alignment
                  </h2>
                  <p className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.78)' }}>
                    Consensus & Segment Breakdown
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="w-9 h-9 rounded-[13px] flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)'
                }}
                whileHover={{ scale: 1.09, background: 'rgba(255,255,255,0.17)' }}
                whileTap={{ scale: 0.93 }}
                transition={{ duration: 0.16 }}
              >
                <X className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.86)' }} />
              </motion.button>
            </div>
          </div>

          {/* UNIFIED TAHOE GLASS CANVAS */}
          <div 
            className="flex-1 overflow-y-auto px-12 pt-8 pb-20"
            style={{ scrollBehavior: 'smooth' }}
          >
            <motion.div
              className="relative rounded-[26px] overflow-hidden"
              style={{
                padding: '48px 36px',
                background: `
                  radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.042) 0%, rgba(255,255,255,0.024) 100%)
                `,
                backdropFilter: 'blur(38px) saturate(152%)',
                WebkitBackdropFilter: 'blur(38px) saturate(152%)',
                boxShadow: `
                  inset 0 2px 0 rgba(255,255,255,0.13),
                  inset 0 0 36px rgba(142, 187, 255, 0.018),
                  0 8px 26px rgba(0,0,0,0.14),
                  0 0 0 0.5px rgba(255,255,255,0.08)
                `
              }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.56, ease: TAHOE.CURVES.liquid }}
            >
              {/* Tahoe Orb */}
              <TahoeOrb score={consensusScore} />
              
              <motion.p
                className="text-[9px] text-center mb-14"
                style={{ color: 'rgba(255,255,255,0.54)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85, duration: 0.35 }}
              >
                Based on 5 sources • Updated 2m ago
              </motion.p>

              {/* Summary */}
              <motion.div
                className="relative rounded-[16px] overflow-hidden mb-12 mx-auto"
                style={{
                  padding: '16px 28px',
                  maxWidth: '76%',
                  background: 'rgba(255, 255, 255, 0.028)'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.92, duration: 0.42 }}
              >
                <p 
                  className="text-[13px] font-medium leading-relaxed text-center"
                  style={{ 
                    color: 'rgba(255,255,255,0.94)',
                    letterSpacing: '-0.016em',
                    lineHeight: '1.56'
                  }}
                >
                  Markets show mixed sentiment across policy, credit, and global conditions.
                </p>
              </motion.div>

              {/* Atmospheric Spacing */}
              <div style={{ height: '32px' }} />

              {/* Lightfield Zones (2x2 Grid) */}
              <div className="grid grid-cols-2 gap-6">
                {segments.map((segment, idx) => (
                  <LightfieldZone
                    key={segment.name}
                    segment={segment}
                    weight={(segment?.weight || 0) * 100}
                    isExpanded={expandedSegment === segment.name}
                    onToggle={() => {
                      setExpandedSegment(expandedSegment === segment.name ? null : segment.name);
                      onOpenDetail?.(segment);
                    }}
                    delay={1.08 + idx * 0.12}
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