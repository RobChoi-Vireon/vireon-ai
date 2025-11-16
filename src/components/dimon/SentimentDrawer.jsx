// 🔒 DESIGN LOCKED — OS HORIZON INSIGHT STRATA V1 ARCHITECTURE
// Last Updated: 2025-01-20
// VIREON CERTIFIED — Full 16-Pillar Audit Compliance
// Apple macOS Tahoe + VisionOS Design Language
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
    base: 0.32,
    breathing: 12
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
// ENHANCED LUMINOUS ORB (Increased Glow + Subsurface Atmosphere)
// ============================================================================
const LuminousAlignmentOrb = ({ score }) => {
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const orbRef = useRef(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 85, damping: 24, mass: 0.8 };
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
  const breathingGlow = 0.06 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.DURATIONS.breathing)) * 0.025;

  return (
    <motion.div 
      ref={orbRef}
      className="relative flex items-center justify-center mx-auto mb-2"
      style={{ width: '180px', height: '180px', x: parallaxX, y: parallaxY }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: MOTION.CURVES.silk }}
    >
      {/* Subsurface Tahoe Atmosphere */}
      <div style={{
        position: 'absolute',
        width: '280px',
        height: '280px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}06 0%, ${color}03 40%, transparent 70%)`,
        filter: 'blur(38px)',
        pointerEvents: 'none'
      }} />

      {/* Enhanced Volumetric Halo (9% larger, reduced intensity) */}
      <motion.div
        className="absolute"
        style={{
          width: '340px',
          height: '340px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}${Math.round(breathingGlow * 255).toString(16).padStart(2, '0')} 0%, ${color}04 55%, transparent 78%)`,
          filter: 'blur(48px)',
          pointerEvents: 'none'
        }}
        animate={{ scale: breathingScale * 1.30, opacity: breathingGlow }}
        transition={{ duration: MOTION.DURATIONS.breathing, ease: MOTION.CURVES.breathe }}
      />

      {/* Liquid Glass Orb */}
      <motion.div
        className="absolute"
        style={{
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.03) 100%)',
          backdropFilter: 'blur(32px) saturate(150%)',
          WebkitBackdropFilter: 'blur(32px) saturate(150%)',
          border: '1px solid rgba(255,255,255,0.16)',
          boxShadow: `
            inset 0 2px 16px rgba(255,255,255,0.14),
            inset 0 -2px 12px rgba(0,0,0,0.20),
            0 0 55px ${color}18
          `
        }}
        animate={{ scale: breathingScale }}
        transition={{ duration: MOTION.DURATIONS.breathing, ease: MOTION.CURVES.breathe }}
      >
        {/* Subsurface Lighting */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle at 45% 35%, ${color}10 0%, transparent 70%)`,
          pointerEvents: 'none'
        }} />

        {/* Top Rim Highlight */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.14) 45%, transparent 70%)',
          filter: 'blur(16px)',
          pointerEvents: 'none'
        }} />
      </motion.div>

      {/* Text Stack */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-[10px] font-medium uppercase tracking-widest mb-3"
          style={{ color: 'rgba(255,255,255,0.65)', letterSpacing: '0.16em' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          Alignment
        </motion.span>
        
        <motion.span
          className="text-5xl mb-1.5"
          style={{ 
            color,
            textShadow: `0 0 26px ${color}42, 0 2px 12px rgba(0,0,0,0.30)`,
            filter: 'brightness(1.12) contrast(1.10)',
            letterSpacing: '-0.04em',
            fontWeight: 550
          }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.45, ease: MOTION.CURVES.silk }}
        >
          {score}
        </motion.span>
        
        <motion.div
          className="text-[11px] font-medium"
          style={{ color: 'rgba(255,255,255,0.58)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.35 }}
        >
          Medium Weight
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// FLOATING SUMMARY CHIP (70-75% width, centered, 2-line wrap, floating shadow)
// ============================================================================
const FloatingSummaryChip = ({ segments, delay }) => {
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
      className="relative rounded-xl overflow-hidden mb-4 mx-auto"
      style={{
        padding: '14px 24px',
        maxWidth: '72%',
        background: 'rgba(255, 255, 255, 0.045)',
        backdropFilter: 'blur(32px) saturate(140%)',
        WebkitBackdropFilter: 'blur(32px) saturate(140%)',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 6px 18px rgba(0,0,0,0.12)'
      }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: MOTION.CURVES.silk }}
    >
      {/* Soft Top Rim */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '16%',
        right: '16%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
        pointerEvents: 'none'
      }} />

      <p 
        className="text-[14px] font-medium leading-relaxed text-center"
        style={{ 
          color: 'rgba(255,255,255,0.92)',
          letterSpacing: '-0.01em',
          lineHeight: '1.5'
        }}
      >
        {generateStory()}
      </p>
    </motion.div>
  );
};

// ============================================================================
// 2×2 GRID SYSTEM (Refined with icon halos, thicker bars, subsurface glow)
// ============================================================================
const SegmentGrid = ({ segments, delay, onOpenDetail }) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  return (
    <div>
      {/* Section Label */}
      <motion.h3 
        className="text-[11px] font-semibold uppercase tracking-wider mb-3 text-center"
        style={{ color: 'rgba(255,255,255,0.54)', letterSpacing: '0.12em' }}
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.08 * idx, duration: 0.35, ease: MOTION.CURVES.silk }}
            >
              <motion.div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  padding: '18px 16px',
                  background: 'rgba(255, 255, 255, 0.032)',
                  backdropFilter: 'blur(28px) saturate(140%)',
                  WebkitBackdropFilter: 'blur(28px) saturate(140%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 3px 10px rgba(0,0,0,0.05)',
                  minHeight: '160px'
                }}
                animate={{
                  y: isHovered ? -2 : 0,
                  boxShadow: isHovered
                    ? `inset 0 1px 0 rgba(255,255,255,0.11), 0 6px 18px rgba(0,0,0,0.10), 0 0 28px ${insight.color}08`
                    : 'inset 0 1px 0 rgba(255,255,255,0.07), 0 3px 10px rgba(0,0,0,0.05)',
                  borderColor: isHovered ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)'
                }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.18, ease: MOTION.CURVES.lift }}
              >
                {/* Top Rim */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '18%',
                  right: '18%',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                  pointerEvents: 'none'
                }} />

                {/* Subsurface Tint */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(circle at 50% -30%, ${insight.color}04 0%, transparent 100%)`,
                  borderRadius: '16px',
                  pointerEvents: 'none'
                }} />

                {/* Icon + Title */}
                <div className="flex items-start justify-between mb-2.5">
                  <div className="relative">
                    {/* Icon Halo */}
                    <div style={{
                      position: 'absolute',
                      inset: -3,
                      borderRadius: '12px',
                      background: `radial-gradient(circle, ${insight.color}08 0%, transparent 70%)`,
                      filter: 'blur(6px)',
                      pointerEvents: 'none'
                    }} />
                    
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center relative"
                      style={{
                        background: `${insight.color}06`,
                        border: `1px solid ${insight.color}14`
                      }}
                    >
                      <Icon style={{ color: insight.color, filter: 'brightness(1.16)' }} />
                    </div>
                  </div>
                  <span className="text-[17px] font-bold" style={{ color: insight.color, filter: 'brightness(1.14)', marginRight: '2px' }}>
                    {Math.round(weight)}%
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-[15px] font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.98)' }}>
                  {segment.name}
                </h4>

                {/* Summary */}
                <p 
                  className="text-[12px] mb-3"
                  style={{ 
                    color: 'rgba(255,255,255,0.82)',
                    lineHeight: '1.45',
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
                  className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-semibold mb-3"
                  style={{
                    background: `${insight.color}08`,
                    border: `1px solid ${insight.color}16`,
                    color: insight.color,
                    letterSpacing: '0.02em'
                  }}
                >
                  {insight.trend}
                </div>

                {/* Enhanced Progress Bar (4px thick, subsurface glow) */}
                <div className="relative">
                  <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    height: '8px',
                    background: `radial-gradient(ellipse, ${insight.color}06 0%, transparent 80%)`,
                    filter: 'blur(4px)',
                    pointerEvents: 'none'
                  }} />
                  
                  <div 
                    className="w-full h-[4px] rounded-full overflow-hidden" 
                    style={{ background: 'rgba(0,0,0,0.18)' }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ 
                        background: `linear-gradient(90deg, ${insight.color}95, ${insight.color}f5)`,
                        boxShadow: `0 0 9px ${insight.color}28`
                      }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${weight}%` }}
                      transition={{ 
                        duration: 0.30, 
                        delay: delay + 0.2 + (idx * 0.08), 
                        ease: [0.25, 0.1, 0, 1.0]
                      }}
                    />
                  </div>
                </div>

                {/* Halo Glow on Hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${insight.color}08 0%, transparent 70%)`,
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
// COLLAPSIBLE SEGMENT DETAILS (Enhanced with TL;DR, better padding, matching glass)
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
      <h3 className="text-[12px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.60)', letterSpacing: '0.12em' }}>
        Segment Details
      </h3>

      <div className="space-y-2">
        {segments.map((segment, idx) => {
          const insight = SEGMENT_INSIGHTS[segment.name] || {};
          const weight = (segment?.weight || 0) * 100;
          const isExpanded = expandedSegment === segment.name;

          return (
            <motion.div
              key={segment.name}
              id={`segment-${segment.name.toLowerCase()}`}
              className="relative rounded-xl overflow-hidden cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.032)',
                backdropFilter: 'blur(28px) saturate(140%)',
                WebkitBackdropFilter: 'blur(28px) saturate(140%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 3px 10px rgba(0,0,0,0.05)'
              }}
              onClick={() => setExpandedSegment(isExpanded ? null : segment.name)}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.35 + (idx * 0.05), duration: 0.3 }}
              whileHover={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.09), 0 4px 12px rgba(0,0,0,0.08), 0 0 22px ${insight.color}06` }}
            >
              {/* Collapsed State */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ background: insight.color, boxShadow: `0 0 8px ${insight.color}48` }}
                  />
                  <span className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.96)' }}>
                    {segment.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-bold" style={{ color: insight.color }}>
                    {Math.round(weight)}%
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.58)' }} />
                  ) : (
                    <ChevronDown className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.58)' }} />
                  )}
                </div>
              </div>

              {/* Expanded State */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="border-t px-7 py-5"
                    style={{ 
                      borderColor: 'rgba(255,255,255,0.07)',
                      background: 'rgba(255, 255, 255, 0.020)'
                    }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: MOTION.CURVES.silk }}
                  >
                    {/* TL;DR Pill */}
                    <div 
                      className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-semibold mb-3"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.10)',
                        color: 'rgba(255,255,255,0.70)',
                        letterSpacing: '0.03em'
                      }}
                    >
                      TL;DR
                    </div>

                    <p className="text-[13px] mb-4" style={{ color: 'rgba(255,255,255,0.88)', lineHeight: '1.55', maxWidth: '90%' }}>
                      <strong style={{ fontWeight: 600, color: 'rgba(255,255,255,0.98)' }}>
                        {insight.detail.split('.')[0]}.
                      </strong>
                      {insight.detail.substring(insight.detail.indexOf('.') + 1)}
                    </p>

                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="px-2.5 py-1 rounded-lg text-[10px] font-semibold"
                        style={{
                          background: `${insight.color}08`,
                          border: `1px solid ${insight.color}16`,
                          color: insight.color
                        }}
                      >
                        {insight.trend}
                      </div>
                      <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.58)' }}>
                        Contribution: {Math.round(weight)}%
                      </span>
                    </div>

                    {/* Animated Bar */}
                    <div className="relative">
                      <div 
                        className="w-full h-[2.5px] rounded-full overflow-hidden" 
                        style={{ background: 'rgba(0,0,0,0.20)' }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ 
                            background: `linear-gradient(90deg, ${insight.color}92, ${insight.color}f2)`,
                            boxShadow: `0 0 8px ${insight.color}28`
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
// STICKY BOTTOM PILLS BAR (Enhanced with rim light, micro-lift, glow ring)
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
        padding: '12px 16px',
        background: 'rgba(18, 20, 28, 0.78)',
        backdropFilter: 'blur(38px) saturate(165%)',
        WebkitBackdropFilter: 'blur(38px) saturate(165%)',
        borderTop: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 -8px 24px rgba(0,0,0,0.20)'
      }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.0, duration: 0.4, ease: MOTION.CURVES.silk }}
    >
      {/* Top Rim Light */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '14%',
        right: '14%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)',
        pointerEvents: 'none'
      }} />

      <div className="flex items-center justify-around gap-2">
        {segments.map((segment) => {
          const insight = SEGMENT_INSIGHTS[segment.name] || {};
          const isActive = activePill === segment.name;

          return (
            <motion.button
              key={segment.name}
              className="flex-1 px-4 py-2.5 rounded-full text-[12px] font-semibold relative"
              style={{
                background: isActive ? `${insight.color}14` : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${isActive ? `${insight.color}28` : 'rgba(255,255,255,0.08)'}`,
                color: isActive ? insight.color : 'rgba(255,255,255,0.82)',
                boxShadow: isActive 
                  ? `0 4px 12px ${insight.color}16, 0 0 0 2px ${insight.color}12`
                  : '0 2px 6px rgba(0,0,0,0.08)'
              }}
              onClick={() => handlePillClick(segment.name)}
              animate={{ y: isActive ? -2 : 0 }}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
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
// MAIN DRAWER — FULL OS HORIZON 16-PILLAR COMPLIANCE
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
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ paddingTop: '80px' }}
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.32, ease: MOTION.CURVES.silk }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.68)' }}
          onClick={onClose}
        />

        {/* Drawer Panel */}
        <motion.div
          className="relative w-full max-w-4xl rounded-[32px] overflow-hidden border flex flex-col"
          style={{
            background: `
              linear-gradient(180deg, 
                rgba(18, 20, 28, 0.88) 0%,
                rgba(16, 18, 26, 0.92) 100%
              )
            `,
            backdropFilter: 'blur(56px) saturate(195%)',
            WebkitBackdropFilter: 'blur(56px) saturate(195%)',
            borderColor: 'rgba(255,255,255,0.14)',
            boxShadow: `
              0 36px 72px -16px rgba(0, 0, 0, 0.82),
              0 0 55px rgba(142, 187, 255, 0.09),
              inset 0 1px 0 rgba(255, 255, 255, 0.13),
              inset 0 0 0 1px rgba(255, 255, 255, 0.03)
            `,
            maxHeight: 'calc(100vh - 100px)',
            height: '90vh'
          }}
          initial={{ opacity: 0, scale: 0.94, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.28, ease: MOTION.CURVES.silk }}
        >
          {/* Unified Atmospheric Gradient */}
          <div style={{
            position: 'absolute',
            top: '-15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '85%',
            height: '70%',
            background: 'radial-gradient(ellipse at 50% 15%, rgba(142, 187, 255, 0.025) 0%, transparent 85%)',
            pointerEvents: 'none',
            borderRadius: '32px'
          }} />

          {/* Vertical Light Gradient */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, transparent 50%, rgba(0, 0, 0, 0.02) 100%)',
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
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.26), transparent)',
            filter: 'blur(1px)',
            pointerEvents: 'none'
          }} />

          {/* Header */}
          <div 
            className="relative border-b flex-shrink-0" 
            style={{ 
              borderColor: 'rgba(255,255,255,0.09)',
              padding: '20px 28px 16px 28px',
              background: 'rgba(255, 255, 255, 0.012)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div 
                  className="w-12 h-12 rounded-xl border flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'rgba(142, 187, 255, 0.09)',
                    borderColor: 'rgba(142, 187, 255, 0.22)',
                    backdropFilter: 'blur(18px)',
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.12), 0 3px 14px rgba(142, 187, 255, 0.18)'
                  }}
                >
                  <Activity className="w-6 h-6 relative z-10" style={{ color: '#8EBBFF', filter: 'brightness(1.12)' }} strokeWidth={1.7} />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.98)' }}>
                    Street Alignment
                  </h2>
                  <p className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>
                    Consensus & Segment Breakdown
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.09)',
                  border: '1px solid rgba(255,255,255,0.11)'
                }}
                whileHover={{ scale: 1.06, background: 'rgba(255,255,255,0.14)' }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.12 }}
              >
                <X className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.80)' }} />
              </motion.button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-8 pt-4 pb-2" style={{ scrollBehavior: 'smooth' }}>
            {/* Orb */}
            <LuminousAlignmentOrb score={consensusScore} />
            
            {/* Metadata (Pulled closer by 4px) */}
            <motion.p
              className="text-[11px] text-center"
              style={{ color: 'rgba(255,255,255,0.52)', marginBottom: '14px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              Based on 5 sources • Updated 2m ago
            </motion.p>

            {/* Floating Summary Chip */}
            <FloatingSummaryChip segments={segments} delay={0.75} />

            {/* 2×2 Grid */}
            <SegmentGrid segments={segments} delay={0.85} onOpenDetail={onOpenDetail} />

            {/* Segment Details */}
            <SegmentDetails segments={segments} delay={0.95} scrollToSegment={scrollToSegment} />
          </div>

          {/* Sticky Bottom Pills Bar */}
          <BottomPillsBar segments={segments} onPillClick={handlePillClick} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(SentimentDrawer);