import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import InflationGapVisual from './InflationGapVisual';

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
    whileHover={{ scale: 1.018, y: -2, transition: { duration: 0.35, ease: HORIZON_EASE } }}
    className="relative flex flex-col items-center justify-center rounded-2xl overflow-hidden"
    style={{
      padding: '24px 28px',
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.052) 0%, rgba(255, 255, 255, 0.032) 100%)',
      backdropFilter: 'blur(48px) saturate(175%)',
      WebkitBackdropFilter: 'blur(48px) saturate(175%)',
      border: '1px solid rgba(255,255,255,0.10)',
      boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.10), 0 6px 24px rgba(0,0,0,0.12)',
      minWidth: '150px'
    }}
  >
    <div style={{
      position: 'absolute',
      top: 0,
      left: '15%',
      right: '15%',
      height: '1.5px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
      pointerEvents: 'none'
    }} />
    
    <div className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.65)', letterSpacing: '0.03em' }}>
      {label}
    </div>
    <div className="text-3xl font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.98)' }}>
      {value ?? '—'}
    </div>
    {isCore && (
      <div className="text-[10px] font-bold mt-1" style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em' }}>
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
      whileHover={{ scale: 1.025, y: -2, transition: { duration: 0.3, ease: HORIZON_EASE } }}
      className="relative flex items-center gap-2.5 rounded-xl overflow-hidden"
      style={{
        padding: '12px 18px',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.052) 0%, rgba(255, 255, 255, 0.032) 100%)',
        backdropFilter: 'blur(36px) saturate(170%)',
        WebkitBackdropFilter: 'blur(36px) saturate(170%)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 3px 12px rgba(0,0,0,0.08)'
      }}
    >
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color, strokeWidth: 2.5 }} />
      <div className="flex flex-col">
        <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.92)' }}>{label}</span>
        {note && <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{note}</span>}
      </div>
    </motion.div>
  );
};

const HorizonCard = ({ title, bullets, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: HORIZON_EASE, delay }}
    whileHover={{ y: -3, transition: { duration: 0.35, ease: HORIZON_EASE } }}
    className="relative rounded-2xl overflow-hidden"
    style={{
      padding: '28px',
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.052) 0%, rgba(255, 255, 255, 0.032) 100%)',
      backdropFilter: 'blur(48px) saturate(175%)',
      WebkitBackdropFilter: 'blur(48px) saturate(175%)',
      border: '1px solid rgba(255,255,255,0.10)',
      boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.10), 0 8px 32px rgba(0,0,0,0.12)'
    }}
  >
    <div style={{
      position: 'absolute',
      top: 0,
      left: '15%',
      right: '15%',
      height: '1.5px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
      pointerEvents: 'none'
    }} />
    
    <h4 className="text-base font-bold mb-4" style={{ color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.01em' }}>
      {title}
    </h4>
    <div className="space-y-2.5">
      {bullets.map((bullet, idx) => (
        <p key={idx} className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {bullet}
        </p>
      ))}
    </div>
  </motion.div>
);

const ImpactCard = ({ label, description }) => (
  <motion.div
    whileHover={{ scale: 1.015, y: -2, transition: { duration: 0.35, ease: HORIZON_EASE } }}
    className="relative rounded-xl overflow-hidden"
    style={{
      padding: '20px 24px',
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.048) 0%, rgba(255, 255, 255, 0.028) 100%)',
      backdropFilter: 'blur(40px) saturate(170%)',
      WebkitBackdropFilter: 'blur(40px) saturate(170%)',
      border: '1px solid rgba(255,255,255,0.09)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.09), 0 4px 16px rgba(0,0,0,0.10)'
    }}
  >
    <div style={{
      position: 'absolute',
      top: 0,
      left: '12%',
      right: '12%',
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
      pointerEvents: 'none'
    }} />
    
    <h4 className="text-sm font-bold mb-2" style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '0.01em' }}>
      {label}
    </h4>
    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.70)' }}>
      {description}
    </p>
  </motion.div>
);

export default function InflationSection({ data }) {
  if (!data) return null;

  const stateColors = StatePillColors[data.state_tag] || StatePillColors.Mixed;
  const policyColors = PolicyBiasColors[data.policy_bias] || PolicyBiasColors.Neutral;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pl-2">
        <h2 className="text-2xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.95)' }}>
          Inflation
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.60)' }}>
          CPI • PCE
        </p>
      </div>

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

      {data.last_updated && (
        <div className="text-xs pl-2" style={{ color: 'rgba(255,255,255,0.40)' }}>
          Last updated: {data.last_updated}
        </div>
      )}

      {/* Visual: CPI-PCE Gap */}
      <InflationGapVisual 
        cpi={data.cpi_core_yoy} 
        pce={data.pce_core_yoy}
        insight="Core CPI running 1.0pp above Core PCE—housing costs create the wedge"
      />

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

            <h3 className="text-lg font-bold mb-4" style={{ color: 'rgba(255,255,255,0.96)' }}>
              Compare
            </h3>

            <div className="space-y-3">
              <p className="text-[17px] font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em' }}>
                {data.comparison_headline || "CPI and PCE tracking closely"}
              </p>
              <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.68)', lineHeight: '1.6' }}>
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

            <h3 className="text-lg font-bold mb-5" style={{ color: 'rgba(255,255,255,0.96)' }}>
              Meaning
            </h3>

            <div className="space-y-4">
              {(data.interpretation_bullets || []).map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <ChevronRight className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: 'rgba(255,255,255,0.45)' }} />
                  <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.80)', lineHeight: '1.65' }}>
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

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold" style={{ color: 'rgba(255,255,255,0.96)' }}>
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

      {/* What This Measures */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: HORIZON_EASE, delay: 0.3 }}
        className="relative rounded-2xl overflow-hidden"
        style={{
          padding: '32px',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.052) 0%, rgba(255, 255, 255, 0.032) 100%)',
          backdropFilter: 'blur(48px) saturate(175%)',
          WebkitBackdropFilter: 'blur(48px) saturate(175%)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.10), 0 8px 32px rgba(0,0,0,0.12)'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
          pointerEvents: 'none'
        }} />

        <h3 className="text-xl font-bold mb-6" style={{ color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.02em' }}>
          What This Measures
        </h3>

        <div className="space-y-5">
          <div>
            <h4 className="text-base font-bold mb-2" style={{ color: 'rgba(255,255,255,0.90)' }}>
              CPI (Consumer Price Index)
            </h4>
            <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)', lineHeight: '1.65' }}>
              Tracks the price of a fixed basket of goods and services households buy. Emphasizes shelter costs heavily, which tend to lag real-time market changes.
            </p>
          </div>

          <div>
            <h4 className="text-base font-bold mb-2" style={{ color: 'rgba(255,255,255,0.90)' }}>
              PCE (Personal Consumption Expenditures)
            </h4>
            <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)', lineHeight: '1.65' }}>
              Measures actual spending patterns that shift as prices change. The Fed's preferred gauge because it adapts to how people substitute goods when prices rise.
            </p>
          </div>

          <div>
            <h4 className="text-base font-bold mb-2" style={{ color: 'rgba(255,255,255,0.90)' }}>
              Why Divergence Matters
            </h4>
            <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)', lineHeight: '1.65' }}>
              When CPI runs above PCE, it often signals housing cost pressure. When PCE runs hotter, broader consumption inflation is accelerating. The gap shapes policy decisions and market expectations.
            </p>
          </div>
        </div>
      </motion.div>

      {/* What Happens Next */}
      <div className="space-y-3">
        <div className="pl-2 mb-4">
          <h3 className="text-xl font-bold" style={{ color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.02em' }}>
            What Happens Next
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <HorizonCard 
            title="Now (0–3 months)"
            delay={0.35}
            bullets={[
              "Fed maintains current stance, watching labor market closely for signs of weakening.",
              "Markets price in potential rate cuts if inflation continues to moderate.",
              "Corporate earnings calls emphasize cost pressures and pricing power."
            ]}
          />
          <HorizonCard 
            title="Quarterly (3–12 months)"
            delay={0.4}
            bullets={[
              "Housing costs begin to cool as lagged shelter components catch up to market reality.",
              "Services inflation becomes the primary determinant of policy direction.",
              "Currency markets adjust to shifting rate differential expectations."
            ]}
          />
          <HorizonCard 
            title="Longer Term (12–36 months)"
            delay={0.45}
            bullets={[
              "Structural factors like deglobalization and labor market tightness anchor inflation above pre-pandemic levels.",
              "Central banks recalibrate long-term neutral rate assumptions.",
              "Asset allocation shifts toward inflation-protected securities gain momentum."
            ]}
          />
        </div>
      </div>

      {/* Who This Affects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: HORIZON_EASE, delay: 0.5 }}
        className="relative rounded-2xl overflow-hidden"
        style={{
          padding: '32px',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.052) 0%, rgba(255, 255, 255, 0.032) 100%)',
          backdropFilter: 'blur(48px) saturate(175%)',
          WebkitBackdropFilter: 'blur(48px) saturate(175%)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.10), 0 8px 32px rgba(0,0,0,0.12)'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
          pointerEvents: 'none'
        }} />

        <h3 className="text-xl font-bold mb-6" style={{ color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.02em' }}>
          Who This Affects
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ImpactCard 
            label="Consumers"
            description="Purchasing power erodes when wage growth lags inflation. Essentials like food and shelter consume a larger share of household budgets."
          />
          <ImpactCard 
            label="Workers"
            description="Real wage growth determines living standards. Tight labor markets give workers leverage to demand raises that match or exceed inflation."
          />
          <ImpactCard 
            label="Businesses"
            description="Margin compression when input costs rise faster than pricing power allows. Small businesses face disproportionate pressure from higher borrowing costs."
          />
          <ImpactCard 
            label="Government"
            description="Social Security and federal benefits adjust to CPI, creating fiscal pressures. Higher interest payments on national debt compound budget challenges."
          />
          <ImpactCard 
            label="Investors"
            description="Fixed-income returns lose real value. Equities face multiple compression as discount rates rise. Inflation-linked assets and commodities become portfolio anchors."
          />
        </div>
      </motion.div>
    </div>
  );
}