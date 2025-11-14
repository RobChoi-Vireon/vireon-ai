
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, Briefcase, BarChart3, Globe, TrendingUp, TrendingDown } from 'lucide-react';

// ============================================================================
// OS HORIZON DESIGN TOKENS — VIREON CONSENSUS METER V4.0
// ============================================================================

const MOTION = {
  CURVES: {
    horizonIn: [0.22, 0.61, 0.36, 1],
    horizonOut: [0.4, 0.0, 0.2, 1],
    appleCurve: [0.32, 0.72, 0, 1]
  },
  DURATIONS: {
    ultraFast: 0.09,
    fast: 0.12,
    base: 0.18,
    slow: 0.60
  }
};

const COLORS = {
  textPrimary: 'rgba(255,255,255,0.95)',
  textMedium: 'rgba(255,255,255,0.82)',
  textCaption: 'rgba(255,255,255,0.60)',
  textMuted: 'rgba(255,255,255,0.55)',
  bull: '#2ECF8D',
  bear: '#F26A6A',
  neutral: '#5EA7FF',
  segments: {
    Policy: '#5EA7FF',
    Credit: '#C084FC',
    Equities: '#2ECF8D',
    Global: '#FFB020'
  }
};

// ============================================================================
// RADIAL GAUGE — APPLE-GRADE CALM DONUT
// ============================================================================

const RadialGauge = ({ score, isHovered }) => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getZoneConfig = (s) => {
    if (s < 40) return { color: COLORS.bear, label: 'Bearish', conviction: 'Low' };
    if (s < 70) return { color: COLORS.neutral, label: 'Mixed', conviction: 'Medium' };
    return { color: COLORS.bull, label: 'Bullish', conviction: 'High' };
  };

  const { color, label, conviction } = getZoneConfig(score);

  return (
    <div className="relative flex items-center justify-center w-[136px] h-[136px] mx-auto">
      <svg width="136" height="136" className="transform -rotate-90">
        <defs>
          {/* Reduced glow intensity by 15-20% (stdDev 3.5→2.8, opacity 1.15→0.95) */}
          <filter id="gauge-calm-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.8" result="coloredBlur"/>
            <feColorMatrix 
              in="coloredBlur" 
              type="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.95 0"
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
          filter="url(#gauge-calm-glow)"
          initial={{ strokeDashoffset: circumference }}
          animate={{ 
            strokeDashoffset: shouldReduceMotion ? offset : offset,
            opacity: isHovered ? 1 : 0.95
          }}
          transition={shouldReduceMotion ? { duration: 0 } : { 
            duration: 0.8, 
            ease: MOTION.CURVES.horizonIn,
            opacity: { duration: 0.2 }
          }}
          onAnimationComplete={() => {
            if (!hasAnimated) {
              setHasAnimated(true);
            }
          }}
        />
      </svg>
      
      {/* Donut Content - OS Horizon Typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Tier 1: Caption Label Above (55-65% opacity, 9-10px) */}
        <motion.span
          className="text-[9px] font-medium uppercase tracking-wide"
          style={{ 
            color: COLORS.textCaption,
            letterSpacing: '0.12em',
            marginBottom: '10px'
          }}
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          Street Alignment
        </motion.span>
        
        {/* Tier 2: Hero Number (unchanged brightness) */}
        <motion.span
          className="text-3xl font-bold"
          style={{ color, marginBottom: '10px' }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ 
            opacity: 1, 
            scale: hasAnimated ? [1, 1.04, 1] : 1
          }}
          transition={hasAnimated ? {
            scale: { duration: 0.5, ease: MOTION.CURVES.appleCurve }
          } : {
            delay: 0.5, 
            duration: 0.3
          }}
        >
          {score}
        </motion.span>
        
        {/* Tier 3 & 4: Medium Emphasis + Caption Combined */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
        >
          {/* Single Line: "Mixed Consensus • Conviction: Medium" */}
          <div className="text-[12px] font-medium" style={{ color: COLORS.textMedium }}>
            {label} Consensus <span style={{ color: COLORS.textCaption }}>•</span> <span style={{ color: COLORS.textCaption }}>Conviction: {conviction}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================================================
// SEGMENT CHIP — INFORMATIONAL PILL (REPLACES MINI-RINGS)
// ============================================================================

const SegmentChip = ({ name, stance, icon: Icon, color, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative flex items-center gap-2 px-4 py-2 rounded-full border cursor-help group"
      style={{
        background: `${color}08`,
        borderColor: `${color}20`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: 0.5 + delay * 0.04, 
        duration: MOTION.DURATIONS.base,
        ease: MOTION.CURVES.horizonIn
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        y: -1,
        scale: 1.02,
        borderColor: `${color}35`,
        transition: { duration: MOTION.DURATIONS.ultraFast }
      }}
    >
      {/* Soft Pulse Highlight on Hover (90ms) */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}25 0%, transparent 70%)`,
          opacity: 0
        }}
        animate={{ opacity: isHovered ? 0.4 : 0 }}
        transition={{ duration: MOTION.DURATIONS.ultraFast }}
      />

      {/* Icon */}
      <div 
        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
        style={{
          background: `${color}15`,
          border: `1px solid ${color}30`
        }}
      >
        <Icon className="w-2.5 h-2.5" style={{ color }} strokeWidth={2.5} />
      </div>

      {/* Stance Text */}
      <span className="text-[11px] font-semibold relative z-10" style={{ color: COLORS.textMedium }}>
        {stance}
      </span>
    </motion.div>
  );
};

// ============================================================================
// TRENDLINE — EXPLAINABLE VISUALIZATION
// ============================================================================

const Sparkline = ({ data = [62, 58, 61, 59, 64, 67, 66], delay = 0 }) => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 32 - ((value - minValue) / range) * 28;
    return `${x},${y}`;
  }).join(' ');

  const slope = data[data.length - 1] - data[0];
  const isImproving = slope > 0;
  const isWeakening = slope < 0;
  const color = isImproving ? COLORS.bull : isWeakening ? COLORS.bear : COLORS.neutral;
  const trendLabel = isImproving ? 'Improving' : isWeakening ? 'Weakening' : 'Stable';
  const TrendIcon = isImproving ? TrendingUp : isWeakening ? TrendingDown : Activity;

  return (
    <div className="space-y-2">
      {/* Trendline Label + Indicator */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: COLORS.textCaption, letterSpacing: '0.08em' }}>
          Consensus Trend (5 days)
        </span>
        <div className="flex items-center gap-1.5">
          <TrendIcon className="w-3 h-3" style={{ color }} />
          <span className="text-[11px] font-semibold" style={{ color: COLORS.textMedium }}>
            {trendLabel}
          </span>
        </div>
      </div>

      {/* Trendline Visualization */}
      <div className="flex items-center justify-center">
        <svg width="100" height="32" className="overflow-visible">
          <defs>
            <filter id="sparkline-calm-glow">
              <feGaussianBlur stdDeviation="1.2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <motion.polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#sparkline-calm-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: shouldReduceMotion ? 1 : 1, 
              opacity: shouldReduceMotion ? 0.9 : 0.9
            }}
            transition={shouldReduceMotion ? { duration: 0 } : { 
              duration: 0.6, 
              delay: delay,
              ease: MOTION.CURVES.horizonIn
            }}
          />
          
          <motion.circle
            cx={points.split(' ')[data.length - 1].split(',')[0]}
            cy={points.split(' ')[data.length - 1].split(',')[1]}
            r="2.5"
            fill={color}
            filter="url(#sparkline-calm-glow)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: delay + 0.6 }}
          />
        </svg>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT — CONSENSUS METER V4.0
// ============================================================================

export default function ConsensusMeter({ score, breakdown, onOpenDrawer }) {
  const [isHovered, setIsHovered] = useState(false);

  if (typeof score !== 'number') {
    return null;
  }

  const segments = breakdown?.segments || [];
  
  // Dynamic segment stances (derived from actual data or mocked)
  const getSegmentStance = (segment) => {
    const weight = (segment?.weight || 0) * 100;
    const stress = segment?.stress_level;
    
    if (segment.name === 'Policy') {
      return stress === 'high' ? 'Cautious' : 'Stable';
    }
    if (segment.name === 'Credit') {
      return stress === 'high' ? 'Tightening' : 'Softening';
    }
    if (segment.name === 'Equities') {
      return weight > 60 ? 'Bullish' : weight < 40 ? 'Bearish' : 'Flat';
    }
    if (segment.name === 'Global') {
      return 'Mixed';
    }
    return 'Neutral';
  };

  const getSegmentIcon = (name) => {
    const icons = {
      Policy: Shield,
      Credit: Briefcase,
      Equities: BarChart3,
      Global: Globe
    };
    return icons[name] || Activity;
  };

  const trendData = [62, 58, 61, 59, 64, 67, 66];
  const sourcesCount = 5;
  const updatedAgo = "2m";

  const handleOpenDrawer = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 ConsensusMeter clicked - opening drawer');
    try {
      if (onOpenDrawer && typeof onOpenDrawer === 'function') {
        onOpenDrawer();
      } else {
        console.error('❌ onOpenDrawer is not a function:', onOpenDrawer);
      }
    } catch (error) {
      console.error('❌ Error opening sentiment drawer:', error);
    }
  };

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="h-full rounded-2xl flex flex-col cursor-pointer relative overflow-hidden"
      style={{
        background: 'rgba(16, 20, 28, 0.55)',
        backdropFilter: 'blur(16px) saturate(165%) brightness(1.04)',
        WebkitBackdropFilter: 'blur(16px) saturate(165%) brightness(1.04)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.20)',
        backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.08) 100%)',
        paddingTop: '28px',
        paddingBottom: '28px',
        paddingLeft: '28px',
        paddingRight: '28px',
        borderRadius: '24px'
      }}
      whileHover={{ 
        y: -1.5,
        scale: 1.01,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 28px rgba(0,0,0,0.26)',
        borderColor: 'rgba(255,255,255,0.18)',
        transition: { 
          duration: MOTION.DURATIONS.fast, 
          ease: MOTION.CURVES.horizonOut 
        }
      }}
      whileTap={{
        scale: 0.99,
        transition: { duration: 0.06 }
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleOpenDrawer}
      role="button"
      tabIndex={0}
      aria-label="Open consensus breakdown with 4 segments"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpenDrawer(e);
        }
      }}
    >
      {/* Subsurface Lighting */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <motion.h2 
          className="text-base font-semibold"
          style={{ color: COLORS.textPrimary }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Consensus
        </motion.h2>
      </div>

      {/* Main Gauge Block */}
      <div className="flex-1 flex items-center justify-center" style={{ marginTop: '8px', marginBottom: '20px' }}>
        <RadialGauge score={score} isHovered={isHovered} />
      </div>

      {/* Low-Opacity Grounding Divider */}
      <div 
        className="h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
          marginBottom: '16px'
        }}
      />

      {/* Segment Chips (Replacing Mini-Rings) - +10-14px from donut */}
      <motion.div 
        className="flex justify-center gap-2 flex-wrap"
        style={{ marginBottom: '20px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {segments.slice(0, 4).map((segment, index) => {
          const Icon = getSegmentIcon(segment.name);
          const stance = getSegmentStance(segment);
          const color = COLORS.segments[segment.name] || COLORS.neutral;

          return (
            <SegmentChip
              key={segment.name}
              name={segment.name}
              stance={stance}
              icon={Icon}
              color={color}
              delay={index}
            />
          );
        })}
      </motion.div>

      {/* Trendline Enhancement - +6-10px from chips */}
      <motion.div
        style={{ marginBottom: '18px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Sparkline data={trendData} delay={0.9} />
      </motion.div>

      {/* Footer - +10px above */}
      <motion.p
        className="text-xs text-center"
        style={{ 
          color: COLORS.textMuted,
          marginTop: '10px'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        Based on {sourcesCount} key sources • Updated {updatedAgo} ago
      </motion.p>

      {/* Hover Hint */}
      <motion.div 
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center text-xs pointer-events-none"
        style={{ color: 'rgba(255,255,255,0.55)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <Activity className="w-3 h-3 mr-1" />
        View detailed breakdown
      </motion.div>

      <style jsx>{`
        /* GPU Acceleration */
        .relative {
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }

        /* High Contrast Mode */
        @media (prefers-contrast: high) {
          .border {
            border-color: rgba(255, 255, 255, 0.4) !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
