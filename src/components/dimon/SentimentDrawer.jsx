// 🔒 DESIGN LOCKED — OS HORIZON TAHOE V5.0 REFINEMENT
// Last Updated: 2025-01-20
// VIREON CERTIFIED — Full 16-Pillar Compliance + macOS Tahoe Atmosphere
// Apple-grade UI/UX, Cinematic Intelligence, Emotional Resonance
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { X, Activity, ChevronDown, ChevronUp } from 'lucide-react';

// OS Horizon Motion DNA (Liquid Silk / Halo Motion)
const MOTION = {
  CURVES: {
    silk: [0.25, 0.1, 0, 1.0],
    breathe: [0.33, 0, 0.4, 1],
    lift: [0.22, 0.61, 0.36, 1]
  },
  DURATIONS: {
    instant: 0.10,
    fast: 0.18,
    base: 0.30,
    breathing: 40
  }
};

// SF Symbol-Style Outline Icons
const OutlineIcons = {
  Policy: ({ style }) => (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" style={style}>
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
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" style={style}>
      <rect x="4.5" y="5.5" width="11" height="3" rx="0.6" stroke="currentColor" strokeWidth="1.2" />
      <rect x="4.5" y="11.5" width="11" height="3" rx="0.6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  Equities: ({ style }) => (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" style={style}>
      <path d="M6 14V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M10 14V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M14 14V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  Global: ({ style }) => (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" style={style}>
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 3.5C10 3.5 12.5 6 12.5 10C12.5 14 10 16.5 10 16.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M4 10H16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
};

// Segment Data
const SEGMENT_INSIGHTS = {
  Policy: {
    summary: "Regulators tightening oversight in medium-term policy environment.",
    detail: "Bipartisan push on content/privacy expands audit scope Y/Y. Capex guidance reflects regulatory friction across major platforms.",
    trend: "Rising",
    color: '#70A8E8'
  },
  Credit: {
    summary: "Spreads widening as stress pockets form in credit markets.",
    detail: "EM HY spreads widen 35bps WoW. Issuance windows shorten. Banks tighten underwriting standards.",
    trend: "Moderate",
    color: '#B88AED'
  },
  Equities: {
    summary: "Market breadth remains flat with limited participation.",
    detail: "Recent gains concentrated in large-cap. Underlying fragility despite headline resilience.",
    trend: "Moderate",
    color: '#32C288'
  },
  Global: {
    summary: "China slowdown weighing on global momentum and trade flows.",
    detail: "Exports normalize. Household confidence lags. Local infra offsets narrow in 2H.",
    trend: "Softening",
    color: '#EDB859'
  }
};

// ============================================================================
// ENHANCED LUMINOUS ORB (15% Larger, Enhanced Halos, Subsurface Shimmer)
// ============================================================================
const LuminousAlignmentOrb = ({ score }) => {
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const orbRef = useRef(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 75, damping: 26, mass: 0.9 };
  const parallaxX = useSpring(useTransform(mouseX, [-100, 100], [-2, 2]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [-100, 100], [-2, 2]), springConfig);

  const getZoneColor = (s) => {
    if (s < 40) return '#E86565';
    if (s < 70) return '#70A8E8';
    return '#32C288';
  };

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

  const breathingScale = 1 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.DURATIONS.breathing)) * 0.02;
  const breathingGlow = 0.045 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.DURATIONS.breathing)) * 0.025;
  const shimmerPhase = (breathingPhase % 35) / 35;

  return (
    <motion.div 
      ref={orbRef}
      className="relative flex items-center justify-center mx-auto mb-1"
      style={{ width: '210px', height: '210px', x: parallaxX, y: parallaxY }}
      initial={{ scale: 0.88, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.65, ease: MOTION.CURVES.silk }}
    >
      {/* Outer Halo Diffusion (Enhanced 5% spread, 260px diameter) */}
      <motion.div
        className="absolute"
        style={{
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}${Math.round(breathingGlow * 255).toString(16).padStart(2, '0')} 0%, ${color}03 50%, transparent 76%)`,
          filter: 'blur(52px)',
          pointerEvents: 'none'
        }}
        animate={{ scale: breathingScale * 1.32, opacity: breathingGlow }}
        transition={{ duration: MOTION.DURATIONS.breathing, ease: MOTION.CURVES.breathe }}
      />

      {/* Directional Inner Halo (Top-Left) */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-20%',
        width: '70%',
        height: '70%',
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 35%, ${color}06 0%, transparent 68%)`,
        filter: 'blur(36px)',
        pointerEvents: 'none'
      }} />

      {/* Liquid Glass Orb (15% larger = 161px) */}
      <motion.div
        className="absolute"
        style={{
          width: '161px',
          height: '161px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.11) 0%, rgba(255, 255, 255, 0.04) 100%)',
          backdropFilter: 'blur(36px) saturate(155%)',
          WebkitBackdropFilter: 'blur(36px) saturate(155%)',
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: `
            inset 0 2px 18px rgba(255,255,255,0.15),
            inset 0 -2px 14px rgba(0,0,0,0.22),
            0 0 60px ${color}20,
            0 0 0 0.5px rgba(255,255,255,0.08)
          `
        }}
        animate={{ scale: breathingScale }}
        transition={{ duration: MOTION.DURATIONS.breathing, ease: MOTION.CURVES.breathe }}
      >
        {/* Subsurface Shimmer (30-45s cycle) */}
        <motion.div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `
            radial-gradient(
              circle at ${45 + Math.sin(shimmerPhase * Math.PI * 2) * 8}% ${38 + Math.cos(shimmerPhase * Math.PI * 2) * 6}%, 
              ${color}12 0%, 
              transparent 68%
            )
          `,
          pointerEvents: 'none'
        }} />

        {/* Top Rim Highlight */}
        <div style={{
          position: 'absolute',
          top: '9px',
          left: '9px',
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 32% 32%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.16) 46%, transparent 72%)',
          filter: 'blur(17px)',
          pointerEvents: 'none'
        }} />

        {/* Luminous Edge Highlight */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          boxShadow: 'inset 0 0 1px 0.5px rgba(255,255,255,0.14)',
          pointerEvents: 'none'
        }} />
      </motion.div>

      {/* Text Stack */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-[10px] font-medium uppercase tracking-widest mb-3"
          style={{ color: 'rgba(255,255,255,0.68)', letterSpacing: '0.18em' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          Alignment
        </motion.span>
        
        <motion.span
          className="text-[56px] mb-1.5"
          style={{ 
            color,
            textShadow: `0 0 32px ${color}45, 0 3px 14px rgba(0,0,0,0.32)`,
            filter: 'brightness(1.14) contrast(1.11)',
            letterSpacing: '-0.045em',
            fontWeight: 560
          }}
          initial={{ opacity: 0, scale: 0.84 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5, ease: MOTION.CURVES.silk }}
        >
          {score}
        </motion.span>
        
        <motion.div
          className="text-[11px] font-medium"
          style={{ color: 'rgba(255,255,255,0.62)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.35 }}
        >
          Medium Weight
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// FLOATING SUMMARY CHIP (70% width, inner shadow, top highlight, micro-lift)
// ============================================================================
const FloatingSummaryChip = ({ segments, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

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
      className="relative rounded-2xl overflow-hidden mb-4 mx-auto"
      style={{
        padding: '16px 26px',
        maxWidth: '72%',
        background: 'rgba(255, 255, 255, 0.048)',
        backdropFilter: 'blur(38px) saturate(148%)',
        WebkitBackdropFilter: 'blur(38px) saturate(148%)',
        border: '1px solid rgba(255,255,255,0.11)',
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.12),
          inset 0 -2px 6px rgba(0,0,0,0.08),
          0 8px 22px rgba(0,0,0,0.14)
        `
      }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: isHovered ? -1.5 : 0 }}
      transition={{ delay, duration: 0.4, ease: MOTION.CURVES.silk }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.14),
          inset 0 -2px 6px rgba(0,0,0,0.08),
          0 10px 26px rgba(0,0,0,0.18)
        `
      }}
    >
      {/* Top Highlight */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '18%',
        right: '18%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
        pointerEvents: 'none'
      }} />

      <p 
        className="text-[14px] font-medium leading-relaxed text-center"
        style={{ 
          color: 'rgba(255,255,255,0.94)',
          letterSpacing: '-0.012em',
          lineHeight: '1.52'
        }}
      >
        {generateStory()}
      </p>
    </motion.div>
  );
};

// ============================================================================
// 2×2 GRID (Micro-Identity Glows, Subsurface Gradients, Enhanced Bars)
// ============================================================================
const SegmentGrid = ({ segments, delay, onOpenDetail }) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  return (
    <div>
      {/* Section Label */}
      <motion.h3 
        className="text-[11px] font-semibold uppercase tracking-wider mb-4 text-center"
        style={{ color: 'rgba(255,255,255,0.56)', letterSpacing: '0.14em' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay - 0.1, duration: 0.35 }}
      >
        Macro Forces Contribution
      </motion.h3>

      <motion.div
        className="grid grid-cols-2 gap-4 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay, duration: 0.5 }}
      >
        {segments.map((segment, idx) => {
          const insight = SEGMENT_INSIGHTS[segment.name] || {};
          const weight = (segment?.weight || 0) * 100;
          const Icon = OutlineIcons[segment.name] || OutlineIcons.Global;
          const isHovered = hoveredSegment === segment.name;

          return (
            <motion.div
              key={segment.name}
              className="relative cursor-pointer"
              onHoverStart={() => setHoveredSegment(segment.name)}
              onHoverEnd={() => setHoveredSegment(null)}
              onClick={() => onOpenDetail?.(segment)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.09 * idx, duration: 0.38, ease: MOTION.CURVES.silk }}
            >
              <motion.div
                className="relative rounded-[22px] overflow-hidden"
                style={{
                  padding: '20px 18px',
                  background: 'rgba(255, 255, 255, 0.036)',
                  backdropFilter: 'blur(32px) saturate(145%)',
                  WebkitBackdropFilter: 'blur(32px) saturate(145%)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,0.08), 
                    0 4px 12px rgba(0,0,0,0.06),
                    0 0 0 0.5px rgba(255,255,255,0.04)
                  `,
                  minHeight: '168px'
                }}
                animate={{
                  y: isHovered ? -2 : 0,
                  boxShadow: isHovered
                    ? `
                      inset 0 1px 0 rgba(255,255,255,0.12), 
                      0 7px 20px rgba(0,0,0,0.12), 
                      0 0 32px ${insight.color}10,
                      0 0 0 0.5px rgba(255,255,255,0.04)
                    `
                    : `
                      inset 0 1px 0 rgba(255,255,255,0.08), 
                      0 4px 12px rgba(0,0,0,0.06),
                      0 0 0 0.5px rgba(255,255,255,0.04)
                    `,
                  borderColor: isHovered ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.09)'
                }}
                whileHover={{ scale: 1.008 }}
                whileTap={{ scale: 0.995 }}
                transition={{ duration: 0.18, ease: MOTION.CURVES.lift }}
              >
                {/* Top Rim Light */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '20%',
                  right: '20%',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
                  pointerEvents: 'none'
                }} />

                {/* Micro-Identity Glow (Unique per segment) */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: `
                    radial-gradient(ellipse at 50% -35%, ${insight.color}05 0%, transparent 100%),
                    linear-gradient(135deg, ${insight.color}02 0%, transparent 60%)
                  `,
                  borderRadius: '22px',
                  pointerEvents: 'none'
                }} />

                {/* Icon + Title */}
                <div className="flex items-start justify-between mb-2.5">
                  <div className="relative">
                    {/* Icon Halo */}
                    <div style={{
                      position: 'absolute',
                      inset: -4,
                      borderRadius: '14px',
                      background: `radial-gradient(circle, ${insight.color}10 0%, transparent 72%)`,
                      filter: 'blur(8px)',
                      pointerEvents: 'none'
                    }} />
                    
                    <div 
                      className="w-11 h-11 rounded-[14px] flex items-center justify-center relative"
                      style={{
                        background: `${insight.color}07`,
                        border: `1px solid ${insight.color}16`,
                        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 0.5px ${insight.color}06`
                      }}
                    >
                      <Icon style={{ color: insight.color, filter: 'brightness(1.18)' }} />
                    </div>
                  </div>
                  <span className="text-[18px] font-bold" style={{ color: insight.color, filter: 'brightness(1.16)', marginRight: '1px' }}>
                    {Math.round(weight)}%
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-[15px] font-semibold mb-2.5" style={{ color: 'rgba(255,255,255,0.98)', letterSpacing: '-0.01em' }}>
                  {segment.name}
                </h4>

                {/* Summary */}
                <p 
                  className="text-[12px] mb-3"
                  style={{ 
                    color: 'rgba(255,255,255,0.84)',
                    lineHeight: '1.48',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {insight.summary}
                </p>

                {/* Status Badge */}
                <div
                  className="inline-block px-3 py-1.5 rounded-lg text-[10px] font-semibold mb-3.5"
                  style={{
                    background: `${insight.color}09`,
                    border: `1px solid ${insight.color}18`,
                    color: insight.color,
                    letterSpacing: '0.025em',
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06)`
                  }}
                >
                  {insight.trend}
                </div>

                {/* Enhanced Progress Bar (5px thick, subsurface glow baseline) */}
                <div className="relative">
                  <div style={{
                    position: 'absolute',
                    bottom: '-3px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '102%',
                    height: '10px',
                    background: `radial-gradient(ellipse, ${insight.color}07 0%, transparent 82%)`,
                    filter: 'blur(5px)',
                    pointerEvents: 'none'
                  }} />
                  
                  <div 
                    className="w-full h-[5px] rounded-full overflow-hidden" 
                    style={{ background: 'rgba(0,0,0,0.20)' }}
                  >
                    <motion.div
                      className="h-full rounded-full relative"
                      style={{ 
                        background: `linear-gradient(90deg, ${insight.color}98, ${insight.color}f8)`,
                        boxShadow: `0 0 11px ${insight.color}32, inset 0 1px 0 rgba(255,255,255,0.12)`
                      }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${weight}%` }}
                      transition={{ 
                        duration: 0.305, 
                        delay: delay + 0.22 + (idx * 0.09), 
                        ease: [0.25, 0.1, 0, 1.0]
                      }}
                    />
                  </div>
                </div>

                {/* Micro-Glow on Hover */}
                <motion.div
                  className="absolute inset-0 rounded-[22px] pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${insight.color}09 0%, transparent 72%)`,
                    opacity: 0
                  }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

// ============================================================================
// SEGMENT DETAILS ACCORDION (Enhanced Padding, Inner Depth, Luminous Divider)
// ============================================================================
const SegmentDetails = ({ segments, delay, scrollToSegment }) => {
  const [expandedSegment, setExpandedSegment] = useState(null);

  useEffect(() => {
    if (scrollToSegment) {
      setExpandedSegment(scrollToSegment);
    }
  }, [scrollToSegment]);

  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay + 0.3, duration: 0.4 }}
    >
      <h3 className="text-[12px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.58)', letterSpacing: '0.13em' }}>
        Segment Details
      </h3>

      <div className="space-y-2.5">
        {segments.map((segment, idx) => {
          const insight = SEGMENT_INSIGHTS[segment.name] || {};
          const weight = (segment?.weight || 0) * 100;
          const isExpanded = expandedSegment === segment.name;

          return (
            <motion.div
              key={segment.name}
              id={`segment-${segment.name.toLowerCase()}`}
              className="relative rounded-[16px] overflow-hidden cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.035)',
                backdropFilter: 'blur(32px) saturate(142%)',
                WebkitBackdropFilter: 'blur(32px) saturate(142%)',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 3px 10px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(255,255,255,0.03)`
              }}
              onClick={() => setExpandedSegment(isExpanded ? null : segment.name)}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.38 + (idx * 0.06), duration: 0.32 }}
              whileHover={{ 
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.11), 0 5px 14px rgba(0,0,0,0.10), 0 0 26px ${insight.color}07, 0 0 0 0.5px rgba(255,255,255,0.03)`,
                y: -1
              }}
            >
              {/* Collapsed State */}
              <div className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ background: insight.color, boxShadow: `0 0 10px ${insight.color}52` }}
                  />
                  <span className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.96)' }}>
                    {segment.name}
                  </span>
                </div>
                <div className="flex items-center gap-3.5">
                  <span className="text-[14px] font-bold" style={{ color: insight.color, filter: 'brightness(1.12)' }}>
                    {Math.round(weight)}%
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.62)' }} />
                  ) : (
                    <ChevronDown className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.62)' }} />
                  )}
                </div>
              </div>

              {/* Expanded State */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="border-t px-8 py-6"
                    style={{ 
                      borderColor: 'rgba(255,255,255,0.08)',
                      background: `
                        linear-gradient(180deg, rgba(255,255,255,0.022) 0%, rgba(255,255,255,0.015) 100%)
                      `,
                      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06)'
                    }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.24, ease: MOTION.CURVES.silk }}
                  >
                    {/* Luminous Top Divider */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: '14%',
                      right: '14%',
                      height: '0.5px',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
                      filter: 'blur(0.5px)',
                      pointerEvents: 'none'
                    }} />

                    {/* TL;DR Chip */}
                    <div 
                      className="inline-block px-3 py-1.5 rounded-lg text-[10px] font-semibold mb-3.5"
                      style={{
                        background: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'rgba(255,255,255,0.74)',
                        letterSpacing: '0.04em'
                      }}
                    >
                      TL;DR
                    </div>

                    <p className="text-[13px] mb-4" style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.58', maxWidth: '92%' }}>
                      <strong style={{ fontWeight: 600, color: 'rgba(255,255,255,0.98)' }}>
                        {insight.detail.split('.')[0]}.
                      </strong>
                      {insight.detail.substring(insight.detail.indexOf('.') + 1)}
                    </p>

                    <div className="flex items-center gap-3.5 mb-4">
                      <div
                        className="px-3 py-1.5 rounded-lg text-[10px] font-semibold"
                        style={{
                          background: `${insight.color}09`,
                          border: `1px solid ${insight.color}18`,
                          color: insight.color,
                          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06)`
                        }}
                      >
                        {insight.trend}
                      </div>
                      <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.62)' }}>
                        Contribution: {Math.round(weight)}%
                      </span>
                    </div>

                    {/* Animated Bar */}
                    <div className="relative">
                      <div 
                        className="w-full h-[3px] rounded-full overflow-hidden" 
                        style={{ background: 'rgba(0,0,0,0.22)' }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ 
                            background: `linear-gradient(90deg, ${insight.color}94, ${insight.color}f4)`,
                            boxShadow: `0 0 10px ${insight.color}30, inset 0 1px 0 rgba(255,255,255,0.10)`
                          }}
                          initial={{ width: '0%' }}
                          animate={{ width: `${weight}%` }}
                          transition={{ duration: 0.32, ease: MOTION.CURVES.silk }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// ============================================================================
// STICKY BOTTOM PILLS BAR (Rim Light, Enhanced Blur, Micro-Lift + Glow Ring)
// ============================================================================
const BottomPillsBar = ({ segments, onPillClick }) => {
  const [activePill, setActivePill] = useState(null);

  const handlePillClick = (segmentName) => {
    setActivePill(segmentName);
    onPillClick?.(segmentName);
  };

  return (
    <motion.div
      className="sticky bottom-0 left-0 right-0 z-10 relative"
      style={{
        padding: '14px 18px',
        background: 'rgba(18, 20, 28, 0.82)',
        backdropFilter: 'blur(44px) saturate(172%)',
        WebkitBackdropFilter: 'blur(44px) saturate(172%)',
        borderTop: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 -10px 28px rgba(0,0,0,0.24)'
      }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.0, duration: 0.42, ease: MOTION.CURVES.silk }}
    >
      {/* Top Rim Light */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '16%',
        right: '16%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.24), transparent)',
        filter: 'blur(0.8px)',
        pointerEvents: 'none'
      }} />

      <div className="flex items-center justify-around gap-2.5">
        {segments.map((segment) => {
          const insight = SEGMENT_INSIGHTS[segment.name] || {};
          const isActive = activePill === segment.name;

          return (
            <motion.button
              key={segment.name}
              className="flex-1 px-4 py-2.5 rounded-full text-[12px] font-semibold relative"
              style={{
                background: isActive ? `${insight.color}16` : 'rgba(255, 255, 255, 0.048)',
                border: `1px solid ${isActive ? `${insight.color}30` : 'rgba(255,255,255,0.09)'}`,
                color: isActive ? insight.color : 'rgba(255,255,255,0.78)',
                boxShadow: isActive 
                  ? `
                    0 6px 16px ${insight.color}18, 
                    0 0 0 2.5px ${insight.color}14,
                    inset 0 1px 0 rgba(255,255,255,0.10)
                  `
                  : `
                    0 2px 7px rgba(0,0,0,0.10),
                    inset 0 -1px 2px rgba(0,0,0,0.08)
                  `,
                opacity: isActive ? 1 : 0.85
              }}
              onClick={() => handlePillClick(segment.name)}
              animate={{ y: isActive ? -2 : 0 }}
              whileHover={{ scale: 1.05, y: -1, opacity: 1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.16 }}
            >
              {segment.name}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN DRAWER — FULL OS HORIZON TAHOE COMPLIANCE
// ============================================================================
const SentimentDrawer = ({ isOpen, onClose, score, breakdown, onOpenDetail }) => {
  const [scrollToSegment, setScrollToSegment] = useState(null);

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

  const handlePillClick = (segmentName) => {
    setScrollToSegment(segmentName);
    const element = document.getElementById(`segment-${segmentName.toLowerCase()}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        setScrollToSegment(null);
      }, 350);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ paddingTop: '80px' }}
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(26px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.34, ease: MOTION.CURVES.silk }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.70)' }}
          onClick={onClose}
        />

        {/* Drawer Panel */}
        <motion.div
          className="relative w-full max-w-4xl rounded-[32px] overflow-hidden border flex flex-col"
          style={{
            background: `
              linear-gradient(180deg, 
                rgba(18, 20, 28, 0.90) 0%,
                rgba(16, 18, 26, 0.94) 100%
              )
            `,
            backdropFilter: 'blur(64px) saturate(205%)',
            WebkitBackdropFilter: 'blur(64px) saturate(205%)',
            borderColor: 'rgba(255,255,255,0.15)',
            boxShadow: `
              0 38px 76px -18px rgba(0, 0, 0, 0.85),
              0 0 62px rgba(142, 187, 255, 0.10),
              inset 0 1px 0 rgba(255, 255, 255, 0.14),
              inset 0 0 0 1px rgba(255, 255, 255, 0.04)
            `,
            maxHeight: 'calc(100vh - 100px)',
            height: '90vh'
          }}
          initial={{ opacity: 0, scale: 0.93, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 22 }}
          transition={{ duration: 0.30, ease: MOTION.CURVES.silk }}
        >
          {/* Top-Down Ambient Light Gradient (6% brighter at top) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, transparent 45%, rgba(0, 0, 0, 0.025) 100%)',
            pointerEvents: 'none',
            borderRadius: '32px'
          }} />

          {/* Blue-Tinted Atmospheric Fog (Top 20%) */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '20%',
            background: 'linear-gradient(180deg, rgba(142, 187, 255, 0.018) 0%, transparent 100%)',
            pointerEvents: 'none',
            borderRadius: '32px 32px 0 0'
          }} />

          {/* Tahoe Environmental Fog (Ultra-Soft Radial) */}
          <div style={{
            position: 'absolute',
            top: '-12%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '88%',
            height: '75%',
            background: 'radial-gradient(ellipse at 50% 18%, rgba(142, 187, 255, 0.028) 0%, transparent 88%)',
            pointerEvents: 'none',
            borderRadius: '32px'
          }} />

          {/* Faint Bokeh Texture (1% opacity) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 300 300\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'2\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
            backgroundSize: '150px 150px',
            opacity: 0.01,
            mixBlendMode: 'soft-light',
            pointerEvents: 'none',
            borderRadius: '32px'
          }} />

          {/* Top Rim Light */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '14%',
            right: '14%',
            height: '1.5px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)',
            filter: 'blur(1.2px)',
            pointerEvents: 'none'
          }} />

          {/* Header */}
          <div 
            className="relative border-b flex-shrink-0" 
            style={{ 
              borderColor: 'rgba(255,255,255,0.10)',
              padding: '20px 28px 16px 28px',
              background: 'rgba(255, 255, 255, 0.015)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div 
                  className="w-12 h-12 rounded-[14px] border flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'rgba(142, 187, 255, 0.10)',
                    borderColor: 'rgba(142, 187, 255, 0.24)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.13), 0 4px 16px rgba(142, 187, 255, 0.20)'
                  }}
                >
                  <Activity className="w-6 h-6 relative z-10" style={{ color: '#8EBBFF', filter: 'brightness(1.14)' }} strokeWidth={1.7} />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.98)', letterSpacing: '-0.015em' }}>
                    Street Alignment
                  </h2>
                  <p className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.74)' }}>
                    Consensus & Segment Breakdown
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="w-10 h-10 rounded-[14px] flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.10)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)'
                }}
                whileHover={{ scale: 1.07, background: 'rgba(255,255,255,0.15)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.14 }}
              >
                <X className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.82)' }} />
              </motion.button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-8 pt-5 pb-2" style={{ scrollBehavior: 'smooth' }}>
            {/* Orb */}
            <LuminousAlignmentOrb score={consensusScore} />
            
            {/* Metadata (Pulled closer by 6px) */}
            <motion.p
              className="text-[10px] text-center"
              style={{ color: 'rgba(255,255,255,0.50)', marginBottom: '12px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.3 }}
            >
              Based on 5 sources • Updated 2m ago
            </motion.p>

            {/* Floating Summary Chip */}
            <FloatingSummaryChip segments={segments} delay={0.80} />

            {/* 2×2 Grid */}
            <SegmentGrid segments={segments} delay={0.92} onOpenDetail={onOpenDetail} />

            {/* Segment Details */}
            <SegmentDetails segments={segments} delay={1.02} scrollToSegment={scrollToSegment} />
          </div>

          {/* Sticky Bottom Pills Bar */}
          <BottomPillsBar segments={segments} onPillClick={handlePillClick} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(SentimentDrawer);