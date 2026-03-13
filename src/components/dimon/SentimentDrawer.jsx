// 🔒 DESIGN LOCKED — OS HORIZON TAHOE V5.1 STREET ALIGNMENT REFINEMENT
// Last Updated: 2025-01-20 | V5.4 Insight Capsules Final OS Horizon Polish
// VIREON CERTIFIED — OS Horizon Hybrid Identity (Cinematic Intelligence + Tahoe Serenity)
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, Activity, Shield, Briefcase, BarChart3, Globe, TrendingUp, TrendingDown, Minus, Sparkles, ArrowUp, ArrowDown } from 'lucide-react';

// Apple-grade font stacks
const SF = {
  display: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Inter", sans-serif',
  text: '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Inter", sans-serif',
  mono: '"SF Mono", "Fira Code", "Menlo", monospace'
};

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
    glowCycle: 8.5,
    capsuleStagger: 0.02,
    capsuleHover: 0.12
  }
};

// Segment Configuration
const SEGMENT_CONFIG = {
  Policy: { 
    Icon: Shield, 
    color: '#70A8E8', 
    glow: 'rgba(112, 168, 232, 0.15)',
    ambient: 'rgba(112, 168, 232, 0.08)',
    insight: 'Regulators are becoming stricter across more industries',
    status: 'Rising',
    statusColor: '#FFB020'
  },
  Credit: { 
    Icon: Briefcase, 
    color: '#B88AED', 
    glow: 'rgba(184, 138, 237, 0.15)',
    ambient: 'rgba(184, 138, 237, 0.08)',
    insight: 'Borrowing costs rising for emerging markets as credit conditions tighten',
    status: 'Moderate',
    statusColor: '#FFB020'
  },
  Equities: { 
    Icon: BarChart3, 
    color: '#32C288', 
    glow: 'rgba(50, 194, 136, 0.15)',
    ambient: 'rgba(50, 194, 136, 0.08)',
    insight: 'A few large companies are driving most of the market gains',
    status: 'Stable',
    statusColor: '#5EA7FF'
  },
  Global: { 
    Icon: Globe, 
    color: '#EDB859', 
    glow: 'rgba(237, 184, 89, 0.15)',
    ambient: 'rgba(237, 184, 89, 0.08)',
    insight: 'China slowdown is dampening expectations for global growth',
    status: 'Softening',
    statusColor: '#F26A6A'
  }
};

// ============================================================================
// OS HORIZON 2.0 LIVING ALIGNMENT ORB
// ============================================================================
const LivingAlignmentOrb = ({ score, delay, convictionLabel, drawerAccent }) => {
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
          border: drawerAccent?.ringBorder ? `1px solid ${drawerAccent.ringBorder}` : '1px solid rgba(255,255,255,0.22)',
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
          style={{ color: 'rgba(255,255,255,0.66)', letterSpacing: '0.18em', fontFamily: SF.text, WebkitFontSmoothing: 'antialiased' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.28, duration: 0.3 }}
        >
          Conviction
        </motion.span>
        
        <motion.span
          style={{ 
            fontSize: '42px',
            fontWeight: 600,
            color: drawerAccent?.scoreColor || 'rgba(255,255,255,0.95)',
            textShadow: `0 0 32px ${drawerAccent?.scoreColor || color}48, 0 3px 14px rgba(0,0,0,0.32)`,
            letterSpacing: '-0.045em',
            marginBottom: '6px',
            fontFamily: SF.display,
            WebkitFontSmoothing: 'antialiased',
            fontVariantNumeric: 'tabular-nums'
          }}
          initial={{ opacity: 0, scale: 0.84 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.38, duration: 0.42, ease: MOTION.CURVES.easeOutQuint }}
        >
          {score}
        </motion.span>
        
        <motion.div
          className="text-[14px] font-medium"
          style={{ color: 'rgba(255,255,255,0.58)', fontFamily: SF.text, WebkitFontSmoothing: 'antialiased', letterSpacing: '-0.008em' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.62, duration: 0.28 }}
        >
          {convictionLabel || 'Moderate Conviction'}
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// NARRATIVE CAPSULE (Apple-Grade Optical Centering)
// ============================================================================
const InsightRevealPanel = ({ segments, delay, summary }) => {
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
          lineHeight: '1.47',
          color: 'rgba(255,255,255,0.92)',
          letterSpacing: '-0.18px',
          textShadow: '0px 1.2px 2.4px rgba(0,0,0,0.28)',
          maxWidth: '82%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100%',
          fontFamily: SF.text,
          WebkitFontSmoothing: 'antialiased',
          fontWeight: 400
        }}
      >
        {summary || 'Markets are showing slight upward pressure as stricter policies and early signs of credit strain push investors to be more cautious.'}
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
        What's Behind This Reading
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
// INSIGHT CAPSULES — Final OS Horizon Polish
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
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + 0.14, duration: 0.24, ease: MOTION.CURVES.silk }}
      style={{ marginTop: '56px', marginBottom: '32px' }}
    >
      <h3 
        className="text-[11px] uppercase mb-8" 
        style={{ 
          color: 'rgba(255,255,255,0.72)', 
          letterSpacing: '0.056em',
          fontWeight: 400
        }}
      >
        Insight Capsules
      </h3>

      <div className="flex flex-col gap-[14px]">
        {segments.map((segment, idx) => {
          const config = SEGMENT_CONFIG[segment.name];
          if (!config) return null;

          // Use live data from segment if available, fall back to static config
          const liveInsight = segment.insight || config.insight;
          const liveTrend = segment.trend || config.status;
          const StatusIcon = (liveTrend === 'rising' || liveTrend === 'Rising') ? TrendingUp
            : (liveTrend === 'falling' || liveTrend === 'Softening' || liveTrend === 'softening') ? TrendingDown
            : Minus;
          const statusColor = (liveTrend === 'rising' || liveTrend === 'Rising') ? '#FFB020'
            : (liveTrend === 'falling' || liveTrend === 'Softening' || liveTrend === 'softening') ? '#F26A6A'
            : (liveTrend === 'stable' || liveTrend === 'Stable') ? '#5EA7FF'
            : config.statusColor;

          const isHovered = hoveredCapsule === segment.name;
          const isClicked = clickedCapsule === segment.name;

          return (
            <motion.button
              key={segment.name}
              className="relative rounded-[20px] overflow-hidden cursor-pointer text-left w-full"
              style={{
                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.063) 0%, rgba(255, 255, 255, 0.032) 100%)`,
                backdropFilter: 'blur(16.5px) saturate(145%)',
                WebkitBackdropFilter: 'blur(16.5px) saturate(145%)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '16px 30px',
                boxShadow: `
                  inset 0 1px 0 rgba(255,255,255,0.092),
                  0 4px 14px rgba(0,0,0,0.08),
                  0 0 ${isHovered ? '14px' : '10px'} ${config.glow}
                `,
                display: 'flex',
                alignItems: 'center',
                gap: '17px',
                minHeight: '50px',
                opacity: isClicked ? 0.96 : 1
              }}
              initial={{ opacity: 0, y: 4, scale: 0.98 }}
              animate={{ 
                opacity: isClicked ? 0.96 : 1, 
                y: 0, 
                scale: 1 
              }}
              transition={{ 
                delay: delay + 0.18 + (idx * MOTION.DURATIONS.capsuleStagger), 
                duration: 0.20, 
                ease: MOTION.CURVES.spring,
                opacity: { duration: isClicked ? 0.08 : 0.20 }
              }}
              onClick={() => handleClick(segment)}
              onMouseEnter={() => setHoveredCapsule(segment.name)}
              onMouseLeave={() => setHoveredCapsule(null)}
              whileHover={{ 
                y: -3,
                scale: 1.02,
                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)`,
                boxShadow: `
                  inset 0 1px 0 rgba(255,255,255,0.10),
                  0 6px 20px rgba(0,0,0,0.12),
                  0 0 18px ${config.glow},
                  0 0 2px ${config.glow}
                `,
                borderColor: 'rgba(255,255,255,0.12)',
                transition: { duration: MOTION.DURATIONS.capsuleHover, ease: 'easeOut' }
              }}
              whileTap={{ scale: 0.985, transition: { duration: 0.08 } }}
            >
              {/* Top-Edge Highlight */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '20%',
                right: '20%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
                pointerEvents: 'none'
              }} />

              {/* Ambient Tint - Reduced by 25% */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(ellipse at 30% 30%, ${config.ambient} 0%, transparent 100%)`,
                borderRadius: '20px',
                pointerEvents: 'none',
                opacity: 0.75
              }} />

              {/* Hover Halo - Reduced to 6.8% opacity */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute inset-[-2px] rounded-[22px]"
                    style={{
                      background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
                      filter: 'blur(10px)',
                      pointerEvents: 'none'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.068 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: MOTION.DURATIONS.capsuleHover }}
                  />
                )}
              </AnimatePresence>

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

              {/* Text Column */}
              <div className="flex-1" style={{ marginRight: '18px' }}>
                <p 
                  className="text-[13px] font-medium leading-snug" 
                  style={{ 
                    color: 'rgba(255,255,255,0.88)', 
                    letterSpacing: '-0.01em',
                    lineHeight: '1.35',
                    marginBottom: '0'
                  }}
                >
                  {liveInsight}
                </p>
              </div>

              {/* Status Tag - Refined Sizing */}
              <div 
                className="inline-flex items-center gap-1.5 rounded-md flex-shrink-0"
                style={{
                  background: `${statusColor}14`,
                  border: `1px solid ${statusColor}24`,
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  borderRadius: '9px'
                }}
              >
                <StatusIcon className="w-3 h-3" style={{ color: statusColor }} strokeWidth={2.5} />
                <span 
                  className="uppercase whitespace-nowrap" 
                  style={{ 
                    fontSize: '9px',
                    color: statusColor,
                    letterSpacing: '0.04em',
                    fontWeight: 500,
                    opacity: 0.78
                  }}
                >
                  {liveTrend}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

// ============================================================================
// FACTOR CARDS — Dynamic array from factor_tilt.factors
// ============================================================================
const getTiltColor = (tilt) => {
  const t = (tilt || '').toLowerCase();
  if (t === 'bullish') return '#2BC686';
  if (t === 'bearish') return '#F26A6A';
  return '#9BA8B5';
};

const getSeverityColor = (severity) => {
  const s = (severity || '').toLowerCase();
  if (s === 'critical') return '#F26A6A';
  if (s === 'high') return '#FF8C42';
  if (s === 'moderate') return '#FFB020';
  return '#9BA8B5';
};

const getTrendIcon = (trend) => {
  const t = (trend || '').toLowerCase();
  if (t === 'rising') return <ArrowUp className="w-3 h-3" strokeWidth={2.5} />;
  if (t === 'falling') return <ArrowDown className="w-3 h-3" strokeWidth={2.5} />;
  if (t === 'emerging') return <Sparkles className="w-3 h-3" strokeWidth={2} />;
  if (t === 'fading') return <Minus className="w-3 h-3 opacity-50" strokeWidth={2} />;
  return <Minus className="w-3 h-3" strokeWidth={2} />;
};

const FactorCards = ({ factors, delay }) => {
  if (!factors || factors.length === 0) return null;
  return (
    <div style={{ marginTop: '48px', marginBottom: '28px' }}>
      <div className="text-[11px] font-medium uppercase tracking-wider mb-5"
        style={{ color: 'rgba(255,255,255,0.58)', letterSpacing: '0.07em', fontWeight: 500, fontFamily: SF.text, WebkitFontSmoothing: 'antialiased' }}>
        What's Behind This Reading
      </div>
      <div className="grid grid-cols-2 gap-4">
        {factors.map((factor, idx) => {
          if (!factor) return null;
          const tiltColor = getTiltColor(factor.tilt);
          return (
            <motion.div
              key={factor.name || idx}
              className="relative rounded-[22px] overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.028) 100%)',
                backdropFilter: 'blur(14px) saturate(152%)',
                WebkitBackdropFilter: 'blur(14px) saturate(152%)',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '18px',
                boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.06), 0 6px 18px rgba(0,0,0,0.08)'
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + idx * 0.06, duration: 0.32, ease: MOTION.CURVES.spring }}
            >
              {/* Top row: name + weight */}
              <div className="flex items-start justify-between mb-3">
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.016em', fontFamily: SF.display, WebkitFontSmoothing: 'antialiased' }}>
                  {factor.name}
                </span>
                {factor.weight != null && (
                  <span style={{ fontSize: '14px', fontWeight: 500, color: tiltColor, fontFamily: SF.display, WebkitFontSmoothing: 'antialiased', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>
                    {factor.weight}%
                  </span>
                )}
              </div>
              {/* Badges row */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {factor.tilt && (
                  <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', padding: '2px 7px', borderRadius: '6px', background: `${tiltColor}18`, color: tiltColor, border: `1px solid ${tiltColor}28`, letterSpacing: '0.06em', fontFamily: SF.text, WebkitFontSmoothing: 'antialiased' }}>
                    {factor.tilt.toUpperCase()}
                  </span>
                )}
                {factor.conviction && (
                  <span style={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', padding: '2px 7px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)', letterSpacing: '0.05em', fontFamily: SF.text, WebkitFontSmoothing: 'antialiased' }}>
                    {factor.conviction}
                  </span>
                )}
                {factor.trend && (
                  <span className="inline-flex items-center gap-1" style={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', padding: '2px 7px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)', letterSpacing: '0.05em', fontFamily: SF.text, WebkitFontSmoothing: 'antialiased' }}>
                    {getTrendIcon(factor.trend)}
                    {factor.trend}
                  </span>
                )}
              </div>
              {/* Insight */}
              {factor.insight && (
                <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.60)', lineHeight: '1.50', letterSpacing: '-0.008em', fontFamily: SF.text, WebkitFontSmoothing: 'antialiased', fontWeight: 400 }}>
                  {factor.insight}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// DIVERGENCE SECTION — Dynamic array from divergence.items
// ============================================================================
const DivergenceSection = ({ items, delay }) => {
  if (!items || items.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.24, ease: MOTION.CURVES.silk }}
      style={{ marginTop: '56px', marginBottom: '32px' }}
    >
      <h3 style={{ fontSize: '11px', textTransform: 'uppercase', marginBottom: '32px', color: 'rgba(255,255,255,0.58)', letterSpacing: '0.07em', fontWeight: 500, fontFamily: SF.text, WebkitFontSmoothing: 'antialiased' }}>
        Divergence
      </h3>
      <div className="flex flex-col gap-[14px]">
        {items.map((item, idx) => {
          if (!item) return null;
          const sevColor = getSeverityColor(item.severity);
          return (
            <div
              key={idx}
              className="relative rounded-[20px] overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.063) 0%, rgba(255,255,255,0.032) 100%)',
                backdropFilter: 'blur(16px) saturate(145%)',
                WebkitBackdropFilter: 'blur(16px) saturate(145%)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '16px 24px',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.09), 0 4px 14px rgba(0,0,0,0.08)'
              }}
            >
              {/* Top highlight line */}
              <div style={{
                position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
                pointerEvents: 'none'
              }} />
              <div className="flex items-start justify-between gap-3 mb-2">
                <p style={{ fontSize: '13.5px', fontWeight: 600, color: 'rgba(255,255,255,0.90)', letterSpacing: '-0.016em', lineHeight: '1.38', fontFamily: SF.display, WebkitFontSmoothing: 'antialiased' }}>
                  {item.headline}
                </p>
                {item.severity && (
                  <span className="flex-shrink-0" style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', padding: '2px 7px', borderRadius: '6px', background: `${sevColor}18`, color: sevColor, border: `1px solid ${sevColor}28`, letterSpacing: '0.06em', fontFamily: SF.text, WebkitFontSmoothing: 'antialiased' }}>
                    {item.severity}
                  </span>
                )}
              </div>
              {item.morning_takeaway && (
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.56)', lineHeight: '1.50', letterSpacing: '-0.008em', marginBottom: '8px', fontFamily: SF.text, WebkitFontSmoothing: 'antialiased', fontWeight: 400 }}>
                  {item.morning_takeaway}
                </p>
              )}
              {item.challenges_factor && (
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: SF.text, WebkitFontSmoothing: 'antialiased', letterSpacing: '-0.005em' }}>
                  Challenges: {item.challenges_factor}{item.challenges_tilt ? ` ${item.challenges_tilt} tilt` : ''}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN STREET ALIGNMENT DRAWER
// ============================================================================
const getDrawerTiltAccent = (tilt, score) => {
  const t = (tilt || 'neutral').toLowerCase();
  const low = typeof score === 'number' && score < 45;
  if (t === 'bullish') return {
    ambientColor: `rgba(245, 166, 35, ${low ? 0.06 : 0.14})`,
    ringBorder: `rgba(245, 166, 35, 0.25)`,
    scoreColor: '#F5A623',
    regimeTint: '#F5A623'
  };
  if (t === 'bearish') return {
    ambientColor: `rgba(232, 93, 117, ${low ? 0.06 : 0.14})`,
    ringBorder: `rgba(232, 93, 117, 0.25)`,
    scoreColor: '#E85D75',
    regimeTint: '#E85D75'
  };
  return { ambientColor: null, ringBorder: null, scoreColor: null, regimeTint: null };
};

const SentimentDrawer = ({ isOpen, onClose, score, breakdown, onOpenDetail, summary, regimeLabel, convictionLabel, sourcesCount, timestampDisplay, factors, divergenceItems, forceDetails, dominantTilt }) => {
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
  const drawerAccent = getDrawerTiltAccent(dominantTilt, consensusScore);

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
            background: drawerAccent.ambientColor
              ? `radial-gradient(circle at 50% 50%, ${drawerAccent.ambientColor} 0%, rgba(0,0,0,0) 72%)`
              : 'radial-gradient(circle at 50% 50%, rgba(155, 185, 255, 0.22) 0%, rgba(0, 0, 0, 0) 72%)',
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
                    letterSpacing: '-0.022em',
                    marginBottom: '2px',
                    fontFamily: SF.display,
                    WebkitFontSmoothing: 'antialiased'
                  }}>
                    Factor Tilt
                  </h2>
                  <p style={{ 
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.50)',
                    fontWeight: 400,
                    marginTop: '3px',
                    letterSpacing: '-0.008em',
                    fontFamily: SF.text,
                    WebkitFontSmoothing: 'antialiased'
                  }}>
                    Factor Tilt &amp; Divergence
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
            <LivingAlignmentOrb score={consensusScore} delay={0.02} convictionLabel={convictionLabel} drawerAccent={drawerAccent} />
            
            {/* Metadata */}
            <motion.p
              className="text-[11px] text-center"
              style={{ color: 'rgba(255,255,255,0.46)', marginBottom: '24px', fontFamily: SF.text, WebkitFontSmoothing: 'antialiased', letterSpacing: '-0.005em' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.72, duration: 0.25 }}
            >
              Based on {sourcesCount ?? 5} sources • Updated {timestampDisplay ?? '2m ago'}
            </motion.p>

            {/* Regime Label */}
            {regimeLabel && (
              <motion.p
                className="text-[11px] font-medium text-center uppercase tracking-widest"
                style={{ color: drawerAccent?.regimeTint || 'rgba(255,255,255,0.52)', letterSpacing: '0.07em', marginBottom: '10px', fontFamily: SF.text, WebkitFontSmoothing: 'antialiased' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.74, duration: 0.24 }}
              >
                {regimeLabel}
              </motion.p>
            )}

            {/* Insight Reveal Panel */}
            {summary && <InsightRevealPanel segments={segments} delay={0.78} summary={summary} />}

            {/* Factor Cards */}
            {factors && factors.length > 0 && (
              <FactorCards factors={factors} delay={0.88} />
            )}

            {/* Divergence Section */}
            {divergenceItems && divergenceItems.length > 0 && (
              <DivergenceSection items={divergenceItems} delay={0.95} />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(SentimentDrawer);