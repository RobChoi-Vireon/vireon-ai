import React from 'react';
import { motion } from 'framer-motion';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];

const NARRATIVE_STATES = {
  stable_consensus: {
    label: 'STABLE CONSENSUS',
    explainer: 'Markets are broadly aligned around the dominant macro narrative.',
    accent: 'rgba(88,227,164,0.72)',
    accentGlow: 'rgba(88,227,164,0.18)',
    pulseColor: 'rgba(88,227,164,0.85)',
  },
  debated_regime: {
    label: 'DEBATED REGIME',
    explainer: 'Consensus exists, but key macro narratives remain contested.',
    accent: 'rgba(255,190,80,0.72)',
    accentGlow: 'rgba(255,190,80,0.18)',
    pulseColor: 'rgba(255,190,80,0.85)',
  },
  regional_divergence: {
    label: 'REGIONAL DIVERGENCE',
    explainer: 'US and global markets are interpreting macro developments differently.',
    accent: 'rgba(94,167,255,0.72)',
    accentGlow: 'rgba(94,167,255,0.18)',
    pulseColor: 'rgba(94,167,255,0.85)',
  },
  narrative_transition: {
    label: 'NARRATIVE TRANSITION',
    explainer: 'Market narratives are shifting rapidly as new information arrives.',
    accent: 'rgba(180,120,255,0.72)',
    accentGlow: 'rgba(180,120,255,0.18)',
    pulseColor: 'rgba(180,120,255,0.85)',
  },
};

// Map color string from backend to a pulse color
const COLOR_MAP = {
  green: { pulseColor: 'rgba(88,227,164,0.85)', accent: 'rgba(88,227,164,0.72)', accentGlow: 'rgba(88,227,164,0.18)' },
  yellow: { pulseColor: 'rgba(255,190,80,0.85)', accent: 'rgba(255,190,80,0.72)', accentGlow: 'rgba(255,190,80,0.18)' },
  orange: { pulseColor: 'rgba(255,140,50,0.85)', accent: 'rgba(255,140,50,0.72)', accentGlow: 'rgba(255,140,50,0.18)' },
  red: { pulseColor: 'rgba(255,106,122,0.85)', accent: 'rgba(255,106,122,0.72)', accentGlow: 'rgba(255,106,122,0.18)' },
};

function toTitleCase(str) {
  return (str || '').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export default function NarrativeStateCard({ narrativeState = 'debated_regime', narrativeStateExplainer = null, liveData = null }) {
  // If liveData is provided (from narrative_map.narrative_state), use it directly
  let config, label, displayExplainer, asOf;
  if (liveData) {
    const colorCfg = COLOR_MAP[liveData.color] || COLOR_MAP.yellow;
    config = { ...colorCfg };
    label = toTitleCase(liveData.regime);
    displayExplainer = liveData.description || '';
    asOf = liveData.as_of_display || '—';
  } else {
    config = NARRATIVE_STATES[narrativeState] || NARRATIVE_STATES.debated_regime;
    label = config.label;
    displayExplainer = narrativeStateExplainer || config.explainer;
    asOf = '—';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08, ease: HORIZON_EASE }}
      className="mb-5"
    >
      {/* Glass card container */}
      <div
        className="relative rounded-2xl overflow-hidden p-5"
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.066) 0%, rgba(255,255,255,0.032) 55%, rgba(255,255,255,0.044) 100%)',
          backdropFilter: 'blur(24px) saturate(150%)',
          WebkitBackdropFilter: 'blur(24px) saturate(150%)',
          border: '1px solid rgba(255,255,255,0.11)',
          boxShadow: [
            'inset 0 1.5px 0 rgba(255,255,255,0.10)',
            'inset 0 -1px 0 rgba(0,0,0,0.10)',
            'inset 1px 0 0 rgba(255,255,255,0.05)',
            '0 4px 16px rgba(0,0,0,0.12)',
          ].join(', '),
        }}
      >
        {/* Top specular highlight */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '8%',
            right: '8%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 35%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.12) 65%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Subsurface glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: `radial-gradient(ellipse at 50% -10%, ${config.accentGlow} 0%, transparent 65%)`,
            pointerEvents: 'none',
            zIndex: 0,
            borderRadius: '2xl',
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.88)' }}>
              Narrative State
            </h3>
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.32)' }}>
              As of: {asOf}
            </span>
          </div>

          {/* Main state with system-active dot */}
          <div className="flex items-center gap-2.5 mb-2.5">
            {/* Pulsing system-active dot */}
            <div className="relative flex-shrink-0">
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6], scale: [0.85, 1, 0.85] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-2 h-2 rounded-full"
                style={{
                  background: config.pulseColor,
                  boxShadow: `0 0 8px ${config.pulseColor}`,
                }}
              />
              <motion.div
                animate={{ opacity: [0.25, 0, 0.25], scale: [1, 1.8, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 w-2 h-2 rounded-full"
                style={{
                  background: config.pulseColor.replace(/[\d.]+\)$/, '0.15)'),
                }}
              />
            </div>

            {/* State label */}
            <motion.h2
              className="text-[18px] font-bold tracking-[-0.01em]"
              style={{
                color: config.accent,
                letterSpacing: '-0.01em',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease: HORIZON_EASE }}
            >
              {label}
            </motion.h2>
          </div>

          {/* Supporting explainer line */}
          <motion.p
            className="text-[13px] leading-[1.5]"
            style={{
              color: 'rgba(255,255,255,0.60)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35, ease: HORIZON_EASE }}
          >
            {displayExplainer}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}