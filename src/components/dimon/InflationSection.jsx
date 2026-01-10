import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronRight, Globe } from 'lucide-react';
import CPIvsPCEOrb from './CPIvsPCEOrb';
import EquilibriumPulse from './EquilibriumPulse';
import YinYangIcon from './YinYangIcon';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];

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
    whileHover={{ scale: 1.02, y: -1 }}
    className="relative flex flex-col items-center justify-center rounded-2xl overflow-hidden"
    style={{
      padding: '20px 24px',
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.028) 100%)',
      backdropFilter: 'blur(32px) saturate(165%)',
      WebkitBackdropFilter: 'blur(32px) saturate(165%)',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.08)',
      minWidth: '140px'
    }}
  >
    <div style={{
      position: 'absolute',
      top: 0,
      left: '15%',
      right: '15%',
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
      pointerEvents: 'none'
    }} />
    
    <div className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.60)', letterSpacing: '0.02em' }}>
      {label}
    </div>
    <div className="text-2xl font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.95)' }}>
      {value ?? '—'}
    </div>
    {isCore && (
      <div className="text-[10px] font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>
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
      whileHover={{ scale: 1.02, y: -1 }}
      className="relative flex items-center gap-2 rounded-xl overflow-hidden"
      style={{
        padding: '10px 16px',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.028) 100%)',
        backdropFilter: 'blur(28px) saturate(165%)',
        WebkitBackdropFilter: 'blur(28px) saturate(165%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.06)'
      }}
    >
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color, strokeWidth: 2 }} />
      <div className="flex flex-col">
        <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>{label}</span>
        {note && <span className="text-xs" style={{ color: 'rgba(255,255,255,0.50)' }}>{note}</span>}
      </div>
    </motion.div>
  );
};

export default function InflationSection({ data }) {
  if (!data) return null;

  const stateColors = StatePillColors[data.state_tag] || StatePillColors.Mixed;
  const policyColors = PolicyBiasColors[data.policy_bias] || PolicyBiasColors.Neutral;

  return (
    <div className="space-y-8">
      {/* Inflation Header */}
      <div className="pl-2 mb-3">
        <h2 className="text-2xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.95)' }}>
          Inflation
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.60)' }}>
          CPI • PCE
        </p>
      </div>

      {/* Living Visual — CPI vs PCE Orb */}
      <CPIvsPCEOrb data={data} />

      {data.last_updated && (
        <div className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.40)', marginTop: '16px' }}>
          Last updated: {data.last_updated}
        </div>
      )}

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

      {/* 2) Compare + 3) Meaning */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Compare Card */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: HORIZON_EASE }}
            className="relative rounded-2xl overflow-hidden h-full"
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

            <div className="flex items-center gap-3 mb-4">
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
            </div>

            <h3 className="text-lg font-bold mb-3" style={{ color: 'rgba(255,255,255,0.95)' }}>
              Compare
            </h3>

            <div className="space-y-2">
              <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {data.comparison_headline || "CPI and PCE tracking closely"}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.60)' }}>
                {data.comparison_detail || "Both measures showing similar trends across major categories."}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Meaning Card */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: HORIZON_EASE, delay: 0.1 }}
            className="relative rounded-2xl overflow-hidden h-full"
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

            <h3 className="text-lg font-bold mb-4" style={{ color: 'rgba(255,255,255,0.95)' }}>
              Meaning
            </h3>

            <div className="space-y-3">
              {(data.interpretation_bullets || []).map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }} />
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    {bullet}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4) Implications: Horizontal Pill Strip */}
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

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: 'rgba(255,255,255,0.95)' }}>
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
    </div>
  );
}