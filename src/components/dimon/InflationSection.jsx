import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronDown, BarChart2 } from 'lucide-react';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];
const SMOOTH_EXPAND = { duration: 0.38, ease: [0.22, 0.61, 0.36, 1] };
const CHEVRON_ROTATE = { duration: 0.32, ease: [0.22, 0.61, 0.36, 1] };

const GLASS_CARD = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 4px 32px rgba(0,0,0,0.40)',
  overflow: 'hidden',
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden',
  WebkitFontSmoothing: 'antialiased',
};

const GLASS_ACCORDION = {
  background: 'rgba(255,255,255,0.025)',
  backdropFilter: 'blur(32px) saturate(185%)',
  WebkitBackdropFilter: 'blur(32px) saturate(185%)',
  border: '1px solid rgba(255,255,255,0.07)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 20px rgba(0,0,0,0.32)',
  overflow: 'hidden',
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden',
  WebkitFontSmoothing: 'antialiased',
};

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

// 1) MACRO SIGNAL CHIPS — floating elevated chips replacing the old rows
const SignalChip = ({ arrow, label, status, index }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = getArrowIcon(arrow);
  const isUp = arrow === 'up';
  const isDown = arrow === 'down';
  const accentColor = isUp ? '#E8606E' : isDown ? '#4DCA94' : '#8C97A6';
  const glowColor = isUp ? 'rgba(232,96,110,0.14)' : isDown ? 'rgba(77,202,148,0.11)' : 'rgba(140,151,166,0.08)';
  const borderColor = isUp ? 'rgba(232,96,110,0.18)' : isDown ? 'rgba(77,202,148,0.15)' : 'rgba(140,151,166,0.12)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.07, duration: 0.4, ease: HORIZON_EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex-1 relative rounded-[14px] p-4 cursor-default"
      style={{
        background: hovered
          ? `radial-gradient(ellipse at top left, rgba(255,255,255,0.06) 0%, transparent 60%), linear-gradient(180deg, ${glowColor} 0%, rgba(255,255,255,0.015) 100%)`
          : `radial-gradient(ellipse at top left, rgba(255,255,255,0.04) 0%, transparent 60%), linear-gradient(180deg, ${glowColor} 0%, rgba(255,255,255,0.010) 100%)`,
        border: `1px solid ${hovered ? borderColor.replace('0.18', '0.26').replace('0.15', '0.22').replace('0.12', '0.18') : borderColor}`,
        boxShadow: hovered
          ? `inset 0 1px 0 rgba(255,255,255,0.09), 0 8px 28px rgba(0,0,0,0.22), 0 0 18px ${glowColor}`
          : `inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.14)`,
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        minWidth: 0,
      }}
    >
      {/* Specular */}
      <div style={{
        position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
        background: `linear-gradient(90deg, transparent, ${accentColor}30, transparent)`,
        pointerEvents: 'none'
      }} />

      <div className="flex items-center gap-1.5 mb-2">
        <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor, filter: `drop-shadow(0 0 4px ${accentColor}80)` }} strokeWidth={2.5} />
        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em' }}>
          {label}
        </span>
      </div>
      <div className="text-[15px] font-bold leading-tight" style={{ color: 'rgba(255,255,255,0.94)', letterSpacing: '-0.015em' }}>
        {status}
      </div>

      {/* Bottom pulse dot */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 3 + index * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: '12px', right: '12px',
          width: '5px', height: '5px', borderRadius: '50%',
          background: accentColor,
          boxShadow: `0 0 6px ${accentColor}`,
        }}
      />
    </motion.div>
  );
};

// 2) DRIVER FORCE METER
const DriverForceMeter = ({ driver, idx, total }) => (
  <div
    className="py-3.5"
    style={{ borderBottom: idx < total - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
  >
    <div className="flex items-center justify-between gap-3 mb-2.5">
      <span className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em' }}>
        {driver.name}
      </span>
      <span
        className="text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
        style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          color: 'rgba(140,195,255,0.88)',
          border: '1px solid rgba(255,255,255,0.10)'
        }}
      >
        {driver.weight}%
      </span>
    </div>
    {/* Force meter bar */}
    <div style={{
      height: '5px', borderRadius: '3px',
      background: 'rgba(255,255,255,0.06)',
      marginBottom: '10px', overflow: 'hidden', position: 'relative'
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(driver.weight, 100)}%` }}
        transition={{ duration: 0.8, delay: 0.15 + idx * 0.1, ease: [0.22, 0.61, 0.36, 1] }}
        style={{
          height: '100%', borderRadius: '3px',
          background: 'linear-gradient(90deg, rgba(94,167,255,0.70), rgba(160,120,255,0.55), rgba(88,227,164,0.40))',
          boxShadow: '0 0 8px rgba(94,167,255,0.35)',
          position: 'relative'
        }}
      >
        {/* Animated shimmer on bar */}
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2.2, delay: 0.8 + idx * 0.1, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: 0, bottom: 0, width: '40%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent)',
            borderRadius: '3px'
          }}
        />
      </motion.div>
    </div>
    <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.58)' }}>
      {driver.reason}
    </p>
  </div>
);

// Accordion panel with hover glow
const AccordionPanel = ({ isOpen, onToggle, title, children, delay = 0 }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: HORIZON_EASE }}
      className="relative rounded-[20px]"
      style={{
        ...GLASS_ACCORDION,
        boxShadow: hovered
          ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.38), 0 0 0 1px rgba(255,255,255,0.06)'
          : GLASS_ACCORDION.boxShadow,
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
        <span className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em' }}>
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={CHEVRON_ROTATE}
          style={{ transformOrigin: 'center', backfaceVisibility: 'hidden' }}
        >
          <ChevronDown className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.40)' }} />
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
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.28 }}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


const CATEGORY_DATA = [
  { name: 'Food', yoy: 2.9, direction: 'up', note: 'Beef and coffee prices remain elevated' },
  { name: 'Energy', yoy: -0.1, direction: 'down', note: 'Gasoline down 7.5%, electricity up 6.3%' },
  { name: 'Shelter', yoy: 3.0, direction: 'flat', note: 'Biggest CPI weight, slowly cooling' },
  { name: 'Services', yoy: 4.9, direction: 'flat', note: 'Medical care 3.2%, personal care 5.4%' },
  { name: 'Core Goods', yoy: 1.1, direction: 'flat', note: 'Used cars deflating, apparel stable' },
];

const getCategoryBarColor = (yoy) => {
  const abs = Math.abs(yoy);
  if (abs < 2) return '#58E3A4';
  if (abs < 3) return '#A8B3C7';
  if (abs < 4) return '#F5A623';
  return '#FF6A7A';
};

const CategoryRow = ({ category, idx, total }) => {
  const absYoy = Math.abs(category.yoy);
  const barWidth = Math.min((absYoy / 6) * 100, 100);
  const barColor = getCategoryBarColor(category.yoy);
  const arrowColor = category.direction === 'up' ? '#FF6A7A' : category.direction === 'down' ? '#58E3A4' : '#A8B3C7';
  const arrowChar = category.direction === 'up' ? '↑' : category.direction === 'down' ? '↓' : '→';

  return (
    <div
      className="py-3.5"
      style={{ borderBottom: idx < total - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em' }}>
          {category.name}
        </span>
        <span className="text-[13px] font-bold flex-shrink-0" style={{ color: arrowColor }}>
          {arrowChar} {category.yoy >= 0 ? '+' : ''}{category.yoy.toFixed(1)}%
        </span>
      </div>
      <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', marginBottom: '8px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(barWidth, 1.5)}%` }}
          transition={{ duration: 0.8, delay: 0.1 + idx * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
          style={{ height: '100%', borderRadius: '3px', background: barColor, opacity: 0.8 }}
        />
      </div>
      <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.48)' }}>
        {category.note}
      </p>
    </div>
  );
};

export default function InflationSection({ data }) {
  const [drawer1Open, setDrawer1Open] = useState(false);
  const [drawer2Open, setDrawer2Open] = useState(false);
  const [drawer3Open, setDrawer3Open] = useState(false);
  const [drawerCatOpen, setDrawerCatOpen] = useState(false);
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
      style={{ overflow: 'visible', background: 'rgba(12,14,18,0.85)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', borderRadius: '24px', padding: '28px' }}
    >
      {/* ── PRIMARY STATUS CARD ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: HORIZON_EASE }}
        className="relative rounded-3xl"
        style={GLASS_CARD}
      >
        <SpecularLine />

        {/* Ambient top bloom */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '55%',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(94,160,255,0.065) 0%, transparent 70%)',
          pointerEvents: 'none', borderRadius: '24px 24px 0 0'
        }} />

        {/* HEADER */}
        <div className="flex items-start justify-between px-6 pt-6 pb-3 relative z-10">
          <div className="flex-1">
            <h3 className="font-semibold mb-1.5" style={{ fontSize: '28px', color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.5px' }}>
              Inflation
            </h3>
            <p className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.40)', letterSpacing: '0.01em' }}>
              Last updated {inflationData.timestamp_display}
            </p>
          </div>
        </div>

        {/* Glow divider line */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(94,160,255,0.28) 35%, rgba(180,140,255,0.20) 65%, transparent 100%)',
        }} />

        {/* Light sweep animation on divider */}
        <div style={{ position: 'relative', height: 0, overflow: 'visible' }}>
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 6, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: '-1px', left: 0, width: '30%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
              pointerEvents: 'none'
            }}
          />
        </div>

        {/* DELTA ANCHOR */}
        <div className="px-6 py-3 relative z-10">
          <div className="inline-flex flex-col px-4 py-2.5 rounded-[12px]" style={{
            background: 'rgba(99,210,190,0.08)',
            border: '1px solid rgba(99,210,190,0.20)',
          }}>
            <div className="text-[10px] font-semibold uppercase mb-1" style={{ color: 'rgba(99,210,190,0.70)', letterSpacing: '0.12em' }}>
              Δ Since last update
            </div>
            <p className="text-sm font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.88)' }}>
              {inflationData.delta_summary}
            </p>
          </div>
        </div>

        <div className="px-5 py-5 space-y-5 relative z-10">
          {/* SIGNAL CHIPS — Current State */}
          <div>
            <div className="text-[10px] font-semibold uppercase mb-3" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em' }}>
              Current state
            </div>
            <div className="flex gap-2.5">
              <SignalChip {...inflationData.headline_state} index={0} />
              <SignalChip {...inflationData.core_state} index={1} />
              <SignalChip {...inflationData.services_state} index={2} />
            </div>
          </div>

          {/* WHY IT MATTERS */}
          <div style={{ opacity: 0.92 }}>
            <div className="text-[10px] font-semibold uppercase mb-2" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em' }}>
              Why it matters
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.65, color: 'rgba(255,255,255,0.65)', fontStyle: 'normal' }}>
              {inflationData.fed_implication}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── INFLATION BY CATEGORY ────────────────────────────────────── */}
      <AccordionPanel
        isOpen={drawerCatOpen}
        onToggle={() => setDrawerCatOpen(!drawerCatOpen)}
        title="Inflation by Category"
        delay={0.04}
      >
        <div className="px-5 pb-5 pt-1">
          {CATEGORY_DATA.map((cat, idx) => (
            <CategoryRow key={idx} category={cat} idx={idx} total={CATEGORY_DATA.length} />
          ))}
        </div>
      </AccordionPanel>

      {/* ── DRAWER 1 — WHY INFLATION LOOKS THIS WAY ─────────────────── */}
      <AccordionPanel
        isOpen={drawer1Open}
        onToggle={() => setDrawer1Open(!drawer1Open)}
        title="Why inflation looks this way"
        delay={0.08}
      >
        <div className="px-5 pb-5 pt-1">
          {inflationData.drivers.slice(0, 3).map((driver, idx) => (
            <DriverForceMeter
              key={idx}
              driver={driver}
              idx={idx}
              total={Math.min(inflationData.drivers.length, 3)}
            />
          ))}
        </div>
      </AccordionPanel>

      {/* ── DRAWER 2 — WHO FEELS THIS MOST ──────────────────────────── */}
      <AccordionPanel
        isOpen={drawer2Open}
        onToggle={() => setDrawer2Open(!drawer2Open)}
        title="Who feels this most"
        delay={0.12}
      >
        <div className="px-5 pb-5 pt-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Winners panel */}
            <div className="p-4 rounded-[16px]" style={{
              background: 'linear-gradient(180deg, rgba(88,227,164,0.09) 0%, rgba(88,227,164,0.04) 100%)',
              border: '1px solid rgba(88,227,164,0.15)',
              boxShadow: 'inset 0 1px 0 rgba(88,227,164,0.08)'
            }}>
              <div className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(88,227,164,0.78)', letterSpacing: '0.06em' }}>
                Winners
              </div>
              <ul className="space-y-1.5">
                {inflationData.winners.slice(0, 4).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[13px]" style={{ color: 'rgba(255,255,255,0.72)' }}>
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(88,227,164,0.70)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Losers panel */}
            <div className="p-4 rounded-[16px]" style={{
              background: 'linear-gradient(180deg, rgba(255,106,122,0.09) 0%, rgba(255,106,122,0.04) 100%)',
              border: '1px solid rgba(255,106,122,0.15)',
              boxShadow: 'inset 0 1px 0 rgba(255,106,122,0.08)'
            }}>
              <div className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,106,122,0.78)', letterSpacing: '0.06em' }}>
                Losers
              </div>
              <ul className="space-y-1.5">
                {inflationData.losers.slice(0, 4).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[13px]" style={{ color: 'rgba(255,255,255,0.72)' }}>
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(255,106,122,0.70)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </AccordionPanel>

      {/* ── DRAWER 3 — HOW TO READ THE DATA ─────────────────────────── */}
      <AccordionPanel
        isOpen={drawer3Open}
        onToggle={() => setDrawer3Open(!drawer3Open)}
        title="How to read the data"
        delay={0.16}
      >
        <div className="px-5 pb-5 pt-3 space-y-4" style={{ opacity: 0.92 }}>
          {/* CPI vs PCE card */}
          <div className="rounded-[16px] overflow-hidden" style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
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
                <BarChart2 className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(140,190,255,0.70)' }} strokeWidth={1.8} />
                <div>
                  <div className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em' }}>CPI vs PCE</div>
                  <div className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.50)' }}>{inflationData.cpi_pce_collapsed}</div>
                </div>
              </div>
              <motion.div
                animate={{ rotate: showCPIPCE ? 180 : 0 }}
                transition={CHEVRON_ROTATE}
                style={{ transformOrigin: 'center', backfaceVisibility: 'hidden' }}
              >
                <ChevronDown className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.32)' }} />
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
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.22 }}
                  >
                    <div style={{ height: '1px', marginBottom: '12px', background: 'linear-gradient(90deg, transparent, rgba(140,190,255,0.22), transparent)' }} />
                    <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>• {inflationData.cpi_plain}</p>
                    <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>• {inflationData.pce_plain}</p>
                    <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>• {inflationData.why_fed_prefers}</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* What to Watch */}
          <div className="pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-[11px] font-semibold uppercase tracking-widest mb-3 pt-3" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.07em' }}>
              What to watch
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-[12px] font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>Next 30–60 days</div>
                <ul className="space-y-1.5">
                  {inflationData.watch_short.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[13px]" style={{ color: 'rgba(255,255,255,0.62)' }}>
                      <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.28)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[12px] font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>Next 6–12 months</div>
                <ul className="space-y-1.5">
                  {inflationData.watch_long.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[13px]" style={{ color: 'rgba(255,255,255,0.62)' }}>
                      <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.28)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </AccordionPanel>

      {/* ── TOP WEIGHTED SOURCES ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: HORIZON_EASE }}
        className="relative rounded-[20px]"
        style={{
          ...GLASS_CARD,
          padding: '18px 20px 16px 20px',
          overflow: 'visible',
          opacity: 0.88
        }}
      >
        <SpecularLine />
        <div className="flex items-center gap-3 overflow-x-auto pb-1 relative z-10">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.01em' }}>
              Top Weighted Sources
            </span>
            <div className="rounded-full px-2 py-0.5 text-[11px] font-bold flex-shrink-0" style={{
              background: 'rgba(94,167,255,0.14)',
              color: 'rgba(140,195,255,0.90)',
              border: '1px solid rgba(94,167,255,0.22)'
            }}>
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
                className="px-3.5 py-1.5 rounded-full font-medium text-[13px] whitespace-nowrap flex-shrink-0"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.11)',
                  color: 'rgba(255,255,255,0.76)',
                  backdropFilter: 'blur(16px)',
                  textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
                  transition: 'all 0.18s ease-out'
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
                  e.currentTarget.style.color = 'rgba(255,255,255,0.76)';
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
              color: 'rgba(255,255,255,0.42)',
              transition: 'all 0.18s ease-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.10)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.70)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.42)';
            }}
          >
            <ChevronDown className="w-4 h-4" style={{ transform: 'rotate(-90deg)' }} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}