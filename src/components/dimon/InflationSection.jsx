import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];

const GLASS_PANEL = {
  background: 'rgba(255,255,255,0.055)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '20px',
};

const TOP_HIGHLIGHT = {
  position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
  pointerEvents: 'none',
};

const getArrowIcon = (direction) => {
  switch (direction) {
    case 'up': return TrendingUp;
    case 'down': return TrendingDown;
    default: return Minus;
  }
};

const getAccentColor = (arrow) => {
  if (arrow === 'up') return '#FF6A7A';
  if (arrow === 'down') return '#58E3A4';
  return '#A8B3C7';
};

const CATEGORY_DATA = [
  { name: 'Services',   yoy: 4.9,  direction: 'up',   note: 'Medical care 3.2%, personal care 5.4%' },
  { name: 'Food',       yoy: 2.9,  direction: 'up',   note: 'Beef and coffee prices remain elevated' },
  { name: 'Shelter',    yoy: 3.0,  direction: 'flat', note: 'Biggest CPI weight, slowly cooling' },
  { name: 'Core Goods', yoy: 1.1,  direction: 'flat', note: 'Used cars deflating, apparel stable' },
  { name: 'Energy',     yoy: -0.1, direction: 'down', note: 'Gasoline down 7.5%, electricity up 6.3%' },
];

const getCategoryBarColor = (yoy) => {
  const abs = Math.abs(yoy);
  if (yoy < 0) return '#58E3A4';
  if (abs < 2) return '#58E3A4';
  if (abs < 3) return '#F5A623';
  if (abs < 4) return '#F5A623';
  return '#FF6A7A';
};

// Progress bar with glow endpoint dot
const ProgressBar = ({ value, maxVal = 6, color, delay = 0 }) => {
  const pct = Math.min((Math.abs(value) / maxVal) * 100, 100);
  return (
    <div style={{ position: 'relative', height: '3px', borderRadius: '999px', background: 'rgba(255,255,255,0.07)', overflow: 'visible', marginBottom: '6px' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(pct, 2)}%` }}
        transition={{ duration: 0.8, delay, ease: [0.22, 0.61, 0.36, 1] }}
        style={{ position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: '999px', background: color }}
      >
        {/* glow dot at endpoint */}
        <div style={{
          position: 'absolute', right: '-3px', top: '50%', transform: 'translateY(-50%)',
          width: '7px', height: '7px', borderRadius: '50%',
          background: color,
          boxShadow: `0 0 6px 2px ${color}88`,
        }} />
      </motion.div>
    </div>
  );
};

export default function InflationSection({ data }) {
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
    sources: data.sources || [],
  };

  // Derive regime from headline_state arrow
  const regimeLabel = inflationData.headline_state.arrow === 'down' ? 'Cooling'
    : inflationData.headline_state.arrow === 'up' ? 'Heating' : 'Stable';
  const regimeColor = inflationData.headline_state.arrow === 'down' ? '#58E3A4'
    : inflationData.headline_state.arrow === 'up' ? '#FF6A7A' : '#A8B3C7';

  const stagger = (i) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, delay: i * 0.06, ease: HORIZON_EASE } });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .regime-dot { animation: pulse-dot 2s ease-in-out infinite; }
      `}</style>

      {/* ── ROW 0: HEADER ─────────────────────────────────────────────── */}
      <motion.div {...stagger(0)} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '32px', fontWeight: 700, color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.5px', margin: 0 }}>
            Inflation
          </h3>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.38)', marginTop: '4px' }}>
            Last updated {inflationData.timestamp_display}
          </p>
        </div>
        {/* Regime chip */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          padding: '6px 14px', borderRadius: '999px',
          background: 'rgba(255,255,255,0.055)',
          border: `1px solid ${regimeColor}44`,
          backdropFilter: 'blur(20px)',
        }}>
          <span className="regime-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: regimeColor, boxShadow: `0 0 6px ${regimeColor}`, display: 'inline-block' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: regimeColor, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {regimeLabel}
          </span>
        </div>
      </motion.div>

      {/* ── ROW 1: CHANGE BANNER ──────────────────────────────────────── */}
      <motion.div {...stagger(1)} style={{
        ...GLASS_PANEL,
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: '12px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={TOP_HIGHLIGHT} />
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(88,227,164,0.80)', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          Δ Since last update
        </span>
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.5 }}>
          {inflationData.delta_summary}
        </span>
      </motion.div>

      {/* ── ROW 2: THREE STATE CARDS ──────────────────────────────────── */}
      <motion.div {...stagger(2)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
        {[inflationData.headline_state, inflationData.core_state, inflationData.services_state].map((state, i) => {
          const Icon = getArrowIcon(state.arrow);
          const accentColor = getAccentColor(state.arrow);
          return (
            <div key={i} style={{
              ...GLASS_PANEL,
              padding: '16px',
              position: 'relative', overflow: 'hidden',
              background: `radial-gradient(ellipse at top left, rgba(255,255,255,0.03) 0%, transparent 60%), rgba(255,255,255,0.055)`,
            }}>
              <div style={TOP_HIGHLIGHT} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Icon style={{ width: '13px', height: '13px', color: accentColor, flexShrink: 0 }} strokeWidth={2.5} />
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  {state.label}
                </span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.88)', lineHeight: 1.5, margin: 0 }}>
                {state.status}
              </p>
              {/* Bottom pulse dot */}
              <div style={{
                position: 'absolute', bottom: '12px', right: '12px',
                width: '6px', height: '6px', borderRadius: '50%',
                background: accentColor,
                boxShadow: `0 0 6px ${accentColor}`,
                animation: 'pulse-dot 2.5s ease-in-out infinite',
              }} />
            </div>
          );
        })}
      </motion.div>

      {/* ── ROW 3: FED IMPLICATION STRIP ─────────────────────────────── */}
      <motion.div {...stagger(3)} style={{
        ...GLASS_PANEL,
        padding: '11px 16px',
        display: 'flex', alignItems: 'center', gap: '14px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={TOP_HIGHLIGHT} />
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          Fed Implication
        </span>
        <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.10)', flexShrink: 0 }} />
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.80)', lineHeight: 1.5 }}>
          {inflationData.fed_implication}
        </span>
      </motion.div>

      {/* ── ROW 4: INFLATION BY CATEGORY | KEY DRIVERS ───────────────── */}
      <motion.div {...stagger(4)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {/* Left: Inflation by Category */}
        <div style={{ ...GLASS_PANEL, padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={TOP_HIGHLIGHT} />
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Inflation by Category
          </div>
          {CATEGORY_DATA.map((cat, idx) => {
            const barColor = getCategoryBarColor(cat.yoy);
            const arrowColor = cat.direction === 'up' ? '#FF6A7A' : cat.direction === 'down' ? '#58E3A4' : '#A8B3C7';
            const arrowChar = cat.direction === 'up' ? '↑' : cat.direction === 'down' ? '↓' : '→';
            return (
              <div key={idx} style={{ paddingBottom: '14px', marginBottom: idx < CATEGORY_DATA.length - 1 ? '2px' : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.88)' }}>{cat.name}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: arrowColor }}>
                    {arrowChar} {cat.yoy >= 0 ? '+' : ''}{cat.yoy.toFixed(1)}%
                  </span>
                </div>
                <ProgressBar value={cat.yoy} maxVal={6} color={barColor} delay={0.1 + idx * 0.07} />
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.40)', margin: 0 }}>{cat.note}</p>
              </div>
            );
          })}
        </div>

        {/* Right: Key Drivers */}
        <div style={{ ...GLASS_PANEL, padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={TOP_HIGHLIGHT} />
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Key Drivers
          </div>
          {inflationData.drivers.slice(0, 3).map((driver, idx) => {
            const barPct = Math.min(driver.weight, 100);
            const roleLabel = driver.role || (driver.weight >= 40 ? 'Primary' : driver.weight >= 25 ? 'Supporting' : 'Offset');
            const roleBg = roleLabel === 'Primary' ? 'rgba(255,255,255,0.10)' : roleLabel === 'Offset' ? 'rgba(255,106,122,0.15)' : 'rgba(88,227,164,0.10)';
            const roleColor = roleLabel === 'Primary' ? 'rgba(255,255,255,0.70)' : roleLabel === 'Offset' ? 'rgba(255,106,122,0.90)' : 'rgba(88,227,164,0.85)';
            return (
              <div key={idx} style={{ paddingBottom: '16px', marginBottom: idx < Math.min(inflationData.drivers.length, 3) - 1 ? '4px' : 0, borderBottom: idx < Math.min(inflationData.drivers.length, 3) - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.92)' }}>{driver.name}</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '6px', background: roleBg, color: roleColor }}>
                    {roleLabel}
                  </span>
                </div>
                <ProgressBar value={barPct} maxVal={100} color="linear-gradient(90deg, rgba(94,167,255,0.80), rgba(160,120,255,0.65))" delay={0.15 + idx * 0.1} />
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.52)', lineHeight: 1.55, margin: 0 }}>{driver.reason}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── ROW 5: WINNERS+LOSERS | WHAT TO WATCH ────────────────────── */}
      <motion.div {...stagger(5)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {/* Left: Winners + Losers 2-col sub-grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {/* Winners */}
          <div style={{
            ...GLASS_PANEL,
            background: 'rgba(52,199,89,0.10)',
            border: '1px solid rgba(52,199,89,0.14)',
            padding: '16px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={TOP_HIGHLIGHT} />
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(88,227,164,0.85)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Winners
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {inflationData.winners.slice(0, 4).map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.80)' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(88,227,164,0.70)', flexShrink: 0, marginTop: '4px' }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* Losers */}
          <div style={{
            ...GLASS_PANEL,
            background: 'rgba(255,69,58,0.10)',
            border: '1px solid rgba(255,69,58,0.14)',
            padding: '16px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={TOP_HIGHLIGHT} />
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,106,122,0.85)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Losers
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {inflationData.losers.slice(0, 4).map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.80)' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,106,122,0.70)', flexShrink: 0, marginTop: '4px' }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: What to Watch */}
        <div style={{ ...GLASS_PANEL, padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={TOP_HIGHLIGHT} />
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px' }}>
            What to Watch
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.60)', marginBottom: '10px' }}>
                Next 30–60 days
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {inflationData.watch_short.slice(0, 4).map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.45 }}>
                    <span style={{ flexShrink: 0, color: 'rgba(255,255,255,0.35)', marginTop: '1px' }}>›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.60)', marginBottom: '10px' }}>
                Next 6–12 months
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {inflationData.watch_long.slice(0, 4).map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.45 }}>
                    <span style={{ flexShrink: 0, color: 'rgba(255,255,255,0.35)', marginTop: '1px' }}>›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── ROW 6: HOW TO READ THE DATA ──────────────────────────────── */}
      <motion.div {...stagger(6)} style={{ ...GLASS_PANEL, padding: '16px 20px', display: 'flex', alignItems: 'stretch', gap: '0', position: 'relative', overflow: 'hidden' }}>
        <div style={TOP_HIGHLIGHT} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginRight: '20px', flexShrink: 0 }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1.4 }}>
            HOW TO<br />READ THE DATA
          </div>
        </div>
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.07)', marginRight: '20px', flexShrink: 0 }} />
        {/* CPI card */}
        <div style={{ flex: 1, padding: '12px 16px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', marginRight: '10px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.88)', marginBottom: '6px' }}>
            CPI — {inflationData.cpi_pce_collapsed ? inflationData.cpi_pce_collapsed.split('/')[0]?.trim() || '2.4%' : '2.4%'}
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.50)', lineHeight: 1.5, margin: 0 }}>
            {inflationData.cpi_plain}
          </p>
        </div>
        {/* PCE card */}
        <div style={{ flex: 1, padding: '12px 16px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', marginRight: '10px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.88)', marginBottom: '6px' }}>
            PCE — {inflationData.cpi_pce_collapsed ? inflationData.cpi_pce_collapsed.split('/')[1]?.trim() || '2.5%' : '2.5%'}
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.50)', lineHeight: 1.5, margin: 0 }}>
            {inflationData.pce_plain}
          </p>
        </div>
        {/* Gap card */}
        <div style={{ flex: 1, padding: '12px 16px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.88)', marginBottom: '6px' }}>
            Gap — 0.1%
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.50)', lineHeight: 1.5, margin: 0 }}>
            {inflationData.why_fed_prefers}
          </p>
        </div>
      </motion.div>

      {/* ── ROW 7: TOP WEIGHTED SOURCES ──────────────────────────────── */}
      <motion.div {...stagger(7)} style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          Top Weighted Sources
        </span>
        <span style={{
          fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px',
          background: 'rgba(94,167,255,0.14)', color: 'rgba(140,195,255,0.90)',
          border: '1px solid rgba(94,167,255,0.22)',
        }}>
          {inflationData.sources.length}
        </span>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {inflationData.sources.slice(0, 5).map((source, idx) => (
            <a
              key={idx}
              href={source.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '6px 14px', borderRadius: '999px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.11)',
                color: 'rgba(255,255,255,0.76)',
                fontSize: '13px', fontWeight: 500,
                textDecoration: 'none',
                backdropFilter: 'blur(16px)',
                transition: 'all 0.18s ease-out',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; e.currentTarget.style.color = 'rgba(255,255,255,0.96)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.76)'; }}
            >
              {source.name}
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}