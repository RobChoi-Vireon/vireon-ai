// 🔒 DESIGN LOCKED — OS HORIZON V5.0 FULL CERTIFICATION (16/16 PILLARS)
// Last Updated: 2025-01-20
// OS HORIZON CERTIFIED — Liquid Glass + Cinematic Motion + Apple Psychology
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Minus, Activity, BarChart3, Zap, Shield, Globe, Briefcase, ArrowRight, AlertTriangle, ArrowRightCircle } from 'lucide-react';

// OS Horizon Motion DNA (Primary Curves)
const MOTION = {
  CURVES: {
    primary: [0.22, 0.61, 0.36, 1],      // Hero animations
    secondary: [0.25, 0.46, 0.45, 0.94], // Card interactions
    tertiary: [0.20, 0.60, 0.35, 1]      // Micro-interactions
  },
  DURATIONS: {
    fast: 0.11,
    base: 0.15,
    slow: 0.22,
    breathing: 6.5
  }
};

// Enhanced Radial Gauge with Full Cinematic Motion
const RadialGauge = ({ score }) => {
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const gaugeRef = useRef(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 150, damping: 30, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-50, 50], [1, -1]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-50, 50], [-1, 1]), springConfig);

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getZoneColor = (s) => {
    if (s < 40) return '#F26A6A';
    if (s < 70) return '#5EA7FF';
    return '#2ECF8D';
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

  // Breathing animation
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

  // Parallax effect
  useEffect(() => {
    if (shouldReduceMotion || !gaugeRef?.current) return;

    const handleMouseMove = (e) => {
      const rect = gaugeRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    const parent = gaugeRef.current;
    parent.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      parent.removeEventListener('mousemove', handleMouseMove);
    };
  }, [shouldReduceMotion, mouseX, mouseY]);

  const breathingScale = 1 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.DURATIONS.breathing)) * 0.01;
  const breathingOpacity = 0.03 + Math.sin(breathingPhase * (2 * Math.PI / MOTION.DURATIONS.breathing)) * 0.02;
  const internalGradientShift = Math.sin(breathingPhase * (2 * Math.PI / 7)) * 2;

  return (
    <div ref={gaugeRef} className="relative flex items-center justify-center w-[136px] h-[136px] mx-auto">
      {/* Subsurface halo layer with breathing */}
      <motion.div
        className="absolute"
        style={{
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
          filter: 'blur(28px)',
          pointerEvents: 'none'
        }}
        animate={{
          opacity: breathingOpacity + 0.03,
          scale: breathingScale * 1.1
        }}
        transition={{
          opacity: { duration: MOTION.DURATIONS.breathing, ease: 'easeInOut' },
          scale: { duration: MOTION.DURATIONS.breathing, ease: 'easeInOut' }
        }}
      />

      {/* Mid-layer diffusion with parallax shift */}
      <motion.div
        className="absolute"
        style={{
          width: '145px',
          height: '145px',
          borderRadius: '50%',
          background: `
            radial-gradient(circle at ${50 + internalGradientShift}% ${48 + internalGradientShift * 0.5}%, 
              ${color}12 0%, 
              ${color}06 45%,
              transparent 68%)
          `,
          filter: 'blur(18px)',
          pointerEvents: 'none',
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY
        }}
        animate={{
          scale: breathingScale * 1.02
        }}
        transition={{
          scale: { duration: MOTION.DURATIONS.breathing, ease: 'easeInOut' }
        }}
      />

      <svg width="136" height="136" className="transform -rotate-90 relative z-10">
        <defs>
          <filter id="gauge-glow-modal" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feColorMatrix 
              in="coloredBlur" 
              type="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.15 0"
            />
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <circle
          cx="68"
          cy="68"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="10"
        />
        
        <motion.circle
          cx="68"
          cy="68"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeLinecap="round"
          filter="url(#gauge-glow-modal)"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Light bloom effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color}08 0%, transparent 70%)`,
            pointerEvents: 'none'
          }}
          animate={{
            opacity: [0.5, 0.7, 0.5],
            scale: [1, 1.08, 1]
          }}
          transition={{
            duration: MOTION.DURATIONS.breathing,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        <motion.span
          className="text-[10px] font-medium uppercase tracking-wide mb-1 relative z-10"
          style={{ 
            color: 'rgba(255,255,255,0.78)',
            letterSpacing: '0.08em'
          }}
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3, ease: MOTION.CURVES.tertiary }}
        >
          Overall Street Alignment
        </motion.span>
        
        <motion.span
          className="text-3xl font-bold relative z-10"
          style={{ 
            color,
            textShadow: `0 0 18px ${color}40, 0 2px 6px rgba(0,0,0,0.28)`
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3, ease: MOTION.CURVES.primary }}
        >
          {score}
        </motion.span>
        
        <motion.div
          className="text-center mt-1 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.3, ease: MOTION.CURVES.secondary }}
        >
          <div className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.96)' }}>
            {label}
          </div>
          <div className="text-[11px] font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Weight: Medium
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const SentimentDrawer = ({ isOpen, onClose, score, breakdown, onOpenDetail }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose?.();
        }
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

  const getTrendInfo = (trend, name) => {
    switch (name) {
      case 'Policy': return { Icon: Shield, color: '#5EA7FF' };
      case 'Credit': return { Icon: Briefcase, color: '#C084FC' };
      case 'Equities': return { Icon: BarChart3, color: '#2ECF8D' };
      case 'Global': return { Icon: Globe, color: '#FFB020' };
      default: return { Icon: Zap, color: '#AAB1B8' };
    }
  };

  const getStressChip = (level) => {
    const config = {
      high: { label: 'High Stress', bg: 'rgba(239, 68, 68, 0.10)', border: 'rgba(239, 68, 68, 0.28)', text: '#F26A6A' },
      moderate: { label: 'Moderate', bg: 'rgba(251, 191, 36, 0.10)', border: 'rgba(251, 191, 36, 0.28)', text: '#FFB020' },
      stable: { label: 'Stable', bg: 'rgba(46, 207, 141, 0.10)', border: 'rgba(46, 207, 141, 0.28)', text: '#2ECF8D' }
    };
    return config[level] || config.stable;
  };

  const getTrendChip = (indicator) => {
    const config = {
      worsening: { label: 'Worsening', Icon: TrendingDown, color: '#F26A6A' },
      rising: { label: 'Rising', Icon: TrendingUp, color: '#FFB020' },
      stable: { label: 'Stable', Icon: Minus, color: '#5EA7FF' }
    };
    return config[indicator] || config.stable;
  };

  const getScoreColor = (s) => {
    if (s >= 70) return '#2ECF8D';
    if (s >= 40) return '#5EA7FF';
    return '#F26A6A';
  };

  const getSegmentIconColor = (name) => {
    switch (name) {
      case 'Policy': return '#5EA7FF';
      case 'Credit': return '#C084FC';
      case 'Equities': return '#2ECF8D';
      case 'Global': return '#FFB020';
      default: return '#AAB1B8';
    }
  };

  const getSegmentTint = (name) => {
    switch (name) {
      case 'Policy': return 'rgba(94, 167, 255, 0.03)';
      case 'Credit': return 'rgba(192, 132, 252, 0.03)';
      case 'Equities': return 'rgba(46, 207, 141, 0.03)';
      case 'Global': return 'rgba(255, 176, 32, 0.03)';
      default: return 'rgba(170, 177, 184, 0.03)';
    }
  };

  if (!isOpen) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { 
      opacity: 1, 
      backdropFilter: 'blur(16px)',
      transition: { duration: 0.3, ease: MOTION.CURVES.primary }
    }
  };

  const drawerVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.96, 
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: MOTION.CURVES.primary
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.98, 
      y: 12,
      transition: { duration: 0.25, ease: MOTION.CURVES.secondary }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: MOTION.CURVES.primary }
    },
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        style={{ paddingTop: '80px' }}
      >
        <motion.div
          className="absolute left-0 right-0 bottom-0"
          style={{ 
            top: '80px',
            background: 'rgba(0,0,0,0.55)'
          }}
          onClick={onClose}
        />

        <motion.div
          className="relative w-full max-w-2xl rounded-[28px] overflow-hidden border"
          style={{
            background: `
              linear-gradient(180deg, 
                rgba(15, 18, 25, 0.92) 0%,
                rgba(14, 17, 24, 0.94) 45%,
                rgba(13, 16, 23, 0.96) 100%
              )
            `,
            backdropFilter: 'blur(32px) saturate(165%)',
            WebkitBackdropFilter: 'blur(32px) saturate(165%)',
            borderColor: 'rgba(255,255,255,0.14)',
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.75),
              0 0 40px rgba(94, 167, 255, 0.12),
              inset 0 1px 0 rgba(255, 255, 255, 0.10),
              inset 0 0 3px rgba(94, 167, 255, 0.05)
            `
          }}
          variants={drawerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* 3-LAYER LIQUID GLASS SYSTEM */}
          
          {/* Layer 1: Subsurface Gradient */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '35%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.022) 0%, transparent 100%)',
            pointerEvents: 'none',
            borderRadius: '28px 28px 0 0'
          }} />

          {/* Layer 2: Soft Haze */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(94, 167, 255, 0.015) 0%, transparent 60%)',
            pointerEvents: 'none',
            opacity: 0.6,
            borderRadius: '28px'
          }} />

          {/* Layer 3: Surface Reflection */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
            pointerEvents: 'none'
          }} />

          {/* Internal Depth Shadows (Premium Corners) */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 100%)',
            pointerEvents: 'none',
            borderRadius: '28px 28px 0 0'
          }} />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: 'linear-gradient(0deg, rgba(0,0,0,0.15) 0%, transparent 100%)',
            pointerEvents: 'none',
            borderRadius: '0 0 28px 28px'
          }} />

          {/* 1% Digital Grain (OS Horizon Texture) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '28px',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
            backgroundSize: '150px 150px',
            opacity: 0.01,
            mixBlendMode: 'overlay',
            pointerEvents: 'none'
          }} />

          {/* Header */}
          <motion.div variants={itemVariants} className="relative p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-xl border flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'rgba(94, 167, 255, 0.08)',
                    borderColor: 'rgba(94, 167, 255, 0.22)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.08), 0 2px 8px rgba(94, 167, 255, 0.15)'
                  }}
                >
                  {/* Micro-reflection inside icon */}
                  <div style={{
                    position: 'absolute',
                    top: '3px',
                    left: '3px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '6px',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)',
                    pointerEvents: 'none'
                  }} />
                  <Activity className="w-6 h-6 relative z-10" style={{ color: '#5EA7FF' }} strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.98)' }}>
                    Street Alignment
                  </h2>
                  <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.76)' }}>
                    Consensus & Segment Breakdown
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.10)'
                }}
                whileHover={{ 
                  scale: 1.05, 
                  background: 'rgba(255,255,255,0.12)',
                  transition: { duration: MOTION.DURATIONS.fast }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.76)' }} />
              </motion.button>
            </div>
          </motion.div>

          {/* Body - Enhanced Spacing */}
          <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
            {/* Top Section: Gauge with Enhanced Spacing (+12px from header) */}
            <motion.div variants={itemVariants} className="flex flex-col items-center mb-10" style={{ marginTop: '12px' }}>
              <RadialGauge score={consensusScore} />
              
              {/* Source Footer with +6% Contrast */}
              <motion.p
                className="text-xs text-center mt-6"
                style={{ color: 'rgba(255,255,255,0.76)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, ease: MOTION.CURVES.tertiary }}
              >
                Based on 5 sources • Updated 2m ago
              </motion.p>
            </motion.div>

            {/* Bottom Section: Segment Tiles with +10px Spacing */}
            {segments.length > 0 ? (
              <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {segments.map((segment, index) => {
                  const { Icon } = getTrendInfo(segment?.trend, segment?.name);
                  const weight = (segment?.weight || 0) * 100;
                  const iconColor = getSegmentIconColor(segment?.name);
                  const segmentTint = getSegmentTint(segment?.name);
                  const stressChip = getStressChip(segment?.stress_level);
                  const trendChip = getTrendChip(segment?.trend_indicator);
                  const isHovered = hoveredCard === segment.name;

                  const handleOpenDetail = () => onOpenDetail && onOpenDetail(segment);

                  return (
                    <motion.div
                      key={segment.name}
                      variants={itemVariants}
                      className="relative p-6 rounded-[20px] border backdrop-blur-lg transition-all duration-300 cursor-pointer group overflow-hidden"
                      style={{
                        background: `
                          linear-gradient(180deg, 
                            rgba(255, 255, 255, 0.05) 0%, 
                            rgba(255, 255, 255, 0.03) 100%
                          )
                        `,
                        borderColor: 'rgba(255,255,255,0.12)',
                        boxShadow: `
                          inset 0 1px 0 rgba(255,255,255,0.08), 
                          0 4px 16px rgba(0,0,0,0.12)
                        `
                      }}
                      onHoverStart={() => setHoveredCard(segment.name)}
                      onHoverEnd={() => setHoveredCard(null)}
                      animate={{
                        y: isHovered ? -2 : 0,
                        borderColor: isHovered ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.12)',
                        boxShadow: isHovered
                          ? `
                            inset 0 1px 0 rgba(255,255,255,0.08), 
                            0 8px 28px rgba(0,0,0,0.22)
                          `
                          : `
                            inset 0 1px 0 rgba(255,255,255,0.08), 
                            0 4px 16px rgba(0,0,0,0.12)
                          `,
                        backdropFilter: isHovered ? 'blur(24px)' : 'blur(22px)'
                      }}
                      transition={{
                        duration: MOTION.DURATIONS.base,
                        ease: MOTION.CURVES.secondary
                      }}
                      onClick={handleOpenDetail}
                    >
                      {/* Subtle Category Tint (3-5% strength) */}
                      <motion.div
                        className="absolute inset-0 rounded-[20px] pointer-events-none"
                        style={{
                          background: `
                            radial-gradient(circle at 50% 0%, ${segmentTint} 0%, transparent 100%)
                          `
                        }}
                        animate={{
                          opacity: isHovered ? 1 : 0.6
                        }}
                        transition={{ duration: 0.3 }}
                      />

                      {/* Ambient Glow on Hover */}
                      <motion.div
                        className="absolute inset-0 rounded-[20px] pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at 50% 0%, ${iconColor}12 0%, transparent 65%)`,
                          opacity: 0
                        }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.25 }}
                      />

                      {/* Micro-reflection inside card */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '20%',
                        right: '20%',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                        pointerEvents: 'none'
                      }} />

                      {/* Row 1: Icon + Title + Weight */}
                      <div className="flex items-center justify-between mb-3 relative z-10">
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center relative"
                            style={{
                              background: `${iconColor}10`,
                              border: `1px solid ${iconColor}25`,
                              boxShadow: `inset 0 1px 1px rgba(255,255,255,0.08), 0 2px 6px ${iconColor}15`
                            }}
                          >
                            {/* Icon micro-reflection */}
                            <div style={{
                              position: 'absolute',
                              top: '2px',
                              left: '2px',
                              width: '12px',
                              height: '12px',
                              borderRadius: '4px',
                              background: 'linear-gradient(135deg, rgba(255,255,255,0.12), transparent)',
                              pointerEvents: 'none'
                            }} />
                            <Icon className="w-4 h-4 relative z-10" style={{ color: iconColor }} strokeWidth={2.5} />
                          </div>
                          <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.96)' }}>
                            {String(segment?.name || 'Unknown')}
                          </span>
                        </div>
                        <span className="text-lg font-bold" style={{ color: iconColor }}>
                          {Math.round(weight)}%
                        </span>
                      </div>
                      
                      {/* Row 2: Short Description with Light Translucency */}
                      <div 
                        className="relative mb-3.5 p-2.5 rounded-lg"
                        style={{
                          background: 'rgba(255,255,255,0.025)',
                          backdropFilter: 'blur(8px)'
                        }}
                      >
                        <p className="text-sm" style={{ 
                          color: 'rgba(255,255,255,0.88)', 
                          lineHeight: '1.5',
                          minHeight: '2.5em'
                        }}>
                          {String(segment?.note || 'No additional insights.')}
                        </p>
                      </div>

                      {/* Row 3: Chips + Mini Bar */}
                      <div className="space-y-2.5 relative z-10">
                        {/* Chips Row with Premium Depth Shadows */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Stress Chip */}
                          <motion.div
                            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
                            style={{
                              background: stressChip.bg,
                              border: `1px solid ${stressChip.border}`,
                              color: stressChip.text,
                              letterSpacing: '0.05em',
                              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.12)'
                            }}
                            whileHover={{
                              background: `${stressChip.bg}cc`,
                              transition: { duration: MOTION.DURATIONS.fast }
                            }}
                          >
                            <AlertTriangle className="w-3 h-3" />
                            <span>{stressChip.label}</span>
                            
                            {/* Micro-shimmer on hover */}
                            {isHovered && (
                              <motion.div
                                className="absolute inset-0 rounded-lg"
                                style={{
                                  background: `linear-gradient(90deg, transparent 0%, ${stressChip.text}15 50%, transparent 100%)`,
                                  opacity: 0
                                }}
                                animate={{
                                  x: ['-100%', '100%'],
                                  opacity: [0, 0.02, 0]
                                }}
                                transition={{
                                  duration: 1.2,
                                  ease: 'linear'
                                }}
                              />
                            )}
                          </motion.div>

                          {/* Trend Chip (Directional Metaphor) */}
                          <motion.div
                            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
                            style={{
                              background: `${trendChip.color}10`,
                              border: `1px solid ${trendChip.color}28`,
                              color: trendChip.color,
                              letterSpacing: '0.05em',
                              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.12)'
                            }}
                            whileHover={{
                              background: `${trendChip.color}15`,
                              transition: { duration: MOTION.DURATIONS.fast }
                            }}
                          >
                            {React.cloneElement(<trendChip.Icon />, { className: "w-3 h-3" })}
                            <span>{trendChip.label}</span>
                          </motion.div>
                        </div>

                        {/* Mini Status Bar (Thermal Gauge Metaphor) */}
                        <div 
                          className="w-full h-1.5 rounded-full overflow-hidden relative" 
                          style={{ background: 'rgba(0,0,0,0.28)' }}
                        >
                          {/* Glass reflection on bar */}
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '50%',
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.08), transparent)',
                            pointerEvents: 'none'
                          }} />
                          
                          <motion.div
                            className="h-full rounded-full relative"
                            style={{ 
                              background: `linear-gradient(90deg, ${getScoreColor(weight)}aa, ${getScoreColor(weight)}ff)`,
                              boxShadow: `0 0 8px ${getScoreColor(weight)}40`
                            }}
                            initial={{ width: '0%' }}
                            animate={{ width: `${weight}%` }}
                            transition={{ 
                              duration: 0.6, 
                              delay: 0.3 + index * 0.06, 
                              ease: 'easeOut' 
                            }}
                          />
                        </div>
                      </div>

                      {/* Hover CTA with Calm Fade */}
                      <motion.div 
                        className="flex items-center justify-end text-xs font-medium mt-3 relative z-10"
                        style={{ color: 'rgba(255,255,255,0.60)' }}
                        animate={{ 
                          opacity: isHovered ? 1 : 0,
                          y: isHovered ? 0 : 2
                        }}
                        transition={{ 
                          duration: MOTION.DURATIONS.base,
                          ease: MOTION.CURVES.tertiary
                        }}
                      >
                        <span>View Analysis</span>
                        <ArrowRight className="w-3 h-3 ml-1.5" />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div variants={itemVariants} className="text-center py-8">
                <Zap className="w-8 h-8 mx-auto mb-2" style={{ color: 'rgba(255,255,255,0.30)' }} />
                <p style={{ color: 'rgba(255,255,255,0.60)' }}>No segment data available</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(SentimentDrawer);