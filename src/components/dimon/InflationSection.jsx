import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronRight, Home, Users, ShoppingBag, ArrowRight, Circle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
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

const DriverChip = ({ icon: Icon, label, detail }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative inline-flex items-center gap-2 px-3 py-2 rounded-full cursor-help"
      style={{
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
      whileHover={{ scale: 1.02 }}
    >
      <Icon className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.60)' }} strokeWidth={2} />
      <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>{label}</span>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 px-3 py-2 rounded-lg whitespace-nowrap z-50"
            style={{
              background: 'rgba(18, 20, 28, 0.95)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
            }}
          >
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>{detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const BiasIndicator = ({ label, direction, description }) => {
  const Icon = direction === 'up' ? ArrowUpRight : direction === 'down' ? ArrowDownRight : Minus;
  const color = direction === 'up' ? 'rgba(255, 106, 122, 0.90)' : direction === 'down' ? 'rgba(88, 227, 164, 0.90)' : 'rgba(168, 179, 199, 0.90)';
  
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} strokeWidth={2.5} />
      <div className="flex-1">
        <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.90)' }}>{label}</div>
        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{description}</div>
      </div>
    </div>
  );
};

export default function InflationSection({ data }) {
  const [showSources, setShowSources] = useState(false);
  
  if (!data) return null;

  const stateColors = StatePillColors[data.state_tag] || StatePillColors.Mixed;

  return (
    <div className="space-y-8">
      {/* Hero State — Single Dominant Moment */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: HORIZON_EASE }}
        className="pl-2"
      >
        <h2 className="text-3xl font-bold mb-3" style={{ color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.02em' }}>
          Inflation: Still Sticky
        </h2>
        <p className="text-base mb-4" style={{ color: 'rgba(255,255,255,0.60)' }}>
          Services and housing continue to limit progress.
        </p>
        <div 
          className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full"
          style={{
            background: stateColors.bg,
            border: `1px solid ${stateColors.border}`,
            color: stateColors.text
          }}
        >
          <Circle className="w-2.5 h-2.5 fill-current" />
          <span>Above Target</span>
        </div>
      </motion.div>

      {/* Inline Driver Chips — Progressive Disclosure */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: HORIZON_EASE, delay: 0.1 }}
        className="flex flex-wrap gap-2 px-2"
      >
        <DriverChip icon={Home} label="Housing" detail="Lagged shelter inflation" />
        <DriverChip icon={Users} label="Services" detail="Wage-driven pressure" />
        <DriverChip icon={ShoppingBag} label="Goods" detail="No longer inflationary" />
      </motion.div>

      {/* CPI vs PCE — Single Insight Moment */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: HORIZON_EASE, delay: 0.15 }}
        className="relative rounded-2xl overflow-hidden"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(94, 167, 255, 0.06) 0%, rgba(94, 167, 255, 0.02) 100%)',
          backdropFilter: 'blur(40px) saturate(160%)',
          WebkitBackdropFilter: 'blur(40px) saturate(160%)',
          border: '1px solid rgba(94, 167, 255, 0.14)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: '12%',
          right: '12%',
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent, rgba(94, 167, 255, 0.24), transparent)',
          pointerEvents: 'none'
        }} />

        <h3 className="text-lg font-bold mb-3" style={{ color: 'rgba(255,255,255,0.96)' }}>
          CPI overstates inflation pressure
        </h3>

        <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Shelter costs keep CPI elevated, while Core PCE — the Fed's anchor — reflects softer services inflation.
        </p>

        <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: 'rgba(94, 167, 255, 0.12)', border: '1px solid rgba(94, 167, 255, 0.20)', color: 'rgba(94, 167, 255, 0.95)' }}>
          Policy anchor: Core PCE
        </div>
      </motion.div>

      {/* Market Impact — Directional Bias */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: HORIZON_EASE, delay: 0.2 }}
        className="space-y-3 px-2"
      >
        <BiasIndicator label="Rates" direction="up" description="Restrictive for longer" />
        <BiasIndicator label="Equities" direction="neutral" description="Data sensitive" />
        <BiasIndicator label="USD" direction="up" description="Rate support" />
        <BiasIndicator label="Borrower flexibility" direction="down" description="Higher financing pressure" />
      </motion.div>

      {/* Metrics Grid — Demoted Evidence */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        <KPIChip label="CPI" value={data.cpi_headline_yoy ? `${data.cpi_headline_yoy}%` : null} />
        <KPIChip label="Core CPI" value={data.cpi_core_yoy ? `${data.cpi_core_yoy}%` : null} isCore />
        <KPIChip label="PCE" value={data.pce_headline_yoy ? `${data.pce_headline_yoy}%` : null} />
        <KPIChip label="Core PCE" value={data.pce_core_yoy ? `${data.pce_core_yoy}%` : null} isCore />
      </motion.div>

      {/* What to Watch — Temporal Flow */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: HORIZON_EASE, delay: 0.3 }}
        className="relative px-2 py-6"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        <div className="flex items-start gap-8">
          <div className="flex-1">
            <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em' }}>
              Near-term
            </div>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Services inflation · wage growth
            </p>
          </div>
          <div className="flex-1">
            <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em' }}>
              Longer-term
            </div>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Shelter CPI rollover · labor cooling
            </p>
          </div>
        </div>
      </motion.div>

      {/* Ambient Confidence — Hover-Revealed Trust */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        onMouseEnter={() => setShowSources(true)}
        onMouseLeave={() => setShowSources(false)}
        className="relative px-4 py-3 rounded-xl cursor-help transition-all duration-300"
        style={{ 
          background: 'rgba(255, 255, 255, 0.02)', 
          border: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Confidence: <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>High</span>
          </div>
          
          <AnimatePresence>
            {showSources && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="text-xs"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                ~78% · Fed, BLS, market data
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}