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
    whileHover={{ 
      y: -6,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 12px 32px rgba(0,0,0,0.12)',
      transition: { duration: 0.3, ease: "easeOut" }
    }}
    className="relative flex flex-col items-center justify-center rounded-2xl overflow-hidden group"
    style={{
      padding: '28px 24px',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.03) 100%)',
      backdropFilter: 'blur(32px) saturate(165%)',
      WebkitBackdropFilter: 'blur(32px) saturate(165%)',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 6px 20px rgba(0,0,0,0.08)',
      minWidth: '140px'
    }}
  >
    <motion.div 
      style={{
        position: 'absolute',
        top: 0,
        left: '12%',
        right: '12%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
        pointerEvents: 'none',
        filter: 'blur(0.5px)'
      }}
      className="opacity-60 group-hover:opacity-100"
      transition={{ duration: 0.3 }}
    />
    
    <div className="text-[10px] font-semibold mb-2 uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.50)' }}>
      {label}
    </div>
    <motion.div 
      className="text-3xl font-light tracking-tight mb-1" 
      style={{ 
        color: 'rgba(255,255,255,0.98)',
        fontVariantNumeric: 'tabular-nums'
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {value ?? '—'}
    </motion.div>
    {isCore && (
      <motion.div 
        className="text-[9px] font-bold mt-1 px-2 py-0.5 rounded-full" 
        style={{ 
          color: 'rgba(255,255,255,0.60)',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
          letterSpacing: '0.08em'
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        CORE
      </motion.div>
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
    <div className="space-y-8"
      style={{
        background: 'radial-gradient(circle at 50% 20%, rgba(255, 180, 100, 0.03) 0%, transparent 60%)',
        padding: '48px 24px',
        marginLeft: '-24px',
        marginRight: '-24px',
        borderRadius: '32px'
      }}
    >
      {/* Header */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: HORIZON_EASE }}
      >
        <motion.h2 
          className="text-5xl md:text-6xl font-light mb-6" 
          style={{ 
            color: 'rgba(255,255,255,0.98)',
            letterSpacing: '-0.03em',
            lineHeight: '1.1'
          }}
          animate={{ 
            textShadow: [
              '0 0 40px rgba(255, 180, 100, 0)',
              '0 0 40px rgba(255, 180, 100, 0.15)',
              '0 0 40px rgba(255, 180, 100, 0)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          Inflation
        </motion.h2>
        <motion.p 
          className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" 
          style={{ 
            color: 'rgba(255,255,255,0.65)',
            fontWeight: 300,
            letterSpacing: '0.01em'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Sticky Beneath the Surface
        </motion.p>
      </motion.div>

      {/* Primary State Orb — Hero Centerpiece */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
        className="relative mb-20"
        style={{ perspective: '2000px' }}
      >
        {/* Ambient Glow Background */}
        <motion.div
          className="absolute inset-0 -z-10"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 180, 100, 0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
            transform: 'translateZ(-100px)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="relative rounded-[36px] overflow-visible"
          style={{
            padding: '56px 48px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: `
              inset 0 2px 0 rgba(255,255,255,0.12),
              0 20px 60px rgba(0,0,0,0.20),
              0 0 80px rgba(255, 180, 100, 0.12)
            `
          }}
          whileHover={{ 
            boxShadow: `
              inset 0 2px 0 rgba(255,255,255,0.14),
              0 24px 70px rgba(0,0,0,0.24),
              0 0 100px rgba(255, 180, 100, 0.18)
            `,
            transition: { duration: 0.6, ease: "easeOut" }
          }}
        >
          {/* Top Light Streak */}
          <motion.div 
            style={{
              position: 'absolute',
              top: 0,
              left: '8%',
              right: '8%',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent)',
              pointerEvents: 'none',
              filter: 'blur(1px)'
            }}
            animate={{
              opacity: [0.5, 0.9, 0.5]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="text-center relative">
            <motion.div 
              className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-6" 
              style={{ 
                color: 'rgba(255,255,255,0.45)',
                fontWeight: 600
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Core Inflation State
            </motion.div>
            
            <motion.div 
              className="text-[88px] md:text-[112px] font-extralight mb-4 relative" 
              style={{ 
                color: 'rgba(255,255,255,0.98)',
                letterSpacing: '-0.04em',
                lineHeight: '0.9',
                fontVariantNumeric: 'tabular-nums'
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
            >
              {data.pce_core_yoy ? `${data.pce_core_yoy}%` : '—'}
              
              {/* Orbital Ring */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              >
                <div
                  style={{
                    width: '140%',
                    height: '140%',
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 180, 100, 0.15)',
                    boxShadow: '0 0 30px rgba(255, 180, 100, 0.1)'
                  }}
                />
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="text-base font-medium mb-6" 
              style={{ 
                color: 'rgba(255,255,255,0.60)',
                letterSpacing: '0.02em'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Above Target
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-center gap-2 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <motion.div 
                className="text-sm font-semibold px-5 py-2.5 rounded-full flex items-center gap-2.5"
                style={{
                  background: `linear-gradient(135deg, ${stateColors.bg}, ${stateColors.bg})`,
                  border: `1px solid ${stateColors.border}`,
                  color: stateColors.text,
                  boxShadow: `0 4px 12px ${stateColors.bg}`
                }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Circle className="w-2.5 h-2.5 fill-current" />
                </motion.div>
                <span>{data.state_tag || 'Sticky'}</span>
              </motion.div>
            </motion.div>

            <motion.p 
              className="text-base max-w-xl mx-auto font-light" 
              style={{ 
                color: 'rgba(255,255,255,0.65)', 
                lineHeight: '1.7',
                letterSpacing: '0.01em'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              Disinflation has slowed as services and housing remain the constraint.
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      {/* Primary Drivers — Cause Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: HORIZON_EASE }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
      >
        {[
          { icon: Home, title: 'Housing & Shelter', subtitle: 'Lagged CPI strength', color: 'rgba(255, 180, 100, 0.15)' },
          { icon: Users, title: 'Services & Wages', subtitle: 'Persistent cost pressure', color: 'rgba(255, 106, 122, 0.15)' },
          { icon: ShoppingBag, title: 'Goods', subtitle: 'No longer inflationary', color: 'rgba(88, 227, 164, 0.15)' }
        ].map((driver, idx) => (
          <motion.div
            key={idx}
            className="relative rounded-2xl overflow-hidden group"
            style={{
              padding: '32px 24px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.03) 100%)',
              backdropFilter: 'blur(32px) saturate(165%)',
              WebkitBackdropFilter: 'blur(32px) saturate(165%)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 20px rgba(0,0,0,0.08)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + idx * 0.1 }}
            whileHover={{ 
              y: -4,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 12px 28px rgba(0,0,0,0.12)',
              transition: { duration: 0.3 }
            }}
          >
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 0%, ${driver.color}, transparent 70%)`,
              }}
              transition={{ duration: 0.4 }}
            />
            
            <div className="relative z-10">
              <motion.div 
                className="mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <driver.icon className="w-7 h-7" style={{ color: 'rgba(255,255,255,0.85)', strokeWidth: 1.5 }} />
              </motion.div>
              <div className="text-base font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.01em' }}>
                {driver.title}
              </div>
              <div className="text-sm font-light" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: '1.6' }}>
                {driver.subtitle}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* CPI vs PCE — Core Interpretive Insight */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: HORIZON_EASE }}
        className="relative rounded-3xl overflow-hidden mb-16"
        style={{
          padding: '40px 36px',
          background: 'linear-gradient(135deg, rgba(94, 167, 255, 0.10) 0%, rgba(94, 167, 255, 0.05) 100%)',
          backdropFilter: 'blur(36px) saturate(170%)',
          WebkitBackdropFilter: 'blur(36px) saturate(170%)',
          border: '1px solid rgba(94, 167, 255, 0.20)',
          boxShadow: `
            inset 0 2px 0 rgba(94, 167, 255, 0.15),
            0 12px 40px rgba(0,0,0,0.15),
            0 0 60px rgba(94, 167, 255, 0.08)
          `
        }}
      >
        <motion.div 
          style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(94, 167, 255, 0.40), transparent)',
            pointerEvents: 'none',
            filter: 'blur(1px)'
          }}
          animate={{
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.02em' }}>
          Why CPI Is Running Above PCE
        </h3>

        <div className="space-y-4 mb-8 max-w-2xl mx-auto">
          <motion.p 
            className="text-base leading-relaxed font-light" 
            style={{ color: 'rgba(255,255,255,0.75)', lineHeight: '1.8' }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            CPI remains elevated due to its heavy weighting of shelter costs, which lag real-time housing conditions.
          </motion.p>
          <motion.p 
            className="text-base leading-relaxed font-light" 
            style={{ color: 'rgba(255,255,255,0.75)', lineHeight: '1.8' }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            PCE shows softer services inflation and is the Fed's preferred gauge.
          </motion.p>
        </div>

        <motion.div 
          className="flex items-start gap-3 px-6 py-4 rounded-2xl max-w-2xl mx-auto" 
          style={{ 
            background: 'linear-gradient(135deg, rgba(94, 167, 255, 0.15) 0%, rgba(94, 167, 255, 0.08) 100%)', 
            border: '1px solid rgba(94, 167, 255, 0.25)',
            boxShadow: '0 4px 16px rgba(94, 167, 255, 0.12)'
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 6px 20px rgba(94, 167, 255, 0.18)',
            transition: { duration: 0.3 }
          }}
        >
          <ArrowRight className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'rgba(94, 167, 255, 1)' }} />
          <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.98)', lineHeight: '1.6', letterSpacing: '-0.01em' }}>
            The Fed anchors policy decisions on Core PCE, not CPI headlines.
          </p>
        </motion.div>
      </motion.div>

      {/* Metrics Grid — Supporting Evidence */}
      <motion.div 
        className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {[
          { label: "CPI YoY", value: data.cpi_headline_yoy ? `${data.cpi_headline_yoy}%` : null, isCore: false },
          { label: "Core CPI YoY", value: data.cpi_core_yoy ? `${data.cpi_core_yoy}%` : null, isCore: true },
          { label: "PCE YoY", value: data.pce_headline_yoy ? `${data.pce_headline_yoy}%` : null, isCore: false },
          { label: "Core PCE YoY", value: data.pce_core_yoy ? `${data.pce_core_yoy}%` : null, isCore: true }
        ].map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 + idx * 0.05 }}
          >
            <KPIChip {...metric} />
          </motion.div>
        ))}
      </motion.div>

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