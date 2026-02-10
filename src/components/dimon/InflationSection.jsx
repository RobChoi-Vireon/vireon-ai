import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
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

const MetricItem = ({ label, value }) => (
  <div className="flex items-baseline justify-between py-2">
    <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.60)' }}>{label}</span>
    <span className="text-2xl font-semibold tracking-tight" style={{ color: 'rgba(255,255,255,0.95)' }}>{value ?? '—'}</span>
  </div>
);

const DriverItem = ({ title, detail }) => (
  <div className="py-3">
    <div className="text-sm font-semibold mb-0.5" style={{ color: 'rgba(255,255,255,0.90)' }}>{title}</div>
    <div className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{detail}</div>
  </div>
);

export default function InflationSection({ data }) {
  if (!data) return null;

  const stateColors = StatePillColors[data.state_tag] || StatePillColors.Mixed;
  const policyColors = PolicyBiasColors[data.policy_bias] || PolicyBiasColors.Neutral;

  return (
    <div className="space-y-12">
      {/* SECTION 1: Hero Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: HORIZON_EASE }}
        className="text-center max-w-2xl mx-auto space-y-6"
      >
        <h2 className="text-4xl md:text-5xl font-light leading-tight tracking-tight" style={{ color: 'rgba(255,255,255,0.96)' }}>
          Inflation isn't falling anymore. It's getting stuck.
        </h2>
        
        <p className="text-lg font-normal leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Prices for goods have cooled. Housing and services haven't.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <div 
            className="text-xs font-semibold px-4 py-2 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.70)'
            }}
          >
            Sticky • Above Target
          </div>
        </div>

        <p className="text-sm pt-1" style={{ color: 'rgba(255,255,255,0.40)' }}>
          Progress has slowed.
        </p>
      </motion.div>

      {/* SECTION 2: Evidence Cluster */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: HORIZON_EASE, delay: 0.1 }}
        className="max-w-3xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Group 1: What people feel */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em' }}>
              What people feel
            </h3>
            <MetricItem label="CPI YoY" value={data.cpi_headline_yoy ? `${data.cpi_headline_yoy}%` : null} />
            <MetricItem label="Core CPI YoY" value={data.cpi_core_yoy ? `${data.cpi_core_yoy}%` : null} />
          </div>

          {/* Group 2: What the Fed watches */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em' }}>
              What the Fed watches
            </h3>
            <MetricItem label="PCE YoY" value={data.pce_headline_yoy ? `${data.pce_headline_yoy}%` : null} />
            <MetricItem label="Core PCE YoY" value={data.pce_core_yoy ? `${data.pce_core_yoy}%` : null} />
          </div>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.40)' }}>
          These don't move at the same speed.
        </p>
      </motion.div>

      {/* SECTION 3: Drivers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: HORIZON_EASE, delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: 'rgba(255,255,255,0.90)' }}>
          What's keeping inflation stuck
        </h3>

        <div className="divide-y divide-white/5">
          <DriverItem title="Housing" detail="Rents adjust slowly." />
          <DriverItem title="Services & wages" detail="Labor costs remain firm." />
          <DriverItem title="Goods" detail="No longer pushing prices higher." />
        </div>
      </motion.div>

      {/* SECTION 4: Fed Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: HORIZON_EASE, delay: 0.3 }}
        className="max-w-2xl mx-auto"
      >
        <div 
          className="relative rounded-2xl overflow-hidden"
          style={{
            padding: '28px 32px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.02) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
          }}
        >
          <p className="text-lg font-medium leading-relaxed text-center mb-4" style={{ color: 'rgba(255,255,255,0.90)' }}>
            The Fed doesn't react to headlines. It reacts to services inflation.
          </p>

          <button
            onClick={() => setIsFedInsightExpanded(!isFedInsightExpanded)}
            className="flex items-center justify-center gap-2 mx-auto text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: 'rgba(255,255,255,0.50)' }}
          >
            <span>{isFedInsightExpanded ? 'Show less' : 'Learn more'}</span>
            <ChevronDown 
              className="w-4 h-4 transition-transform duration-200" 
              style={{ transform: isFedInsightExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>

          <AnimatePresence>
            {isFedInsightExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: HORIZON_EASE }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-white/5">
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.60)' }}>
                    CPI lags real-time conditions. Core PCE tracks services inflation more closely and drives policy decisions.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* SECTION 5: Market Implication */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: HORIZON_EASE, delay: 0.4 }}
        className="max-w-2xl mx-auto"
      >
        <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: 'rgba(255,255,255,0.90)' }}>
          What this means right now
        </h3>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.30)' }} />
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Rates stay restrictive
            </p>
          </div>
          <div className="flex items-start gap-3">
            <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.30)' }} />
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Risk assets remain sensitive
            </p>
          </div>
          <div className="flex items-start gap-3">
            <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.30)' }} />
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
              U.S. dollar stays supported
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <div 
            className="text-xs font-medium px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.55)'
            }}
          >
            Policy pressure remains
          </div>
        </div>
      </motion.div>

      {/* SECTION 6: Conditional Humility */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: HORIZON_EASE, delay: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div 
          className="relative overflow-hidden"
          style={{
            padding: '20px 24px',
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '16px'
          }}
        >
          <button
            onClick={() => setIsConditionalExpanded(!isConditionalExpanded)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.65)' }}>
              What would change this view
            </h3>
            <ChevronDown 
              className="w-4 h-4 flex-shrink-0 transition-transform duration-200" 
              style={{ 
                color: 'rgba(255,255,255,0.40)',
                transform: isConditionalExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
              }}
            />
          </button>

          <AnimatePresence>
            {isConditionalExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: HORIZON_EASE }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }} />
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.60)' }}>
                      Sustained decline in core PCE services
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }} />
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.60)' }}>
                      Cooling wage growth
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }} />
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.60)' }}>
                      Shelter CPI rolling over decisively
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}