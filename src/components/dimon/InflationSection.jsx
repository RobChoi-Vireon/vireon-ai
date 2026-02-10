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
          Inflation
        </h2>
      </div>

      {/* Current State — Primary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: HORIZON_EASE }}
        className="relative rounded-2xl overflow-hidden mb-6"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.050) 0%, rgba(255, 255, 255, 0.030) 100%)',
          backdropFilter: 'blur(32px) saturate(165%)',
          WebkitBackdropFilter: 'blur(32px) saturate(165%)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.10)'
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
          Inflation remains above target and is not improving meaningfully.
        </h3>

        <div className="flex items-center gap-2 mb-4">
          <div 
            className="text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2"
            style={{
              background: stateColors.bg,
              border: `1px solid ${stateColors.border}`,
              color: stateColors.text
            }}
          >
            <Circle className="w-3 h-3 fill-current" />
            <span>Above Target • {data.state_tag || 'Sticky'}</span>
          </div>
        </div>

        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Goods prices have cooled. Services and housing inflation remain elevated.
        </p>
      </motion.div>

      {/* What's Driving Inflation — Causes Only */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: HORIZON_EASE, delay: 0.05 }}
        className="relative rounded-2xl overflow-hidden mb-6"
        style={{
          padding: '24px 28px',
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
          What's driving inflation
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Home className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.60)' }} strokeWidth={2} />
            <div>
              <div className="text-sm font-medium mb-0.5" style={{ color: 'rgba(255,255,255,0.90)' }}>Housing</div>
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>Shelter inflation adjusts slowly.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.60)' }} strokeWidth={2} />
            <div>
              <div className="text-sm font-medium mb-0.5" style={{ color: 'rgba(255,255,255,0.90)' }}>Services & wages</div>
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>Labor costs remain elevated.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShoppingBag className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.60)' }} strokeWidth={2} />
            <div>
              <div className="text-sm font-medium mb-0.5" style={{ color: 'rgba(255,255,255,0.90)' }}>Goods</div>
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>Goods prices are no longer a material driver.</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Why This Matters — Policy Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: HORIZON_EASE, delay: 0.1 }}
        className="relative rounded-2xl overflow-hidden mb-6"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(94, 167, 255, 0.08) 0%, rgba(94, 167, 255, 0.04) 100%)',
          backdropFilter: 'blur(32px) saturate(165%)',
          WebkitBackdropFilter: 'blur(32px) saturate(165%)',
          border: '1px solid rgba(94, 167, 255, 0.18)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.10)'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent, rgba(94, 167, 255, 0.28), transparent)',
          pointerEvents: 'none'
        }} />

        <h3 className="text-base font-bold mb-3" style={{ color: 'rgba(255,255,255,0.95)' }}>
          Why this matters
        </h3>

        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
          Services inflation drives Fed policy, keeping rate cuts constrained while it remains elevated.
        </p>
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

      {/* Market Impact — Downstream Effects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: HORIZON_EASE, delay: 0.15 }}
        className="relative rounded-2xl overflow-hidden mb-6"
        style={{
          padding: '24px 28px',
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
          Market impact
        </h3>

        <div className="space-y-2.5">
          <div className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }} />
            <div>
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.90)' }}>Rates: </span>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.70)' }}>Restrictive for longer</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }} />
            <div>
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.90)' }}>Equities: </span>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.70)' }}>Sensitive to inflation data</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }} />
            <div>
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.90)' }}>U.S. dollar: </span>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.70)' }}>Supported</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }} />
            <div>
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.90)' }}>Borrowers: </span>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.70)' }}>Higher financing pressure</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* What to Watch — Time Horizon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: HORIZON_EASE, delay: 0.2 }}
        className="relative rounded-2xl overflow-hidden mb-6"
        style={{
          padding: '24px 28px',
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
          What to watch
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em' }}>
              Short term
            </div>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.80)' }}>
              Services inflation and wage growth.
            </p>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em' }}>
              Long term
            </div>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.80)' }}>
              Shelter CPI rollover and labor market cooling.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Consensus & Conditionality */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: HORIZON_EASE, delay: 0.25 }}
        className="relative rounded-2xl overflow-hidden mb-6"
        style={{
          padding: '24px 28px',
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

        <h3 className="text-base font-bold mb-3" style={{ color: 'rgba(255,255,255,0.95)' }}>
          Consensus view
        </h3>

        <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
          Inflation progress has stalled, keeping policy restrictive until services inflation cools.
        </p>

        <div className="pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em' }}>
            What would change this view
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }} />
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Sustained decline in core services PCE
              </p>
            </div>
            <div className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }} />
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Cooling wage growth
              </p>
            </div>
            <div className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }} />
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Clear shelter disinflation
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confidence Footer */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em' }}>
            Confidence
          </div>
          <div className="text-base font-bold" style={{ color: 'rgba(255,255,255,0.80)' }}>
            78%
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-medium uppercase tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em' }}>
            Sources
          </div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.60)' }}>
            Federal Reserve · BLS · Bloomberg · WSJ · FT
          </div>
        </div>
      </div>
    </div>
  );
}