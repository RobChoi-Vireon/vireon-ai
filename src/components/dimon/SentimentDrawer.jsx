// 🔒 DESIGN LOCKED — OS HORIZON TAHOE V5.1 STREET ALIGNMENT REFINEMENT
// Last Updated: 2025-01-20 | V5.2 Insight Capsules Apple-Grade Polish
// VIREON CERTIFIED — OS Horizon Hybrid Identity (Cinematic Intelligence + Tahoe Serenity)
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, Activity, Shield, Briefcase, BarChart3, Globe, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// OS Horizon Motion DNA
const MOTION = {
  CURVES: {
    easeOutQuint: [0.22, 1, 0.36, 1],
    silk: [0.25, 0.1, 0, 1.0],
    spring: [0.22, 0.61, 0.36, 1],
    bloom: [0.18, 0.82, 0.23, 1],
    bounce: [0.68, -0.55, 0.27, 1.55]
  },
  DURATIONS: {
    drawerEntry: 0.42,
    orbArrival: 0.22,
    cardStagger: 0.06,
    breathe: 9.0,
    rowExpand: 0.2,
    glowCycle: 8.5
  }
};

// Segment Configuration
const SEGMENT_CONFIG = {
  Policy: { 
    Icon: Shield, 
    color: '#70A8E8', 
    glow: 'rgba(112, 168, 232, 0.15)',
    ambient: 'rgba(112, 168, 232, 0.08)',
    insight: 'Regulatory oversight expanding across multiple sectors',
    status: 'Rising',
    statusColor: '#FFB020'
  },
  Credit: { 
    Icon: Briefcase, 
    color: '#B88AED', 
    glow: 'rgba(184, 138, 237, 0.15)',
    ambient: 'rgba(184, 138, 237, 0.08)',
    insight: 'EM spreads widening as credit markets show stress signals',
    status: 'Moderate',
    statusColor: '#FFB020'
  },
  Equities: { 
    Icon: BarChart3, 
    color: '#32C288', 
    glow: 'rgba(50, 194, 136, 0.15)',
    ambient: 'rgba(50, 194, 136, 0.08)',
    insight: 'Flat breadth with concentrated gains in mega-cap names',
    status: 'Stable',
    statusColor: '#5EA7FF'
  },
  Global: { 
    Icon: Globe, 
    color: '#EDB859', 
    glow: 'rgba(237, 184, 89, 0.15)',
    ambient: 'rgba(237, 184, 89, 0.08)',
    insight: 'China slowdown weighing on global growth outlook',
    status: 'Softening',
    statusColor: '#F26A6A'
  }
};

// ============================================================================
// OS HORIZON 2.0 LIVING ALIGNMENT ORB
// ============================================================================
const LivingAlignmentOrb = ({ score, delay }) => {
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [particlePhase, setParticlePhase] = useState(0);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const parallaxX = useTransform(mouseX, [-100, 100], [-3, 3]);
  const parallaxY = useTransform(mouseY, [-100, 100], [-3, 3]);

  useEffect(() => {
    let rafId, startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setBreathingPhase(elapsed);
      setParticlePhase(elapsed * 0.3);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => rafId && cancelAnimationFrame(rafId);
  }, []);

  const breathingScale = 1 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.DURATIONS.breathe)) * 0.018;

  const getZoneColor = (s) => {
    if (s < 40) return '#E86565';
    if (s < 70) return '#70A8E8';
    return '#32C288';
  };

  const color = getZoneColor(score);

  return (
    <motion.div
      className="relative flex items-center justify-center mx-auto"
      style={{ width: '168px', height: '168px', x: parallaxX, y: parallaxY, marginBottom: '0px' }}
      initial={{ opacity: 0, scale: 0.96, y: 0 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: delay + 0.08, duration: MOTION.DURATIONS.orbArrival, ease: MOTION.CURVES.easeOutQuint }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - (rect.left + rect.width / 2));
        mouseY.set(e.clientY - (rect.top + rect.height / 2));
      }}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      {/* Soft Inner Glow (Ice Blue) */}
      <div style={{
        position: 'absolute',
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(180, 210, 255, 0.07) 0%, transparent 68%)',
        filter: 'blur(32px)',
        pointerEvents: 'none'
      }} />

      {/* Soft Halo Ring (Increased Blur) */}
      <motion.div
        className="absolute"
        style={{
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 0%, transparent 72%)`,
          filter: 'blur(55px)',
          pointerEvents: 'none',
          opacity: 0.35
        }}
        animate={{ scale: breathingScale * 1.15 }}
        transition={{ duration: MOTION.DURATIONS.breathe, ease: 'easeInOut' }}
      />

      {/* Subsurface Glow */}
      <div style={{
        position: 'absolute',
        width: '190px',
        height: '190px',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(140,160,255,0.22) 0%, transparent 68%)`,
        filter: 'blur(36px)',
        pointerEvents: 'none'
      }} />

      {/* Particle Shimmer */}
      <motion.div
        className="absolute"
        style={{
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.45)',
          boxShadow: '0 0 12px rgba(255,255,255,0.6)',
          left: `calc(50% + ${84 * Math.cos(particlePhase * Math.PI * 2)}px)`,
          top: `calc(50% + ${84 * Math.sin(particlePhase * Math.PI * 2)}px)`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Glass Orb */}
      <motion.div
        className="absolute"
        style={{
          width: '168px',
          height: '168px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.07) 100%)',
          backdropFilter: 'blur(14px) saturate(165%)',
          WebkitBackdropFilter: 'blur(14px) saturate(165%)',
          border: '1px solid rgba(255,255,255,0.22)',
          boxShadow: `
            inset 0 2px 24px rgba(255,255,255,0.20),
            inset 0 -2px 18px rgba(0,0,0,0.28),
            0 16px 40px rgba(120,160,255,0.15)
          `
        }}
        animate={{ scale: breathingScale }}
        transition={{ duration: MOTION.DURATIONS.breathe, ease: 'easeInOut' }}
      >
        {/* Top Rim Highlight */}
        <div style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 28% 28%, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.20) 40%, transparent 68%)',
          filter: 'blur(20px)',
          pointerEvents: 'none'
        }} />

        {/* Inner Depth Layer */}
        <div style={{
          position: 'absolute',
          inset: '8px',
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${color}06 0%, transparent 100%)`,
          pointerEvents: 'none'
        }} />
      </motion.div>

      {/* Text Stack */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-[11px] font-medium uppercase tracking-widest mb-2.5"
          style={{ color: 'rgba(255,255,255,0.66)', letterSpacing: '0.18em' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.28, duration: 0.3 }}
        >
          Alignment
        </motion.span>
        
        <motion.span
          style={{ 
            fontSize: '42px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.95)',
            textShadow: `0 0 32px ${color}48, 0 3px 14px rgba(0,0,0,0.32)`,
            letterSpacing: '-0.045em',
            marginBottom: '6px'
          }}
          initial={{ opacity: 0, scale: 0.84 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.38, duration: 0.42, ease: MOTION.CURVES.easeOutQuint }}
        >
          {score}
        </motion.span>
        
        <motion.div
          className="text-[14px] font-medium"
          style={{ color: 'rgba(255,255,255,0.58)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.62, duration: 0.28 }}
        >
          Medium Weight
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// NARRATIVE CAPSULE (Apple-Grade Optical Centering)
// ============================================================================
const InsightRevealPanel = ({ segments, delay }) => {
  return (
    <motion.div
      className="relative rounded-[28px] overflow-hidden mx-auto"
      style={{
        maxWidth: '84%',
        paddingTop: '20px',
        paddingBottom: '20px',
        paddingLeft: '32px',
        paddingRight: '32px',
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(16px) saturate(165%)',
        WebkitBackdropFilter: 'blur(16px) saturate(165%)',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow: `
          inset 0 2px 0 rgba(255,255,255,0.06),
          inset 0 0 24px rgba(0,0,0,0.24),
          0 0 22px rgba(140,180,255,0.06),
          0 4px 32px rgba(0,0,0,0.35)
        `,
        marginTop: '12px',
        marginBottom: '32px'
      }}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay + 0.09, duration: 0.18, ease: MOTION.CURVES.silk }}
    >
      {/* Top Inner Highlight */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '28px',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.06) 0%, transparent 100%)',
        borderRadius: '28px 28px 0 0',
        pointerEvents: 'none'
      }} />

      {/* Bottom Inner Shadow */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '28px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.24) 0%, transparent 100%)',
        borderRadius: '0 0 28px 28px',
        pointerEvents: 'none'
      }} />

      {/* Enhanced Glass Surface Glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(140,180,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        borderRadius: '28px'
      }} />

      <p 
        className="text-center relative z-10"
        style={{ 
          fontSize: '15.5px',
          lineHeight: '1.42',
          color: 'rgba(255,255,255,0.92)',
          letterSpacing: '-0.15px',
          textShadow: '0px 1.2px 2.4px rgba(0,0,0,0.28)',
          maxWidth: '82%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100%'
        }}
      >
        Markets show mild upward pressure driven by policy tightening and early credit stress signals.
      </p>
    </motion.div>
  );
};

// ============================================================================
// UNIFORM CARD GRID (2×2, Perfect Uniformity)
// ============================================================================
const MacroForceGrid = ({ segments, delay, onOpenDetail }) => {
  const sortedSegments = [...segments].sort((a, b) => (b.weight || 0) - (a.weight || 0));

  return (
    <div style={{ marginTop: '48px', marginBottom: '28px' }}>
      <motion.div
        className="text-[11px] font-medium uppercase tracking-wider mb-5"
        style={{ 
          color: 'rgba(255,255,255,0.58)', 
          letterSpacing: '0.06em',
          fontWeight: 500
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay - 0.05, duration: 0.3 }}
      >
        What's Driving This Alignment
      </motion.div>

      <div className="grid grid-cols-2 gap-5">
        {sortedSegments.map((segment, idx) => {
          if (!segment) return null;
          const config = SEGMENT_CONFIG[segment.name];
          const weight = (segment?.weight || 0) * 100;
          const animDelay = delay + (idx * MOTION.DURATIONS.cardStagger);

          return (
            <motion.div
              key={segment.name}
              className="relative rounded-[22px] overflow-hidden cursor-pointer"
              style={{
                height: '154px',
                background: `linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.028) 100%)`,
                backdropFilter: 'blur(14px) saturate(152%)',
                WebkitBackdropFilter: 'blur(14px) saturate(152%)',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '18px',
                boxShadow: `
                  inset 0 1px 0 rgba(0,0,0,0.06),
                  0 6px 18px rgba(0,0,0,0.08)
                `,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: animDelay, 
                duration: 0.32, 
                ease: MOTION.CURVES.spring 
              }}
              onClick={() => onOpenDetail?.(segment)}
              whileHover={{ 
                y: -2,
                background: `linear-gradient(180deg, rgba(255, 255, 255, 0.055) 0%, rgba(255, 255, 255, 0.032) 100%)`,
                boxShadow: `
                  inset 0 1px 0 rgba(0,0,0,0.06),
                  0 8px 24px rgba(0,0,0,0.10), 
                  0 0 32px ${config.glow}
                `,
                borderColor: 'rgba(255,255,255,0.08)',
                transition: { duration: 0.16 }
              }}
              whileTap={{ scale: 0.995 }}
            >
              {/* Ambient Color Glow */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(ellipse at 50% -35%, ${config.ambient} 0%, transparent 100%)`,
                borderRadius: '22px',
                pointerEvents: 'none'
              }} />

              {/* Top Inner Gradient (Ice Blue) */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '60px',
                background: 'linear-gradient(to bottom, rgba(180, 210, 255, 0.06) 0%, transparent 100%)',
                borderRadius: '22px 22px 0 0',
                pointerEvents: 'none'
              }} />

              {/* Inset Highlight */}
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '22px',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
                pointerEvents: 'none'
              }} />

              {/* Top Row: Icon + Percent */}
              <div className="flex items-start justify-between relative z-10">
                <div 
                  className="w-10 h-10 rounded-[14px] flex items-center justify-center"
                  style={{
                    background: `${config.color}10`,
                    border: `1px solid ${config.color}20`,
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.10)`
                  }}
                >
                  <config.Icon 
                    style={{ color: config.color, filter: 'brightness(1.18)' }} 
                    className="w-5 h-5" 
                    strokeWidth={2} 
                  />
                </div>
                <span 
                  className="text-[20px] font-medium" 
                  style={{ 
                    color: config.color,
                    filter: 'brightness(1.16)'
                  }}
                >
                  {Math.round(weight)}%
                </span>
              </div>

              {/* Label + Bar */}
              <div className="relative z-10">
                <h4 className="text-[15px] font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.94)', letterSpacing: '-0.01em', lineHeight: '1.35' }}>
                  {segment.name}
                </h4>

                {/* Contribution Bar - Unified Track Color */}
                <div 
                  className="w-full h-[4px] rounded-full overflow-hidden" 
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ 
                      background: `linear-gradient(90deg, ${config.color}88, ${config.color}e8)`,
                      boxShadow: `0 0 10px ${config.color}28, inset 0 1px 0 rgba(255,255,255,0.12)`
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${weight}%` }}
                    transition={{ 
                      duration: 0.36, 
                      delay: animDelay + 0.15, 
                      ease: MOTION.CURVES.easeOutQuint
                    }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// NEW: INSIGHT CAPSULES (Apple-Grade Polish)
// ============================================================================
const InsightCapsules = ({ segments, delay, onOpenDetail }) => {
  const [hoveredCapsule, setHoveredCapsule] = useState(null);
  const [clickedCapsule, setClickedCapsule] = useState(null);

  const handleClick = (segment) => {
    setClickedCapsule(segment.name);
    setTimeout(() => {
      setClickedCapsule(null);
      onOpenDetail?.(segment);
    }, 80);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + 0.18, duration: 0.26 }}
      style={{ marginTop: '44px', marginBottom: '28px' }}
    >
      <h3 
        className="text-[11px] uppercase tracking-wider mb-6" 
        style={{ 
          color: 'rgba(255,255,255,0.72)', 
          letterSpacing: '0.058em',
          fontWeight: 400
        }}
      >
        Insight Capsules
      </h3>

      <div className="flex flex-col gap-4">
        {segments.map((segment, idx) => {
          const config = SEGMENT_CONFIG[segment.name];
          if (!config) return null;

          const StatusIcon = config.status === 'Rising' || config.status === 'Softening' 
            ? (config.status === 'Rising' ? TrendingUp : TrendingDown)
            : Minus;

          const isHovered = hoveredCapsule === segment.name;
          const isClicked = clickedCapsule === segment.name;

          return (
            <motion.button
              key={segment.name}
              className="relative rounded-[20px] overflow-hidden cursor-pointer text-left w-full"
              style={{
                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.03) 100%)`,
                backdropFilter: 'blur(16px) saturate(145%)',
                WebkitBackdropFilter: 'blur(16px) saturate(145%)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '16px 26px',
                boxShadow: `
                  inset 0 1px 0 rgba(255,255,255,0.06),
                  0 4px 14px rgba(0,0,0,0.08),
                  0 0 ${isHovered ? '16px' : '12px'} ${config.glow}
                `,
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                minHeight: '56px',
                opacity: isClicked ? 0.96 : 1
              }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: isClicked ? 0.96 : 1, scale: 1 }}
              transition={{ 
                delay: delay + 0.22 + (idx * 0.04), 
                duration: 0.22, 
                ease: MOTION.CURVES.spring,
                opacity: { duration: isClicked ? 0.08 : 0.22 }
              }}
              onClick={() => handleClick(segment)}
              onMouseEnter={() => setHoveredCapsule(segment.name)}
              onMouseLeave={() => setHoveredCapsule(null)}
              whileHover={{ 
                y: -3,
                scale: 1.015,
                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)`,
                boxShadow: `
                  inset 0 1px 0 rgba(255,255,255,0.09),
                  0 6px 20px rgba(0,0,0,0.12),
                  0 0 22px ${config.glow},
                  0 0 2px ${config.glow}
                `,
                borderColor: 'rgba(255,255,255,0.12)',
                transition: { duration: 0.12, ease: 'easeOut' }
              }}
              whileTap={{ scale: 0.995 }}
            >
              {/* Ambient Tint - Reduced 25% */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(ellipse at 30% 30%, ${config.ambient} 0%, transparent 100%)`,
                borderRadius: '20px',
                pointerEvents: 'none',
                opacity: 0.75
              }} />

              {/* Hover Halo - Softer */}
              {isHovered && (
                <motion.div
                  className="absolute inset-[-2px] rounded-[22px]"
                  style={{
                    background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
                    filter: 'blur(8px)',
                    pointerEvents: 'none',
                    opacity: 0
                  }}
                  animate={{ opacity: 0.15 }}
                  transition={{ duration: 0.12 }}
                />
              )}

              {/* Icon */}
              <div 
                className="w-9 h-9 rounded-[13px] flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${config.color}12`,
                  border: `1px solid ${config.color}24`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08)`
                }}
              >
                <config.Icon 
                  style={{ color: config.color, filter: 'brightness(1.15)' }} 
                  className="w-4.5 h-4.5" 
                  strokeWidth={2.2} 
                />
              </div>

              {/* Text */}
              <div className="flex-1">
                <p 
                  className="text-[13px] font-medium leading-snug mb-1.5" 
                  style={{ 
                    color: 'rgba(255,255,255,0.88)', 
                    letterSpacing: '-0.01em',
                    lineHeight: '1.35'
                  }}
                >
                  {config.insight}
                </p>

                {/* Status Tag - Apple-Grade Polish */}
                <div 
                  className="inline-flex items-center gap-1.5 rounded-md"
                  style={{
                    background: `${config.statusColor}14`,
                    border: `1px solid ${config.statusColor}24`,
                    paddingLeft: '8px',
                    paddingRight: '8px',
                    paddingTop: '4px',
                    paddingBottom: '4px',
                    borderRadius: '8px'
                  }}
                >
                  <StatusIcon className="w-3 h-3" style={{ color: config.statusColor }} strokeWidth={2.5} />
                  <span 
                    className="text-[10px] uppercase" 
                    style={{ 
                      color: config.statusColor,
                      letterSpacing: '0.04em',
                      fontWeight: 500,
                      opacity: 0.78
                    }}
                  >
                    {config.status}
                  </span>
                </div>
              </div>
            </motion.button>
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
        animate={{ opacity: 1, backdropFilter: 'blur(14px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.32, ease: MOTION.CURVES.silk }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{ 
            background: 'linear-gradient(135deg, rgba(15, 18, 28, 0.78) 0%, rgba(8, 12, 22, 0.82) 100%)'
          }}
          onClick={onClose}
        />

        {/* Drawer Panel */}
        <motion.div
          className="relative w-full max-w-4xl rounded-[28px] overflow-hidden border flex flex-col"
          style={{
            background: 'linear-gradient(180deg, rgba(21, 25, 35, 0.88) 0%, rgba(9, 13, 23, 0.92) 100%)',
            backdropFilter: 'blur(15px) saturate(165%)',
            WebkitBackdropFilter: 'blur(15px) saturate(165%)',
            borderColor: 'rgba(255,255,255,0.06)',
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
          {/* Top Corner Rim-Lights */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '180px',
            height: '1px',
            background: 'linear-gradient(to right, rgba(255,255,255,0.025), transparent)',
            pointerEvents: 'none',
            zIndex: 10
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '180px',
            height: '1px',
            background: 'linear-gradient(to left, rgba(255,255,255,0.025), transparent)',
            pointerEvents: 'none',
            zIndex: 10
          }} />

          {/* Subsurface Glow Behind Orb */}
          <div style={{
            position: 'absolute',
            zIndex: 0,
            top: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '420px',
            height: '420px',
            background: 'radial-gradient(circle at 50% 50%, rgba(155, 185, 255, 0.22) 0%, rgba(0, 0, 0, 0) 72%)',
            filter: 'blur(80px)',
            mixBlendMode: 'screen',
            pointerEvents: 'none'
          }} />

          {/* Header */}
          <motion.div 
            className="relative border-b flex-shrink-0" 
            style={{ 
              borderColor: 'rgba(255,255,255,0.06)',
              padding: '22px 34px 18px 34px',
              background: 'rgba(255, 255, 255, 0.020)',
              zIndex: 1
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.24 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-13 h-13 rounded-[16px] border flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'rgba(142, 187, 255, 0.13)',
                    borderColor: 'rgba(142, 187, 255, 0.28)',
                    backdropFilter: 'blur(14px)',
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.16), 0 4px 20px rgba(142, 187, 255, 0.24)'
                  }}
                >
                  <Activity className="w-7 h-7 relative z-10" style={{ color: '#8EBBFF', filter: 'brightness(1.18)' }} strokeWidth={1.9} />
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
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)'
                }}
                whileHover={{ scale: 1.06, background: 'rgba(255,255,255,0.14)' }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.12 }}
              >
                <X className="w-5.5 h-5.5" style={{ color: 'rgba(255,255,255,0.84)' }} strokeWidth={2} />
              </motion.button>
            </div>
          </motion.div>

          {/* Scrollable Body */}
          <div 
            className="flex-1 overflow-y-auto" 
            style={{ 
              scrollBehavior: 'smooth',
              padding: '34px 52px 56px 52px',
              position: 'relative',
              zIndex: 1
            }}
          >
            {/* Living Orb */}
            <LivingAlignmentOrb score={consensusScore} delay={0.02} />
            
            {/* Metadata */}
            <motion.p
              className="text-[11px] text-center"
              style={{ color: 'rgba(255,255,255,0.46)', marginBottom: '24px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.72, duration: 0.25 }}
            >
              Based on 5 sources • Updated 2m ago
            </motion.p>

            {/* Insight Reveal Panel */}
            <InsightRevealPanel segments={segments} delay={0.78} />

            {/* Macro Forces Grid */}
            <MacroForceGrid segments={segments} delay={0.88} onOpenDetail={onOpenDetail} />

            {/* NEW: Insight Capsules */}
            <InsightCapsules segments={segments} delay={0.95} onOpenDetail={onOpenDetail} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(SentimentDrawer);