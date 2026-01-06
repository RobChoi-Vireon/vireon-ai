import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];

// Micro color system - muted blues
const SEMANTIC_COLORS = {
  policy: 'rgba(100, 160, 240, 0.85)',
  cooling: 'rgba(122, 237, 207, 0.70)',
  sticky: 'rgba(255, 211, 122, 0.70)'
};

const GAPIndicator = ({ gap }) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center relative" 
      style={{ height: '280px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Concentric rings - more prominent */}
      <motion.div 
        className="absolute" 
        style={{
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          border: '1px solid rgba(100,130,180,0.25)',
          boxShadow: '0 0 40px rgba(100,130,180,0.15)'
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div 
        className="absolute" 
        style={{
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          border: '1px solid rgba(100,130,180,0.30)',
          boxShadow: '0 0 30px rgba(100,130,180,0.18)'
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div 
        className="absolute" 
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: '1px solid rgba(100,130,180,0.35)',
          boxShadow: '0 0 20px rgba(100,130,180,0.20)'
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
      
      {/* Center state */}
      <motion.div 
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em' }}>
          GAP
        </div>
        <div className="text-5xl font-bold" style={{ color: 'rgba(255,255,255,0.95)' }}>
          {gap}%
        </div>
      </motion.div>
    </motion.div>
  );
};

const LearningColumn = ({ title, primary, secondary, watch }) => {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>
        {title}
      </h4>
      <div className="space-y-2">
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.95)' }}>
          {primary}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(170,185,205,0.70)' }}>
          {secondary}
        </p>
        {watch && (
          <p className="text-xs mt-3" style={{ color: 'rgba(140,160,185,0.55)' }}>
            {watch}
          </p>
        )}
      </div>
    </div>
  );
};

const TimeHorizon = ({ label, lines, arcProgress }) => {
  const arcLength = 100;
  const dashOffset = arcLength - (arcLength * arcProgress);
  
  return (
    <div className="relative">
      {/* Segmented progress arc */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
        <svg width="60" height="30" viewBox="0 0 60 30" fill="none">
          <path
            d="M 10 25 Q 30 5, 50 25"
            stroke={SEMANTIC_COLORS.policy}
            strokeWidth="1.5"
            strokeDasharray="4 2"
            strokeDashoffset={dashOffset}
            opacity="0.35"
            fill="none"
          />
        </svg>
      </div>
      
      <div className="space-y-2 pt-2">
        <div className="text-xs font-semibold" style={{ color: SEMANTIC_COLORS.policy }}>
          {label}
        </div>
        {lines.map((line, idx) => (
          <p key={idx} className="text-sm leading-relaxed" style={{ 
            color: 'rgba(255,255,255,0.85)'
          }}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};

const DownstreamCard = ({ outcome, mechanism, icon: Icon, tint }) => {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden"
      style={{
        padding: '20px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        cursor: 'default'
      }}
      whileHover={{
        y: -2,
        boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
        transition: { duration: 0.20, ease: 'easeOut' }
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        {Icon && (
          <div style={{ color: tint, opacity: 0.6 }}>
            <Icon className="w-4 h-4" strokeWidth={2} />
          </div>
        )}
        <h4 className="font-semibold text-sm" style={{ color: 'rgba(255,255,255,0.95)' }}>
          {outcome}
        </h4>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(170,185,205,0.75)' }}>
        {mechanism}
      </p>
    </motion.div>
  );
};

export default function InflationSection({ data }) {
  const [activeTab, setActiveTab] = useState('meaning');
  
  if (!data) return null;

  const gap = Math.abs(data.cpi_core_yoy - data.pce_core_yoy).toFixed(1);

  return (
    <div 
      className="relative" 
      style={{
        background: 'linear-gradient(180deg, rgba(16,18,22,1) 0%, rgba(14,16,20,1) 100%)',
        padding: '56px 32px 80px 32px',
        borderRadius: '28px',
        marginBottom: '48px'
      }}
    >
      {/* Subtle vertical gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.008) 0%, transparent 50%)',
        borderRadius: '28px'
      }} />
      
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'rgba(255,255,255,0.95)' }}>
          Inflation — Sticky
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.50)' }}>
          Consumer prices remain elevated while policy inflation cools.
        </p>
      </div>

      {/* GAP Visual Hero */}
      <div className="flex justify-center mb-16">
        <GAPIndicator gap={gap} />
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'CPI YOY', value: `${data.cpi_headline_yoy}%`, sublabel: null },
          { label: 'CORE CPI YOY', value: `${data.cpi_core_yoy}%`, sublabel: 'CORE' },
          { label: 'PCE YOY', value: `${data.pce_headline_yoy}%`, sublabel: null },
          { label: 'CORE PCE YOY', value: `${data.pce_core_yoy}%`, sublabel: 'CORE' }
        ].map((kpi, idx) => (
          <motion.div
            key={idx}
            className="flex flex-col items-center justify-center rounded-xl transition-all"
            style={{
              padding: '24px 18px',
              background: 'rgba(255,255,255,0.015)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              cursor: 'default'
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + (idx * 0.05), ease: [0.22, 1, 0.36, 1] }}
            whileHover={{
              y: -2,
              boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
              transition: { duration: 0.18, ease: 'easeOut' }
            }}
          >
            <div className="text-xs mb-3 text-center font-medium" style={{ color: 'rgba(255,255,255,0.40)', letterSpacing: '0.05em' }}>
              {kpi.label}
            </div>
            <div className="text-3xl font-bold" style={{ color: 'rgba(255,255,255,0.95)' }}>
              {kpi.value}
            </div>
            {kpi.sublabel && (
              <div className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
                {kpi.sublabel}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex justify-center gap-8 mb-10 pb-3 relative">
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(100,130,180,0.15) 50%, transparent 100%)'
        }} />
      </div>
      <div className="flex justify-center gap-8 mb-10">
        {[
          { id: 'meaning', label: 'What This Means' },
          { id: 'evolves', label: 'How This Evolves' },
          { id: 'leads', label: 'What This Leads To' }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="text-sm font-medium relative"
            style={{
              color: activeTab === tab.id ? SEMANTIC_COLORS.policy : 'rgba(255,255,255,0.50)',
              paddingBottom: '12px'
            }}
            whileHover={{
              color: activeTab === tab.id ? SEMANTIC_COLORS.policy : 'rgba(255,255,255,0.70)',
              transition: { duration: 0.18, ease: 'easeOut' }
            }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: '2px',
                  background: SEMANTIC_COLORS.policy
                }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'meaning' && (
          <motion.div
            key="meaning"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <LearningColumn
              title="CPI"
              primary="Everyday costs still feel high."
              secondary="Because rent and services change slowly."
              watch="Watch: rent and services."
            />
            <LearningColumn
              title="PCE"
              primary="People switch what they buy, so prices rise less."
              secondary="Because people switch what they buy when prices rise."
              watch="Watch: spending pullback."
            />
            <LearningColumn
              title="Meaning"
              primary="Rate decisions follow spending, not frustration."
              secondary="Because inflation is tracked by what people keep buying."
              watch="Watch: rate-cut timing."
            />
          </motion.div>
        )}

        {activeTab === 'evolves' && (
          <motion.div
            key="evolves"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <TimeHorizon
              label="Now"
              lines={[
                "Prices stay stubborn in services.",
                "Because rent and wages take time to cool."
              ]}
              arcProgress={0.25}
            />
            <TimeHorizon
              label="Near Term (~3m)"
              lines={[
                "Goods prices cool faster than services.",
                "Because supply improves sooner than wages."
              ]}
              arcProgress={0.45}
            />
            <TimeHorizon
              label="Medium Term (~6m)"
              lines={[
                "Services cool, but not evenly.",
                "Because wage pressure fades gradually."
              ]}
              arcProgress={0.65}
            />
            <TimeHorizon
              label="Confirmation (~12m)"
              lines={[
                "Inflation moves closer to normal.",
                "Because slower demand finally shows up in prices."
              ]}
              arcProgress={0.85}
            />
          </motion.div>
        )}

        {activeTab === 'leads' && (
          <motion.div
            key="leads"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <DownstreamCard
              outcome="Rates — Rates stay high longer"
              mechanism="Because inflation cools slowly."
              icon={TrendingUp}
              tint={SEMANTIC_COLORS.sticky}
            />
            <DownstreamCard
              outcome="Stocks — Stock prices stay less 'expensive'"
              mechanism="Because higher rates reduce what investors will pay."
              icon={TrendingDown}
              tint={SEMANTIC_COLORS.sticky}
            />
            <DownstreamCard
              outcome="Loans — Borrowing stays tight"
              mechanism="Because banks and markets wait for clearer cooling."
              icon={Minus}
              tint="rgba(255,255,255,0.45)"
            />
            <DownstreamCard
              outcome="Dollar — Dollar stays firm"
              mechanism="Because US rates stay high compared to others."
              icon={TrendingUp}
              tint={SEMANTIC_COLORS.policy}
            />
            <DownstreamCard
              outcome="Risk — The path stays uncertain"
              mechanism="Because cooling happens in waves."
              icon={Minus}
              tint="rgba(255,255,255,0.45)"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced transition zone - dissolve into background */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(16,18,22,0.6) 50%, rgba(13,15,19,0.9) 85%, rgba(11,14,19,1) 100%)',
        borderRadius: '0 0 28px 28px'
      }} />
      
      {/* Quiet light diffusion at transition */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-20 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center top, rgba(255,255,255,0.008) 0%, transparent 70%)',
        filter: 'blur(20px)'
      }} />
    </div>
  );
}