import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, BarChart2, Database, ChevronRight, Flame, Wind, Activity, ExternalLink } from 'lucide-react';

const SPRING = { type: 'spring', stiffness: 380, damping: 40, mass: 0.8 };
const ENTRY  = { type: 'spring', stiffness: 320, damping: 35, mass: 0.85 };

const FONT = {
  display: '"SF Pro Display", Inter, system-ui, -apple-system, sans-serif',
  text:    '"SF Pro Text", Inter, system-ui, -apple-system, sans-serif',
};
const TYPE = {
  smoothing: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale', textRendering: 'optimizeLegibility' },
  tabular:   { fontVariantNumeric: 'tabular-nums' },
};

const GLASS = {
  panel: {
    background: 'linear-gradient(180deg, rgba(18,22,30,0.72) 0%, rgba(12,15,22,0.80) 100%)',
    backdropFilter: 'blur(32px) saturate(160%)',
    WebkitBackdropFilter: 'blur(32px) saturate(160%)',
    border: '1px solid rgba(255,255,255,0.07)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.08)',
    borderRadius: '28px',
  },
  card: {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.025) 100%)',
    backdropFilter: 'blur(20px) saturate(150%)',
    WebkitBackdropFilter: 'blur(20px) saturate(150%)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 4px 20px rgba(0,0,0,0.20)',
    borderRadius: '20px',
  }
};

const SPECULAR = {
  position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
  pointerEvents: 'none',
};

const DIVIDER = { height: '1px', background: 'rgba(255,255,255,0.06)' };

const getRegimeTheme = (arrow) => {
  if (arrow === 'up')   return { label: 'Heating', color: '#F26A6A', glow: 'rgba(242,106,106,0.15)', Icon: TrendingUp };
  if (arrow === 'down') return { label: 'Cooling', color: '#5CD8A0', glow: 'rgba(92,216,160,0.15)',  Icon: TrendingDown };
  return                       { label: 'Stable',  color: '#5EA7FF', glow: 'rgba(94,167,255,0.15)',  Icon: Minus };
};

const getCategoryColor = (yoy) => {
  if (yoy < 0)   return '#5CD8A0';
  if (yoy < 2)   return '#5CD8A0';
  if (yoy < 3.5) return '#FFB020';
  return '#F26A6A';
};

const MiniBar = ({ value, maxVal = 6, color, delay = 0 }) => {
  const pct = Math.min((Math.abs(value) / maxVal) * 100, 100);
  return (
    <div style={{ position: 'relative', height: '3px', borderRadius: '999px', background: 'rgba(255,255,255,0.07)', overflow: 'visible', marginTop: '6px', marginBottom: '4px' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(pct, 2)}%` }}
        transition={{ duration: 0.9, delay, ease: [0.22, 0.61, 0.36, 1] }}
        style={{ position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: '999px', background: color }}
      >
        <div style={{
          position: 'absolute', right: '-3px', top: '50%', transform: 'translateY(-50%)',
          width: '6px', height: '6px', borderRadius: '50%', background: color,
          boxShadow: `0 0 6px 1px ${color}88`,
        }} />
      </motion.div>
    </div>
  );
};

const CATEGORY_DATA = [
  { name: 'Services',   yoy: 4.9,  direction: 'up',   note: 'Medical care 3.2%, personal care 5.4%' },
  { name: 'Food',       yoy: 2.9,  direction: 'up',   note: 'Beef and coffee prices remain elevated' },
  { name: 'Shelter',    yoy: 3.0,  direction: 'flat', note: 'Biggest CPI weight, slowly cooling' },
  { name: 'Core Goods', yoy: 1.1,  direction: 'flat', note: 'Used cars deflating, apparel stable' },
  { name: 'Energy',     yoy: -0.1, direction: 'down', note: 'Gasoline down 7.5%, electricity up 6.3%' },
];

export default function InflationSection({ data }) {
  const [showHowToRead, setShowHowToRead] = useState(false);
  if (!data) return null;

  const d = {
    timestamp_display: data.timestamp_display || '',
    delta_summary: data.delta_summary || '',
    headline_state: data.headline_state || { arrow: 'flat', label: 'Headline Inflation', status: '' },
    core_state: data.core_state || { arrow: 'flat', label: 'Core Inflation', status: '' },
    services_state: data.services_state || { arrow: 'flat', label: 'Services Inflation', status: '' },
    fed_implication: data.fed_implication || '',
    drivers: data.drivers || [],
    winners: data.winners || [],
    losers: data.losers || [],
    cpi_plain: data.cpi_plain || '',
    pce_plain: data.pce_plain || '',
    why_fed_prefers: data.why_fed_prefers || '',
    watch_short: data.watch_short || [],
    watch_long: data.watch_long || [],
    sources: data.sources || [],
    cpi_pce_collapsed: data.cpi_pce_collapsed || '',
  };

  const regimeTheme = getRegimeTheme(d.headline_state.arrow);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...ENTRY, delay: 0.05 }}
      style={{ ...GLASS.panel, padding: '28px 26px', position: 'relative', overflow: 'visible' }}
    >
      {/* Top specular */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        borderRadius: '999px', pointerEvents: 'none'
      }} />
      {/* Ambient bloom */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '120px',
        background: `radial-gradient(ellipse at 50% 0%, ${regimeTheme.glow.replace('0.15','0.07')} 0%, transparent 70%)`,
        borderRadius: '28px 28px 0 0', pointerEvents: 'none'
      }} />

      {/* ── 1. HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px', position: 'relative' }}>
        <div>
          <h2 style={{ fontFamily: FONT.display, fontSize: '28px', fontWeight: 600, color: 'rgba(255,255,255,0.97)', letterSpacing: '-0.01em', margin: 0, lineHeight: 1.2, ...TYPE.smoothing }}>
            Inflation
          </h2>
          <p style={{ fontFamily: FONT.text, fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.65)', margin: '4px 0 0', letterSpacing: '0', lineHeight: 1.4, ...TYPE.smoothing }}>
            {d.timestamp_display ? `Last updated ${d.timestamp_display}` : 'Real-time price pressure signals.'}
          </p>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          padding: '7px 14px 7px 11px', borderRadius: '999px',
          background: `${regimeTheme.color}0C`, border: `1px solid ${regimeTheme.color}25`,
          backdropFilter: 'blur(12px)', fontFamily: FONT.text, fontSize: '11px', fontWeight: 600,
          color: regimeTheme.color, letterSpacing: '0.06em', textTransform: 'uppercase', ...TYPE.smoothing
        }}>
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '6px', height: '6px', borderRadius: '50%', background: regimeTheme.color, boxShadow: `0 0 6px ${regimeTheme.color}` }}
          />
          {regimeTheme.label}
        </div>
      </div>

      {/* ── 2. DELTA BANNER ── */}
      {d.delta_summary && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...ENTRY, delay: 0.08 }}
          style={{ ...GLASS.card, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '14px', margin: '16px 0', position: 'relative', overflow: 'hidden' }}
        >
          <div style={SPECULAR} />
          <span style={{ fontFamily: FONT.text, fontSize: '11px', fontWeight: 600, color: 'rgba(92,216,160,0.85)', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0, ...TYPE.smoothing }}>
            Δ Since last update
          </span>
          <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
          <span style={{ fontFamily: FONT.text, fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, letterSpacing: '0.01em', ...TYPE.smoothing }}>{d.delta_summary}</span>
        </motion.div>
      )}

      {/* ── 3. THREE STATE CARDS ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...ENTRY, delay: 0.12 }}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}
      >
        {[d.headline_state, d.core_state, d.services_state].map((state, i) => {
          const t = getRegimeTheme(state.arrow);
          return (
            <div key={i} style={{ ...GLASS.card, padding: '16px 18px', position: 'relative', overflow: 'hidden' }}>
              <div style={SPECULAR} />
              <motion.div style={{
                position: 'absolute', inset: 0, borderRadius: '20px', pointerEvents: 'none',
                background: `radial-gradient(ellipse at 0% 50%, ${t.glow} 0%, transparent 65%)`
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', position: 'relative', zIndex: 2 }}>
                <t.Icon className="w-3 h-3" style={{ color: t.color }} strokeWidth={2.5} />
                <span style={{ fontFamily: FONT.text, fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.06em', textTransform: 'uppercase', ...TYPE.smoothing }}>
                  {state.label}
                </span>
              </div>
              <p style={{ fontFamily: FONT.text, fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,0.92)', lineHeight: 1.45, margin: '0 0 12px', position: 'relative', zIndex: 2, ...TYPE.smoothing }}>
                {state.status}
              </p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '3px 10px 3px 7px', borderRadius: '999px',
                background: `${t.color}0C`, border: `1px solid ${t.color}22`,
                fontFamily: FONT.text, fontSize: '12px', fontWeight: 500, color: t.color, letterSpacing: '0.04em', textTransform: 'uppercase',
                position: 'relative', zIndex: 2
              }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: t.color, boxShadow: `0 0 5px ${t.color}` }} />
                {t.label}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* ── 4. FED IMPLICATION STRIP ── */}
      {d.fed_implication && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...ENTRY, delay: 0.16 }}
          style={{ ...GLASS.card, padding: '11px 16px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', position: 'relative', overflow: 'hidden' }}
        >
          <div style={SPECULAR} />
          <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0 }}>
            Fed Implication
          </span>
          <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.5 }}>{d.fed_implication}</span>
        </motion.div>
      )}

      {/* ── 5. CATEGORY | DRIVERS (2-col) ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...ENTRY, delay: 0.20 }}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}
      >
        {/* Categories */}
        <div style={{ ...GLASS.card, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
          <div style={SPECULAR} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px' }}>
            <BarChart2 className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.40)' }} strokeWidth={2} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Inflation by Category
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {CATEGORY_DATA.map((cat, idx) => {
              const barColor = getCategoryColor(cat.yoy);
              const arrowChar = cat.direction === 'up' ? '↑' : cat.direction === 'down' ? '↓' : '→';
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.88)' }}>{cat.name}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: barColor }}>
                      {arrowChar} {cat.yoy >= 0 ? '+' : ''}{cat.yoy.toFixed(1)}%
                    </span>
                  </div>
                  <MiniBar value={cat.yoy} maxVal={6} color={barColor} delay={0.08 + idx * 0.06} />
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', margin: 0, lineHeight: 1.4 }}>{cat.note}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Drivers */}
        <div style={{ ...GLASS.card, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
          <div style={SPECULAR} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px' }}>
            <Flame className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.40)' }} strokeWidth={2} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Key Drivers
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {d.drivers.slice(0, 3).map((driver, idx) => {
              const roleLabel = driver.role || (driver.weight >= 40 ? 'Primary' : driver.weight >= 25 ? 'Supporting' : 'Offset');
              const roleColor = roleLabel === 'Primary' ? '#5EA7FF' : roleLabel === 'Offset' ? '#F26A6A' : '#5CD8A0';
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.90)' }}>{driver.name}</span>
                    <div style={{
                      padding: '2px 9px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
                      background: `${roleColor}0C`, border: `1px solid ${roleColor}22`,
                      color: roleColor, letterSpacing: '0.04em', textTransform: 'uppercase'
                    }}>{roleLabel}</div>
                  </div>
                  <MiniBar value={driver.weight} maxVal={100} color={`linear-gradient(90deg, rgba(94,167,255,0.80), rgba(160,120,255,0.65))`} delay={0.10 + idx * 0.08} />
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.50)', margin: '4px 0 0', lineHeight: 1.5 }}>{driver.reason}</p>
                </div>
              );
            })}
            {d.drivers.length === 0 && (
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '20px 0' }}>Driver data pending.</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── 6. WINNERS | LOSERS | WHAT TO WATCH (3-col) ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...ENTRY, delay: 0.24 }}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '10px', marginBottom: '10px' }}
      >
        {/* Winners */}
        <div style={{
          ...GLASS.card,
          background: 'linear-gradient(180deg, rgba(92,216,160,0.06) 0%, rgba(92,216,160,0.03) 100%)',
          border: '1px solid rgba(92,216,160,0.12)',
          padding: '16px 18px', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ ...SPECULAR, background: 'linear-gradient(90deg, transparent, rgba(92,216,160,0.14), transparent)' }} />
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(92,216,160,0.85)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>Winners</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {d.winners.slice(0, 5).map((item, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.78)' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(92,216,160,0.75)', flexShrink: 0, marginTop: '5px', boxShadow: '0 0 5px rgba(92,216,160,0.45)' }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Losers */}
        <div style={{
          ...GLASS.card,
          background: 'linear-gradient(180deg, rgba(242,106,106,0.06) 0%, rgba(242,106,106,0.03) 100%)',
          border: '1px solid rgba(242,106,106,0.12)',
          padding: '16px 18px', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ ...SPECULAR, background: 'linear-gradient(90deg, transparent, rgba(242,106,106,0.14), transparent)' }} />
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(242,106,106,0.85)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>Losers</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {d.losers.slice(0, 5).map((item, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.78)' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(242,106,106,0.75)', flexShrink: 0, marginTop: '5px', boxShadow: '0 0 5px rgba(242,106,106,0.45)' }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* What to Watch */}
        <div style={{ ...GLASS.card, padding: '16px 18px', position: 'relative', overflow: 'hidden' }}>
          <div style={SPECULAR} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px' }}>
            <Wind className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.40)' }} strokeWidth={2} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>What to Watch</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[{ label: 'Next 30–60 days', items: d.watch_short }, { label: 'Next 6–12 months', items: d.watch_long }].map(({ label, items }) => (
              <div key={label}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.52)', marginBottom: '10px' }}>{label}</div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {items.slice(0, 4).map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', fontSize: '13px', color: 'rgba(255,255,255,0.70)', lineHeight: 1.45 }}>
                      <ChevronRight className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.28)', flexShrink: 0, marginTop: '2px' }} strokeWidth={2} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── 7. HOW TO READ THE DATA (collapsible) ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...ENTRY, delay: 0.28 }}
        style={{ ...GLASS.card, marginBottom: '10px', position: 'relative', overflow: 'hidden' }}
      >
        <div style={SPECULAR} />
        <button
          onClick={() => setShowHowToRead(v => !v)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 18px',
            background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left'
          }}
        >
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.12em', textTransform: 'uppercase', flex: 1 }}>
            How to Read the Data
          </span>
          <motion.div animate={{ rotate: showHowToRead ? 90 : 0 }} transition={{ duration: 0.18 }}>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.28)' }} strokeWidth={2} />
          </motion.div>
        </button>

        {showHowToRead && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', gap: '10px', padding: '0 18px 14px' }}>
              {[
                { label: 'CPI', value: d.cpi_pce_collapsed?.split('/')[0]?.trim() || '2.4%', color: '#5EA7FF', desc: d.cpi_plain },
                { label: 'PCE', value: d.cpi_pce_collapsed?.split('/')[1]?.trim() || '2.5%', color: '#B47FFF', desc: d.pce_plain },
                { label: 'Gap', value: '0.1%', color: '#FFB020', desc: d.why_fed_prefers },
              ].map((item, idx) => (
                <div key={idx} style={{
                  flex: 1, padding: '10px 14px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.88)' }}>{item.label}</span>
                    <span style={{
                      fontSize: '11px', fontWeight: 700, padding: '1px 7px', borderRadius: '999px',
                      background: `${item.color}10`, color: item.color, border: `1px solid ${item.color}20`
                    }}>{item.value}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ── 8. TOP WEIGHTED SOURCES ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...ENTRY, delay: 0.30 }}
        style={{ ...GLASS.card, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', overflow: 'hidden' }}
      >
        <div style={SPECULAR} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0 }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.10em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Top Weighted Sources
          </span>
          <div style={{
            fontSize: '10px', fontWeight: 700, padding: '1px 7px', borderRadius: '999px',
            background: 'rgba(94,167,255,0.12)', color: 'rgba(140,195,255,0.90)',
            border: '1px solid rgba(94,167,255,0.22)',
          }}>{d.sources.length}</div>
        </div>
        <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />
        <div style={{ display: 'flex', gap: '7px', flex: 1, overflow: 'hidden' }}>
          {d.sources.slice(0, 5).map((source, idx) => (
            <a key={idx} href={source.url || '#'} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '4px 12px', borderRadius: '999px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.62)', fontSize: '12px', fontWeight: 500,
                textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
                transition: 'all 0.14s ease-out',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = 'rgba(255,255,255,0.92)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.62)'; }}
            >
              {source.name}
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}