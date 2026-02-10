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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: HORIZON_EASE }}
        className="mb-10"
      >
        <h3 className="text-xl font-semibold mb-5 leading-tight" style={{ color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.015em', maxWidth: '680px' }}>
          Inflation remains above target and is not improving meaningfully.
        </h3>

        <div className="flex items-center gap-3 mb-5">
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full"
            style={{
              background: 'rgba(255, 180, 100, 0.08)',
              border: '1px solid rgba(255, 180, 100, 0.16)',
              color: '#FFB464'
            }}
          >
            <Circle className="w-2.5 h-2.5 fill-current opacity-90" />
            <span className="text-xs font-semibold">Above Target • {data.state_tag || 'Sticky'}</span>
          </div>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.68)', maxWidth: '560px' }}>
          Goods prices have cooled. Services and housing inflation remain elevated.
        </p>
      </motion.div>

      {/* What's Driving Inflation — Causes Only */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: HORIZON_EASE, delay: 0.08 }}
        className="mb-10"
      >
        <h3 className="text-base font-semibold mb-6" style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em' }}>
          What's driving inflation
        </h3>

        <div className="space-y-5 pl-1">
          <div className="flex items-start gap-3.5">
            <Home className="w-[18px] h-[18px] mt-1 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.48)', strokeWidth: 1.8 }} />
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.88)' }}>Housing</div>
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.58)' }}>Shelter inflation adjusts slowly.</div>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <Users className="w-[18px] h-[18px] mt-1 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.48)', strokeWidth: 1.8 }} />
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.88)' }}>Services & wages</div>
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.58)' }}>Labor costs remain elevated.</div>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <ShoppingBag className="w-[18px] h-[18px] mt-1 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.48)', strokeWidth: 1.8 }} />
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.88)' }}>Goods</div>
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.58)' }}>Goods prices are no longer a material driver.</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Why This Matters — Policy Link */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: HORIZON_EASE, delay: 0.12 }}
        className="mb-10 pl-1"
      >
        <h3 className="text-base font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em' }}>
          Why this matters
        </h3>

        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.70)', maxWidth: '640px' }}>
          Services inflation drives Fed policy, keeping rate cuts constrained while it remains elevated.
        </p>
      </motion.div>

      {/* Metrics — Minimal Supporting Evidence */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.16 }}
        className="mb-10"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>CPI YoY</div>
            <div className="text-2xl font-semibold tabular-nums" style={{ color: 'rgba(255,255,255,0.92)' }}>
              {data.cpi_headline_yoy ? `${data.cpi_headline_yoy}%` : '—'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>Core CPI YoY</div>
            <div className="text-2xl font-semibold tabular-nums" style={{ color: 'rgba(255,255,255,0.92)' }}>
              {data.cpi_core_yoy ? `${data.cpi_core_yoy}%` : '—'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>PCE YoY</div>
            <div className="text-2xl font-semibold tabular-nums" style={{ color: 'rgba(255,255,255,0.92)' }}>
              {data.pce_headline_yoy ? `${data.pce_headline_yoy}%` : '—'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>Core PCE YoY</div>
            <div className="text-2xl font-semibold tabular-nums" style={{ color: 'rgba(255,255,255,0.92)' }}>
              {data.pce_core_yoy ? `${data.pce_core_yoy}%` : '—'}
            </div>
          </div>
        </div>
        
        <div className="w-full h-px mt-8 mb-2" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
      </motion.div>

      {/* Market Impact — Downstream Effects */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: HORIZON_EASE, delay: 0.16 }}
        className="mb-10 pl-1"
      >
        <h3 className="text-base font-semibold mb-5" style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em' }}>
          Market impact
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.86)' }}>Rates</span>
            <div className="flex-1 border-b border-dotted" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.58)' }}>Restrictive for longer</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.86)' }}>Equities</span>
            <div className="flex-1 border-b border-dotted" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.58)' }}>Sensitive to inflation data</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.86)' }}>U.S. dollar</span>
            <div className="flex-1 border-b border-dotted" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.58)' }}>Supported</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.86)' }}>Borrowers</span>
            <div className="flex-1 border-b border-dotted" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.58)' }}>Higher financing pressure</span>
          </div>
        </div>
      </motion.div>

      {/* What to Watch — Time Horizon */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: HORIZON_EASE, delay: 0.2 }}
        className="mb-10 pl-1"
      >
        <h3 className="text-base font-semibold mb-5" style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em' }}>
          What to watch
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.42)', letterSpacing: '0.08em' }}>
              Short term
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
              Services inflation and wage growth.
            </p>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.42)', letterSpacing: '0.08em' }}>
              Long term
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
              Shelter CPI rollover and labor market cooling.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Consensus & Conditionality */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: HORIZON_EASE, delay: 0.24 }}
        className="mb-10 pl-1"
      >
        <h3 className="text-base font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em' }}>
          Consensus view
        </h3>

        <p className="text-sm mb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.70)', maxWidth: '640px' }}>
          Inflation progress has stalled, keeping policy restrictive until services inflation cools.
        </p>

        <div className="pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.42)', letterSpacing: '0.08em' }}>
            What would change this view
          </div>
          <div className="space-y-2.5 pl-0.5">
            <div className="flex items-start gap-2.5">
              <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.32)' }} />
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.68)' }}>
                Sustained decline in core services PCE
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.32)' }} />
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.68)' }}>
                Cooling wage growth
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.32)' }} />
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.68)' }}>
                Clear shelter disinflation
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confidence Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.32 }}
        className="flex items-center justify-between pt-6 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div>
          <div className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.38)', letterSpacing: '0.08em' }}>
            Confidence
          </div>
          <div className="text-sm font-semibold tabular-nums" style={{ color: 'rgba(255,255,255,0.72)' }}>
            78%
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.38)', letterSpacing: '0.08em' }}>
            Sources
          </div>
          <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.52)' }}>
            Federal Reserve · BLS · Bloomberg · WSJ · FT
          </div>
        </div>
      </motion.div>
    </div>
  );
}