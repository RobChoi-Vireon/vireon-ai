// 🔒 DESIGN LOCKED — OS HORIZON TAHOE V5.1 STREET ALIGNMENT REFINEMENT
// Last Updated: 2025-01-20 | V3 Emotion Engine + Apple Glass Applied
// VIREON CERTIFIED — OS Horizon Hybrid Identity (Cinematic Intelligence + Tahoe Serenity)
// Full atmospheric rebuild with depth field, living orb, emotion engine, insight layers
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
// OS HORIZON 2.0 LIVING ALIGNMENT ORB (Emotion Engine V3)
// ============================================================================
const LivingAlignmentOrb = ({ score, delay }) => {
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [particlePhase, setParticlePhase] = useState(0);
  const [glowPhase, setGlowPhase] = useState(0);
  
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
      setGlowPhase(elapsed);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => rafId && cancelAnimationFrame(rafId);
  }, []);

  const breathingScale = 1 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.DURATIONS.breathe)) * 0.018;
  const glowOpacity = 0.05 + Math.sin(glowPhase * (2 * Math.PI / MOTION.DURATIONS.glowCycle)) * 0.07;

  const getZoneColor = (s) => {
    if (s < 40) return '#E86565';
    if (s < 70) return '#70A8E8';
    return '#32C288';
  };

  const color = getZoneColor(score);

  return (
    <motion.div
      className="relative flex items-center justify-center mx-auto mb-4"
      style={{ width: '168px', height: '168px', x: parallaxX, y: parallaxY }}
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
      {/* Breathing Glow Cycle */}
      <motion.div
        className="absolute"
        style={{
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 0%, transparent 72%)`,
          filter: 'blur(52px)',
          pointerEvents: 'none',
          opacity: glowOpacity
        }}
        animate={{ scale: breathingScale * 1.2 }}
        transition={{ duration: MOTION.DURATIONS.breathe, ease: 'easeInOut' }}
      />

      {/* Halo Bloom (On Open) */}
      <motion.div
        className="absolute"
        style={{
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(120,160,255,0.12) 0%, transparent 72%)`,
          filter: 'blur(48px)',
          pointerEvents: 'none'
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.12, duration: 0.18, ease: 'easeOut' }}
      />

      {/* Core Ring Glow */}
      <div style={{
        position: 'absolute',
        width: '190px',
        height: '190px',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(140,160,255,0.20) 0%, transparent 68%)`,
        filter: 'blur(36px)',
        pointerEvents: 'none'
      }} />

      {/* Particle Shimmer Orbit */}
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

      {/* Radial Highlight Sweep (On Open) */}
      <motion.div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.14) 0%, transparent 60%)',
          filter: 'blur(18px)',
          pointerEvents: 'none'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.7] }}
        transition={{ delay: delay + 0.15, duration: 0.5, ease: 'easeOut' }}
      />

      {/* Glass Orb (Multi-Layer) */}
      <motion.div
        className="absolute"
        style={{
          width: '168px',
          height: '168px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.07) 100%)',
          backdropFilter: 'blur(38px) saturate(165%)',
          WebkitBackdropFilter: 'blur(38px) saturate(165%)',
          border: '1px solid rgba(255,255,255,0.22)',
          boxShadow: `
            inset 0 2px 24px rgba(255,255,255,0.20),
            inset 0 -2px 18px rgba(0,0,0,0.28),
            0 16px 40px rgba(120,160,255,0.15)
          `
        }}
        initial={{ scale: 0.96 }}
        animate={{ scale: breathingScale }}
        transition={{ duration: MOTION.DURATIONS.breathe, ease: 'easeInOut' }}
      >
        {/* Micro-Highlight Ring */}
        <div style={{
          position: 'absolute',
          inset: '6px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.06)',
          pointerEvents: 'none'
        }} />

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
// APPLE GLASS V3 TL;DR CAPSULE (Enhanced Insight Reveal)
// ============================================================================
const InsightRevealPanel = ({ segments, delay }) => {
  return (
    <motion.div
      className="relative rounded-[22px] overflow-hidden mx-auto"
      style={{
        maxWidth: '84%',
        padding: '18px 28px',
        background: 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(22px) saturate(158%)',
        WebkitBackdropFilter: 'blur(22px) saturate(158%)',
        border: '0.75px solid rgba(255,255,255,0.12)',
        boxShadow: `
          inset 0 2px 0 rgba(255,255,255,0.18),
          inset 0 0 24px rgba(0,0,0,0.35),
          0 0 32px rgba(140,180,255,0.18),
          0 4px 32px rgba(0,0,0,0.35)
        `,
        marginBottom: '20px'
      }}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay + 0.09, duration: 0.18, ease: MOTION.CURVES.silk }}
      whileHover={{ 
        y: -2,
        boxShadow: `
          inset 0 2px 0 rgba(255,255,255,0.22),
          inset 0 0 24px rgba(0,0,0,0.35),
          0 0 36px rgba(140,180,255,0.22),
          0 6px 40px rgba(0,0,0,0.42)
        `,
        transition: { duration: 0.15 }
      }}
    >
      {/* Top Glossy Streak */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '28px',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.09) 0%, transparent 100%)',
        borderRadius: '22px 22px 0 0',
        pointerEvents: 'none'
      }} />

      {/* Ambient Glow Behind */}
      <div style={{
        position: 'absolute',
        inset: '-12px',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(155,185,255,0.06) 0%, transparent 70%)',
        filter: 'blur(24px)',
        pointerEvents: 'none',
        zIndex: -1
      }} />

      {/* Horizontal Pulse (Initial Load) */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
          borderRadius: '22px',
          pointerEvents: 'none'
        }}
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ delay: delay + 0.2, duration: 1.2, ease: 'easeOut' }}
      />

      <p 
        className="text-center relative z-10"
        style={{ 
          fontSize: '15.5px',
          lineHeight: '1.61',
          color: 'rgba(255,255,255,0.90)',
          letterSpacing: '-0.01em'
        }}
      >
        Markets show mild upward pressure driven by policy tightening and early credit stress signals.
      </p>
    </motion.div>
  );
};

// ============================================================================
// OS HORIZON INTELLIGENCE BLOCKS (V3 Primary Driver Hierarchy)
// ============================================================================
const MacroForceGrid = ({ segments, delay, onOpenDetail }) => {
  const sortedSegments = [...segments].sort((a, b) => (b.weight || 0) - (a.weight || 0));
  
  const tiles = sortedSegments.map((seg, i) => ({
    segment: seg,
    isPrimary: i === 0,
    height: i < 2 ? (i === 0 ? '166px' : '158px') : '128px'
  }));

  return (
    <div style={{ marginBottom: '40px' }}>
      <motion.div
        className="text-[11px] font-medium uppercase tracking-wider mb-4"
        style={{ color: 'rgba(255,255,255,0.48)', letterSpacing: '0.11em' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay - 0.05, duration: 0.3 }}
      >
        What's Driving This Alignment
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {tiles.map((tile, idx) => {
          if (!tile.segment) return null;
          const config = SEGMENT_CONFIG[tile.segment.name];
          const weight = (tile.segment?.weight || 0) * 100;
          const isPrimary = tile.isPrimary;
          const animDelay = delay + (isPrimary ? (tiles.length - 1) * MOTION.DURATIONS.cardStagger : idx * MOTION.DURATIONS.cardStagger);

          return (
            <motion.div
              key={tile.segment.name}
              className="relative rounded-[20px] overflow-hidden cursor-pointer"
              style={{
                height: tile.height,
                background: isPrimary
                  ? `linear-gradient(180deg, rgba(255, 255, 255, 0.058) 0%, rgba(255, 255, 255, 0.034) 100%)`
                  : `linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.028) 100%)`,
                backdropFilter: 'blur(24px) saturate(152%)',
                WebkitBackdropFilter: 'blur(24px) saturate(152%)',
                border: isPrimary 
                  ? `1px solid rgba(255,255,255,0.09)` 
                  : '1px solid rgba(255,255,255,0.06)',
                padding: '22px 26px',
                boxShadow: isPrimary 
                  ? `inset 0 0 0 1px rgba(255,255,255,0.06), 0 12px 24px ${config.color}20, 0 8px 42px rgba(0,0,0,0.44)`
                  : '0 8px 36px rgba(0,0,0,0.36)',
                transform: isPrimary ? 'translateY(-2px)' : 'none'
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: isPrimary ? -2 : 0 }}
              transition={{ 
                delay: animDelay, 
                duration: 0.32, 
                ease: isPrimary ? MOTION.CURVES.bounce : MOTION.CURVES.spring 
              }}
              onClick={() => onOpenDetail?.(tile.segment)}
              whileHover={{ 
                y: isPrimary ? -4 : -2,
                scale: 1.008,
                background: isPrimary 
                  ? `linear-gradient(180deg, rgba(255, 255, 255, 0.068) 0%, rgba(255, 255, 255, 0.044) 100%)`
                  : `linear-gradient(180deg, rgba(255, 255, 255, 0.055) 0%, rgba(255, 255, 255, 0.038) 100%)`,
                boxShadow: isPrimary
                  ? `0 14px 50px rgba(0,0,0,0.48), 0 0 40px ${config.glow}`
                  : `0 12px 44px rgba(0,0,0,0.44), 0 0 32px ${config.glow}`,
                borderColor: 'rgba(255,255,255,0.12)',
                transition: { duration: 0.16 }
              }}
              whileTap={{ scale: 0.995 }}
            >
              {/* Ambient Color Glow */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `
                  radial-gradient(ellipse at 50% -35%, ${config.ambient} 0%, transparent 100%),
                  linear-gradient(135deg, ${config.ambient}06 0%, transparent 70%)
                `,
                borderRadius: '20px',
                pointerEvents: 'none'
              }} />

              {/* Icon + Weight */}
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="w-12 h-12 rounded-[15px] flex items-center justify-center relative"
                  style={{
                    background: `${config.color}${isPrimary ? '12' : '10'}`,
                    border: `1px solid ${config.color}${isPrimary ? '24' : '20'}`,
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.10), 0 0 0 0.5px ${config.color}08`,
                    filter: isPrimary ? 'brightness(1.04)' : 'none'
                  }}
                >
                  <config.Icon 
                    style={{ 
                      color: config.color, 
                      filter: isPrimary ? 'brightness(1.22) saturate(1.1)' : 'brightness(1.18)',
                      opacity: isPrimary ? 1 : 0.95
                    }} 
                    className="w-5.5 h-5.5" 
                    strokeWidth={2} 
                  />
                </div>
                <span 
                  className="text-[20px] font-bold" 
                  style={{ 
                    background: `linear-gradient(to bottom, ${config.color} 0%, ${config.color}dd 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'brightness(1.16)'
                  }}
                >
                  {Math.round(weight)}%
                </span>
              </div>

              {/* Title */}
              <h4 className="text-[16px] font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.94)', letterSpacing: '-0.01em' }}>
                {tile.segment.name}
              </h4>

              {/* Smooth Contribution Bar */}
              <div className="relative">
                <div 
                  className="w-full h-[4px] rounded-full overflow-hidden" 
                  style={{ background: 'rgba(0,0,0,0.24)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ 
                      background: `linear-gradient(90deg, ${config.color}96, ${config.color}f8)`,
                      boxShadow: `0 0 12px ${config.color}34, inset 0 1px 0 rgba(255,255,255,0.14)`
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
// INSIGHT ROWS (V3 OS Horizon Layer System)
// ============================================================================
const InsightRows = ({ segments, delay, onOpenDetail }) => {
  const [expandedRow, setExpandedRow] = useState(null);

  const handleRowClick = (segmentName) => {
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
    >
      <h3 className="text-[11px] font-medium uppercase tracking-wider mb-5" style={{ color: 'rgba(255,255,255,0.46)', letterSpacing: '0.10em' }}>
        Breakdown by Macro Forces
      </h3>

      <div className="space-y-3">
        {segments.map((segment, idx) => {
          const config = SEGMENT_CONFIG[segment.name];
          const weight = (segment?.weight || 0) * 100;
          const isExpanded = expandedRow === segment.name;

          return (
            <motion.div
              key={segment.name}
              className="relative rounded-[16px] overflow-hidden cursor-pointer"
              style={{
                background: `linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.02) 100%)`,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: `
                  inset 0 0 12px rgba(0,0,0,0.45),
                  0 0 16px rgba(80,80,120,0.10)
                `
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.32 + (idx * 0.08), duration: 0.26 }}
              onClick={() => handleRowClick(segment.name)}
              whileHover={{ 
                y: -1,
                background: `linear-gradient(180deg, rgba(255, 255, 255, 0.048) 0%, rgba(255, 255, 255, 0.028) 100%)`,
                borderColor: 'rgba(255,255,255,0.10)',
                boxShadow: `
                  inset 0 0 12px rgba(0,0,0,0.45),
                  0 4px 22px rgba(0,0,0,0.28), 
                  0 0 22px ${config.glow}
                `,
                transition: { duration: 0.14 }
              }}
            >
              {/* Icon Gradient Highlight (Emissive +0.05) */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '16px',
                transform: 'translateY(-50%)',
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${config.ambient} 0%, transparent 68%)`,
                filter: 'blur(18px)',
                pointerEvents: 'none',
                opacity: isExpanded ? 1 : 0.65,
                transition: 'opacity 0.2s ease'
              }} />

              {/* Internal Edge Light */}
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '16px',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                pointerEvents: 'none'
              }} />

              {/* Content */}
              <div 
                className="flex items-center justify-between"
                style={{ padding: '17px 22px', minHeight: '58px' }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: config.color, boxShadow: `0 0 14px ${config.color}60` }}
                  />
                  <config.Icon className="w-4.5 h-4.5" style={{ color: config.color }} strokeWidth={2.2} />
                  <span className="text-[15px] font-semibold" style={{ color: 'rgba(255,255,255,0.82)' }}>
                    {segment.name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[16px] font-bold" style={{ color: 'rgba(255,255,255,0.40)' }}>
                    {Math.round(weight)}%
                  </span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <ChevronDown className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.52)' }} />
                  </motion.div>
                </div>
              </div>

              {/* Expanded Panel (Bloom Effect) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="border-t px-8 py-7"
                    style={{ 
                      borderColor: 'rgba(255,255,255,0.08)',
                      background: `
                        linear-gradient(180deg, rgba(255,255,255,0.026) 0%, rgba(255,255,255,0.018) 100%)
                      `,
                      boxShadow: `
                        inset 0 2px 10px rgba(0,0,0,0.08),
                        0 12px 32px rgba(0,0,0,0.35)
                      `
                    }}
                    initial={{ height: 0, opacity: 0, y: -6 }}
                    animate={{ height: 'auto', opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: MOTION.CURVES.bloom }}
                  >
                    {/* Connecting Gradient Strip */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: '16%',
                      right: '16%',
                      height: '2px',
                      background: `linear-gradient(90deg, transparent, ${config.color}28, transparent)`,
                      filter: 'blur(1px)',
                      pointerEvents: 'none'
                    }} />

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

                    <p className="text-[14px] mb-5" style={{ color: 'rgba(255,255,255,0.88)', lineHeight: '1.62', maxWidth: '92%' }}>
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

                    {/* Contribution Bar */}
                    <div className="relative mb-5">
                      <div 
                        className="w-full h-[4px] rounded-full overflow-hidden" 
                        style={{ background: 'rgba(0,0,0,0.22)' }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ 
                            background: `linear-gradient(90deg, ${config.color}94, ${config.color}f8)`,
                            boxShadow: `0 0 10px ${config.color}32, inset 0 1px 0 rgba(255,255,255,0.12)`
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
                        textDecoration: 'underline',
                        textDecorationColor: `${config.color}60`,
                        textDecorationThickness: '1px',
                        textUnderlineOffset: '3px',
                        textShadow: `0 0 12px ${config.color}40`,
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
            backdropFilter: 'blur(48px) saturate(215%)',
            WebkitBackdropFilter: 'blur(48px) saturate(215%)',
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
          {/* Atmospheric Lightfield (Magic Layer) */}
          <div style={{
            position: 'absolute',
            zIndex: 0,
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            height: '540px',
            background: 'radial-gradient(circle at 50% 18%, rgba(155, 185, 255, 0.11) 0%, rgba(0, 0, 0, 0) 72%)',
            mixBlendMode: 'screen',
            pointerEvents: 'none'
          }} />

          {/* Ambient Top-Down Soft Gradient */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 40%)',
            pointerEvents: 'none',
            borderRadius: '32px'
          }} />

          {/* Corner-Lens Lighting (Top-Left) */}
          <div style={{
            position: 'absolute',
            top: '-5%',
            left: '-5%',
            width: '30%',
            height: '30%',
            background: 'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)',
            filter: 'blur(32px)',
            pointerEvents: 'none'
          }} />

          {/* Corner-Lens Lighting (Bottom-Right) */}
          <div style={{
            position: 'absolute',
            bottom: '-5%',
            right: '-5%',
            width: '30%',
            height: '30%',
            background: 'radial-gradient(circle at 100% 100%, rgba(255,255,255,0.03) 0%, transparent 70%)',
            filter: 'blur(32px)',
            pointerEvents: 'none'
          }} />

          {/* Particle Noise (Premium Glass Depth) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.015'/%3E%3C/svg%3E")`,
            opacity: 0.015,
            pointerEvents: 'none',
            borderRadius: '32px',
            mixBlendMode: 'overlay'
          }} />

          {/* Edge Bloom (3-4% Opacity) */}
          <div style={{
            position: 'absolute',
            inset: '-2px',
            borderRadius: '32px',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.035) 0%, transparent 65%)',
            pointerEvents: 'none'
          }} />

          {/* Top Rim Light */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '16%',
            right: '16%',
            height: '1.5px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.32), transparent)',
            filter: 'blur(1.3px)',
            pointerEvents: 'none'
          }} />

          {/* Header */}
          <motion.div 
            className="relative border-b flex-shrink-0" 
            style={{ 
              borderColor: 'rgba(255,255,255,0.10)',
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
                    backdropFilter: 'blur(24px)',
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
              padding: '44px 52px 56px 52px',
              position: 'relative',
              zIndex: 1
            }}
          >
            {/* Living Orb */}
            <LivingAlignmentOrb score={consensusScore} delay={0.02} />
            
            {/* Metadata */}
            <motion.p
              className="text-[11px] text-center mb-6"
              style={{ color: 'rgba(255,255,255,0.46)' }}
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