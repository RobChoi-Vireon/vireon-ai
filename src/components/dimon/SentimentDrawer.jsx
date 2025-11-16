// 🔒 DESIGN LOCKED — OS HORIZON LIGHT GLASS TAHOE V2.1
// Last Updated: 2025-01-20
// VIREON CERTIFIED — Premium Frosted Glass Intelligence Panel
// Apple macOS Tahoe + VisionOS Light Glass Design Language
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { X, Activity, ChevronRight } from 'lucide-react';

// OS Horizon Motion DNA
const MOTION = {
  CURVES: {
    primary: [0.22, 0.61, 0.36, 1],
    secondary: [0.25, 0.46, 0.45, 0.94],
    breathe: [0.33, 0, 0.4, 1],
    expand: [0.25, 0.1, 0, 1.0]
  },
  DURATIONS: {
    fast: 0.08,
    base: 0.14,
    expand: 0.19,
    slow: 0.20,
    breathing: 9
  }
};

// SF Symbol-Style Outline Icons
const OutlineIcons = {
  Policy: ({ style }) => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={style}>
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
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={style}>
      <rect x="4.5" y="5.5" width="11" height="3" rx="0.6" stroke="currentColor" strokeWidth="1.2" />
      <rect x="4.5" y="11.5" width="11" height="3" rx="0.6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  Equities: ({ style }) => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={style}>
      <path d="M6 14V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M10 14V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M14 14V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  Global: ({ style }) => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={style}>
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
    trend: "Rising",
    detail: "Policy tightening accelerating with new regulatory frameworks. Compliance costs rising across tech and finance sectors. Medium-term headwinds expected for large-cap growth stocks as oversight intensifies."
  },
  Credit: {
    summary: "Spreads widening as stress pockets form in credit markets.",
    trend: "Moderate",
    detail: "Credit spreads expanding 18-35bps WoW in HY/EM segments. Issuance windows shortening and refinancing conditions tightening. Banks showing increased selectivity in underwriting as stress signals emerge."
  },
  Equities: {
    summary: "Market breadth remains flat with limited participation.",
    trend: "Moderate",
    detail: "Equity market concentration persists with gains limited to large-cap tech. Breadth indicators showing weakness despite headline index resilience. Rotation signals remain muted across sectors."
  },
  Global: {
    summary: "China slowdown weighing on global momentum and trade flows.",
    trend: "Softening",
    detail: "Chinese economic data continuing to underwhelm expectations. Export volumes normalizing while domestic demand remains subdued. Implications for global commodity markets and multinational earnings growth."
  }
};

// ============================================================================
// LIGHT GLASS TAHOE ORB
// ============================================================================
const LightGlassOrb = ({ score }) => {
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  const getZoneColor = (s) => {
    if (s < 40) return { base: '#DC6B6B', light: '#EF9A9A' };
    if (s < 70) return { base: '#5B92D6', light: '#90B8E8' };
    return { base: '#4CAF7A', light: '#81C995' };
  };

  const getZoneLabel = (s) => {
    if (s < 40) return 'Bearish';
    if (s < 70) return 'Mildly Bullish';
    return 'Bullish';
  };

  const colorSet = getZoneColor(score);
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

  const breathingScale = 1 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.DURATIONS.breathing)) * 0.007;
  const breathingOpacity = 0.06 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.DURATIONS.breathing)) * 0.02;

  return (
    <motion.div 
      className="relative flex items-center justify-center mx-auto mb-3"
      style={{
        width: '160px',
        height: '160px'
      }}
    >
      {/* Soft Bloom Ring */}
      <motion.div
        className="absolute"
        style={{
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colorSet.light}18 0%, ${colorSet.light}08 40%, transparent 68%)`,
          filter: 'blur(28px)',
          pointerEvents: 'none'
        }}
        animate={{
          opacity: breathingOpacity + 0.06,
          scale: breathingScale * 1.14
        }}
        transition={{
          duration: MOTION.DURATIONS.breathing,
          ease: MOTION.CURVES.breathe
        }}
      />

      {/* Atmospheric Glow (Floating Effect) */}
      <motion.div
        className="absolute"
        style={{
          width: '140px',
          height: '70px',
          top: '85%',
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${colorSet.base}08 0%, transparent 70%)`,
          filter: 'blur(18px)',
          pointerEvents: 'none'
        }}
        animate={{
          opacity: breathingOpacity,
          scale: breathingScale * 1.08
        }}
        transition={{
          duration: MOTION.DURATIONS.breathing,
          ease: MOTION.CURVES.breathe
        }}
      />

      {/* Light Glass Orb */}
      <motion.div
        className="absolute"
        style={{
          width: '128px',
          height: '128px',
          borderRadius: '50%',
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.76) 0%, 
              rgba(248, 250, 252, 0.82) 100%
            )
          `,
          backdropFilter: 'blur(32px) saturate(120%)',
          WebkitBackdropFilter: 'blur(32px) saturate(120%)',
          border: '1px solid rgba(255,255,255,0.65)',
          boxShadow: `
            inset 0 2px 8px rgba(255,255,255,0.85),
            inset 0 -2px 6px rgba(148,163,184,0.12),
            0 4px 16px rgba(0,0,0,0.08),
            0 0 24px ${colorSet.light}14
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
        {/* Subsurface Lighting Highlight */}
        <div style={{
          position: 'absolute',
          top: '6px',
          left: '6px',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 28% 28%, rgba(255,255,255,0.68) 0%, rgba(255,255,255,0.22) 45%, transparent 72%)',
          filter: 'blur(10px)',
          pointerEvents: 'none'
        }} />

        {/* Chrome Rim Highlight */}
        <div style={{
          position: 'absolute',
          inset: '2px',
          borderRadius: '50%',
          background: `
            radial-gradient(circle at 70% 32%, transparent 38%, rgba(255,255,255,0.48) 82%, rgba(255,255,255,0.24) 92%, transparent 100%)
          `,
          pointerEvents: 'none'
        }} />
      </motion.div>

      {/* Text Stack */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-[10px] font-medium uppercase tracking-wide mb-3"
          style={{ 
            color: 'rgba(51, 65, 85, 0.76)',
            letterSpacing: '0.14em',
            fontWeight: 500
          }}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35, ease: MOTION.CURVES.primary }}
        >
          Street Alignment
        </motion.span>
        
        <motion.span
          className="text-4xl font-bold mb-2"
          style={{ 
            color: colorSet.base,
            textShadow: `0 1px 3px ${colorSet.base}18`,
            letterSpacing: '-0.04em',
            fontWeight: 700
          }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.36, ease: MOTION.CURVES.primary }}
        >
          {score}
        </motion.span>
        
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <div className="text-[14px] font-semibold" style={{ color: 'rgba(30, 41, 59, 0.92)' }}>
            {label}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// 2×2 INSIGHT PILLS GRID
// ============================================================================
const InsightPillsGrid = ({ segments, delay }) => {
  const [hoveredPill, setHoveredPill] = useState(null);

  const getIconColor = (n) => {
    switch (n) {
      case 'Policy': return { base: '#5B92D6', light: '#7FA9DE' };
      case 'Credit': return { base: '#A77AD4', light: '#BA92E0' };
      case 'Equities': return { base: '#4CAF7A', light: '#6BC18E' };
      case 'Global': return { base: '#E5A546', light: '#EBB668' };
      default: return { base: '#94A3B8', light: '#B0BCC9' };
    }
  };

  const pillOrder = ['Policy', 'Credit', 'Equities', 'Global'];
  const orderedSegments = pillOrder.map(name => 
    segments.find(s => s.name === name) || { name, weight: 0 }
  );

  return (
    <motion.div
      className="grid grid-cols-2 gap-2.5 mb-4"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.32, ease: MOTION.CURVES.primary }}
    >
      {orderedSegments.map((segment, idx) => {
        const colorSet = getIconColor(segment.name);
        const Icon = OutlineIcons[segment.name] || OutlineIcons.Global;
        const weight = (segment?.weight || 0) * 100;
        const isHovered = hoveredPill === segment.name;

        return (
          <motion.div
            key={segment.name}
            className="relative"
            onHoverStart={() => setHoveredPill(segment.name)}
            onHoverEnd={() => setHoveredPill(null)}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.1 + (idx * 0.04), duration: 0.28 }}
          >
            <motion.div
              className="relative rounded-2xl overflow-hidden"
              style={{
                padding: '12px 14px',
                background: 'rgba(255, 255, 255, 0.62)',
                backdropFilter: 'blur(28px) saturate(115%)',
                WebkitBackdropFilter: 'blur(28px) saturate(115%)',
                border: '1px solid rgba(226, 232, 240, 0.75)',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.85), 0 2px 6px rgba(0,0,0,0.04)'
              }}
              animate={{
                y: isHovered ? -1.5 : 0,
                boxShadow: isHovered
                  ? `inset 0 1px 2px rgba(255,255,255,0.85), 0 3px 10px rgba(0,0,0,0.08), 0 0 16px ${colorSet.light}12`
                  : 'inset 0 1px 2px rgba(255,255,255,0.85), 0 2px 6px rgba(0,0,0,0.04)',
                borderColor: isHovered ? 'rgba(203, 213, 225, 0.85)' : 'rgba(226, 232, 240, 0.75)'
              }}
              transition={{ duration: MOTION.DURATIONS.base, ease: MOTION.CURVES.secondary }}
            >
              {/* Chrome Rim */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '8%',
                right: '8%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)',
                pointerEvents: 'none'
              }} />

              {/* Interior Glow */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(circle at 50% -10%, ${colorSet.light}04 0%, transparent 75%)`,
                borderRadius: '16px',
                pointerEvents: 'none'
              }} />

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{
                      background: `${colorSet.light}12`,
                      border: `1px solid ${colorSet.light}24`
                    }}
                  >
                    <Icon style={{ color: colorSet.base }} />
                  </div>
                  <span className="text-[12px] font-semibold" style={{ color: 'rgba(30, 41, 59, 0.92)' }}>
                    {segment.name}
                  </span>
                </div>
                <span className="text-[15px] font-bold" style={{ color: colorSet.base }}>
                  {Math.round(weight)}%
                </span>
              </div>

              {/* Micro-shadow */}
              <div style={{
                position: 'absolute',
                bottom: '-3px',
                left: '12%',
                right: '12%',
                height: '4px',
                background: 'radial-gradient(ellipse, rgba(0,0,0,0.04) 0%, transparent 70%)',
                filter: 'blur(2px)',
                pointerEvents: 'none'
              }} />
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// ============================================================================
// LIGHT GLASS INSIGHT STRIPE
// ============================================================================
const InsightStripe = ({ segments }) => {
  const generateInsight = () => {
    const hasPolicyRising = segments.find(s => s.name === 'Policy')?.trend === '+';
    const hasCreditStress = segments.find(s => s.name === 'Credit')?.stress_level === 'high';
    
    if (hasPolicyRising && hasCreditStress) {
      return "Mild upward pressure from policy tightening and credit stress.";
    }
    return "Mixed sentiment across policy, credit, and global conditions.";
  };

  return (
    <motion.div
      className="relative rounded-xl overflow-hidden mb-4"
      style={{
        padding: '8px 18px',
        background: 'rgba(255, 255, 255, 0.54)',
        backdropFilter: 'blur(24px) saturate(110%)',
        WebkitBackdropFilter: 'blur(24px) saturate(110%)',
        border: '1px solid rgba(226, 232, 240, 0.70)',
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.80), 0 2px 5px rgba(0,0,0,0.03)'
      }}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.52, duration: 0.30, ease: MOTION.CURVES.primary }}
    >
      {/* Micro-shadow */}
      <div style={{
        position: 'absolute',
        bottom: '-2px',
        left: '14%',
        right: '14%',
        height: '3px',
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.03) 0%, transparent 70%)',
        filter: 'blur(2px)',
        pointerEvents: 'none'
      }} />

      <p 
        className="text-[12px] font-medium text-center relative z-10"
        style={{ 
          color: 'rgba(51, 65, 85, 0.88)',
          letterSpacing: '-0.005em',
          lineHeight: '1.4'
        }}
      >
        {generateInsight()}
      </p>
    </motion.div>
  );
};

// ============================================================================
// LIGHT GLASS SEGMENT CARD
// ============================================================================
const SegmentCard = ({ segment, delay, onOpenDetail }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIconColor = (n) => {
    switch (n) {
      case 'Policy': return { base: '#5B92D6', light: '#7FA9DE' };
      case 'Credit': return { base: '#A77AD4', light: '#BA92E0' };
      case 'Equities': return { base: '#4CAF7A', light: '#6BC18E' };
      case 'Global': return { base: '#E5A546', light: '#EBB668' };
      default: return { base: '#94A3B8', light: '#B0BCC9' };
    }
  };

  const colorSet = getIconColor(segment.name);
  const Icon = OutlineIcons[segment.name] || OutlineIcons.Global;
  const weight = (segment?.weight || 0) * 100;
  const narrative = SEGMENT_INSIGHTS[segment.name] || { summary: 'No insights', trend: 'Stable' };

  return (
    <motion.div
      className="relative cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onOpenDetail?.(segment)}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.32, ease: MOTION.CURVES.primary }}
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{
          padding: '14px 16px',
          background: 'rgba(255, 255, 255, 0.68)',
          backdropFilter: 'blur(28px) saturate(118%)',
          WebkitBackdropFilter: 'blur(28px) saturate(118%)',
          border: '1px solid rgba(226, 232, 240, 0.72)',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.85), 0 2px 8px rgba(0,0,0,0.05)'
        }}
        animate={{
          y: isHovered ? -2 : 0,
          boxShadow: isHovered
            ? `inset 0 1px 2px rgba(255,255,255,0.85), 0 4px 12px rgba(0,0,0,0.08), 0 0 18px ${colorSet.light}10`
            : 'inset 0 1px 2px rgba(255,255,255,0.85), 0 2px 8px rgba(0,0,0,0.05)',
          borderColor: isHovered ? 'rgba(203, 213, 225, 0.85)' : 'rgba(226, 232, 240, 0.72)'
        }}
        transition={{ duration: MOTION.DURATIONS.base, ease: MOTION.CURVES.secondary }}
      >
        {/* Chrome Rim */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.70), transparent)',
          pointerEvents: 'none'
        }} />

        {/* Header: Icon + Name + Weight */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: `${colorSet.light}14`,
                border: `1px solid ${colorSet.light}26`
              }}
            >
              <Icon style={{ color: colorSet.base }} />
            </div>
            <span className="text-[13px] font-semibold" style={{ color: 'rgba(30, 41, 59, 0.94)' }}>
              {segment.name}
            </span>
          </div>
          <span className="text-[15px] font-bold" style={{ color: colorSet.base }}>
            {Math.round(weight)}%
          </span>
        </div>

        {/* Narrative */}
        <p 
          className="text-[12px] mb-2"
          style={{ 
            color: 'rgba(51, 65, 85, 0.86)',
            letterSpacing: '-0.004em',
            lineHeight: '1.4'
          }}
        >
          {narrative.summary}
        </p>

        {/* Bottom Row */}
        <div className="flex items-center justify-between mb-1.5">
          <div
            className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
            style={{
              background: `${colorSet.light}14`,
              border: `1px solid ${colorSet.light}24`,
              color: colorSet.base,
              letterSpacing: '0.008em'
            }}
          >
            {narrative.trend}
          </div>
          
          <motion.div
            className="flex items-center gap-0.5 text-[10px] font-medium"
            style={{ color: 'rgba(100, 116, 139, 0.68)' }}
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : -2
            }}
            transition={{ duration: MOTION.DURATIONS.base }}
          >
            <span>Details</span>
            <ChevronRight className="w-3 h-3" />
          </motion.div>
        </div>

        {/* Signal Bar */}
        <div className="relative">
          <div 
            className="w-full h-[2px] rounded-full overflow-hidden relative" 
            style={{ background: 'rgba(203, 213, 225, 0.35)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ 
                background: `linear-gradient(90deg, ${colorSet.base}90, ${colorSet.base}e8)`,
                boxShadow: `0 0 5px ${colorSet.light}20`
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${weight}%` }}
              transition={{ 
                duration: 0.60, 
                delay: delay + 0.12, 
                ease: 'easeOut' 
              }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// SEGMENT DETAIL OVERLAY (LIGHT GLASS)
// ============================================================================
const SegmentDetailOverlay = ({ segment, onClose }) => {
  if (!segment) return null;

  const getIconColor = (n) => {
    switch (n) {
      case 'Policy': return { base: '#5B92D6', light: '#7FA9DE' };
      case 'Credit': return { base: '#A77AD4', light: '#BA92E0' };
      case 'Equities': return { base: '#4CAF7A', light: '#6BC18E' };
      case 'Global': return { base: '#E5A546', light: '#EBB668' };
      default: return { base: '#94A3B8', light: '#B0BCC9' };
    }
  };

  const colorSet = getIconColor(segment.name);
  const Icon = OutlineIcons[segment.name] || OutlineIcons.Global;
  const detail = SEGMENT_INSIGHTS[segment.name]?.detail || 'No additional details available.';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="absolute inset-0 z-50 flex items-center justify-center p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.16, ease: MOTION.CURVES.expand }}
        onClick={onClose}
      >
        {/* Darkened Background */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(5px)' }}
        />

        {/* Detail Card */}
        <motion.div
          className="relative rounded-3xl overflow-hidden max-w-lg w-full"
          style={{
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(48px) saturate(125%)',
            WebkitBackdropFilter: 'blur(48px) saturate(125%)',
            border: '1px solid rgba(226, 232, 240, 0.82)',
            boxShadow: `
              0 24px 56px -12px rgba(0, 0, 0, 0.12),
              0 0 32px ${colorSet.light}08,
              inset 0 1px 2px rgba(255, 255, 255, 0.90)
            `,
            padding: '26px 30px'
          }}
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.19, ease: MOTION.CURVES.expand }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Chrome Rim */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '1.5px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.82), transparent)',
            filter: 'blur(0.4px)',
            pointerEvents: 'none'
          }} />

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: `${colorSet.light}18`,
                border: `1px solid ${colorSet.light}32`,
                boxShadow: `0 0 12px ${colorSet.light}10`
              }}
            >
              <Icon style={{ color: colorSet.base, width: '22px', height: '22px' }} />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: 'rgba(30, 41, 59, 0.96)' }}>
                {segment.name}
              </h3>
              <p className="text-[11px] font-medium" style={{ color: 'rgba(100, 116, 139, 0.76)' }}>
                Detailed Analysis
              </p>
            </div>
          </div>

          {/* Divider */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(203, 213, 225, 0.50), transparent)',
            margin: '14px 0 18px 0'
          }} />

          {/* Detail Text */}
          <p 
            className="text-[14px] leading-relaxed mb-5"
            style={{ 
              color: 'rgba(51, 65, 85, 0.88)',
              letterSpacing: '-0.005em',
              lineHeight: '1.6'
            }}
          >
            {detail}
          </p>

          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-[13px] font-semibold"
            style={{
              background: 'rgba(226, 232, 240, 0.42)',
              border: '1px solid rgba(203, 213, 225, 0.50)',
              color: 'rgba(51, 65, 85, 0.88)'
            }}
            whileHover={{ background: 'rgba(203, 213, 225, 0.52)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: MOTION.DURATIONS.fast }}
          >
            Close
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================================================
// LIGHT GLASS DOCK (BOTTOM NAV)
// ============================================================================
const LightGlassDock = ({ segments, delay }) => {
  const [activeSegment, setActiveSegment] = useState('Policy');

  const getIconColor = (n) => {
    switch (n) {
      case 'Policy': return { base: '#5B92D6', light: '#7FA9DE' };
      case 'Credit': return { base: '#A77AD4', light: '#BA92E0' };
      case 'Equities': return { base: '#4CAF7A', light: '#6BC18E' };
      case 'Global': return { base: '#E5A546', light: '#EBB668' };
      default: return { base: '#94A3B8', light: '#B0BCC9' };
    }
  };

  return (
    <motion.div
      className="relative rounded-[22px] overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.58)',
        backdropFilter: 'blur(32px) saturate(112%)',
        WebkitBackdropFilter: 'blur(32px) saturate(112%)',
        border: '1px solid rgba(226, 232, 240, 0.68)',
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.82), 0 3px 10px rgba(0,0,0,0.06)',
        padding: '14px 18px'
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.30, ease: MOTION.CURVES.primary }}
    >
      {/* Chrome Rim */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '8%',
        right: '8%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.72), transparent)',
        pointerEvents: 'none'
      }} />

      {/* Soft Shadow (Floating) */}
      <div style={{
        position: 'absolute',
        bottom: '-4px',
        left: '10%',
        right: '10%',
        height: '6px',
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.04) 0%, transparent 70%)',
        filter: 'blur(4px)',
        pointerEvents: 'none'
      }} />

      <div className="flex items-center justify-between gap-2.5">
        {segments.map((segment, idx) => {
          const colorSet = getIconColor(segment.name);
          const weight = (segment?.weight || 0) * 100;
          const Icon = OutlineIcons[segment.name] || OutlineIcons.Global;
          const isActive = activeSegment === segment.name;

          return (
            <motion.div 
              key={segment.name} 
              className="flex-1 cursor-pointer"
              onHoverStart={() => setActiveSegment(segment.name)}
            >
              <div className="flex flex-col items-center gap-1">
                <div 
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{
                    background: isActive ? `${colorSet.light}18` : 'transparent',
                    border: isActive ? `1px solid ${colorSet.light}28` : 'none',
                    transition: 'all 0.14s ease'
                  }}
                >
                  <Icon style={{ color: isActive ? colorSet.base : 'rgba(100, 116, 139, 0.62)', width: '14px', height: '14px' }} />
                </div>
                <span 
                  className="text-[10px] font-medium" 
                  style={{ 
                    color: isActive ? colorSet.base : 'rgba(100, 116, 139, 0.64)',
                    transition: 'color 0.14s ease'
                  }}
                >
                  {segment.name}
                </span>
                
                {/* Active Indicator */}
                <motion.div
                  className="h-[2px] rounded-full mt-0.5"
                  style={{
                    width: '20px',
                    background: isActive ? `linear-gradient(90deg, ${colorSet.base}88, ${colorSet.base}e8)` : 'transparent',
                    boxShadow: isActive ? `0 0 6px ${colorSet.light}28` : 'none'
                  }}
                  animate={{
                    opacity: isActive ? 1 : 0
                  }}
                  transition={{ duration: 0.16 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN DRAWER — LIGHT GLASS TAHOE
// ============================================================================
const SentimentDrawer = ({ isOpen, onClose, score, breakdown, onOpenDetail }) => {
  const [activeOverlay, setActiveOverlay] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape' && !activeOverlay) onClose?.();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose, activeOverlay]);

  const consensusScore = useMemo(() => (typeof score === 'number' ? score : 0), [score]);
  const segments = useMemo(() => (Array.isArray(breakdown?.segments) ? breakdown.segments : []), [breakdown]);

  const handleSegmentClick = (segment) => {
    setActiveOverlay(segment);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ paddingTop: '80px' }}
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.24, ease: MOTION.CURVES.primary }}
      >
        {/* Darkened Background */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.58)' }}
          onClick={!activeOverlay ? onClose : undefined}
        />

        {/* Light Glass Tahoe Panel */}
        <motion.div
          className="relative w-full max-w-4xl rounded-[32px] overflow-hidden border"
          style={{
            background: `
              linear-gradient(180deg, 
                rgba(248, 250, 252, 0.88) 0%,
                rgba(241, 245, 249, 0.92) 100%
              )
            `,
            backdropFilter: 'blur(52px) saturate(120%)',
            WebkitBackdropFilter: 'blur(52px) saturate(120%)',
            borderColor: 'rgba(226, 232, 240, 0.82)',
            boxShadow: `
              0 32px 64px -14px rgba(0, 0, 0, 0.15),
              inset 0 1px 2px rgba(255, 255, 255, 0.92),
              inset 0 0 0 1px rgba(255, 255, 255, 0.45),
              0 0 48px rgba(100, 116, 139, 0.08)
            `,
            maxHeight: 'calc(100vh - 100px)'
          }}
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 14 }}
          transition={{ duration: 0.20, ease: MOTION.CURVES.primary }}
        >
          {/* Inner Shadow (Depth) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            boxShadow: 'inset 0 0 24px rgba(148, 163, 184, 0.06)',
            borderRadius: '32px',
            pointerEvents: 'none'
          }} />

          {/* Chrome Top Rim */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '8%',
            right: '8%',
            height: '1.5px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.88), transparent)',
            filter: 'blur(0.5px)',
            pointerEvents: 'none'
          }} />

          {/* Header */}
          <div 
            className="relative border-b" 
            style={{ 
              borderColor: 'rgba(226, 232, 240, 0.55)',
              padding: '20px 26px 16px 26px',
              background: 'rgba(255, 255, 255, 0.28)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-11 h-11 rounded-xl border flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'rgba(147, 197, 253, 0.16)',
                    borderColor: 'rgba(147, 197, 253, 0.35)',
                    backdropFilter: 'blur(14px)',
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.70), 0 2px 8px rgba(59, 130, 246, 0.10)'
                  }}
                >
                  <Activity className="w-5.5 h-5.5 relative z-10" style={{ color: '#3B82F6' }} strokeWidth={1.7} />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight" style={{ color: 'rgba(30, 41, 59, 0.96)' }}>
                    Street Alignment
                  </h2>
                  <p className="text-[11px] font-medium" style={{ color: 'rgba(100, 116, 139, 0.80)' }}>
                    Consensus & Segment Breakdown
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(226, 232, 240, 0.48)',
                  border: '1px solid rgba(203, 213, 225, 0.55)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
                whileHover={{ scale: 1.04, background: 'rgba(203, 213, 225, 0.55)' }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: MOTION.DURATIONS.fast }}
              >
                <X className="w-4 h-4" style={{ color: 'rgba(71, 85, 105, 0.82)' }} />
              </motion.button>
            </div>
          </div>

          {/* Body (Compressed for Above-the-Fold) */}
          <div className="px-7 pt-3 pb-5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
            {/* Orb */}
            <LightGlassOrb score={consensusScore} />
            
            {/* Metadata */}
            <motion.p
              className="text-[10px] text-center mb-2.5"
              style={{ color: 'rgba(100, 116, 139, 0.68)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.52, duration: 0.26 }}
            >
              Based on 5 sources • Updated 2m ago
            </motion.p>

            {/* 2×2 Pills Grid */}
            <InsightPillsGrid segments={segments} delay={0.58} />

            {/* Insight Stripe */}
            <InsightStripe segments={segments} />

            {/* Segment Cards (Compressed) */}
            <div className="space-y-3 mb-4">
              {segments.map((segment, idx) => (
                <SegmentCard 
                  key={segment.name}
                  segment={segment} 
                  delay={0.68 + (idx * 0.05)} 
                  onOpenDetail={handleSegmentClick} 
                />
              ))}
            </div>

            {/* Light Glass Dock */}
            <LightGlassDock segments={segments} delay={0.92} />
          </div>

          {/* Segment Detail Overlay */}
          {activeOverlay && (
            <SegmentDetailOverlay 
              segment={activeOverlay} 
              onClose={() => setActiveOverlay(null)} 
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(SentimentDrawer);