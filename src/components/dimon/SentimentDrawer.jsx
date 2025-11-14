
// 🔒 DESIGN LOCKED — OS HORIZON V4.0
// Last Updated: 2025-01-20
// Do not modify visual design without explicit assignment
// See: DESIGN_LOCKED_COMPONENTS.md

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Minus, Activity, BarChart3, Zap, Shield, Globe, Briefcase, ArrowRight, AlertTriangle, ArrowRightCircle } from 'lucide-react';

// OS Horizon Motion Tokens
const MOTION = {
  CURVES: {
    horizonIn: [0.22, 0.61, 0.36, 1],
    horizonOut: [0.4, 0.0, 0.2, 1]
  },
  DURATIONS: {
    fast: 0.18,
    base: 0.24,
    slow: 0.36
  }
};

// Simplified Radial Gauge (Inline to avoid import issues)
const RadialGauge = ({ score }) => {
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

  return (
    <div className="relative flex items-center justify-center w-[136px] h-[136px] mx-auto">
      <svg width="136" height="136" className="transform -rotate-90">
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
          stroke="rgba(255,255,255,0.1)"
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
        <motion.span
          className="text-[10px] font-medium uppercase tracking-wide mb-1"
          style={{ 
            color: 'rgba(255,255,255,0.70)',
            letterSpacing: '0.08em'
          }}
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          Overall Street Alignment
        </motion.span>
        
        <motion.span
          className="text-3xl font-bold"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {score}
        </motion.span>
        
        <motion.div
          className="text-center mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
        >
          <div className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.88)' }}>
            {label}
          </div>
          <div className="text-[11px] font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Weight: Medium
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const SentimentDrawer = ({ isOpen, onClose, score, breakdown, onOpenDetail }) => {
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
      high: { label: 'High Stress', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.30)', text: '#F26A6A' },
      moderate: { label: 'Moderate', bg: 'rgba(251, 191, 36, 0.12)', border: 'rgba(251, 191, 36, 0.30)', text: '#FFB020' },
      stable: { label: 'Stable', bg: 'rgba(46, 207, 141, 0.12)', border: 'rgba(46, 207, 141, 0.30)', text: '#2ECF8D' }
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

  if (!isOpen) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { 
      opacity: 1, 
      backdropFilter: 'blur(12px)',
      transition: { duration: 0.3 }
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
        ease: MOTION.CURVES.horizonIn
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.98, 
      y: 12,
      transition: { duration: 0.25, ease: MOTION.CURVES.horizonOut }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: MOTION.CURVES.horizonIn }
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
            background: 'rgba(0,0,0,0.60)'
          }}
          onClick={onClose}
        />

        <motion.div
          className="relative w-full max-w-2xl rounded-3xl overflow-hidden border"
          style={{
            background: 'rgba(15, 18, 25, 0.95)',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            borderColor: 'rgba(255,255,255,0.12)',
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.8),
              0 0 40px rgba(94, 167, 255, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.08)
            `
          }}
          variants={drawerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Subsurface Lighting */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)',
            pointerEvents: 'none'
          }} />

          {/* Header */}
          <motion.div variants={itemVariants} className="relative p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-xl border flex items-center justify-center"
                  style={{
                    background: 'rgba(94, 167, 255, 0.10)',
                    borderColor: 'rgba(94, 167, 255, 0.25)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Activity className="w-6 h-6" style={{ color: '#5EA7FF' }} strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.95)' }}>
                    Street Alignment
                  </h2>
                  <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.70)' }}>
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
                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.12)' }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.70)' }} />
              </motion.button>
            </div>
          </motion.div>

          {/* Body */}
          <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
            {/* Top Section: Gauge */}
            <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
              <RadialGauge score={consensusScore} />
              
              {/* Source Footer Under Gauge */}
              <motion.p
                className="text-xs text-center mt-4"
                style={{ color: 'rgba(255,255,255,0.70)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                Based on 5 sources • Updated 2m ago
              </motion.p>
            </motion.div>

            {/* Bottom Section: Segment Tiles */}
            {segments.length > 0 ? (
              <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {segments.map((segment, index) => {
                  const { Icon } = getTrendInfo(segment?.trend, segment?.name);
                  const weight = (segment?.weight || 0) * 100;
                  const iconColor = getSegmentIconColor(segment?.name);
                  const stressChip = getStressChip(segment?.stress_level);
                  const trendChip = getTrendChip(segment?.trend_indicator);

                  const handleOpenDetail = () => onOpenDetail && onOpenDetail(segment);

                  return (
                    <motion.div
                      key={segment.name}
                      variants={itemVariants}
                      className="relative p-4 rounded-2xl border backdrop-blur-lg transition-all duration-300 cursor-pointer group overflow-hidden"
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        borderColor: 'rgba(255,255,255,0.12)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.15)'
                      }}
                      whileHover={{ 
                        y: -3,
                        borderColor: 'rgba(255,255,255,0.20)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 24px rgba(0,0,0,0.25)',
                        transition: { duration: 0.2 }
                      }}
                      onClick={handleOpenDetail}
                    >
                      {/* Ambient Glow */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at 50% 0%, ${iconColor}15 0%, transparent 60%)`,
                          opacity: 0
                        }}
                        animate={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />

                      {/* Row 1: Icon + Title + Weight */}
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{
                              background: `${iconColor}12`,
                              border: `1px solid ${iconColor}25`
                            }}
                          >
                            <Icon className="w-4 h-4" style={{ color: iconColor }} strokeWidth={2.5} />
                          </div>
                          <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.92)' }}>
                            {String(segment?.name || 'Unknown')}
                          </span>
                        </div>
                        <span className="text-lg font-bold" style={{ color: iconColor }}>
                          {Math.round(weight)}%
                        </span>
                      </div>
                      
                      {/* Row 2: Short Description */}
                      <p className="text-sm mb-3" style={{ 
                        color: 'rgba(255,255,255,0.82)', 
                        lineHeight: '1.5',
                        minHeight: '2.5em'
                      }}>
                        {String(segment?.note || 'No additional insights.')}
                      </p>

                      {/* Row 3: Chips + Mini Bar */}
                      <div className="space-y-2.5">
                        {/* Chips Row */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Stress Chip */}
                          <div
                            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
                            style={{
                              background: stressChip.bg,
                              border: `1px solid ${stressChip.border}`,
                              color: stressChip.text,
                              letterSpacing: '0.05em'
                            }}
                          >
                            <AlertTriangle className="w-3 h-3" />
                            <span>{stressChip.label}</span>
                          </div>

                          {/* Trend Chip */}
                          <div
                            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
                            style={{
                              background: `${trendChip.color}12`,
                              border: `1px solid ${trendChip.color}30`,
                              color: trendChip.color,
                              letterSpacing: '0.05em'
                            }}
                          >
                            {React.cloneElement(<trendChip.Icon />, { className: "w-3 h-3" })}
                            <span>{trendChip.label}</span>
                          </div>
                        </div>

                        {/* Mini Status Bar */}
                        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.25)' }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ 
                              background: `linear-gradient(90deg, ${getScoreColor(weight)}99, ${getScoreColor(weight)}ff)`
                            }}
                            initial={{ width: '0%' }}
                            animate={{ width: `${weight}%` }}
                            transition={{ duration: 0.6, delay: 0.3 + index * 0.08, ease: 'easeOut' }}
                          />
                        </div>
                      </div>

                      {/* Hover CTA */}
                      <motion.div 
                        className="flex items-center justify-end text-xs font-medium mt-2.5"
                        style={{ color: 'rgba(255,255,255,0.60)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
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
