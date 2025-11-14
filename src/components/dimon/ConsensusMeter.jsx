import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, Briefcase, BarChart3, Globe, TrendingUp, TrendingDown } from 'lucide-react';

// ============================================================================
// OS HORIZON DESIGN TOKENS — VIREON CONSENSUS METER V5.0 (INLINE DRAWER)
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
// INLINE DRAWER — OS HORIZON "LIQUID SILK" EXPANSION
// ============================================================================

const InlineDrawer = ({ isOpen, score, breakdown, onOpenDetail, onClose }) => {
  const drawerRef = useRef(null);

  useEffect(() => {
    if (isOpen && drawerRef.current) {
      const rect = drawerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const targetScroll = window.scrollY + rect.top - (viewportHeight * 0.2);
      
      if (rect.top < viewportHeight * 0.2 || rect.bottom > viewportHeight * 0.9) {
        window.scrollTo({
          top: Math.max(0, targetScroll),
          behavior: 'smooth'
        });
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const segments = Array.isArray(breakdown?.segments) ? breakdown.segments : [];

  const getSegmentIconColor = (name) => {
    switch (name) {
      case 'Policy': return '#5EA7FF';
      case 'Credit': return '#C084FC';
      case 'Equities': return '#2ECF8D';
      case 'Global': return '#FFB020';
      default: return '#AAB1B8';
    }
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

  const getScoreColor = (s) => {
    if (s >= 70) return '#2ECF8D';
    if (s >= 40) return '#5EA7FF';
    return '#F26A6A';
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
      stable: { label: 'Stable', Icon: Activity, color: '#5EA7FF' }
    };
    return config[indicator] || config.stable;
  };

  if (!isOpen) return null;

  return (
    <motion.div
      ref={drawerRef}
      className="overflow-hidden"
      initial={{ height: 0, opacity: 0 }}
      animate={{ 
        height: 'auto',
        opacity: 1,
        transition: {
          height: { duration: 0.5, ease: MOTION.CURVES.horizonIn },
          opacity: { duration: 0.3, delay: 0.1 }
        }
      }}
      exit={{ 
        height: 0,
        opacity: 0,
        transition: {
          height: { duration: 0.4, ease: MOTION.CURVES.horizonOut },
          opacity: { duration: 0.2 }
        }
      }}
      style={{ marginTop: '16px' }}
    >
      <motion.div
        className="rounded-2xl p-6 backdrop-filter backdrop-blur-md border"
        style={{
          background: 'rgba(16, 20, 28, 0.55)',
          backdropFilter: 'blur(16px) saturate(165%) brightness(1.04)',
          WebkitBackdropFilter: 'blur(16px) saturate(165%) brightness(1.04)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.20)'
        }}
        initial={{ y: -10, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          transition: {
            duration: 0.3,
            delay: 0.2,
            ease: MOTION.CURVES.horizonIn
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-xl border flex items-center justify-center"
              style={{
                background: 'rgba(94, 167, 255, 0.10)',
                borderColor: 'rgba(94, 167, 255, 0.25)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Activity className="w-5 h-5" style={{ color: '#5EA7FF' }} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.95)' }}>
                Street Alignment
              </h3>
              <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.70)' }}>
                Consensus & Segment Breakdown
              </p>
            </div>
          </div>
        </div>

        {/* Segment Grid */}
        {segments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {segments.map((segment, index) => {
              const Icon = getSegmentIcon(segment?.name);
              const weight = (segment?.weight || 0) * 100;
              const iconColor = getSegmentIconColor(segment?.name);
              const stressChip = getStressChip(segment?.stress_level);
              const trendChip = getTrendChip(segment?.trend_indicator);

              const handleOpenDetail = () => onOpenDetail && onOpenDetail(segment);

              return (
                <motion.div
                  key={segment.name}
                  className="relative p-4 rounded-2xl border backdrop-blur-lg transition-all duration-300 cursor-pointer group overflow-hidden"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    borderColor: 'rgba(255,255,255,0.12)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.15)'
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      delay: 0.3 + (index * 0.08),
                      duration: 0.3,
                      ease: MOTION.CURVES.horizonIn
                    }
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
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="w-8 h-8 mx-auto mb-2" style={{ color: 'rgba(255,255,255,0.30)' }} />
            <p style={{ color: 'rgba(255,255,255,0.60)' }}>No segment data available</p>
          </div>
        )}

        {/* Footer */}
        <motion.p
          className="text-xs text-center mt-6 pt-4 border-t"
          style={{ 
            color: COLORS.textMuted,
            borderColor: 'rgba(255,255,255,0.06)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Based on 5 sources • Updated 2m ago
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// MAIN COMPONENT — CONSENSUS METER V5.0 (WITH INLINE DRAWER)
// ============================================================================

export default function ConsensusMeter({ score, breakdown, onOpenDrawer }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef(null);

  if (typeof score !== 'number') {
    return null;
  }

  const segments = breakdown?.segments || [];
  
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

  const handleToggleExpansion = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div ref={containerRef} className="relative">
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
        onClick={handleToggleExpansion}
        role="button"
        tabIndex={0}
        aria-label="Open consensus breakdown with 4 segments"
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggleExpansion(e);
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
          {isExpanded ? 'Click to collapse' : 'View detailed breakdown'}
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

      {/* Inline Drawer - Expands Below Card */}
      <InlineDrawer 
        isOpen={isExpanded}
        score={score}
        breakdown={breakdown}
        onOpenDetail={(segment) => {
          setIsExpanded(false);
          setTimeout(() => onOpenDrawer && onOpenDrawer(segment), 300);
        }}
        onClose={() => setIsExpanded(false)}
      />
    </div>
  );
}