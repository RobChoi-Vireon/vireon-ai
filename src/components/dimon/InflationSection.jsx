import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];

// OS Horizon palette - cool tones with subtle life
const PALETTE = {
  cpi: {
    ring: 'rgba(120, 140, 160, 0.45)',
    glow: 'rgba(120, 140, 160, 0.20)',
    text: '#8B9AAD'
  },
  pce: {
    ring: 'rgba(90, 130, 170, 0.45)',
    glow: 'rgba(90, 130, 170, 0.20)',
    text: '#6B95C0'
  },
  neutral: {
    bg: 'rgba(32, 36, 42, 0.40)',
    border: 'rgba(255, 255, 255, 0.08)',
    text: 'rgba(255, 255, 255, 0.70)',
    textBright: 'rgba(255, 255, 255, 0.98)',
    textDim: 'rgba(255, 255, 255, 0.50)',
    textCausal: 'rgba(180, 200, 220, 0.68)'
  },
  ambient: {
    horizonBlue: 'rgba(90, 130, 170, 0.06)',
    horizonBloom: 'rgba(110, 150, 190, 0.08)',
    horizonGlow: 'rgba(100, 140, 180, 0.12)'
  },
  accent: {
    active: 'rgba(100, 160, 220, 0.95)',
    marker: 'rgba(100, 160, 220, 0.40)'
  },
  semantic: {
    rates: 'rgba(100, 160, 220, 0.70)',
    equities: 'rgba(180, 190, 200, 0.70)',
    credit: 'rgba(140, 150, 165, 0.70)',
    usd: 'rgba(110, 200, 220, 0.70)',
    risk: 'rgba(200, 170, 130, 0.70)'
  },
  teaching: {
    policy: 'rgba(100, 160, 220, 0.55)',
    easing: 'rgba(110, 200, 200, 0.55)',
    friction: 'rgba(200, 180, 140, 0.55)',
    confidence: 'rgba(120, 180, 220, 0.55)'
  }
};

// Apple typography system
const TYPE = {
  systemLabel: {
    fontSize: '22px',
    fontWeight: 700,
    letterSpacing: '-0.015em',
    lineHeight: 1.3
  },
  systemSubtext: {
    fontSize: '14px',
    fontWeight: 500,
    letterSpacing: '0',
    lineHeight: 1.5
  },
  systemNote: {
    fontSize: '13px',
    fontWeight: 400,
    letterSpacing: '0',
    lineHeight: 1.65
  },
  kpiValue: {
    fontSize: '36px',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    lineHeight: 1
  },
  kpiLabel: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    lineHeight: 1.2
  }
};

// Component 1: InflationStateHeader
const InflationStateHeader = ({ state, descriptor }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: HORIZON_EASE }}
    className="mb-6"
  >
    <h2 style={{ 
      color: PALETTE.neutral.textBright,
      ...TYPE.systemLabel,
      marginBottom: '8px'
    }}>
      {state}
    </h2>
    <p style={{ 
      color: PALETTE.neutral.text,
      ...TYPE.systemSubtext
    }}>
      {descriptor}
    </p>
  </motion.div>
);

// Component 2: InflationSystemNote
const InflationSystemNote = () => (
  <motion.div
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: HORIZON_EASE, delay: 0.1 }}
    className="mb-8 relative overflow-hidden"
    style={{
      padding: '16px 20px',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.025) 0%, rgba(255, 255, 255, 0.015) 100%)',
      backdropFilter: 'blur(32px) saturate(165%)',
      WebkitBackdropFilter: 'blur(32px) saturate(165%)',
      borderRadius: '14px',
      border: `1px solid ${PALETTE.neutral.border}`,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.06)'
    }}
  >
    <div style={{
      position: 'absolute',
      top: 0,
      left: '15%',
      right: '15%',
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
      pointerEvents: 'none'
    }} />
    <div style={{ 
      color: PALETTE.neutral.text,
      fontSize: '13px',
      fontWeight: 400,
      letterSpacing: '0',
      lineHeight: 1.85
    }}>
      CPI captures household price pressure.<br />
      PCE captures spending behavior.<br />
      The gap shows where inflation feels stronger than policy suggests.
    </div>
  </motion.div>
);

// Component 3: InflationPressureRing
const InflationPressureRing = ({ cpiValue, pceValue }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const gap = cpiValue && pceValue ? Math.abs(cpiValue - pceValue).toFixed(1) : null;
  const gapIntensity = cpiValue && pceValue 
    ? Math.min(Math.abs(cpiValue - pceValue) / 2, 1) 
    : 0.3;
  
  return (
    <div className="relative flex items-center justify-center" style={{ height: '240px' }}>
      {/* Horizon light source - static daylight intelligence */}
      <div
        style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          background: `radial-gradient(circle, ${PALETTE.ambient.horizonGlow} 0%, ${PALETTE.ambient.horizonBlue} 35%, transparent 65%)`,
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.35
        }}
      />

      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative"
        style={{ width: '200px', height: '200px', zIndex: 1 }}
      >
        {/* Breathing base glow */}
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            inset: '-20px',
            background: `radial-gradient(circle, ${PALETTE.cpi.glow} 0%, transparent 70%)`,
            filter: 'blur(20px)',
            pointerEvents: 'none'
          }}
        />

        {/* Outer ring - CPI */}
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
            borderTopColor: PALETTE.cpi.ring,
            borderRightColor: PALETTE.cpi.ring,
            opacity: 0.7,
            boxShadow: `0 0 ${gapIntensity * 30}px ${PALETTE.cpi.glow}`
          }}
        />

        {/* Inner ring - PCE */}
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
            borderTopColor: PALETTE.pce.ring,
            borderLeftColor: PALETTE.pce.ring,
            opacity: 0.7,
            boxShadow: `0 0 ${gapIntensity * 25}px ${PALETTE.pce.glow}`
          }}
        />

        {/* Center glass panel with subtle pulse */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          animate={{
            boxShadow: [
              'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.2)',
              'inset 0 1px 0 rgba(255,255,255,0.18), 0 10px 36px rgba(90,130,170,0.08)',
              'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.2)'
            ]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            inset: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.03) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.12)',
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
                  color: PALETTE.neutral.textDim,
                  ...TYPE.kpiLabel,
                  marginBottom: '4px'
                }}>
                  GAP
                </div>
                <div style={{ 
                  color: PALETTE.neutral.textBright,
                  fontSize: '24px',
                  fontWeight: 700,
                  letterSpacing: '-0.02em'
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
                  color: PALETTE.neutral.textBright,
                  fontSize: '10px',
                  fontWeight: 500,
                  lineHeight: 1.5,
                  letterSpacing: '0.01em'
                }}>
                  Consumer prices hotter than policy inflation
                </div>
                <div style={{ 
                  color: PALETTE.neutral.textDim,
                  fontSize: '9px',
                  fontWeight: 500,
                  marginTop: '4px'
                }}>
                  Policy follows PCE
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Component 4: InflationSnapshotKPIs
const KPIChip = ({ label, value, isCore = false }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -2, transition: { duration: 0.3, ease: HORIZON_EASE } }}
      className="relative flex flex-col items-center justify-center rounded-2xl overflow-hidden"
      style={{
        padding: '24px 28px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.02) 100%)',
        backdropFilter: 'blur(48px) saturate(170%)',
        WebkitBackdropFilter: 'blur(48px) saturate(170%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: isHovered 
          ? 'inset 0 2px 0 rgba(255,255,255,0.10), 0 12px 32px rgba(0,0,0,0.10), 0 4px 16px rgba(90,130,170,0.06)'
          : 'inset 0 2px 0 rgba(255,255,255,0.08), 0 6px 22px rgba(0,0,0,0.08)',
        minWidth: '140px',
        transition: 'box-shadow 0.3s ease'
      }}
    >
      <motion.div 
        style={{
          position: 'absolute',
          top: 0,
          left: '12%',
          right: '12%',
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
          pointerEvents: 'none',
          filter: 'blur(0.5px)'
        }}
        animate={{ opacity: isHovered ? 1 : 0.8 }}
      />
      
      <div style={{ 
        color: PALETTE.neutral.textDim,
        ...TYPE.kpiLabel,
        textTransform: 'uppercase',
        marginBottom: '10px'
      }}>
        {label}
      </div>
      
      <motion.div 
        className="relative"
        style={{ 
          color: PALETTE.neutral.textBright,
          ...TYPE.kpiValue,
          letterSpacing: '-0.03em'
        }}
        animate={{ scale: isHovered ? 1.03 : 1 }}
        transition={{ duration: 0.3, ease: HORIZON_EASE }}
      >
        {value ?? '—'}
      </motion.div>
      
      {isCore && (
        <motion.div 
          className="px-2 py-1 rounded-md"
          style={{ 
            color: PALETTE.neutral.textDim,
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            marginTop: '8px'
          }}
          animate={{ opacity: isHovered ? 1 : 0.7 }}
        >
          CORE
        </motion.div>
      )}
    </motion.div>
  );
};

const InflationSnapshotKPIs = ({ cpi_headline_yoy, cpi_core_yoy, pce_headline_yoy, pce_core_yoy }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 opacity-85 mb-8">
    <KPIChip label="CPI YoY" value={cpi_headline_yoy ? `${cpi_headline_yoy}%` : null} />
    <KPIChip label="Core CPI YoY" value={cpi_core_yoy ? `${cpi_core_yoy}%` : null} isCore />
    <KPIChip label="PCE YoY" value={pce_headline_yoy ? `${pce_headline_yoy}%` : null} />
    <KPIChip label="Core PCE YoY" value={pce_core_yoy ? `${pce_core_yoy}%` : null} isCore />
  </div>
);

// Component 5: InflationLensSwitcher
const InflationLensSwitcher = ({ lenses, active, onChange }) => (
  <div className="relative flex items-center justify-center gap-1 p-1.5 rounded-[20px] mb-12" style={{
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.025) 100%)',
    backdropFilter: 'blur(48px) saturate(175%)',
    WebkitBackdropFilter: 'blur(48px) saturate(175%)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.10)'
  }}>
    <div style={{
      position: 'absolute',
      top: 0,
      left: '15%',
      right: '15%',
      height: '1.5px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
      pointerEvents: 'none',
      filter: 'blur(0.5px)'
    }} />

    {lenses.map(lens => (
      <motion.button
        key={lens.id}
        onClick={() => onChange(lens.id)}
        className="relative px-7 py-3 rounded-[16px] overflow-hidden"
        whileHover={{ scale: active === lens.id ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: HORIZON_EASE }}
        style={{
          background: active === lens.id 
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.07) 100%)'
            : 'transparent',
          color: active === lens.id ? PALETTE.accent.active : PALETTE.neutral.text,
          fontWeight: active === lens.id ? 600 : 500,
          fontSize: '15px',
          letterSpacing: active === lens.id ? '-0.01em' : '0',
          boxShadow: active === lens.id 
            ? 'inset 0 1.5px 0 rgba(255,255,255,0.12), 0 3px 12px rgba(0,0,0,0.10)' 
            : 'none',
          transition: 'all 0.3s ease'
        }}
      >
        {active === lens.id && (
          <>
            <div style={{
              position: 'absolute',
              top: 0,
              left: '12%',
              right: '12%',
              height: '1.5px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 30%, rgba(90, 130, 170, 0.08) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />
          </>
        )}
        <span className="relative z-10">{lens.label}</span>
      </motion.button>
    ))}
  </div>
);

// Component 6: InflationUnderstandingLens
const InflationUnderstandingLens = () => {
  const items = [
    { 
      label: 'CPI',
      arrow: '↗',
      arrowColor: PALETTE.teaching.friction,
      insight: 'Higher rent and essentials',
      driver: 'Housing and services reset slowly',
      impact: 'Living costs stay elevated for longer'
    },
    { 
      label: 'PCE',
      arrow: '→',
      arrowColor: PALETTE.teaching.easing,
      insight: 'Adaptive spending',
      driver: 'Consumers substitute rather than stop spending',
      impact: 'Demand shifts but doesn\'t collapse'
    },
    { 
      label: 'Meaning',
      arrow: '↗',
      arrowColor: PALETTE.teaching.policy,
      insight: 'Policy responds to demand, not pain',
      driver: 'Inflation is measured by behavior',
      impact: 'Fed focuses on PCE trends'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
      {items.map((item, i) => (
        <motion.div 
          key={item.label}
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 + i * 0.05 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div style={{ 
              color: PALETTE.neutral.textDim,
              ...TYPE.kpiLabel,
              textTransform: 'uppercase'
            }}>
              {item.label}
            </div>
            <span style={{ 
              fontSize: '16px', 
              color: item.arrowColor,
              fontWeight: 500
            }}>
              {item.arrow}
            </span>
          </div>
          
          <div className="relative" style={{ paddingLeft: '8px', marginBottom: '12px' }}>
            <div style={{
              position: 'absolute',
              left: 0,
              top: '4px',
              bottom: '4px',
              width: '2px',
              background: PALETTE.accent.marker,
              borderRadius: '2px'
            }} />
            <p style={{ 
              color: PALETTE.neutral.textBright, 
              fontSize: '15px',
              fontWeight: 400,
              lineHeight: 1.7,
              letterSpacing: '-0.005em',
              marginBottom: '10px'
            }}>
              {item.insight}
            </p>
          </div>
          
          <p style={{ 
            color: PALETTE.neutral.textCausal,
            fontSize: '13px',
            fontWeight: 400,
            lineHeight: 1.75,
            marginBottom: '8px'
          }}>
            {item.driver}
          </p>
          
          <p style={{ 
            color: PALETTE.neutral.textDim,
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: 1.7,
            opacity: 0.75
          }}>
            {item.impact}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

// Component 7: InflationTimeLens
const TIME_HORIZONS = {
  now: { 
    label: 'Now',
    arrow: '↗',
    arrowColor: PALETTE.teaching.friction,
    state: 'Housing keeps inflation elevated',
    driver: 'Rent and shelter reset slowly',
    arcSegment: 0.25,
    arcOpacity: 0.35,
    arcGaps: []
  },
  near: { 
    label: 'Near Term (~3m)',
    arrow: '↘',
    arrowColor: PALETTE.teaching.easing,
    state: 'Goods inflation fades further',
    driver: 'Supply chains normalize faster than services',
    arcSegment: 0.50,
    arcOpacity: 0.45,
    arcGaps: []
  },
  medium: { 
    label: 'Medium Term (~6m)',
    arrow: '→',
    arrowColor: PALETTE.teaching.policy,
    state: 'Services inflation cools unevenly',
    driver: 'Wage pressure eases gradually',
    arcSegment: 0.70,
    arcOpacity: 0.40,
    arcGaps: [0.35, 0.45]
  },
  confirmation: { 
    label: 'Confirmation (~12m)',
    arrow: '↘',
    arrowColor: PALETTE.teaching.confidence,
    state: 'Policy easing becomes possible',
    driver: 'Confidence matters more than speed',
    arcSegment: 0.85,
    arcOpacity: 0.50,
    arcGaps: []
  }
};

const SegmentedProgressArc = ({ segment, opacity, gaps = [], color }) => {
  const radius = 16;
  const strokeWidth = 2;
  const size = (radius + strokeWidth) * 2;
  const center = size / 2;
  
  const startAngle = -90;
  const endAngle = startAngle + (segment * 360);
  
  const createArc = (start, end) => {
    const startRad = (start * Math.PI) / 180;
    const endRad = (end * Math.PI) / 180;
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };
  
  if (gaps.length === 0) {
    return (
      <svg width={size} height={size} style={{ opacity }}>
        <path
          d={createArc(startAngle, endAngle)}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
    );
  }
  
  const segments = [];
  const gapAngles = gaps.map(g => startAngle + (g * 360));
  
  let currentStart = startAngle;
  gapAngles.forEach((gapAngle, i) => {
    const gapEnd = i < gapAngles.length - 1 ? gapAngles[i + 1] - 10 : endAngle;
    if (gapAngle > currentStart) {
      segments.push({ start: currentStart, end: gapAngle - 5, opacity: i % 2 === 0 ? opacity : opacity * 0.5 });
    }
    currentStart = gapAngle + 5;
  });
  
  if (currentStart < endAngle) {
    segments.push({ start: currentStart, end: endAngle, opacity: opacity * 0.7 });
  }
  
  return (
    <svg width={size} height={size}>
      {segments.map((seg, i) => (
        <path
          key={i}
          d={createArc(seg.start, seg.end)}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={seg.opacity}
        />
      ))}
    </svg>
  );
};

const InflationTimeLens = () => {
  const [selected, setSelected] = useState('now');

  return (
    <div>
      <div className="flex items-center justify-center gap-4 mb-10">
        {Object.entries(TIME_HORIZONS).map(([key, horizon]) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            className="relative px-5 py-2 rounded-xl transition-all duration-200"
            style={{
              background: selected === key 
                ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)'
                : 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.02) 100%)',
              backdropFilter: 'blur(32px) saturate(165%)',
              WebkitBackdropFilter: 'blur(32px) saturate(165%)',
              border: `1px solid ${selected === key ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)'}`,
              color: selected === key ? PALETTE.accent.active : PALETTE.neutral.text,
              fontWeight: selected === key ? 600 : 500,
              fontSize: '14px'
            }}
          >
            {horizon.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div 
          key={selected}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: HORIZON_EASE }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span style={{ 
              fontSize: '18px', 
              color: TIME_HORIZONS[selected].arrowColor,
              fontWeight: 500
            }}>
              {TIME_HORIZONS[selected].arrow}
            </span>
            <SegmentedProgressArc 
              segment={TIME_HORIZONS[selected].arcSegment}
              opacity={TIME_HORIZONS[selected].arcOpacity}
              gaps={TIME_HORIZONS[selected].arcGaps}
              color={PALETTE.accent.active}
            />
          </div>
          
          <div className="relative" style={{ paddingLeft: '8px', marginBottom: '12px' }}>
            <div style={{
              position: 'absolute',
              left: 0,
              top: '5px',
              bottom: '5px',
              width: '2px',
              background: PALETTE.accent.marker,
              borderRadius: '2px'
            }} />
            <p style={{ 
              color: PALETTE.neutral.textBright, 
              fontSize: '17px',
              fontWeight: 400,
              lineHeight: 1.75,
              letterSpacing: '-0.005em'
            }}>
              {TIME_HORIZONS[selected].state}
            </p>
          </div>
          <p style={{ 
            color: PALETTE.neutral.textCausal,
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: 1.85
          }}>
            {TIME_HORIZONS[selected].driver}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Component 8: InflationConsequencesLens
const CONSEQUENCES = {
  consumer: { 
    label: 'Consumer',
    arrow: '↗',
    arrowColor: PALETTE.teaching.friction,
    outcome: 'Living costs stay elevated as growth slows',
    mechanism: 'Incomes adjust slower than prices',
    watch: 'Wage growth vs core CPI'
  },
  worker: { 
    label: 'Worker',
    arrow: '→',
    arrowColor: PALETTE.teaching.policy,
    outcome: 'Wage gains help but don\'t restore purchasing power',
    mechanism: 'Inflation erodes gains before they compound',
    watch: 'Real wage trends'
  },
  business: { 
    label: 'Business',
    arrow: '↘',
    arrowColor: PALETTE.teaching.easing,
    outcome: 'Pricing power weakens',
    mechanism: 'Demand softens while costs remain high',
    watch: 'Margin compression signals'
  },
  government: { 
    label: 'Government',
    arrow: '→',
    arrowColor: PALETTE.teaching.friction,
    outcome: 'Policy flexibility shrinks',
    mechanism: 'Easing risks reigniting inflation',
    watch: 'Fed forward guidance shifts'
  },
  investor: { 
    label: 'Investor',
    arrow: '→',
    arrowColor: PALETTE.teaching.confidence,
    outcome: 'Valuations stay compressed longer',
    mechanism: 'Discount rates stabilize, not fall',
    watch: 'Long-term yield expectations'
  }
};

const InflationConsequencesLens = () => {
  const [selected, setSelected] = useState('consumer');

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        {Object.entries(CONSEQUENCES).map(([key, consequence]) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            className="relative px-5 py-2 rounded-xl transition-all duration-200"
            style={{
              background: selected === key 
                ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)'
                : 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.02) 100%)',
              backdropFilter: 'blur(32px) saturate(165%)',
              WebkitBackdropFilter: 'blur(32px) saturate(165%)',
              border: `1px solid ${selected === key ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)'}`,
              color: selected === key ? PALETTE.accent.active : PALETTE.neutral.text,
              fontWeight: selected === key ? 600 : 500,
              fontSize: '15px',
              letterSpacing: '-0.005em'
            }}
          >
            {consequence.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div 
          key={selected}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: HORIZON_EASE }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <span style={{ 
              fontSize: '18px', 
              color: CONSEQUENCES[selected].arrowColor,
              fontWeight: 500
            }}>
              {CONSEQUENCES[selected].arrow}
            </span>
          </div>
          
          <div className="relative" style={{ paddingLeft: '8px', marginBottom: '14px' }}>
            <div style={{
              position: 'absolute',
              left: 0,
              top: '5px',
              bottom: '5px',
              width: '2px',
              background: PALETTE.accent.marker,
              borderRadius: '2px'
            }} />
            <p style={{ 
              color: PALETTE.neutral.textBright, 
              fontSize: '17px',
              fontWeight: 400,
              lineHeight: 1.75,
              letterSpacing: '-0.005em'
            }}>
              {CONSEQUENCES[selected].outcome}
            </p>
          </div>
          
          <p style={{ 
            color: PALETTE.neutral.textCausal,
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: 1.75,
            marginBottom: '10px'
          }}>
            {CONSEQUENCES[selected].mechanism}
          </p>
          
          <p style={{ 
            color: PALETTE.neutral.textDim,
            fontSize: '12px',
            fontWeight: 500,
            lineHeight: 1.7,
            opacity: 0.75
          }}>
            Watch: {CONSEQUENCES[selected].watch}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Component 9: InflationImplicationsStrip
const ImplicationPill = ({ label, direction, note, because }) => {
  const Icon = direction === 'up' ? TrendingUp : direction === 'down' ? TrendingDown : Minus;
  
  // Semantic icon colors
  const getIconColor = () => {
    const labelLower = label.toLowerCase();
    if (labelLower.includes('rate')) return PALETTE.semantic.rates;
    if (labelLower.includes('equit')) return PALETTE.semantic.equities;
    if (labelLower.includes('credit')) return PALETTE.semantic.credit;
    if (labelLower.includes('usd')) return PALETTE.semantic.usd;
    if (labelLower.includes('risk')) return PALETTE.semantic.risk;
    return direction === 'up' ? '#6B95C0' : direction === 'down' ? '#8B9AAD' : '#78899A';
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -1, transition: { duration: 0.3, ease: HORIZON_EASE } }}
      className="relative flex flex-col gap-2.5 rounded-2xl overflow-hidden"
      style={{
        padding: '16px 20px',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.015) 100%)',
        backdropFilter: 'blur(48px) saturate(160%)',
        WebkitBackdropFilter: 'blur(48px) saturate(160%)',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.05), 0 2px 8px rgba(0,0,0,0.04)'
      }}
    >
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 flex-shrink-0" style={{ color: getIconColor(), strokeWidth: 2.5 }} />
        <span style={{ 
          color: PALETTE.neutral.textBright,
          fontSize: '14px',
          fontWeight: 600,
          letterSpacing: '-0.005em'
        }}>{label}</span>
        {note && <span style={{ 
          color: PALETTE.neutral.textDim,
          fontSize: '13px',
          fontWeight: 500
        }}>— {note}</span>}
      </div>
      {because && (
        <div style={{ 
        color: PALETTE.neutral.textCausal,
        fontSize: '13px',
        fontWeight: 400,
        lineHeight: 1.75,
        paddingLeft: '28px'
        }}>
        Because {because}.
        </div>
      )}
    </motion.div>
  );
};

const InflationImplicationsStrip = ({ implications }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: HORIZON_EASE, delay: 0.2 }}
    className="relative rounded-3xl overflow-hidden"
    style={{
      padding: '28px 32px',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.025) 0%, rgba(255, 255, 255, 0.015) 100%)',
      backdropFilter: 'blur(60px) saturate(160%)',
      WebkitBackdropFilter: 'blur(60px) saturate(160%)',
      border: '1px solid rgba(255,255,255,0.05)',
      boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.04), 0 6px 24px rgba(0,0,0,0.04)'
    }}
  >
    <div style={{
      position: 'absolute',
      top: 0,
      left: '12%',
      right: '12%',
      height: '1.5px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
      pointerEvents: 'none',
      filter: 'blur(0.5px)'
    }} />

    <h3 style={{ 
      color: PALETTE.neutral.textBright,
      fontSize: '16px',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
      marginBottom: '18px'
    }}>
      Pressure Effects
    </h3>

    <div className="flex flex-wrap gap-4">
      {implications.map((impl, idx) => (
        <ImplicationPill 
          key={idx}
          label={impl.label}
          direction={impl.direction}
          note={impl.note}
          because={impl.because}
        />
      ))}
    </div>
  </motion.div>
);

// Main Section Component
export default function InflationSection({ data }) {
  const [activeLens, setActiveLens] = useState('understanding');

  if (!data) return null;

  const lenses = [
    { id: 'understanding', label: 'What This Means' },
    { id: 'time', label: 'How This Evolves' },
    { id: 'consequences', label: 'What This Leads To' }
  ];

  return (
    <div className="relative space-y-8">
      {/* Vertical daylight gradient */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '60%',
        background: 'linear-gradient(180deg, rgba(36, 40, 46, 0.4) 0%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      
      <div className="relative z-10">
        <InflationStateHeader 
          state="Inflation — Sticky" 
          descriptor="Price pressure remains elevated, feeding into broader equilibrium."
        />
      </div>

      <InflationSystemNote />

      <div className="relative mb-12">
        {/* Subtle pressure field background */}
        <div style={{
          position: 'absolute',
          inset: '-40px',
          opacity: 0.03,
          pointerEvents: 'none',
          background: `
            linear-gradient(45deg, transparent 48%, ${PALETTE.teaching.friction} 49%, ${PALETTE.teaching.friction} 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, ${PALETTE.teaching.policy} 49%, ${PALETTE.teaching.policy} 51%, transparent 52%)
          `,
          backgroundSize: '80px 80px',
          filter: 'blur(1px)'
        }} />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: HORIZON_EASE }}
        >
          <InflationPressureRing 
            cpiValue={data.cpi_headline_yoy} 
            pceValue={data.pce_headline_yoy}
          />
        </motion.div>
      </div>

      <div className="relative z-10">
        <InflationSnapshotKPIs 
          cpi_headline_yoy={data.cpi_headline_yoy}
          cpi_core_yoy={data.cpi_core_yoy}
          pce_headline_yoy={data.pce_headline_yoy}
          pce_core_yoy={data.pce_core_yoy}
        />
      </div>

      <div className="relative z-10">
        <InflationLensSwitcher lenses={lenses} active={activeLens} onChange={setActiveLens} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeLens}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: HORIZON_EASE }}
          className="relative rounded-3xl overflow-hidden z-10"
          style={{
            padding: '52px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.018) 100%)',
            backdropFilter: 'blur(80px) saturate(165%)',
            WebkitBackdropFilter: 'blur(80px) saturate(165%)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.04)',
            minHeight: '320px'
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
            filter: 'blur(1px)'
          }} />

          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 35%, rgba(255, 255, 255, 0.04) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          {activeLens === 'understanding' && <InflationUnderstandingLens />}
          {activeLens === 'time' && <InflationTimeLens />}
          {activeLens === 'consequences' && <InflationConsequencesLens />}
        </motion.div>
      </AnimatePresence>

      {data.market_implications && data.market_implications.length > 0 && (
        <div className="relative z-10">
          <InflationImplicationsStrip implications={data.market_implications} />
        </div>
      )}
      
      {/* Transition zone into Equilibrium */}
      <div style={{
        height: '120px',
        background: 'linear-gradient(180deg, transparent 0%, rgba(36, 40, 46, 0.2) 50%, rgba(36, 40, 46, 0.4) 100%)',
        marginTop: '60px',
        marginBottom: '-40px',
        pointerEvents: 'none',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(100, 140, 180, 0.04) 0%, transparent 60%)',
          filter: 'blur(40px)'
        }} />
      </div>
    </div>
  );
}