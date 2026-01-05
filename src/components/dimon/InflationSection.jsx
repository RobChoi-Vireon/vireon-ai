import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];

// Apple-grade typography system
const TYPOGRAPHY = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
  smoothing: {
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale'
  },
  scale: {
    hero: { size: '54px', weight: 900, lineHeight: 1.05, letterSpacing: '-0.05em' },
    heading1: { size: '28px', weight: 700, lineHeight: 1.2, letterSpacing: '-0.025em' },
    heading2: { size: '20px', weight: 700, lineHeight: 1.3, letterSpacing: '-0.02em' },
    heading3: { size: '17px', weight: 600, lineHeight: 1.4, letterSpacing: '-0.01em' },
    body: { size: '17px', weight: 400, lineHeight: 1.65, letterSpacing: '0' },
    bodyEmphasis: { size: '15px', weight: 500, lineHeight: 1.6, letterSpacing: '0.01em' },
    caption: { size: '13px', weight: 500, lineHeight: 1.4, letterSpacing: '0.01em' },
    label: { size: '11px', weight: 600, lineHeight: 1.2, letterSpacing: '0.06em' },
    micro: { size: '10px', weight: 700, lineHeight: 1.2, letterSpacing: '0.08em' }
  }
};

// Thermal color system
const THERMAL = {
  warm: {
    glow: 'rgba(255, 160, 90, 0.35)',
    accent: 'rgba(255, 140, 70, 0.45)',
    subtle: 'rgba(255, 150, 80, 0.18)'
  },
  cool: {
    glow: 'rgba(100, 180, 255, 0.35)',
    accent: 'rgba(90, 170, 255, 0.45)',
    subtle: 'rgba(95, 175, 255, 0.18)'
  }
};

const HORIZONS = {
  now: {
    label: 'Now',
    bullets: [
      "Fed maintains current stance, watching labor market closely.",
      "Markets price in rate cuts if inflation continues moderating."
    ]
  },
  quarterly: {
    label: '3–12 Months',
    bullets: [
      "Housing costs begin cooling as shelter components catch up to reality.",
      "Services inflation becomes the primary policy determinant."
    ]
  },
  longer: {
    label: '12–36 Months',
    bullets: [
      "Deglobalization and labor tightness keep inflation above pre-pandemic norms.",
      "Central banks recalibrate long-term neutral rate assumptions."
    ]
  }
};

const STAKEHOLDERS = {
  consumers: {
    label: 'Consumers',
    description: 'Purchasing power erodes when wage growth lags inflation. Essentials like food and shelter consume a larger share of household budgets.'
  },
  workers: {
    label: 'Workers',
    description: 'Real wage growth determines living standards. Tight labor markets give workers leverage to demand raises that match or exceed inflation.'
  },
  businesses: {
    label: 'Businesses',
    description: 'Margin compression when input costs rise faster than pricing power allows. Small businesses face disproportionate pressure from higher borrowing costs.'
  },
  government: {
    label: 'Government',
    description: 'Social Security and federal benefits adjust to CPI, creating fiscal pressures. Higher interest payments on national debt compound budget challenges.'
  },
  investors: {
    label: 'Investors',
    description: 'Fixed-income returns lose real value. Equities face multiple compression as discount rates rise. Inflation-linked assets and commodities become portfolio anchors.'
  }
};

const StatePillColors = {
  "Cooling": { bg: "rgba(88, 227, 164, 0.12)", border: "rgba(88, 227, 164, 0.24)", text: "#58E3A4" },
  "Sticky": { bg: "rgba(255, 180, 100, 0.12)", border: "rgba(255, 180, 100, 0.24)", text: "#FFB464" },
  "Re-accelerating": { bg: "rgba(255, 106, 122, 0.12)", border: "rgba(255, 106, 122, 0.24)", text: "#FF6A7A" },
  "Mixed": { bg: "rgba(168, 179, 199, 0.12)", border: "rgba(168, 179, 199, 0.24)", text: "#A8B3C7" }
};

const PolicyBiasColors = {
  "Dovish": { bg: "rgba(88, 227, 164, 0.12)", border: "rgba(88, 227, 164, 0.24)", text: "#58E3A4" },
  "Neutral": { bg: "rgba(168, 179, 199, 0.12)", border: "rgba(168, 179, 199, 0.24)", text: "#A8B3C7" },
  "Hawkish": { bg: "rgba(255, 106, 122, 0.12)", border: "rgba(255, 106, 122, 0.24)", text: "#FF6A7A" }
};

const KPIChip = ({ label, value, isCore = false }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4, transition: { duration: 0.4, ease: HORIZON_EASE } }}
      className="relative flex flex-col items-center justify-center rounded-3xl overflow-hidden group"
      style={{
        padding: '28px 32px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.065) 0%, rgba(255, 255, 255, 0.038) 100%)',
        backdropFilter: 'blur(64px) saturate(180%)',
        WebkitBackdropFilter: 'blur(64px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: isHovered 
          ? 'inset 0 2px 0 rgba(255,255,255,0.14), 0 12px 48px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.08)'
          : 'inset 0 2px 0 rgba(255,255,255,0.12), 0 8px 32px rgba(0,0,0,0.14)',
        minWidth: '160px',
        transition: 'box-shadow 0.4s ease'
      }}
    >
      {/* Specular Highlight */}
      <motion.div 
        style={{
          position: 'absolute',
          top: 0,
          left: '12%',
          right: '12%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.24), transparent)',
          pointerEvents: 'none',
          filter: 'blur(1px)'
        }}
        animate={{ opacity: isHovered ? 1 : 0.8 }}
      />

      {/* Ambient Glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 40%, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        opacity: isHovered ? 1 : 0.6,
        transition: 'opacity 0.4s ease'
      }} />
      
      <div style={{ 
        color: 'rgba(255,255,255,0.70)', 
        fontSize: TYPOGRAPHY.scale.label.size,
        fontWeight: TYPOGRAPHY.scale.label.weight,
        letterSpacing: TYPOGRAPHY.scale.label.letterSpacing,
        lineHeight: TYPOGRAPHY.scale.label.lineHeight,
        textTransform: 'uppercase',
        marginBottom: '12px',
        ...TYPOGRAPHY.smoothing
      }}>
        {label}
      </div>
      
      <motion.div 
        className="relative"
        style={{ 
          color: 'rgba(255,255,255,1)',
          fontSize: '36px',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 1,
          ...TYPOGRAPHY.smoothing
        }}
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.4, ease: HORIZON_EASE }}
      >
        {value ?? '—'}
        <div style={{
          position: 'absolute',
          inset: '-8px',
          background: isHovered ? 'radial-gradient(ellipse, rgba(110, 185, 255, 0.12) 0%, transparent 60%)' : 'none',
          filter: 'blur(12px)',
          pointerEvents: 'none',
          transition: 'background 0.4s ease'
        }} />
      </motion.div>
      
      {isCore && (
        <motion.div 
          className="px-2 py-1 rounded-md"
          style={{ 
            color: 'rgba(255,255,255,0.55)', 
            fontSize: TYPOGRAPHY.scale.micro.size,
            fontWeight: TYPOGRAPHY.scale.micro.weight,
            letterSpacing: TYPOGRAPHY.scale.micro.letterSpacing,
            lineHeight: TYPOGRAPHY.scale.micro.lineHeight,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            marginTop: '8px',
            ...TYPOGRAPHY.smoothing
          }}
          animate={{ opacity: isHovered ? 1 : 0.7 }}
        >
          CORE
        </motion.div>
      )}
    </motion.div>
  );
};

const ImplicationPill = ({ label, direction, note }) => {
  const Icon = direction === 'up' ? TrendingUp : direction === 'down' ? TrendingDown : Minus;
  const color = direction === 'up' ? '#58E3A4' : direction === 'down' ? '#FF6A7A' : '#A8B3C7';
  
  return (
    <motion.div
      whileHover={{ scale: 1.025, y: -2, transition: { duration: 0.3, ease: HORIZON_EASE } }}
      className="relative flex items-center gap-2.5 rounded-xl overflow-hidden"
      style={{
        padding: '12px 18px',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.052) 0%, rgba(255, 255, 255, 0.032) 100%)',
        backdropFilter: 'blur(36px) saturate(170%)',
        WebkitBackdropFilter: 'blur(36px) saturate(170%)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 3px 12px rgba(0,0,0,0.08)'
      }}
    >
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color, strokeWidth: 2.5 }} />
      <div className="flex flex-col">
        <span style={{ 
          color: 'rgba(255,255,255,0.92)',
          fontSize: '14px',
          fontWeight: 600,
          letterSpacing: '-0.005em',
          ...TYPOGRAPHY.smoothing
        }}>{label}</span>
        {note && <span style={{ 
          color: 'rgba(255,255,255,0.55)',
          fontSize: TYPOGRAPHY.scale.caption.size,
          fontWeight: TYPOGRAPHY.scale.caption.weight,
          letterSpacing: TYPOGRAPHY.scale.caption.letterSpacing,
          ...TYPOGRAPHY.smoothing
        }}>{note}</span>}
      </div>
    </motion.div>
  );
};

const InflationPressureRing = ({ cpiValue, pceValue, onHover }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate gap intensity (0-1)
  const gapIntensity = cpiValue && pceValue 
    ? Math.min(Math.abs(cpiValue - pceValue) / 2, 1) 
    : 0.3;
  
  const gap = cpiValue && pceValue ? Math.abs(cpiValue - pceValue).toFixed(1) : null;
  const isConsumerPressure = cpiValue && pceValue && cpiValue > pceValue;
  
  return (
    <div className="relative flex items-center justify-center" style={{ height: '240px' }}>
      <motion.div
        onHoverStart={() => {
          setIsHovered(true);
          onHover && onHover(true);
        }}
        onHoverEnd={() => {
          setIsHovered(false);
          onHover && onHover(false);
        }}
        className="relative"
        style={{ width: '200px', height: '200px' }}
      >
        {/* Breathing animation base */}
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            inset: '-20px',
            background: `radial-gradient(circle, ${THERMAL.warm.subtle} 0%, transparent 70%)`,
            filter: 'blur(20px)',
            pointerEvents: 'none'
          }}
        />

        {/* Outer ring - CPI (warm) */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: isHovered ? 1.05 : 1
          }}
          transition={{
            rotate: { duration: 40, repeat: Infinity, ease: "linear" },
            scale: { duration: 0.4, ease: HORIZON_EASE }
          }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: THERMAL.warm.accent,
            borderRightColor: THERMAL.warm.accent,
            opacity: 0.7,
            boxShadow: `0 0 ${gapIntensity * 30}px ${THERMAL.warm.glow}`
          }}
        />

        {/* Inner ring - PCE (cool) */}
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: isHovered ? 1.05 : 1
          }}
          transition={{
            rotate: { duration: 35, repeat: Infinity, ease: "linear" },
            scale: { duration: 0.4, ease: HORIZON_EASE }
          }}
          style={{
            position: 'absolute',
            inset: '20px',
            borderRadius: '50%',
            border: '2.5px solid transparent',
            borderTopColor: THERMAL.cool.accent,
            borderLeftColor: THERMAL.cool.accent,
            opacity: 0.7,
            boxShadow: `0 0 ${gapIntensity * 25}px ${THERMAL.cool.glow}`
          }}
        />

        {/* Center glass panel - transforms on hover */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            position: 'absolute',
            inset: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 32px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px'
          }}
        >
          <AnimatePresence mode="wait">
            {!isHovered ? (
              <motion.div
                key="gap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ 
                  color: 'rgba(255,255,255,0.60)',
                  fontSize: TYPOGRAPHY.scale.label.size,
                  fontWeight: TYPOGRAPHY.scale.label.weight,
                  letterSpacing: TYPOGRAPHY.scale.label.letterSpacing,
                  marginBottom: '4px',
                  ...TYPOGRAPHY.smoothing
                }}>
                  GAP
                </div>
                <div style={{ 
                  color: 'rgba(255,255,255,0.95)',
                  fontSize: '24px',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  ...TYPOGRAPHY.smoothing
                }}>
                  {gap ? `${gap}%` : '—'}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="meaning"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: HORIZON_EASE }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ 
                  color: isConsumerPressure ? THERMAL.warm.accent.replace('0.45', '1') : THERMAL.cool.accent.replace('0.45', '1'),
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  ...TYPOGRAPHY.smoothing
                }}>
                  {isConsumerPressure ? 'Consumer Pressure' : 'Policy Signal'}
                </div>
                <div style={{ 
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '10px',
                  fontWeight: 500,
                  lineHeight: 1.5,
                  letterSpacing: '0.01em',
                  ...TYPOGRAPHY.smoothing
                }}>
                  {isConsumerPressure 
                    ? 'CPI leads → households feel it first'
                    : 'PCE leads → Fed sees broad demand'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Gap intensity glow */}
        <div style={{
          position: 'absolute',
          inset: '-10px',
          background: `radial-gradient(circle, ${THERMAL.warm.glow} 0%, ${THERMAL.cool.glow} 50%, transparent 70%)`,
          filter: 'blur(15px)',
          opacity: gapIntensity * 0.6,
          pointerEvents: 'none'
        }} />
      </motion.div>


    </div>
  );
};

const SegmentedControl = ({ segments, active, onChange }) => {
  const getModeHue = (segmentId) => {
    if (segmentId === 'overview') return THERMAL.cool.subtle;
    if (segmentId === 'timeline') return 'rgba(150, 120, 255, 0.03)';
    if (segmentId === 'impact') return THERMAL.warm.subtle;
    return 'transparent';
  };

  return (
    <div className="relative flex items-center justify-center gap-1 p-1.5 rounded-[20px]" style={{
      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.058) 0%, rgba(255, 255, 255, 0.035) 100%), ${getModeHue(active)}`,
      backdropFilter: 'blur(48px) saturate(175%)',
      WebkitBackdropFilter: 'blur(48px) saturate(175%)',
      border: '1px solid rgba(255,255,255,0.10)',
      boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.10), 0 4px 20px rgba(0,0,0,0.10)',
      transition: 'background 0.4s ease'
    }}>
      {/* Top Specular Rim */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '15%',
        right: '15%',
        height: '1.5px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
        pointerEvents: 'none',
        filter: 'blur(0.5px)'
      }} />

      {segments.map(segment => (
        <motion.button
          key={segment.id}
          onClick={() => onChange(segment.id)}
          className="relative px-7 py-3 rounded-[16px] overflow-hidden"
          whileHover={{ scale: active === segment.id ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: HORIZON_EASE }}
          style={{
            background: active === segment.id 
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.10) 100%)'
              : 'transparent',
            color: active === segment.id ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.65)',
            fontWeight: active === segment.id ? 600 : 500,
            fontSize: '15px',
            letterSpacing: active === segment.id ? '-0.01em' : '0',
            ...TYPOGRAPHY.smoothing,
            boxShadow: active === segment.id 
              ? 'inset 0 1.5px 0 rgba(255,255,255,0.16), 0 3px 12px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.08)' 
              : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          {active === segment.id && (
            <>
              <div style={{
                position: 'absolute',
                top: 0,
                left: '12%',
                right: '12%',
                height: '1.5px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)',
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at 50% 30%, rgba(110, 185, 255, 0.10) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />
            </>
          )}
          <span className="relative z-10">{segment.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

const TimelineSelector = ({ horizons, active, onChange }) => (
  <div className="flex items-center justify-center gap-4 mb-6">
    {Object.entries(horizons).map(([key, horizon]) => (
      <button
        key={key}
        onClick={() => onChange(key)}
        className="relative px-5 py-2 rounded-xl transition-all duration-200"
        style={{
          background: active === key 
            ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.06) 100%)'
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.028) 100%)',
          backdropFilter: 'blur(32px) saturate(165%)',
          WebkitBackdropFilter: 'blur(32px) saturate(165%)',
          border: `1px solid ${active === key ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)'}`,
          color: active === key ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.65)',
          fontWeight: active === key ? 600 : 500,
          fontSize: '14px'
        }}
      >
        {horizon.label}
      </button>
    ))}
  </div>
);

const StakeholderSelector = ({ stakeholders, active, onChange }) => (
  <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
    {Object.entries(stakeholders).map(([key, stakeholder]) => (
      <button
        key={key}
        onClick={() => onChange(key)}
        className="relative px-5 py-2 rounded-xl transition-all duration-200"
        style={{
          background: active === key 
            ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.06) 100%)'
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.028) 100%)',
          backdropFilter: 'blur(32px) saturate(165%)',
          WebkitBackdropFilter: 'blur(32px) saturate(165%)',
          border: `1px solid ${active === key ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)'}`,
          color: active === key ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.65)',
          fontWeight: active === key ? 600 : 500,
          fontSize: '15px',
          letterSpacing: '-0.005em',
          ...TYPOGRAPHY.smoothing
        }}
      >
        {stakeholder.label}
      </button>
    ))}
  </div>
);

export default function InflationSection({ data }) {
  const [activeSegment, setActiveSegment] = useState('overview');
  const [selectedHorizon, setSelectedHorizon] = useState('now');
  const [selectedStakeholder, setSelectedStakeholder] = useState('consumers');

  if (!data) return null;

  const stateColors = StatePillColors[data.state_tag] || StatePillColors.Mixed;
  const policyColors = PolicyBiasColors[data.policy_bias] || PolicyBiasColors.Neutral;

  const segments = [
    { id: 'overview', label: 'Overview' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'impact', label: 'Impact' }
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: HORIZON_EASE }}
        className="mb-6"
      >
        <h2 style={{ 
          color: 'rgba(255,255,255,0.95)',
          fontSize: TYPOGRAPHY.scale.heading1.size,
          fontWeight: TYPOGRAPHY.scale.heading1.weight,
          letterSpacing: TYPOGRAPHY.scale.heading1.letterSpacing,
          lineHeight: TYPOGRAPHY.scale.heading1.lineHeight,
          ...TYPOGRAPHY.smoothing
        }}>
          Inflation
        </h2>
      </motion.div>

      {/* Hero State Display */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: HORIZON_EASE, delay: 0.1 }}
        className="mb-10 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4, ease: HORIZON_EASE }}
            className="px-4 py-2 rounded-xl"
            style={{
              background: stateColors.bg,
              border: `1px solid ${stateColors.border}`,
              color: stateColors.text,
              fontSize: TYPOGRAPHY.scale.micro.size,
              fontWeight: TYPOGRAPHY.scale.micro.weight,
              letterSpacing: TYPOGRAPHY.scale.micro.letterSpacing,
              boxShadow: `0 0 20px ${stateColors.bg}, inset 0 1px 0 rgba(255,255,255,0.1)`,
              ...TYPOGRAPHY.smoothing
            }}
          >
            {data.state_tag?.toUpperCase() || 'STICKY'}
          </motion.div>
        </div>

        <motion.h3 
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ 
            color: 'rgba(255,255,255,0.96)',
            fontSize: '32px',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            ...TYPOGRAPHY.smoothing
          }}
        >
          Inflation Pressure
        </motion.h3>
        
        <motion.p 
          className="max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          style={{ 
            color: 'rgba(255,255,255,0.68)',
            fontSize: TYPOGRAPHY.scale.bodyEmphasis.size,
            fontWeight: TYPOGRAPHY.scale.bodyEmphasis.weight,
            letterSpacing: TYPOGRAPHY.scale.bodyEmphasis.letterSpacing,
            lineHeight: TYPOGRAPHY.scale.bodyEmphasis.lineHeight,
            ...TYPOGRAPHY.smoothing
          }}
        >
          CPI elevated by shelter costs. PCE shows softer demand.
        </motion.p>
      </motion.div>

      {/* Hero Visual - Inflation Pressure Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: HORIZON_EASE }}
        className="mb-8"
      >
        <InflationPressureRing 
          cpiValue={data.cpi_headline_yoy} 
          pceValue={data.pce_headline_yoy}
        />
      </motion.div>

      {/* Snapshot: KPI Chips (de-emphasized) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 opacity-90">
        <KPIChip 
          label="CPI YoY" 
          value={data.cpi_headline_yoy ? `${data.cpi_headline_yoy}%` : null} 
        />
        <KPIChip 
          label="Core CPI YoY" 
          value={data.cpi_core_yoy ? `${data.cpi_core_yoy}%` : null}
          isCore 
        />
        <KPIChip 
          label="PCE YoY" 
          value={data.pce_headline_yoy ? `${data.pce_headline_yoy}%` : null} 
        />
        <KPIChip 
          label="Core PCE YoY" 
          value={data.pce_core_yoy ? `${data.pce_core_yoy}%` : null}
          isCore 
        />
      </div>

      {/* State Badge (minimal) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-3 mb-6"
      >
        <motion.div 
          className="px-4 py-2 rounded-xl"
          whileHover={{ scale: 1.05 }}
          style={{
            background: stateColors.bg,
            border: `1.5px solid ${stateColors.border}`,
            color: stateColors.text,
            fontSize: TYPOGRAPHY.scale.micro.size,
            fontWeight: TYPOGRAPHY.scale.micro.weight,
            letterSpacing: TYPOGRAPHY.scale.micro.letterSpacing,
            boxShadow: `0 0 24px ${stateColors.bg}`,
            ...TYPOGRAPHY.smoothing
          }}
        >
          {data.state_tag}
        </motion.div>
        {data.last_updated && (
          <div style={{ 
            color: 'rgba(255,255,255,0.45)',
            fontSize: TYPOGRAPHY.scale.label.size,
            fontWeight: 500,
            letterSpacing: '0.02em',
            ...TYPOGRAPHY.smoothing
          }}>
            {data.last_updated}
          </div>
        )}
      </motion.div>

      {/* Implications Strip (de-emphasized) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: HORIZON_EASE, delay: 0.2 }}
        className="relative rounded-3xl overflow-hidden opacity-85"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.028) 100%)',
          backdropFilter: 'blur(48px) saturate(165%)',
          WebkitBackdropFilter: 'blur(48px) saturate(165%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 24px rgba(0,0,0,0.10)'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: '12%',
          right: '12%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)',
          pointerEvents: 'none',
          filter: 'blur(0.5px)'
        }} />

        <div className="flex items-center justify-between mb-5">
          <h3 style={{ 
            color: 'rgba(255,255,255,0.85)',
            fontSize: TYPOGRAPHY.scale.heading3.size,
            fontWeight: TYPOGRAPHY.scale.heading3.weight,
            letterSpacing: TYPOGRAPHY.scale.heading3.letterSpacing,
            lineHeight: TYPOGRAPHY.scale.heading3.lineHeight,
            ...TYPOGRAPHY.smoothing
          }}>
            Implications
          </h3>
          <motion.div 
            className="px-3.5 py-2 rounded-xl"
            whileHover={{ scale: 1.05 }}
            style={{
              background: policyColors.bg,
              border: `1.5px solid ${policyColors.border}`,
              color: policyColors.text,
              fontSize: TYPOGRAPHY.scale.micro.size,
              fontWeight: TYPOGRAPHY.scale.micro.weight,
              letterSpacing: TYPOGRAPHY.scale.micro.letterSpacing,
              boxShadow: `0 0 16px ${policyColors.bg}`,
              ...TYPOGRAPHY.smoothing
            }}
          >
            Policy: {data.policy_bias}
          </motion.div>
        </div>

        <div className="flex flex-wrap gap-3">
          {(data.market_implications || []).map((implication, idx) => (
            <ImplicationPill 
              key={idx}
              label={implication.label}
              direction={implication.direction}
              note={implication.note}
            />
          ))}
        </div>
      </motion.div>

      {/* Segmented Control - Modes */}
      <div className="flex justify-center my-10">
        <SegmentedControl segments={segments} active={activeSegment} onChange={setActiveSegment} />
      </div>

      {/* Depth Panel - Modes */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSegment}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: HORIZON_EASE }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            padding: '48px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.065) 0%, rgba(255, 255, 255, 0.038) 100%)',
            backdropFilter: 'blur(64px) saturate(180%)',
            WebkitBackdropFilter: 'blur(64px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.12), 0 12px 48px rgba(0,0,0,0.16)',
            minHeight: '360px'
          }}
        >
          {/* Enhanced Specular */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '12%',
            right: '12%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.24), transparent)',
            pointerEvents: 'none',
            filter: 'blur(1px)'
          }} />

          {/* Ambient Atmosphere */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 35%, rgba(255, 255, 255, 0.06) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          {activeSegment === 'overview' && (
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 style={{ 
                    color: 'rgba(255,255,255,0.98)',
                    fontSize: TYPOGRAPHY.scale.heading2.size,
                    fontWeight: TYPOGRAPHY.scale.heading2.weight,
                    letterSpacing: TYPOGRAPHY.scale.heading2.letterSpacing,
                    lineHeight: TYPOGRAPHY.scale.heading2.lineHeight,
                    marginBottom: '12px',
                    ...TYPOGRAPHY.smoothing
                  }}>
                    CPI
                  </h4>
                  <p style={{ 
                    color: 'rgba(255,255,255,0.80)', 
                    fontSize: TYPOGRAPHY.scale.body.size,
                    fontWeight: TYPOGRAPHY.scale.body.weight,
                    letterSpacing: TYPOGRAPHY.scale.body.letterSpacing,
                    lineHeight: TYPOGRAPHY.scale.body.lineHeight,
                    ...TYPOGRAPHY.smoothing
                  }}>
                    What households feel (rent, essentials)
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <h4 style={{ 
                    color: 'rgba(255,255,255,0.98)',
                    fontSize: TYPOGRAPHY.scale.heading2.size,
                    fontWeight: TYPOGRAPHY.scale.heading2.weight,
                    letterSpacing: TYPOGRAPHY.scale.heading2.letterSpacing,
                    lineHeight: TYPOGRAPHY.scale.heading2.lineHeight,
                    marginBottom: '12px',
                    ...TYPOGRAPHY.smoothing
                  }}>
                    PCE
                  </h4>
                  <p style={{ 
                    color: 'rgba(255,255,255,0.80)', 
                    fontSize: TYPOGRAPHY.scale.body.size,
                    fontWeight: TYPOGRAPHY.scale.body.weight,
                    letterSpacing: TYPOGRAPHY.scale.body.letterSpacing,
                    lineHeight: TYPOGRAPHY.scale.body.lineHeight,
                    ...TYPOGRAPHY.smoothing
                  }}>
                    What policy watches (adaptive spending)
                  </p>
                </motion.div>
              </div>

              <motion.div 
                className="space-y-5"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 style={{ 
                  color: 'rgba(255,255,255,0.98)',
                  fontSize: TYPOGRAPHY.scale.heading2.size,
                  fontWeight: TYPOGRAPHY.scale.heading2.weight,
                  letterSpacing: TYPOGRAPHY.scale.heading2.letterSpacing,
                  lineHeight: TYPOGRAPHY.scale.heading2.lineHeight,
                  marginBottom: '20px',
                  ...TYPOGRAPHY.smoothing
                }}>
                  Why the gap matters
                </h4>
                <p style={{ 
                  color: 'rgba(255,255,255,0.80)', 
                  fontSize: TYPOGRAPHY.scale.body.size,
                  fontWeight: TYPOGRAPHY.scale.body.weight,
                  letterSpacing: TYPOGRAPHY.scale.body.letterSpacing,
                  lineHeight: TYPOGRAPHY.scale.body.lineHeight,
                  ...TYPOGRAPHY.smoothing
                }}>
                  CPI above PCE → consumer pressure
                </p>
                <p style={{ 
                  color: 'rgba(255,255,255,0.80)', 
                  fontSize: TYPOGRAPHY.scale.body.size,
                  fontWeight: TYPOGRAPHY.scale.body.weight,
                  letterSpacing: TYPOGRAPHY.scale.body.letterSpacing,
                  lineHeight: TYPOGRAPHY.scale.body.lineHeight,
                  ...TYPOGRAPHY.smoothing
                }}>
                  PCE above CPI → broad demand inflation
                </p>
                <p style={{ 
                  color: 'rgba(255,255,255,0.80)', 
                  fontSize: TYPOGRAPHY.scale.body.size,
                  fontWeight: TYPOGRAPHY.scale.body.weight,
                  letterSpacing: TYPOGRAPHY.scale.body.letterSpacing,
                  lineHeight: TYPOGRAPHY.scale.body.lineHeight,
                  ...TYPOGRAPHY.smoothing
                }}>
                  Gap informs Fed policy bias
                </p>
              </motion.div>
            </div>
          )}

          {activeSegment === 'timeline' && (
            <div className="relative z-10">
              <TimelineSelector horizons={HORIZONS} active={selectedHorizon} onChange={setSelectedHorizon} />
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedHorizon}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: HORIZON_EASE }}
                  className="space-y-5 text-center max-w-2xl mx-auto"
                >
                  {HORIZONS[selectedHorizon].bullets.map((bullet, idx) => (
                    <motion.p 
                      key={idx} 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08, ease: HORIZON_EASE }}
                      style={{ 
                        color: 'rgba(255,255,255,0.84)', 
                        fontSize: TYPOGRAPHY.scale.body.size,
                        fontWeight: TYPOGRAPHY.scale.body.weight,
                        letterSpacing: TYPOGRAPHY.scale.body.letterSpacing,
                        lineHeight: TYPOGRAPHY.scale.body.lineHeight,
                        ...TYPOGRAPHY.smoothing
                      }}
                    >
                      {bullet}
                    </motion.p>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {activeSegment === 'impact' && (
            <div className="relative z-10">
              <StakeholderSelector stakeholders={STAKEHOLDERS} active={selectedStakeholder} onChange={setSelectedStakeholder} />
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedStakeholder}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: HORIZON_EASE }}
                  className="text-center max-w-2xl mx-auto"
                >
                  <h4 style={{ 
                    color: 'rgba(255,255,255,0.98)',
                    fontSize: TYPOGRAPHY.scale.heading2.size,
                    fontWeight: TYPOGRAPHY.scale.heading2.weight,
                    letterSpacing: TYPOGRAPHY.scale.heading2.letterSpacing,
                    lineHeight: TYPOGRAPHY.scale.heading2.lineHeight,
                    marginBottom: '20px',
                    ...TYPOGRAPHY.smoothing
                  }}>
                    {STAKEHOLDERS[selectedStakeholder].label}
                  </h4>
                  <p style={{ 
                    color: 'rgba(255,255,255,0.84)', 
                    fontSize: TYPOGRAPHY.scale.body.size,
                    fontWeight: TYPOGRAPHY.scale.body.weight,
                    letterSpacing: TYPOGRAPHY.scale.body.letterSpacing,
                    lineHeight: TYPOGRAPHY.scale.body.lineHeight,
                    ...TYPOGRAPHY.smoothing
                  }}>
                    {STAKEHOLDERS[selectedStakeholder].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}