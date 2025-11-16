// 🔒 DESIGN LOCKED — OS HORIZON INSIGHT STRATA V2 ARCHITECTURE
// Last Updated: 2025-01-20
// VIREON CERTIFIED — Above-the-Fold Intelligence Panel
// Apple macOS Tahoe + VisionOS Design Language
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
    expand: 0.18,
    slow: 0.18,
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

// Category Colors (matching ConsensusMeter)
const CATEGORY_COLORS = {
  'Policy': { accent: 'rgba(242, 106, 106, 0.50)', glow: 'rgba(242, 106, 106, 0.15)', dot: '#F26A6A', tint: 'rgba(242, 106, 106, 0.02)' },
  'Credit': { accent: 'rgba(94, 167, 255, 0.50)', glow: 'rgba(94, 167, 255, 0.15)', dot: '#5EA7FF', tint: 'rgba(94, 167, 255, 0.02)' },
  'Equities': { accent: 'rgba(43, 198, 134, 0.50)', glow: 'rgba(43, 198, 134, 0.15)', dot: '#2BC686', tint: 'rgba(43, 198, 134, 0.02)' },
  'Global': { accent: 'rgba(255, 176, 32, 0.50)', glow: 'rgba(255, 176, 32, 0.15)', dot: '#FFB020', tint: 'rgba(255, 176, 32, 0.02)' }
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
// LUMINOUS ALIGNMENT ORB (Compact)
// ============================================================================
const LuminousAlignmentOrb = ({ score }) => {
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

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

  const breathingScale = 1 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.DURATIONS.breathing)) * 0.009;
  const breathingOpacity = 0.04 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.DURATIONS.breathing)) * 0.018;
  const crescentRotation = breathingPhase * 0.5;

  return (
    <motion.div 
      className="relative flex items-center justify-center mx-auto mb-4"
      style={{
        width: '160px',
        height: '160px'
      }}
    >
      {/* Volumetric Halo */}
      <motion.div
        className="absolute"
        style={{
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}12 0%, ${color}06 45%, transparent 72%)`,
          filter: 'blur(32px)',
          pointerEvents: 'none'
        }}
        animate={{
          opacity: breathingOpacity + 0.05,
          scale: breathingScale * 1.18
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
          width: '160px',
          height: '160px',
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
          filter: 'blur(18px)',
          pointerEvents: 'none'
        }}
        animate={{
          scale: breathingScale * 1.10,
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
          width: '128px',
          height: '128px',
          borderRadius: '50%',
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.09) 0%, 
              rgba(255, 255, 255, 0.03) 100%
            )
          `,
          backdropFilter: 'blur(24px) saturate(140%)',
          WebkitBackdropFilter: 'blur(24px) saturate(140%)',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: `
            inset 0 2px 12px rgba(255,255,255,0.12),
            inset 0 -2px 8px rgba(0,0,0,0.18),
            0 0 35px ${color}14
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
          top: '8px',
          left: '8px',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 32% 32%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.12) 42%, transparent 68%)',
          filter: 'blur(12px)',
          pointerEvents: 'none'
        }} />
      </motion.div>

      {/* Text Stack */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-[10px] font-medium uppercase tracking-wide mb-3"
          style={{ 
            color: 'rgba(255,255,255,0.68)',
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
            color,
            textShadow: `0 0 18px ${color}36, 0 2px 8px rgba(0,0,0,0.24)`,
            filter: 'brightness(1.10) contrast(1.08)',
            letterSpacing: '-0.04em'
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
          <div className="text-[14px] font-semibold" style={{ color: 'rgba(255,255,255,0.98)' }}>
            {label}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// DISTILLED INSIGHT CHIP (Compact Capsule)
// ============================================================================
const InsightChip = ({ segments }) => {
  const generateInsight = () => {
    const hasPolicyRising = segments.find(s => s.name === 'Policy')?.trend === '+';
    const hasCreditStress = segments.find(s => s.name === 'Credit')?.stress_level === 'high';
    
    if (hasPolicyRising && hasCreditStress) {
      return "Mild upward pressure from policy tightening and early credit stress.";
    }
    return "Mixed sentiment across policy, credit, and global conditions.";
  };

  return (
    <motion.div
      className="relative inline-flex mx-auto mb-5"
      style={{
        padding: '10px 20px',
        borderRadius: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(24px) saturate(130%)',
        WebkitBackdropFilter: 'blur(24px) saturate(130%)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 10px rgba(0,0,0,0.06), 0 0 20px rgba(142, 187, 255, 0.04)'
      }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.32, ease: MOTION.CURVES.primary }}
    >
      {/* Subsurface Glow */}
      <div style={{
        position: 'absolute',
        inset: '-8px',
        borderRadius: '28px',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(142, 187, 255, 0.08) 0%, transparent 70%)',
        filter: 'blur(12px)',
        pointerEvents: 'none'
      }} />

      <p 
        className="text-[13px] font-medium text-center relative z-10"
        style={{ 
          color: 'rgba(255,255,255,0.92)',
          letterSpacing: '-0.006em',
          lineHeight: '1.4'
        }}
      >
        {generateInsight()}
      </p>
    </motion.div>
  );
};

// ============================================================================
// CATEGORY PILL (2×2 Grid Item - Matches ConsensusMeter)
// ============================================================================
const CategoryPill = ({ segment, delay, onOpenDetail }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const colors = CATEGORY_COLORS[segment.name] || { 
    accent: 'rgba(170, 177, 184, 0.50)', 
    glow: 'rgba(170, 177, 184, 0.15)', 
    dot: '#AAB1B8',
    tint: 'rgba(170, 177, 184, 0.02)'
  };
  
  const value = (segment.weight || 0) * 100;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.28, ease: MOTION.CURVES.secondary }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onOpenDetail?.(segment)}
    >
      <motion.div
        className="px-3.5 py-2 rounded-xl flex items-center gap-2 relative overflow-hidden cursor-pointer"
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(21px)',
          WebkitBackdropFilter: 'blur(21px)',
          border: '1px solid rgba(255, 255, 255, 0.085)',
          boxShadow: `
            inset 0 1px 2px rgba(255, 255, 255, 0.095),
            inset 0 0 7px ${colors.glow}18,
            0 2px 6px rgba(0, 0, 0, 0.04)
          `
        }}
        animate={{
          y: isHovered ? -1.5 : 0,
          background: isHovered ? 'rgba(255, 255, 255, 0.065)' : 'rgba(255, 255, 255, 0.04)',
          backdropFilter: isHovered ? 'blur(23px)' : 'blur(21px)',
          boxShadow: isHovered
            ? `
              inset 0 1px 2px rgba(255, 255, 255, 0.095),
              inset 0 0 12px ${colors.glow}35,
              0 5px 14px rgba(0, 0, 0, 0.08)
            `
            : `
              inset 0 1px 2px rgba(255, 255, 255, 0.095),
              inset 0 0 7px ${colors.glow}18,
              0 2px 6px rgba(0, 0, 0, 0.04)
            `
        }}
        transition={{
          duration: 0.11,
          ease: MOTION.CURVES.secondary
        }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{
            background: colors.dot,
            boxShadow: `0 0 10px ${colors.glow}, inset 0 0 3px rgba(255,255,255,0.35)`
          }}
        />

        <span 
          className="text-[11px] font-medium" 
          style={{ 
            color: 'rgba(255,255,255,0.75)',
            letterSpacing: '0.01em'
          }}
        >
          {segment.name}
        </span>

        <span 
          className="text-[12px] font-bold ml-1" 
          style={{ color: colors.dot }}
        >
          {Math.round(value)}%
        </span>

        {/* Moving highlight (left → right) */}
        {isHovered && !shouldReduceMotion && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${colors.accent} 50%, transparent 100%)`,
              opacity: 0
            }}
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 0.05, 0]
            }}
            transition={{
              duration: 1,
              ease: 'linear'
            }}
          />
        )}

        {/* Refraction shimmer */}
        {isHovered && !shouldReduceMotion && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              background: `linear-gradient(120deg, transparent 0%, ${colors.accent} 50%, transparent 100%)`,
              opacity: 0
            }}
            animate={{
              x: ['-150%', '150%'],
              opacity: [0, 0.15, 0]
            }}
            transition={{
              duration: 0.9,
              ease: 'easeOut',
              delay: 0.1
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// SEGMENT DETAIL OVERLAY
// ============================================================================
const SegmentDetailOverlay = ({ segment, onClose }) => {
  if (!segment) return null;

  const colors = CATEGORY_COLORS[segment.name] || { 
    accent: 'rgba(170, 177, 184, 0.50)', 
    glow: 'rgba(170, 177, 184, 0.15)', 
    dot: '#AAB1B8',
    tint: 'rgba(170, 177, 184, 0.02)'
  };
  
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
          style={{ background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(6px)' }}
        />

        {/* Detail Card */}
        <motion.div
          className="relative rounded-3xl overflow-hidden max-w-lg w-full"
          style={{
            background: 'rgba(18, 20, 28, 0.88)',
            backdropFilter: 'blur(42px) saturate(160%)',
            WebkitBackdropFilter: 'blur(42px) saturate(160%)',
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: `
              0 24px 56px -12px rgba(0, 0, 0, 0.72),
              0 0 40px ${colors.glow}35,
              inset 0 1px 0 rgba(255, 255, 255, 0.12)
            `,
            padding: '28px 32px'
          }}
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.18, ease: MOTION.CURVES.expand }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Rim */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '12%',
            right: '12%',
            height: '1.5px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
            filter: 'blur(0.5px)',
            pointerEvents: 'none'
          }} />

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: `${colors.dot}08`,
                border: `1px solid ${colors.dot}18`,
                boxShadow: `0 0 16px ${colors.glow}45`
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: colors.dot,
                  boxShadow: `0 0 12px ${colors.glow}, inset 0 0 4px rgba(255,255,255,0.4)`
                }}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: 'rgba(255,255,255,0.98)' }}>
                {segment.name}
              </h3>
              <p className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.64)' }}>
                Detailed Analysis
              </p>
            </div>
          </div>

          {/* Divider */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
            margin: '16px 0 20px 0'
          }} />

          {/* Detail Text */}
          <p 
            className="text-[14px] leading-relaxed mb-6"
            style={{ 
              color: 'rgba(255,255,255,0.90)',
              letterSpacing: '-0.006em',
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
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.10)',
              color: 'rgba(255,255,255,0.88)'
            }}
            whileHover={{ background: 'rgba(255,255,255,0.12)' }}
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
// BOTTOM NAV ROW (4-Segment Trajectory)
// ============================================================================
const BottomNavRow = ({ segments, delay }) => {
  const getIconColor = (n) => {
    const colors = CATEGORY_COLORS[n];
    return colors ? colors.dot : '#A8B1BA';
  };

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.028)',
        backdropFilter: 'blur(24px) saturate(132%)',
        WebkitBackdropFilter: 'blur(24px) saturate(132%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 10px rgba(0,0,0,0.04)',
        padding: '16px 20px'
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.32, ease: MOTION.CURVES.primary }}
    >
      {/* Top Rim */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
        pointerEvents: 'none'
      }} />

      <div className="flex items-center justify-between gap-3">
        {segments.map((segment, idx) => {
          const iconColor = getIconColor(segment.name);
          const weight = (segment?.weight || 0) * 100;

          return (
            <div key={segment.name} className="flex-1">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div 
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: iconColor,
                    boxShadow: `0 0 8px ${iconColor}60`
                  }}
                />
                <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.84)' }}>
                  {segment.name}
                </span>
              </div>

              <div className="relative">
                <div 
                  className="w-full h-[2.5px] rounded-full overflow-hidden relative" 
                  style={{ background: 'rgba(0,0,0,0.16)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ 
                      background: `linear-gradient(90deg, ${iconColor}88, ${iconColor}e8)`,
                      boxShadow: `0 0 5px ${iconColor}20`
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${weight}%` }}
                    transition={{ 
                      duration: 0.10, 
                      delay: delay + 0.12 + (idx * 0.025), 
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
// MAIN DRAWER — INSIGHT STRATA V2 (ABOVE-THE-FOLD)
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

  const orderedSegments = ['Policy', 'Credit', 'Equities', 'Global'].map(name => 
    segments.find(s => s.name === name)
  ).filter(Boolean);

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
        animate={{ opacity: 1, backdropFilter: 'blur(18px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.26, ease: MOTION.CURVES.primary }}
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.62)' }}
          onClick={!activeOverlay ? onClose : undefined}
        />

        {/* Drawer Panel */}
        <motion.div
          className="relative w-full max-w-4xl rounded-[32px] overflow-hidden border"
          style={{
            background: `
              linear-gradient(180deg, 
                rgba(18, 20, 28, 0.84) 0%,
                rgba(17, 19, 27, 0.88) 100%
              )
            `,
            backdropFilter: 'blur(44px) saturate(175%)',
            WebkitBackdropFilter: 'blur(44px) saturate(175%)',
            borderColor: 'rgba(255,255,255,0.12)',
            boxShadow: `
              0 28px 60px -12px rgba(0, 0, 0, 0.76),
              0 0 40px rgba(142, 187, 255, 0.06),
              inset 0 1px 0 rgba(255, 255, 255, 0.10),
              inset 0 0 0 1px rgba(255, 255, 255, 0.024)
            `,
            maxHeight: 'calc(100vh - 100px)'
          }}
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 14 }}
          transition={{ duration: 0.22, ease: MOTION.CURVES.primary }}
        >
          {/* Gradient Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '65%',
            height: '50%',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(142, 187, 255, 0.018) 0%, transparent 70%)',
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
            filter: 'blur(0.6px)',
            pointerEvents: 'none'
          }} />

          {/* Header */}
          <div 
            className="relative border-b" 
            style={{ 
              borderColor: 'rgba(255,255,255,0.08)',
              padding: '22px 28px 18px 28px',
              background: 'rgba(255, 255, 255, 0.008)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div 
                  className="w-12 h-12 rounded-xl border flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'rgba(142, 187, 255, 0.08)',
                    borderColor: 'rgba(142, 187, 255, 0.18)',
                    backdropFilter: 'blur(14px)',
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.09), 0 2px 10px rgba(142, 187, 255, 0.14)'
                  }}
                >
                  <Activity className="w-6 h-6 relative z-10" style={{ color: '#8EBBFF', filter: 'brightness(1.10)' }} strokeWidth={1.6} />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.98)' }}>
                    Street Alignment
                  </h2>
                  <p className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.74)' }}>
                    Consensus & Segment Breakdown
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.09)'
                }}
                whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.12)' }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: MOTION.DURATIONS.fast }}
              >
                <X className="w-4.5 h-4.5" style={{ color: 'rgba(255,255,255,0.76)' }} />
              </motion.button>
            </div>
          </div>

          {/* Body (Above-the-Fold) */}
          <div className="px-8 pt-5 pb-6">
            {/* Orb */}
            <LuminousAlignmentOrb score={consensusScore} />
            
            {/* Metadata */}
            <motion.p
              className="text-[10px] text-center mb-3"
              style={{ color: 'rgba(255,255,255,0.50)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.28 }}
            >
              Based on 5 sources • Updated 2m ago
            </motion.p>

            {/* Insight Chip */}
            <div className="flex justify-center mb-6">
              <InsightChip segments={segments} />
            </div>

            {/* 2×2 Pill Grid: Policy/Credit | Equities/Global */}
            <div className="flex justify-center mb-5">
              <div className="grid grid-cols-2 gap-x-3 gap-y-3 w-auto">
                {orderedSegments.map((segment, idx) => (
                  <CategoryPill 
                    key={segment.name} 
                    segment={segment} 
                    delay={0.65 + (idx * 0.05)} 
                    onOpenDetail={handleSegmentClick} 
                  />
                ))}
              </div>
            </div>

            {/* Bottom Nav Row */}
            <BottomNavRow segments={orderedSegments} delay={0.92} />
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