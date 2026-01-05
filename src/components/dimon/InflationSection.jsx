import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];

// Micro color system - extremely low saturation
const SEMANTIC_COLORS = {
  policy: 'rgba(110, 180, 255, 0.75)',
  cooling: 'rgba(122, 237, 207, 0.70)',
  sticky: 'rgba(255, 211, 122, 0.70)'
};

const GAPIndicator = ({ gap }) => {
  return (
    <div className="flex flex-col items-center justify-center relative" style={{ height: '280px', width: '280px' }}>
      {/* Horizon bloom - larger and softer */}
      <div className="absolute" style={{
        width: '320px',
        height: '320px',
        background: 'radial-gradient(ellipse at center, rgba(110, 180, 255, 0.12) 0%, rgba(110, 180, 255, 0.04) 50%, transparent 75%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />
      
      {/* Concentric rings - larger, softer */}
      <motion.div 
        className="absolute" 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: HORIZON_EASE }}
        style={{
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.05)',
          filter: 'blur(1px)'
        }} 
      />
      <motion.div 
        className="absolute"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: HORIZON_EASE }}
        style={{
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.07)',
          filter: 'blur(1px)'
        }} 
      />
      <motion.div 
        className="absolute"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: HORIZON_EASE }}
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.09)',
          filter: 'blur(0.5px)'
        }} 
      />
      
      {/* Center state - prominent */}
      <motion.div 
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: HORIZON_EASE }}
      >
        <div className="text-5xl font-bold mb-3" style={{ 
          color: 'rgba(255,255,255,0.98)',
          letterSpacing: '-0.02em',
          textShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          {gap}bp
        </div>
        <div className="text-xs font-medium" style={{ 
          color: 'rgba(255,255,255,0.48)', 
          letterSpacing: '0.08em',
          textTransform: 'uppercase'
        }}>
          CPI - PCE GAP
        </div>
      </motion.div>
    </div>
  );
};

const LearningColumn = ({ title, primary, secondary }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-base font-semibold" style={{ 
        color: 'rgba(255,255,255,0.88)',
        letterSpacing: '-0.01em'
      }}>
        {title}
      </h4>
      <div className="space-y-3">
        <p className="text-base leading-relaxed" style={{ 
          color: 'rgba(255,255,255,0.96)',
          lineHeight: '1.6'
        }}>
          {primary}
        </p>
        <p className="text-sm leading-relaxed" style={{ 
          color: 'rgba(170,185,205,0.68)',
          lineHeight: '1.7'
        }}>
          {secondary}
        </p>
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
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2, ease: HORIZON_EASE }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        padding: '24px',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.032) 0%, rgba(255, 255, 255, 0.020) 100%)',
        backdropFilter: 'blur(32px) saturate(165%)',
        WebkitBackdropFilter: 'blur(32px) saturate(165%)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.06)'
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div style={{ color: tint, opacity: 0.5 }}>
            <Icon className="w-4 h-4" strokeWidth={1.8} />
          </div>
        )}
        <h4 className="font-semibold text-base" style={{ 
          color: 'rgba(255,255,255,0.96)',
          letterSpacing: '-0.01em'
        }}>
          {outcome}
        </h4>
      </div>
      <p className="text-sm leading-relaxed" style={{ 
        color: 'rgba(170,185,205,0.72)',
        lineHeight: '1.7'
      }}>
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
        background: 'linear-gradient(180deg, rgba(28,31,36,1) 0%, rgba(24,27,32,1) 50%, rgba(20,23,28,1) 100%)',
        padding: '0',
        borderRadius: '0',
        marginBottom: '0'
      }}
    >
      {/* Subtle vertical daylight gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.018) 0%, transparent 40%, rgba(0,0,0,0.12) 100%)'
      }} />
      
      {/* Hero Section - Large and Calm */}
      <div className="relative" style={{ padding: '80px 32px 60px 32px' }}>
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold mb-3" style={{ 
            color: 'rgba(255,255,255,0.98)',
            letterSpacing: '-0.02em'
          }}>
            Inflation
          </h2>
          <p className="text-sm" style={{ 
            color: 'rgba(255,255,255,0.52)',
            letterSpacing: '0.05em'
          }}>
            CPI • PCE
          </p>
        </div>

        {/* GAP Visual Hero - Prominent */}
        <div className="flex justify-center mb-24">
          <GAPIndicator gap={gap} />
        </div>
      </div>

      {/* Information Section */}
      <div style={{ padding: '0 32px 80px 32px' }}>
        {/* KPI Strip - Floating Glass */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {[
            { label: 'CPI YoY', value: `${data.cpi_headline_yoy}%` },
            { label: 'Core CPI', value: `${data.cpi_core_yoy}%` },
            { label: 'PCE YoY', value: `${data.pce_headline_yoy}%` },
            { label: 'Core PCE', value: `${data.pce_core_yoy}%` }
          ].map((kpi, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.05, ease: HORIZON_EASE }}
              className="flex flex-col items-center justify-center rounded-2xl"
              style={{
                padding: '24px 20px',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.022) 100%)',
                backdropFilter: 'blur(24px) saturate(165%)',
                WebkitBackdropFilter: 'blur(24px) saturate(165%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.08)'
              }}
            >
              <div className="text-xs font-medium mb-2" style={{ 
                color: 'rgba(255,255,255,0.52)',
                letterSpacing: '0.03em'
              }}>
                {kpi.label}
              </div>
              <div className="text-3xl font-bold" style={{ color: 'rgba(255,255,255,0.98)' }}>
                {kpi.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section Navigation Tabs - Soft */}
        <div className="flex justify-center gap-10 mb-12 pb-5" style={{
          borderBottom: '1px solid rgba(255,255,255,0.04)'
        }}>
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
                color: activeTab === tab.id ? SEMANTIC_COLORS.policy : 'rgba(255,255,255,0.48)',
                paddingBottom: '16px',
                transition: 'color 0.3s ease'
              }}
              whileHover={{ color: 'rgba(110, 180, 255, 0.85)' }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: '2px',
                    background: SEMANTIC_COLORS.policy,
                    borderRadius: '2px'
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Tab Content - Spacious */}
        <AnimatePresence mode="wait">
          {activeTab === 'meaning' && (
            <motion.div
              key="meaning"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: HORIZON_EASE }}
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
            >
              <LearningColumn
                title="CPI"
                primary="Higher rent and essentials"
                secondary="Because housing and services reset slowly."
              />
              <LearningColumn
                title="PCE"
                primary="Adaptive spending"
                secondary="Because consumers substitute rather than stop spending."
              />
              <LearningColumn
                title="Meaning"
                primary="Policy responds to demand, not pain"
                secondary="Because inflation is measured by behavior."
              />
            </motion.div>
          )}

          {activeTab === 'evolves' && (
            <motion.div
              key="evolves"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: HORIZON_EASE }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              <TimeHorizon
                label="Now"
                lines={[
                  "Core inflation elevated",
                  "Services prices sticky"
                ]}
                arcProgress={0.25}
              />
              <TimeHorizon
                label="Near Term (~3m)"
                lines={[
                  "Housing costs normalize slowly",
                  "Fed holds restrictive stance"
                ]}
                arcProgress={0.45}
              />
              <TimeHorizon
                label="Medium Term (~6m)"
                lines={[
                  "Services inflation cools unevenly",
                  "Wage pressure eases gradually"
                ]}
                arcProgress={0.65}
              />
              <TimeHorizon
                label="Confirmation (~12m)"
                lines={[
                  "Sustained return toward 2%",
                  "Policy easing begins"
                ]}
                arcProgress={0.85}
              />
            </motion.div>
          )}

          {activeTab === 'leads' && (
            <motion.div
              key="leads"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: HORIZON_EASE }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <DownstreamCard
                outcome="Rates — Higher for longer"
                mechanism="Because services inflation constrains easing."
                icon={TrendingUp}
                tint={SEMANTIC_COLORS.sticky}
              />
              <DownstreamCard
                outcome="Equities — Multiple compression"
                mechanism="Because elevated discount rates persist."
                icon={TrendingDown}
                tint={SEMANTIC_COLORS.sticky}
              />
              <DownstreamCard
                outcome="Credit — Spreads stable"
                mechanism="Because growth holds while policy waits."
                icon={Minus}
                tint="rgba(255,255,255,0.45)"
              />
              <DownstreamCard
                outcome="USD — Rate differential support"
                mechanism="Because US rates stay elevated vs peers."
                icon={TrendingUp}
                tint={SEMANTIC_COLORS.policy}
              />
              <DownstreamCard
                outcome="Risk — Policy uncertainty"
                mechanism="Because inflation path remains unclear."
                icon={Minus}
                tint="rgba(255,255,255,0.45)"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quiet Transition Zone into Equilibrium */}
      <div style={{
        height: '120px',
        background: 'linear-gradient(180deg, transparent 0%, rgba(22,25,30,0.4) 30%, rgba(18,21,26,0.7) 100%)',
        position: 'relative'
      }}>
        {/* Soft light diffusion */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(110,180,255,0.04) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }} />
      </div>
    </div>
  );
}