import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronRight, Home, Users, ShoppingBag, ArrowRight, Circle } from 'lucide-react';
import CPIvsPCEOrb from './CPIvsPCEOrb';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="pl-2 mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'rgba(255,255,255,0.95)' }}>
          Inflation — Sticky Beneath the Surface
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.70)' }}>
          Headline inflation is easing, but core pressures remain elevated due to housing and services.
        </p>
      </div>

      {/* Primary State Orb — Centerpiece */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: HORIZON_EASE }}
        className="relative rounded-3xl overflow-hidden mb-6"
        style={{
          padding: '32px',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.055) 0%, rgba(255, 255, 255, 0.032) 100%)',
          backdropFilter: 'blur(36px) saturate(170%)',
          WebkitBackdropFilter: 'blur(36px) saturate(170%)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.10), 0 6px 20px rgba(0,0,0,0.12)'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: '12%',
          right: '12%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
          pointerEvents: 'none'
        }} />

        <div className="text-center mb-3">
          <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.50)', letterSpacing: '0.1em' }}>
            Core Inflation State
          </div>
          <div className="text-5xl font-bold mb-2" style={{ color: 'rgba(255,255,255,0.95)' }}>
            {data.pce_core_yoy ? `${data.pce_core_yoy}%` : '—'}
          </div>
          <div className="text-sm font-medium mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Above Target
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <div 
              className="text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2"
              style={{
                background: stateColors.bg,
                border: `1px solid ${stateColors.border}`,
                color: stateColors.text
              }}
            >
              <Circle className="w-3 h-3 fill-current" />
              <span>{data.state_tag || 'Sticky'} (Not Breaking Down Yet)</span>
            </div>
          </div>

          <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.70)', lineHeight: '1.6' }}>
            Disinflation has slowed as services and housing remain the constraint.
          </p>
        </div>
      </motion.div>

      {/* Primary Drivers Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: HORIZON_EASE }}
        className="relative rounded-2xl overflow-hidden mb-6"
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

        <h3 className="text-base font-bold mb-4" style={{ color: 'rgba(255,255,255,0.95)' }}>
          Primary Drivers
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Home className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.70)' }} />
            <div>
              <div className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>Housing & Shelter</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.60)' }}>Lagged CPI strength</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.70)' }} />
            <div>
              <div className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>Services & Wages</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.60)' }}>Persistent cost pressure</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShoppingBag className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.70)' }} />
            <div>
              <div className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>Goods</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.60)' }}>No longer inflationary</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CPI vs PCE Interpretive Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: HORIZON_EASE, delay: 0.1 }}
        className="relative rounded-2xl overflow-hidden mb-6"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(94, 167, 255, 0.10) 0%, rgba(94, 167, 255, 0.05) 100%)',
          backdropFilter: 'blur(36px) saturate(168%)',
          WebkitBackdropFilter: 'blur(36px) saturate(168%)',
          border: '1px solid rgba(94, 167, 255, 0.22)',
          boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.10), 0 6px 20px rgba(0,0,0,0.14)'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: '12%',
          right: '12%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(94, 167, 255, 0.38), transparent)',
          pointerEvents: 'none'
        }} />

        {/* Forced Takeaway — Zero Thinking Required */}
        <div className="mb-6 pb-5 border-b" style={{ borderColor: 'rgba(94, 167, 255, 0.18)' }}>
          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(94, 167, 255, 0.80)', letterSpacing: '0.08em' }}>
            Primary Takeaway
          </div>
          <p className="text-lg font-bold leading-tight" style={{ color: 'rgba(255,255,255,0.98)' }}>
            CPI overstates inflation pressure — Core PCE reflects the Fed's reality.
          </p>
        </div>

        {/* Compressed Explanation */}
        <div className="mb-5">
          <h3 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.70)', letterSpacing: '0.06em' }}>
            Why CPI Is Running Above PCE
          </h3>
          <p className="text-sm leading-relaxed mb-2" style={{ color: 'rgba(255,255,255,0.85)' }}>
            CPI remains elevated due to its heavy weighting of shelter costs, which lag real-time housing conditions. PCE shows softer services inflation and is the Fed's preferred policy gauge.
          </p>
        </div>

        {/* Policy Benchmark Declaration */}
        <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-xl" style={{ background: 'rgba(94, 167, 255, 0.14)', border: '1px solid rgba(94, 167, 255, 0.24)' }}>
          <div className="flex-1">
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(94, 167, 255, 0.90)', letterSpacing: '0.08em' }}>
              Policy-Relevant Benchmark
            </div>
            <div className="text-2xl font-bold" style={{ color: 'rgba(255,255,255,0.96)' }}>
              Core PCE ({data.pce_core_yoy ? `${data.pce_core_yoy}%` : '2.9%'})
            </div>
          </div>
        </div>

        {/* Market Translation — Plain English */}
        <div className="flex items-start gap-2 px-4 py-3 rounded-xl" style={{ background: 'rgba(94, 167, 255, 0.10)', border: '1px solid rgba(94, 167, 255, 0.18)' }}>
          <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'rgba(94, 167, 255, 0.90)' }} />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(94, 167, 255, 0.80)', letterSpacing: '0.06em' }}>
              Translation for Markets
            </div>
            <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.92)' }}>
              CPI headlines may look hot, but they exaggerate policy pressure relative to what the Fed actually responds to.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid — Supporting Evidence */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

      {/* Market Bias — Downstream Implications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: HORIZON_EASE, delay: 0.2 }}
        className="relative rounded-2xl overflow-hidden mb-6"
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
          <h3 className="text-base font-bold" style={{ color: 'rgba(255,255,255,0.95)' }}>
            Market Bias
          </h3>
          <div 
            className="text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2"
            style={{
              background: policyColors.bg,
              border: `1px solid ${policyColors.border}`,
              color: policyColors.text
            }}
          >
            <Circle className="w-2.5 h-2.5 fill-current" />
            <span>Policy Bias: {data.policy_bias || 'Hawkish Hold'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>Rates</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.60)' }}>Higher-for-longer bias remains</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>Equities</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.60)' }}>Valuation pressure persists</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>USD</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.60)' }}>Supported by rate differentials</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>Risk Assets</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.60)' }}>Sensitive to services inflation data</div>
          </div>
        </div>
      </motion.div>

      {/* What to Watch — Invalidation Conditions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: HORIZON_EASE, delay: 0.3 }}
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

        <h3 className="text-base font-bold mb-4" style={{ color: 'rgba(255,255,255,0.95)' }}>
          What Would Change This View
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }} />
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Sustained decline in Core PCE services
            </p>
          </div>
          <div className="flex items-start gap-3">
            <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }} />
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Cooling wage growth
            </p>
          </div>
          <div className="flex items-start gap-3">
            <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }} />
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Shelter CPI rolling over decisively
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}