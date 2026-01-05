import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];

const HORIZONS = {
  now: {
    label: 'Now',
    bullets: [
      "Fed maintains current stance, watching labor market closely for signs of weakening.",
      "Markets price in potential rate cuts if inflation continues to moderate.",
      "Corporate earnings calls emphasize cost pressures and pricing power."
    ]
  },
  quarterly: {
    label: '3–12 Months',
    bullets: [
      "Housing costs begin to cool as lagged shelter components catch up to market reality.",
      "Services inflation becomes the primary determinant of policy direction.",
      "Currency markets adjust to shifting rate differential expectations."
    ]
  },
  longer: {
    label: '12–36 Months',
    bullets: [
      "Structural factors like deglobalization and labor market tightness anchor inflation above pre-pandemic levels.",
      "Central banks recalibrate long-term neutral rate assumptions.",
      "Asset allocation shifts toward inflation-protected securities gain momentum."
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

const KPIChip = ({ label, value, isCore = false }) => (
  <motion.div
    whileHover={{ scale: 1.018, y: -2, transition: { duration: 0.35, ease: HORIZON_EASE } }}
    className="relative flex flex-col items-center justify-center rounded-2xl overflow-hidden"
    style={{
      padding: '24px 28px',
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.052) 0%, rgba(255, 255, 255, 0.032) 100%)',
      backdropFilter: 'blur(48px) saturate(175%)',
      WebkitBackdropFilter: 'blur(48px) saturate(175%)',
      border: '1px solid rgba(255,255,255,0.10)',
      boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.10), 0 6px 24px rgba(0,0,0,0.12)',
      minWidth: '150px'
    }}
  >
    <div style={{
      position: 'absolute',
      top: 0,
      left: '15%',
      right: '15%',
      height: '1.5px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
      pointerEvents: 'none'
    }} />
    
    <div className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.65)', letterSpacing: '0.03em' }}>
      {label}
    </div>
    <div className="text-3xl font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.98)' }}>
      {value ?? '—'}
    </div>
    {isCore && (
      <div className="text-[10px] font-bold mt-1" style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em' }}>
        CORE
      </div>
    )}
  </motion.div>
);

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
        <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.92)' }}>{label}</span>
        {note && <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{note}</span>}
      </div>
    </motion.div>
  );
};

const SegmentedControl = ({ segments, active, onChange }) => (
  <div className="flex items-center justify-center gap-2 p-2 rounded-2xl" style={{
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.028) 100%)',
    backdropFilter: 'blur(36px) saturate(170%)',
    WebkitBackdropFilter: 'blur(36px) saturate(170%)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)'
  }}>
    {segments.map(segment => (
      <button
        key={segment.id}
        onClick={() => onChange(segment.id)}
        className="relative px-6 py-2.5 rounded-xl transition-all duration-200"
        style={{
          background: active === segment.id 
            ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)'
            : 'transparent',
          color: active === segment.id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.60)',
          fontWeight: active === segment.id ? 600 : 500,
          fontSize: '14px',
          boxShadow: active === segment.id ? 'inset 0 1px 0 rgba(255,255,255,0.12), 0 2px 8px rgba(0,0,0,0.08)' : 'none'
        }}
      >
        {segment.label}
      </button>
    ))}
  </div>
);

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
          fontSize: '14px'
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
      {/* Header */}
      <div className="pl-2">
        <h2 className="text-2xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.95)' }}>
          Inflation
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.60)' }}>
          CPI • PCE
        </p>
      </div>

      {/* 1) Snapshot: KPI Chips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Gap Visual & Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: HORIZON_EASE }}
        className="relative rounded-2xl overflow-hidden"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.052) 0%, rgba(255, 255, 255, 0.032) 100%)',
          backdropFilter: 'blur(48px) saturate(175%)',
          WebkitBackdropFilter: 'blur(48px) saturate(175%)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.10), 0 6px 24px rgba(0,0,0,0.12)'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
          pointerEvents: 'none'
        }} />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="text-xs font-bold px-3 py-1.5 rounded-full"
              style={{
                background: stateColors.bg,
                border: `1px solid ${stateColors.border}`,
                color: stateColors.text
              }}
            >
              {data.state_tag}
            </div>
            {data.last_updated && (
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {data.last_updated}
              </div>
            )}
          </div>
        </div>

        <p className="text-[17px] font-medium leading-relaxed" style={{ color: 'rgba(255,255,255,0.88)', lineHeight: '1.6' }}>
          {data.comparison_headline || "Inflation remains sticky as housing keeps CPI elevated while services soften in PCE."}
        </p>
      </motion.div>

      {/* Implications Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: HORIZON_EASE, delay: 0.2 }}
        className="relative rounded-2xl overflow-hidden"
        style={{
          padding: '24px',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.028) 100%)',
          backdropFilter: 'blur(32px) saturate(165%)',
          WebkitBackdropFilter: 'blur(32px) saturate(165%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.08)'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
          pointerEvents: 'none'
        }} />

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold" style={{ color: 'rgba(255,255,255,0.96)' }}>
            Implications
          </h3>
          <div 
            className="text-xs font-bold px-3 py-1.5 rounded-full"
            style={{
              background: policyColors.bg,
              border: `1px solid ${policyColors.border}`,
              color: policyColors.text
            }}
          >
            Policy: {data.policy_bias}
          </div>
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

      {/* Segmented Control */}
      <div className="flex justify-center my-6">
        <SegmentedControl segments={segments} active={activeSegment} onChange={setActiveSegment} />
      </div>

      {/* Depth Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSegment}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15, ease: HORIZON_EASE }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            padding: '32px',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.052) 0%, rgba(255, 255, 255, 0.032) 100%)',
            backdropFilter: 'blur(48px) saturate(175%)',
            WebkitBackdropFilter: 'blur(48px) saturate(175%)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.10), 0 8px 32px rgba(0,0,0,0.12)',
            minHeight: '280px'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            right: '15%',
            height: '1.5px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
            pointerEvents: 'none'
          }} />

          {activeSegment === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold mb-2" style={{ color: 'rgba(255,255,255,0.92)' }}>
                    CPI
                  </h4>
                  <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: '1.65' }}>
                    What households feel (rent, essentials)
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-bold mb-2" style={{ color: 'rgba(255,255,255,0.92)' }}>
                    PCE
                  </h4>
                  <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: '1.65' }}>
                    What policy watches (adaptive spending)
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-bold mb-3" style={{ color: 'rgba(255,255,255,0.92)' }}>
                  Why the gap matters
                </h4>
                <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: '1.65' }}>
                  CPI above PCE → consumer pressure
                </p>
                <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: '1.65' }}>
                  PCE above CPI → broad demand inflation
                </p>
                <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: '1.65' }}>
                  Gap informs Fed policy bias
                </p>
              </div>
            </div>
          )}

          {activeSegment === 'timeline' && (
            <div>
              <TimelineSelector horizons={HORIZONS} active={selectedHorizon} onChange={setSelectedHorizon} />
              <div className="space-y-3">
                {HORIZONS[selectedHorizon].bullets.map((bullet, idx) => (
                  <p key={idx} className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)', lineHeight: '1.65' }}>
                    {bullet}
                  </p>
                ))}
              </div>
            </div>
          )}

          {activeSegment === 'impact' && (
            <div>
              <StakeholderSelector stakeholders={STAKEHOLDERS} active={selectedStakeholder} onChange={setSelectedStakeholder} />
              <div className="text-center max-w-2xl mx-auto">
                <h4 className="text-base font-bold mb-3" style={{ color: 'rgba(255,255,255,0.92)' }}>
                  {STAKEHOLDERS[selectedStakeholder].label}
                </h4>
                <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)', lineHeight: '1.7' }}>
                  {STAKEHOLDERS[selectedStakeholder].description}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}