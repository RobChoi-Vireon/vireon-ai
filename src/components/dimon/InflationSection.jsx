import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronDown, BarChart2 } from 'lucide-react';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];
const SMOOTH_EXPAND = { duration: 0.35, ease: [0.22, 0.61, 0.36, 1] };
const CHEVRON_ROTATE = { duration: 0.35, ease: [0.22, 0.61, 0.36, 1] };

// Shared glass surface style
const GLASS_CARD = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.052) 0%, rgba(255,255,255,0.030) 100%)',
  backdropFilter: 'blur(42px) saturate(170%)',
  WebkitBackdropFilter: 'blur(42px) saturate(170%)',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.09), 0 6px 28px rgba(0,0,0,0.12)',
  overflow: 'hidden',
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden',
  WebkitFontSmoothing: 'antialiased',
};

const DRAWER_GLASS = {
  ...GLASS_CARD,
  borderRadius: '20px',
};

// Top specular highlight shared element
const SpecularLine = () => (
  <div style={{
    position: 'absolute', top: 0, left: '12%', right: '12%', height: '1.5px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
    pointerEvents: 'none', zIndex: 1
  }} />
);

const getArrowIcon = (direction) => {
  switch (direction) {
    case 'up': return TrendingUp;
    case 'down': return TrendingDown;
    default: return Minus;
  }
};

// Enhanced State Status Row with subtle bar
const StateStatusRow = ({ arrow, label, status, sparkline }) => {
  const Icon = getArrowIcon(arrow);
  const color = arrow === 'up'
    ? 'rgba(255, 106, 122, 0.90)'
    : arrow === 'down'
      ? 'rgba(88, 227, 164, 0.90)'
      : 'rgba(168, 179, 199, 0.90)';
  const barColor = arrow === 'up'
    ? 'rgba(255, 106, 122, 0.18)'
    : arrow === 'down'
      ? 'rgba(88, 227, 164, 0.14)'
      : 'rgba(168, 179, 199, 0.10)';

  return (
    <div
      className="flex items-center justify-between py-3 relative"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      {/* Subtle background bar */}
      <div style={{
        position: 'absolute', inset: 0,
        background: barColor,
        borderRadius: '8px',
        opacity: 0.6,
        pointerEvents: 'none'
      }} />
      <div className="flex items-center gap-3 relative z-10 px-2">
        <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} strokeWidth={2.5} />
        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.62)' }}>{label}</span>
      </div>
      <span className="text-sm font-semibold relative z-10 px-2" style={{ color: 'rgba(255,255,255,0.92)' }}>
        {status}
      </span>
    </div>
  );
};

// Driver row with visual percentage bar
const DriverRow = ({ driver, idx, total }) => (
  <div
    className="py-3"
    style={{ borderBottom: idx < total - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
  >
    <div className="flex items-center justify-between gap-3 mb-2">
      <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em' }}>
        {driver.name}
      </span>
      <span
        className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
        style={{
          background: 'rgba(94, 167, 255, 0.14)',
          color: 'rgba(140, 195, 255, 0.92)',
          border: '1px solid rgba(94, 167, 255, 0.22)'
        }}
      >
        {driver.weight}%
      </span>
    </div>
    {/* Visual bar derived from existing weight value */}
    <div style={{
      height: '3px', borderRadius: '2px',
      background: 'rgba(255,255,255,0.06)',
      marginBottom: '8px', overflow: 'hidden'
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(driver.weight, 100)}%` }}
        transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
        style={{
          height: '100%', borderRadius: '2px',
          background: 'linear-gradient(90deg, rgba(94, 167, 255, 0.60), rgba(140, 195, 255, 0.40))'
        }}
      />
    </div>
    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.62)' }}>
      {driver.reason}
    </p>
  </div>
);

// Accordion wrapper with hover glow
const AccordionPanel = ({ isOpen, onToggle, title, children }) => (
  <div
    className="relative"
    style={{
      ...DRAWER_GLASS,
      transition: 'box-shadow 0.2s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = 'inset 0 1.5px 0 rgba(255,255,255,0.10), 0 8px 32px rgba(0,0,0,0.16), 0 0 0 1px rgba(255,255,255,0.07)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = DRAWER_GLASS.boxShadow;
    }}
  >
    <SpecularLine />
    <button
      onClick={onToggle}
      className="w-full px-5 py-4 text-left flex items-center justify-between relative z-10"
      style={{
        background: isOpen ? 'rgba(255,255,255,0.025)' : 'transparent',
        transition: 'background 0.2s ease-out',
        borderBottom: isOpen ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em' }}>
        {title}
      </span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={CHEVRON_ROTATE}
        style={{ transformOrigin: 'center', backfaceVisibility: 'hidden' }}
      >
        <ChevronDown className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.45)' }} />
      </motion.div>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={SMOOTH_EXPAND}
          style={{ overflow: 'hidden', transformOrigin: 'top', backfaceVisibility: 'hidden', perspective: 1000 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.25 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);


export default function InflationSection({ data }) {
  const [drawer1Open, setDrawer1Open] = useState(false);
  const [drawer2Open, setDrawer2Open] = useState(false);
  const [drawer3Open, setDrawer3Open] = useState(false);
  const [showCPIPCE, setShowCPIPCE] = useState(false);

  if (!data) return null;

  const inflationData = {
    timestamp_display: data.timestamp_display || '',
    delta_summary: data.delta_summary || '',
    confidence: data.confidence || 0,
    confidence_reason: data.confidence_reason || '',
    headline_state: data.headline_state || { arrow: 'flat', label: 'Headline inflation', status: '' },
    core_state: data.core_state || { arrow: 'flat', label: 'Core inflation', status: '' },
    services_state: data.services_state || { arrow: 'flat', label: 'Services inflation', status: '' },
    fed_implication: data.fed_implication || '',
    drivers: data.drivers || [],
    winners: data.winners || [],
    losers: data.losers || [],
    cpi_pce_collapsed: data.cpi_pce_collapsed || '',
    cpi_plain: data.cpi_plain || '',
    pce_plain: data.pce_plain || '',
    why_fed_prefers: data.why_fed_prefers || '',
    watch_short: data.watch_short || [],
    watch_long: data.watch_long || [],
    sources: data.sources || []
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: HORIZON_EASE }}
      className="space-y-3"
      style={{ overflow: 'visible' }}
    >
      {/* PRIMARY STATUS CARD */}
      <div className="relative rounded-3xl" style={GLASS_CARD}>
        <SpecularLine />

        {/* Ambient top glow */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '60%',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(94, 160, 255, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none', borderRadius: '24px 24px 0 0'
        }} />

        {/* HEADER */}
        <div className="flex items-start justify-between px-6 pt-6 pb-3 relative z-10">
          <div className="flex-1">
            <h3
              className="text-2xl font-bold mb-1.5"
              style={{ color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.025em' }}
            >
              Inflation
            </h3>
            <p className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.42)', letterSpacing: '0.01em' }}>
              Last updated {inflationData.timestamp_display}
            </p>
          </div>
        </div>

        {/* Glow divider line beneath header */}
        <div style={{
          height: '1px', marginBottom: '0',
          background: 'linear-gradient(90deg, transparent 0%, rgba(94, 160, 255, 0.22) 40%, rgba(180, 140, 255, 0.18) 70%, transparent 100%)',
        }} />

        {/* DELTA ANCHOR — highlighted ribbon */}
        <div
          className="px-6 py-3.5 relative z-10"
          style={{
            background: 'linear-gradient(90deg, rgba(94, 167, 255, 0.10) 0%, rgba(94, 167, 255, 0.04) 100%)',
            borderBottom: '1px solid rgba(94, 167, 255, 0.10)',
          }}
        >
          <div className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(94, 167, 255, 0.70)', letterSpacing: '0.06em' }}>
            Δ Since last update
          </div>
          <p className="text-sm font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.90)' }}>
            {inflationData.delta_summary}
          </p>
        </div>

        <div className="px-6 py-5 space-y-5 relative z-10">
          {/* CURRENT STATE */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.07em' }}>
              Current state
            </div>
            <div className="space-y-1">
              <StateStatusRow {...inflationData.headline_state} />
              <StateStatusRow {...inflationData.core_state} />
              <StateStatusRow {...inflationData.services_state} />
            </div>
          </div>

          {/* WHY IT MATTERS */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.07em' }}>
              Why it matters
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.80)' }}>
              {inflationData.fed_implication}
            </p>
          </div>
        </div>
      </div>

      {/* DRAWER 1 — WHY INFLATION LOOKS THIS WAY */}
      <AccordionPanel
        isOpen={drawer1Open}
        onToggle={() => setDrawer1Open(!drawer1Open)}
        title="Why inflation looks this way"
      >
        <div className="px-5 pb-5 pt-1">
          {inflationData.drivers.slice(0, 3).map((driver, idx) => (
            <DriverRow
              key={idx}
              driver={driver}
              idx={idx}
              total={Math.min(inflationData.drivers.length, 3)}
            />
          ))}
        </div>
      </AccordionPanel>

      {/* DRAWER 2 — WHO FEELS THIS MOST */}
      <AccordionPanel
        isOpen={drawer2Open}
        onToggle={() => setDrawer2Open(!drawer2Open)}
        title="Who feels this most"
      >
        <div className="px-5 pb-5 pt-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Winners panel */}
            <div
              className="p-4 rounded-[16px]"
              style={{
                background: 'linear-gradient(180deg, rgba(88, 227, 164, 0.08) 0%, rgba(88, 227, 164, 0.04) 100%)',
                border: '1px solid rgba(88, 227, 164, 0.14)',
              }}
            >
              <div className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(88, 227, 164, 0.80)', letterSpacing: '0.06em' }}>
                Winners
              </div>
              <ul className="space-y-1.5">
                {inflationData.winners.slice(0, 4).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.72)' }}>
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(88, 227, 164, 0.70)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Losers panel */}
            <div
              className="p-4 rounded-[16px]"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 106, 122, 0.08) 0%, rgba(255, 106, 122, 0.04) 100%)',
                border: '1px solid rgba(255, 106, 122, 0.14)',
              }}
            >
              <div className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255, 106, 122, 0.80)', letterSpacing: '0.06em' }}>
                Losers
              </div>
              <ul className="space-y-1.5">
                {inflationData.losers.slice(0, 4).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.72)' }}>
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(255, 106, 122, 0.70)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </AccordionPanel>

      {/* DRAWER 3 — HOW TO READ THE DATA */}
      <AccordionPanel
        isOpen={drawer3Open}
        onToggle={() => setDrawer3Open(!drawer3Open)}
        title="How to read the data"
      >
        <div className="px-5 pb-5 pt-3 space-y-4">
          {/* CPI vs PCE — glass card */}
          <div
            className="rounded-[16px] overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <button
              onClick={() => setShowCPIPCE(!showCPIPCE)}
              className="w-full flex items-center justify-between py-3.5 px-4"
              style={{
                background: showCPIPCE ? 'rgba(255,255,255,0.025)' : 'transparent',
                transition: 'background 0.2s ease-out',
                borderBottom: showCPIPCE ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
              }}
            >
              <div className="flex items-center gap-2.5 text-left">
                <BarChart2 className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(140, 190, 255, 0.70)' }} strokeWidth={1.8} />
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em' }}>CPI vs PCE</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.52)' }}>{inflationData.cpi_pce_collapsed}</div>
                </div>
              </div>
              <motion.div
                animate={{ rotate: showCPIPCE ? 180 : 0 }}
                transition={CHEVRON_ROTATE}
                style={{ transformOrigin: 'center', backfaceVisibility: 'hidden' }}
              >
                <ChevronDown className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.35)' }} />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {showCPIPCE && (
                <motion.div
                  key="cpipce-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={SMOOTH_EXPAND}
                  style={{ overflow: 'hidden', transformOrigin: 'top', backfaceVisibility: 'hidden', perspective: 1000 }}
                >
                  <motion.div
                    className="px-4 pb-4 pt-3 space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.08, duration: 0.2 }}
                  >
                    {/* Glow divider */}
                    <div style={{ height: '1px', marginBottom: '12px', background: 'linear-gradient(90deg, transparent, rgba(140, 190, 255, 0.20), transparent)' }} />
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>• {inflationData.cpi_plain}</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>• {inflationData.pce_plain}</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>• {inflationData.why_fed_prefers}</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* What to Watch */}
          <div className="pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-[11px] font-semibold uppercase tracking-widest mb-3 pt-3" style={{ color: 'rgba(255,255,255,0.38)', letterSpacing: '0.07em' }}>
              What to watch
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.68)' }}>Next 30–60 days</div>
                <ul className="space-y-1.5">
                  {inflationData.watch_short.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.30)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.68)' }}>Next 6–12 months</div>
                <ul className="space-y-1.5">
                  {inflationData.watch_long.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.30)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </AccordionPanel>

      {/* TOP WEIGHTED SOURCES */}
      <div
        className="relative rounded-[20px]"
        style={{
          ...GLASS_CARD,
          padding: '18px 20px 16px 20px',
          overflow: 'visible',
        }}
      >
        <SpecularLine />
        <div className="flex items-center gap-3 overflow-x-auto pb-1 relative z-10">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.90)', letterSpacing: '-0.01em' }}>
              Top Weighted Sources
            </span>
            <div
              className="rounded-full px-2 py-0.5 text-xs font-bold flex-shrink-0"
              style={{
                background: 'rgba(94, 167, 255, 0.14)',
                color: 'rgba(140, 195, 255, 0.90)',
                border: '1px solid rgba(94, 167, 255, 0.22)'
              }}
            >
              {inflationData.sources.length}
            </div>
          </div>

          <div className="flex gap-2">
            {inflationData.sources.slice(0, 4).map((source, idx) => (
              <a
                key={idx}
                href={source.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-full font-medium text-sm whitespace-nowrap flex-shrink-0"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.11)',
                  color: 'rgba(255,255,255,0.78)',
                  backdropFilter: 'blur(16px)',
                  textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
                  transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.13)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.96)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 22px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.11)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.78)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.12)';
                }}
              >
                {source.name}
              </a>
            ))}
          </div>

          <button
            className="p-2 rounded-full flex-shrink-0 ml-2"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.09)',
              color: 'rgba(255,255,255,0.45)',
              transition: 'all 0.2s ease-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.10)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.72)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
            }}
          >
            <ChevronDown className="w-4 h-4" style={{ transform: 'rotate(-90deg)' }} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}