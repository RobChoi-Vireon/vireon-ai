// 🔒 DESIGN LOCKED — OS HORIZON TAHOE V7 FINAL PRODUCTION PASS
// Last Updated: 2025-01-20 | Hybrid Balanced Production Polish Applied
// VIREON CERTIFIED — OS Horizon Hybrid Identity (Cinematic Intelligence + Tahoe Serenity)
// Final pass: perfect uniformity, spacing grid, micro-motion, typography rhythm
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, Activity, Shield, Briefcase, BarChart3, Globe, ChevronDown, ArrowRight } from 'lucide-react';

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
    ambient: 'rgba(112, 168, 232, 0.08)'
  },
  Credit: { 
    Icon: Briefcase, 
    color: '#B88AED', 
    glow: 'rgba(184, 138, 237, 0.15)',
    ambient: 'rgba(184, 138, 237, 0.08)'
  },
  Equities: { 
    Icon: BarChart3, 
    color: '#32C288', 
    glow: 'rgba(50, 194, 136, 0.15)',
    ambient: 'rgba(50, 194, 136, 0.08)'
  },
  Global: { 
    Icon: Globe, 
    color: '#EDB859', 
    glow: 'rgba(237, 184, 89, 0.15)',
    ambient: 'rgba(237, 184, 89, 0.08)'
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
      {/* Subsurface Radial Glow - Low Opacity */}
      <div style={{
        position: 'absolute',
        width: '190px',
        height: '190px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(140,160,255,0.18) 0%, transparent 72%)',
        filter: 'blur(42px)',
        pointerEvents: 'none'
      }} />

      {/* Soft Halo Ring - Increased Blur for Softer Diffusion */}
      <motion.div
        className="absolute"
        style={{
          width: '230px',
          height: '230px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 0%, transparent 75%)`,
          filter: 'blur(62px)',
          pointerEvents: 'none',
          opacity: 0.32
        }}
        animate={{ scale: breathingScale * 1.15 }}
        transition={{ duration: MOTION.DURATIONS.breathe, ease: 'easeInOut' }}
      />

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
// NARRATIVE CAPSULE (Increased Blur, Contrast, Top Highlight)
// ============================================================================
const InsightRevealPanel = ({ segments, delay }) => {
  return (
    <motion.div
      className="relative rounded-[18px] overflow-hidden mx-auto"
      style={{
        maxWidth: '84%',
        paddingTop: '8px',
        paddingBottom: '24px',
        paddingLeft: '22px',
        paddingRight: '22px',
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(18px) saturate(158%)',
        WebkitBackdropFilter: 'blur(18px) saturate(158%)',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow: `
          inset 0 2px 0 rgba(255,255,255,0.04),
          inset 0 0 24px rgba(0,0,0,0.35),
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
      {/* Top Edge Highlight - Increased Opacity */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '24px',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.04) 0%, transparent 100%)',
        borderRadius: '18px 18px 0 0',
        pointerEvents: 'none'
      }} />

      <p 
        className="text-center relative z-10"
        style={{ 
          fontSize: '15.5px',
          lineHeight: '1.35',
          color: 'rgba(255,255,255,0.94)',
          letterSpacing: '-0.01em'
        }}
      >
        Markets show mild upward pressure driven by policy tightening and early credit stress signals.
      </p>
    </motion.div>
  );
};

// ============================================================================
// UNIFORM CARD GRID (2×2, Perfect Production Uniformity)
// ============================================================================
const MacroForceGrid = ({ segments, delay, onOpenDetail }) => {
  const sortedSegments = [...segments].sort((a, b) => (b.weight || 0) - (a.weight || 0));

  return (
    <div style={{ marginTop: '48px', marginBottom: '40px' }}>
      <motion.div
        className="text-[11px] font-medium uppercase tracking-wider mb-5"
        style={{ 
          color: 'rgba(255,255,255,0.60)', 
          letterSpacing: '0.05em',
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
                y: -1.5,
                background: `linear-gradient(180deg, rgba(255, 255, 255, 0.055) 0%, rgba(255, 255, 255, 0.032) 100%)`,
                boxShadow: `
                  inset 0 1px 0 rgba(0,0,0,0.06),
                  0 8px 24px rgba(0,0,0,0.10), 
                  0 0 28px ${config.glow}
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
                  className="text-[20px] font-medium text-right" 
                  style={{ 
                    color: config.color,
                    filter: 'brightness(1.16)',
                    lineHeight: '1.2'
                  }}
                >
                  {Math.round(weight)}%
                </span>
              </div>

              {/* Label + Bar */}
              <div className="relative z-10">
                <h4 
                  className="text-[15px] font-semibold mb-3" 
                  style={{ 
                    color: 'rgba(255,255,255,0.94)', 
                    letterSpacing: '-0.01em', 
                    lineHeight: '1.34' 
                  }}
                >
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
// SEGMENT DETAILS (8px Glow, Symmetrical Padding, 200ms Transitions)
// ============================================================================
const InsightRows = ({ segments, delay, onOpenDetail }) => {
  const [expandedRow, setExpandedRow] = useState(null);

  const handleRowClick = (e, segmentName) => {
    e.stopPropagation();
    setExpandedRow(expandedRow === segmentName ? null : segmentName);
  };

  const handleViewFullAnalysis = (e, segment) => {
    e.stopPropagation();
    onOpenDetail?.(segment);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + 0.3, duration: 0.35 }}
      style={{ marginTop: '44px' }}
    >
      <h3 
        className="text-[11px] uppercase tracking-wider mb-5" 
        style={{ 
          color: 'rgba(255,255,255,0.60)', 
          letterSpacing: '0.05em',
          fontWeight: 500
        }}
      >
        Breakdown by Macro Forces
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {segments.map((segment, idx) => {
          const config = SEGMENT_CONFIG[segment.name];
          const weight = (segment?.weight || 0) * 100;
          const isExpanded = expandedRow === segment.name;

          return (
            <motion.div
              key={segment.name}
              className="relative rounded-[22px] overflow-hidden"
              style={{
                background: `linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.028) 100%)`,
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: isExpanded ? `1px solid ${config.color}40` : '1px solid rgba(255,255,255,0.06)',
                boxShadow: `
                  inset 0 0 12px rgba(0,0,0,0.45),
                  0 6px 18px rgba(0,0,0,0.08)
                `
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.32 + (idx * 0.08), duration: 0.26 }}
            >
              {/* Clickable Header */}
              <motion.div
                onClick={(e) => handleRowClick(e, segment.name)}
                className="cursor-pointer"
                style={{
                  padding: '17px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: '58px'
                }}
                whileHover={{
                  y: -0.5,
                  boxShadow: `0 0 8px ${config.glow}`,
                  transition: { duration: 0.15 }
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: config.color, boxShadow: `0 0 14px ${config.color}60` }}
                  />
                  <config.Icon className="w-4.5 h-4.5" style={{ color: config.color }} strokeWidth={2.2} />
                  <span 
                    className="text-[15px] font-medium" 
                    style={{ 
                      color: 'rgba(255,255,255,0.82)', 
                      lineHeight: '1.34' 
                    }}
                  >
                    {segment.name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span 
                    className="text-[16px] font-medium text-right" 
                    style={{ 
                      color: 'rgba(255,255,255,0.40)',
                      lineHeight: '1.2'
                    }}
                  >
                    {Math.round(weight)}%
                  </span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    <ChevronDown className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.52)' }} />
                  </motion.div>
                </div>
              </motion.div>

              {/* Expanded Panel - Symmetrical Padding, 8px Glow */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="border-t"
                    style={{ 
                      borderColor: 'rgba(255,255,255,0.06)',
                      background: `linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.028) 100%)`,
                      boxShadow: `
                        inset 0 1px 0 rgba(255,255,255,0.01),
                        inset 0 2px 10px rgba(0,0,0,0.08),
                        0 0 8px ${config.glow}
                      `,
                      padding: '20px 22px',
                      borderRadius: '0 0 22px 22px'
                    }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    {/* TL;DR Chip */}
                    <div 
                      className="inline-block px-3 py-1.5 rounded-lg text-[10px] font-semibold mb-4"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.14)',
                        color: 'rgba(255,255,255,0.74)',
                        letterSpacing: '0.04em'
                      }}
                    >
                      TL;DR
                    </div>

                    <p 
                      className="text-[14px] mb-5" 
                      style={{ 
                        color: 'rgba(255,255,255,0.88)', 
                        lineHeight: '1.34', 
                        maxWidth: '92%' 
                      }}
                    >
                      {segment.name === 'Policy' && (
                        <>
                          <strong style={{ fontWeight: 600, color: 'rgba(255,255,255,0.96)' }}>
                            Regulators tightening oversight in medium-term policy environment.
                          </strong>
                          {' '}Bipartisan push on content/privacy expands audit scope Y/Y.
                        </>
                      )}
                      {segment.name === 'Credit' && (
                        <>
                          <strong style={{ fontWeight: 600, color: 'rgba(255,255,255,0.96)' }}>
                            Spreads widening as stress pockets form in credit markets.
                          </strong>
                          {' '}EM HY spreads widen 35bps WoW.
                        </>
                      )}
                      {segment.name === 'Equities' && (
                        <>
                          <strong style={{ fontWeight: 600, color: 'rgba(255,255,255,0.96)' }}>
                            Market breadth remains flat with limited participation.
                          </strong>
                          {' '}Recent gains concentrated in large-cap.
                        </>
                      )}
                      {segment.name === 'Global' && (
                        <>
                          <strong style={{ fontWeight: 600, color: 'rgba(255,255,255,0.96)' }}>
                            China slowdown weighing on global momentum and trade flows.
                          </strong>
                          {' '}Exports normalize.
                        </>
                      )}
                    </p>

                    {/* Contribution Bar - Unified Track Color */}
                    <div className="relative mb-5">
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
                          transition={{ duration: 0.32, ease: MOTION.CURVES.silk }}
                        />
                      </div>
                    </div>

                    {/* View Full Analysis CTA */}
                    <motion.button
                      onClick={(e) => handleViewFullAnalysis(e, segment)}
                      className="flex items-center gap-2 text-[13px] font-medium ml-auto"
                      style={{ 
                        color: config.color,
                        filter: 'brightness(1.12)'
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.07, duration: 0.25 }}
                      whileHover={{ 
                        x: 2,
                        filter: 'brightness(1.25)',
                        transition: { duration: 0.12 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View full {segment.name} Analysis
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </motion.button>
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
// MAIN STREET ALIGNMENT DRAWER (Rim-Lights, Diffusion, Vertical Gradient)
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

        {/* Drawer Panel - Vertical Gradient, Increased Diffusion */}
        <motion.div
          className="relative w-full max-w-4xl rounded-[28px] overflow-hidden border flex flex-col"
          style={{
            background: 'linear-gradient(180deg, rgba(24, 28, 38, 0.88) 0%, rgba(7, 11, 21, 0.92) 100%)',
            backdropFilter: 'blur(16px) saturate(168%)',
            WebkitBackdropFilter: 'blur(16px) saturate(168%)',
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
            width: '200px',
            height: '1px',
            background: 'linear-gradient(to right, rgba(255,255,255,0.03), transparent)',
            pointerEvents: 'none',
            zIndex: 10
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '200px',
            height: '1px',
            background: 'linear-gradient(to left, rgba(255,255,255,0.03), transparent)',
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
                    marginBottom: '2px',
                    lineHeight: '1.3'
                  }}>
                    Street Alignment
                  </h2>
                  <p style={{ 
                    fontSize: '15px',
                    color: 'rgba(255,255,255,0.55)',
                    fontWeight: 400,
                    marginTop: '4px',
                    lineHeight: '1.35'
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

            {/* Insight Rows */}
            <InsightRows segments={segments} delay={0.98} onOpenDetail={onOpenDetail} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(SentimentDrawer);