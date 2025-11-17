// 🔒 DESIGN LOCKED — OS HORIZON TAHOE V5.1 STREET ALIGNMENT REFINEMENT
// Last Updated: 2025-01-20
// VIREON CERTIFIED — OS Horizon Liquid Glass 4.0 + Cinematic Intelligence
// Full Apple-grade rebuild with atmospheric lightfield and asymmetric tiles
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Shield, Briefcase, BarChart3, Globe } from 'lucide-react';

// OS Horizon Motion DNA
const MOTION = {
  CURVES: {
    easeOutQuint: [0.22, 1, 0.36, 1],
    silk: [0.25, 0.1, 0, 1.0],
    spring: [0.22, 0.61, 0.36, 1]
  },
  DURATIONS: {
    drawerEntry: 0.42,
    orbArrival: 0.35,
    cardStagger: 0.05,
    breathe: 6.8
  }
};

// Segment Icon Map
const SEGMENT_ICONS = {
  Policy: Shield,
  Credit: Briefcase,
  Equities: BarChart3,
  Global: Globe
};

// Segment Theme Colors
const SEGMENT_THEMES = {
  Policy: { color: '#70A8E8', glow: 'rgba(112, 168, 232, 0.12)' },
  Credit: { color: '#B88AED', glow: 'rgba(184, 138, 237, 0.12)' },
  Equities: { color: '#32C288', glow: 'rgba(50, 194, 136, 0.12)' },
  Global: { color: '#EDB859', glow: 'rgba(237, 184, 89, 0.12)' }
};

// ============================================================================
// OS HORIZON 2.0 ALIGNMENT ORB (Multi-Layered Living Orb)
// ============================================================================
const AlignmentOrb = ({ score, delay }) => {
  const [breathingPhase, setBreathingPhase] = useState(0);

  useEffect(() => {
    let rafId, startTime = Date.now();
    const animate = () => {
      setBreathingPhase((Date.now() - startTime) / 1000);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => rafId && cancelAnimationFrame(rafId);
  }, []);

  const breathingScale = 1 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.DURATIONS.breathe)) * 0.015;

  const getZoneColor = (s) => {
    if (s < 40) return '#E86565';
    if (s < 70) return '#70A8E8';
    return '#32C288';
  };

  const color = getZoneColor(score);

  return (
    <motion.div
      className="relative flex items-center justify-center mx-auto mb-8"
      style={{ width: '168px', height: '168px' }}
      initial={{ opacity: 0, scale: 0.88, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: delay + 0.08, duration: MOTION.DURATIONS.orbArrival, ease: MOTION.CURVES.easeOutQuint }}
    >
      {/* Outer Glow Diffusion */}
      <motion.div
        className="absolute"
        style={{
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(120,160,255,0.10) 0%, transparent 72%)`,
          filter: 'blur(48px)',
          pointerEvents: 'none'
        }}
        animate={{ scale: breathingScale * 1.15 }}
        transition={{ duration: MOTION.DURATIONS.breathe, ease: 'easeInOut' }}
      />

      {/* Inner Glow */}
      <div style={{
        position: 'absolute',
        width: '190px',
        height: '190px',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(140,160,255,0.20) 0%, transparent 68%)`,
        filter: 'blur(32px)',
        pointerEvents: 'none'
      }} />

      {/* Glass Orb */}
      <motion.div
        className="absolute"
        style={{
          width: '168px',
          height: '168px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.06) 100%)',
          backdropFilter: 'blur(36px) saturate(160%)',
          WebkitBackdropFilter: 'blur(36px) saturate(160%)',
          border: '1px solid rgba(255,255,255,0.20)',
          boxShadow: `
            inset 0 2px 22px rgba(255,255,255,0.18),
            inset 0 -2px 16px rgba(0,0,0,0.25),
            0 12px 48px rgba(120,160,255,0.20)
          `
        }}
        animate={{ scale: breathingScale }}
        transition={{ duration: MOTION.DURATIONS.breathe, ease: 'easeInOut' }}
      >
        {/* Top Rim Highlight */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.18) 42%, transparent 70%)',
          filter: 'blur(18px)',
          pointerEvents: 'none'
        }} />
      </motion.div>

      {/* Text Stack */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-[11px] font-medium uppercase tracking-widest mb-2"
          style={{ color: 'rgba(255,255,255,0.68)', letterSpacing: '0.16em' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.25, duration: 0.3 }}
        >
          Alignment
        </motion.span>
        
        <motion.span
          style={{ 
            fontSize: '42px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.95)',
            textShadow: `0 0 28px ${color}42, 0 2px 12px rgba(0,0,0,0.30)`,
            letterSpacing: '-0.04em',
            marginBottom: '4px'
          }}
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.35, duration: 0.4, ease: MOTION.CURVES.easeOutQuint }}
        >
          {score}
        </motion.span>
        
        <motion.div
          className="text-[14px] font-medium"
          style={{ color: 'rgba(255,255,255,0.58)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.55, duration: 0.25 }}
        >
          Medium Weight
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// FLOATING GLASS CAPSULE (Intelligence Insight)
// ============================================================================
const InsightCapsule = ({ segments, delay }) => {
  return (
    <motion.div
      className="relative rounded-[22px] overflow-hidden mx-auto mb-10"
      style={{
        maxWidth: '82%',
        padding: '18px 26px',
        background: 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(22px) saturate(155%)',
        WebkitBackdropFilter: 'blur(22px) saturate(155%)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.14),
          0 4px 32px rgba(0,0,0,0.35)
        `
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.35, ease: MOTION.CURVES.silk }}
      whileHover={{ 
        y: -2,
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.18),
          0 6px 38px rgba(0,0,0,0.42)
        `,
        transition: { duration: 0.15 }
      }}
    >
      <p 
        className="text-center"
        style={{ 
          fontSize: '15.5px',
          lineHeight: '1.55',
          color: 'rgba(255,255,255,0.85)',
          letterSpacing: '-0.008em'
        }}
      >
        Markets show mild upward pressure driven by policy tightening and early credit stress signals.
      </p>
    </motion.div>
  );
};

// ============================================================================
// ASYMMETRIC CINEMATIC TILES (Macro Forces Contribution)
// ============================================================================
const MacroForcesTiles = ({ segments, delay, onOpenDetail }) => {
  const tiles = [
    { segment: segments.find(s => s.name === 'Policy'), height: '152px' },
    { segment: segments.find(s => s.name === 'Credit'), height: '152px' },
    { segment: segments.find(s => s.name === 'Equities'), height: '128px' },
    { segment: segments.find(s => s.name === 'Global'), height: '128px' }
  ];

  return (
    <div>
      <motion.h3 
        className="text-[12px] font-semibold uppercase tracking-wider mb-5 text-center"
        style={{ color: 'rgba(255,255,255,0.52)', letterSpacing: '0.13em' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay - 0.05, duration: 0.3 }}
      >
        Macro Forces Contribution
      </motion.h3>

      <div className="grid grid-cols-2 gap-5 mb-8">
        {tiles.map((tile, idx) => {
          if (!tile.segment) return null;
          const theme = SEGMENT_THEMES[tile.segment.name];
          const Icon = SEGMENT_ICONS[tile.segment.name];
          const weight = (tile.segment?.weight || 0) * 100;

          return (
            <motion.div
              key={tile.segment.name}
              className="relative rounded-[20px] overflow-hidden cursor-pointer"
              style={{
                height: tile.height,
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(24px) saturate(148%)',
                WebkitBackdropFilter: 'blur(24px) saturate(148%)',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '22px 26px',
                boxShadow: '0 8px 38px rgba(0,0,0,0.38)'
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: delay + (idx * MOTION.DURATIONS.cardStagger), 
                duration: 0.32, 
                ease: MOTION.CURVES.spring 
              }}
              onClick={() => onOpenDetail?.(tile.segment)}
              whileHover={{ 
                y: -3,
                boxShadow: `0 12px 46px rgba(0,0,0,0.45), 0 0 32px ${theme.glow}`,
                borderColor: 'rgba(255,255,255,0.10)',
                transition: { duration: 0.18 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Micro-Identity Glow */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `
                  radial-gradient(ellipse at 50% -30%, ${theme.glow} 0%, transparent 100%),
                  linear-gradient(135deg, ${theme.glow}08 0%, transparent 65%)
                `,
                borderRadius: '20px',
                pointerEvents: 'none'
              }} />

              {/* Icon */}
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="w-11 h-11 rounded-[14px] flex items-center justify-center relative"
                  style={{
                    background: `${theme.color}08`,
                    border: `1px solid ${theme.color}18`,
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 0.5px ${theme.color}06`
                  }}
                >
                  <Icon style={{ color: theme.color, filter: 'brightness(1.16)' }} className="w-5 h-5" strokeWidth={2} />
                </div>
                <span className="text-[19px] font-bold" style={{ color: theme.color, filter: 'brightness(1.14)' }}>
                  {Math.round(weight)}%
                </span>
              </div>

              {/* Title */}
              <h4 className="text-[16px] font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.008em' }}>
                {tile.segment.name}
              </h4>

              {/* Trend Badge */}
              <div
                className="inline-block px-3 py-1.5 rounded-lg text-[11px] font-semibold"
                style={{
                  background: `${theme.color}09`,
                  border: `1px solid ${theme.color}18`,
                  color: theme.color,
                  letterSpacing: '0.02em',
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06)`
                }}
              >
                {tile.segment.name === 'Policy' ? 'Rising' : tile.segment.name === 'Credit' ? 'Moderate' : tile.segment.name === 'Equities' ? 'Moderate' : 'Softening'}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// INTERACTIVE OS-LEVEL SEGMENT LIST
// ============================================================================
const SegmentDetailsList = ({ segments, delay, onOpenDetail }) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay + 0.25, duration: 0.35 }}
    >
      <h3 className="text-[12px] font-semibold uppercase tracking-wider mb-5" style={{ color: 'rgba(255,255,255,0.50)', letterSpacing: '0.12em' }}>
        Segment Details
      </h3>

      <div className="space-y-3">
        {segments.map((segment, idx) => {
          const theme = SEGMENT_THEMES[segment.name];
          const Icon = SEGMENT_ICONS[segment.name];
          const weight = (segment?.weight || 0) * 100;
          const isHovered = hoveredSegment === segment.name;

          return (
            <motion.div
              key={segment.name}
              className="relative rounded-[18px] overflow-hidden cursor-pointer"
              style={{
                height: '66px',
                background: 'rgba(255, 255, 255, 0.035)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.05)',
                padding: '0 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.28 + (idx * 0.045), duration: 0.28 }}
              onClick={() => onOpenDetail?.(segment)}
              onHoverStart={() => setHoveredSegment(segment.name)}
              onHoverEnd={() => setHoveredSegment(null)}
              whileHover={{ 
                y: -2,
                background: 'rgba(255, 255, 255, 0.055)',
                borderColor: 'rgba(255,255,255,0.10)',
                boxShadow: `0 6px 24px rgba(0,0,0,0.28), 0 0 28px ${theme.glow}`,
                transition: { duration: 0.15 }
              }}
              whileTap={{ 
                scale: 0.985,
                boxShadow: `0 3px 16px rgba(0,0,0,0.35), 0 0 18px ${theme.glow}`,
                transition: { duration: 0.08 }
              }}
            >
              {/* Icon Glow Effect */}
              {isHovered && (
                <div style={{
                  position: 'absolute',
                  left: '18px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
                  filter: 'blur(14px)',
                  pointerEvents: 'none'
                }} />
              )}

              <div className="flex items-center gap-3.5">
                <div 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: theme.color, boxShadow: `0 0 12px ${theme.color}58` }}
                />
                <Icon className="w-4.5 h-4.5" style={{ color: theme.color }} strokeWidth={2} />
                <span className="text-[15px] font-semibold" style={{ color: 'rgba(255,255,255,0.82)' }}>
                  {segment.name}
                </span>
              </div>

              <span className="text-[16px] font-bold" style={{ color: 'rgba(255,255,255,0.40)' }}>
                {Math.round(weight)}%
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN STREET ALIGNMENT DRAWER
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
        animate={{ opacity: 1, backdropFilter: 'blur(18px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.32, ease: MOTION.CURVES.silk }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.72)' }}
          onClick={onClose}
        />

        {/* Drawer Panel */}
        <motion.div
          className="relative w-full max-w-4xl rounded-[32px] overflow-hidden border flex flex-col"
          style={{
            background: 'rgba(7, 10, 16, 0.72)',
            backdropFilter: 'blur(48px) saturate(210%)',
            WebkitBackdropFilter: 'blur(48px) saturate(210%)',
            borderColor: 'rgba(255,255,255,0.08)',
            boxShadow: `
              0 28px 78px rgba(0,0,0,0.55),
              0 0 24px rgba(120,160,255,0.045)
            `,
            maxHeight: 'calc(100vh - 100px)',
            height: '90vh'
          }}
          initial={{ opacity: 0, scale: 0.985, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.99, y: 12 }}
          transition={{ duration: MOTION.DURATIONS.drawerEntry, ease: MOTION.CURVES.easeOutQuint }}
        >
          {/* Atmospheric Lightfield */}
          <div style={{
            position: 'absolute',
            zIndex: -1,
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            height: '540px',
            background: 'radial-gradient(circle at 50% 15%, rgba(155, 185, 255, 0.11) 0%, rgba(0, 0, 0, 0) 72%)',
            mixBlendMode: 'screen',
            pointerEvents: 'none'
          }} />

          {/* Top Rim Light */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '14%',
            right: '14%',
            height: '1.5px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent)',
            filter: 'blur(1.5px)',
            pointerEvents: 'none'
          }} />

          {/* Header */}
          <div 
            className="relative border-b flex-shrink-0" 
            style={{ 
              borderColor: 'rgba(255,255,255,0.10)',
              padding: '22px 32px 18px 32px',
              background: 'rgba(255, 255, 255, 0.018)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-13 h-13 rounded-[16px] border flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'rgba(142, 187, 255, 0.12)',
                    borderColor: 'rgba(142, 187, 255, 0.26)',
                    backdropFilter: 'blur(22px)',
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.14), 0 4px 18px rgba(142, 187, 255, 0.22)'
                  }}
                >
                  <Activity className="w-7 h-7 relative z-10" style={{ color: '#8EBBFF', filter: 'brightness(1.16)' }} strokeWidth={1.8} />
                </div>
                <div>
                  <h2 style={{ 
                    fontSize: '24px',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.94)',
                    letterSpacing: '0.005em',
                    marginBottom: '2px'
                  }}>
                    Street Alignment
                  </h2>
                  <p style={{ 
                    fontSize: '15px',
                    color: 'rgba(255,255,255,0.55)',
                    fontWeight: 400,
                    marginTop: '4px'
                  }}>
                    Consensus & Macro Force Breakdown
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="w-11 h-11 rounded-[16px] flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)'
                }}
                whileHover={{ scale: 1.06, background: 'rgba(255,255,255,0.14)' }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.12 }}
              >
                <X className="w-5.5 h-5.5" style={{ color: 'rgba(255,255,255,0.84)' }} strokeWidth={2} />
              </motion.button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div 
            className="flex-1 overflow-y-auto" 
            style={{ 
              scrollBehavior: 'smooth',
              padding: '44px 52px 56px 52px'
            }}
          >
            {/* Orb */}
            <AlignmentOrb score={consensusScore} delay={0.02} />
            
            {/* Metadata */}
            <motion.p
              className="text-[11px] text-center mb-4"
              style={{ color: 'rgba(255,255,255,0.48)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.68, duration: 0.25 }}
            >
              Based on 5 sources • Updated 2m ago
            </motion.p>

            {/* Floating Glass Capsule */}
            <InsightCapsule segments={segments} delay={0.75} />

            {/* Asymmetric Tiles */}
            <MacroForcesTiles segments={segments} delay={0.85} onOpenDetail={onOpenDetail} />

            {/* Segment Details List */}
            <SegmentDetailsList segments={segments} delay={0.95} onOpenDetail={onOpenDetail} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(SentimentDrawer);