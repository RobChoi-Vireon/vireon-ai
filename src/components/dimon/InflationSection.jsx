import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, BarChart2, Database, ChevronRight, Flame, Wind, Activity, AlertCircle, ExternalLink } from 'lucide-react';

// ─── OS HORIZON TOKENS (matching DivergenceReport) ───────────────────────────
const EASE = [0.26, 0.11, 0.26, 1.0];
const SPRING = { type: 'spring', stiffness: 380, damping: 40, mass: 0.8 };
const ENTRY = { type: 'spring', stiffness: 320, damping: 35, mass: 0.85 };

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

const getRegimeTheme = (arrow) => {
  if (arrow === 'up')   return { label: 'Heating',  color: '#F26A6A', glow: 'rgba(242,106,106,0.15)', Icon: TrendingUp };
  if (arrow === 'down') return { label: 'Cooling',  color: '#5CD8A0', glow: 'rgba(92,216,160,0.15)',  Icon: TrendingDown };
  return                       { label: 'Stable',   color: '#5EA7FF', glow: 'rgba(94,167,255,0.15)',  Icon: Minus };
};

const getCategoryColor = (yoy) => {
  if (yoy < 0)    return '#5CD8A0';
  if (yoy < 2)    return '#5CD8A0';
  if (yoy < 3.5)  return '#FFB020';
  return '#F26A6A';
};

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
const ProgressBar = ({ value, maxVal = 6, color, delay = 0 }) => {
  const pct = Math.min((Math.abs(value) / maxVal) * 100, 100);
  return (
    <div style={{ position: 'relative', height: '3px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'visible', marginBottom: '4px' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(pct, 2)}%` }}
        transition={{ duration: 0.9, delay, ease: [0.22, 0.61, 0.36, 1] }}
        style={{ position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: '999px', background: color }}
      >
        <div style={{
          position: 'absolute', right: '-3px', top: '50%', transform: 'translateY(-50%)',
          width: '7px', height: '7px', borderRadius: '50%',
          background: color, boxShadow: `0 0 6px 2px ${color}88`,
        }} />
      </motion.div>
    </div>
  );
};

// ─── STATE CARD ──────────────────────────────────────────────────────────────
const StateCard = ({ state, index }) => {
  const [hovered, setHovered] = useState(false);
  const theme = getRegimeTheme(state.arrow);
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...ENTRY, delay: index * 0.07 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.div
        animate={{
          y: hovered ? -2 : 0,
          boxShadow: hovered
            ? `inset 0 1px 0 rgba(255,255,255,0.12), 0 12px 40px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.10)`
            : GLASS.card.boxShadow
        }}
        transition={SPRING}
        style={{ ...GLASS.card, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}
      >
        <div style={SPECULAR} />
        <motion.div
          style={{
            position: 'absolute', inset: 0, borderRadius: '20px', pointerEvents: 'none',
            background: `radial-gradient(ellipse at 0% 50%, ${theme.glow} 0%, transparent 65%)`
          }}
          animate={{ opacity: hovered ? 1 : 0.4 }}
          transition={SPRING}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', position: 'relative', zIndex: 2 }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${theme.color}12`, border: `1px solid ${theme.color}22`,
            boxShadow: `0 0 10px ${theme.glow}`
          }}>
            <theme.Icon className="w-3.5 h-3.5" style={{ color: theme.color }} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
            {state.label}
          </span>
        </div>

        <p style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.88)', lineHeight: 1.5, margin: 0, position: 'relative', zIndex: 2 }}>
          {state.status}
        </p>

        {/* Bottom risk pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '12px',
          padding: '3px 10px 3px 8px', borderRadius: '999px',
          background: `${theme.color}0C`, border: `1px solid ${theme.color}22`,
          fontSize: '10px', fontWeight: 600, color: theme.color, letterSpacing: '0.05em', textTransform: 'uppercase',
          position: 'relative', zIndex: 2
        }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: theme.color, boxShadow: `0 0 5px ${theme.color}80` }} />
          {theme.label}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── CATEGORY CARD ────────────────────────────────────────────────────────────
const CategoryCard = ({ cat, index }) => {
  const [hovered, setHovered] = useState(false);
  const barColor = getCategoryColor(cat.yoy);
  const arrowChar = cat.direction === 'up' ? '↑' : cat.direction === 'down' ? '↓' : '→';
  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.div
        animate={{ y: hovered ? -1 : 0 }}
        transition={SPRING}
        style={{ ...GLASS.card, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}
      >
        <div style={SPECULAR} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.90)' }}>{cat.name}</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: barColor }}>
            {arrowChar} {cat.yoy >= 0 ? '+' : ''}{cat.yoy.toFixed(1)}%
          </span>
        </div>
        <ProgressBar value={cat.yoy} maxVal={6} color={barColor} delay={0.1 + index * 0.06} />
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.40)', margin: 0, lineHeight: 1.4, position: 'relative', zIndex: 2 }}>{cat.note}</p>

        {/* Footer meta */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)',
          marginTop: '10px', position: 'relative', zIndex: 2
        }}>
          <div style={{
            padding: '2px 8px', borderRadius: '999px',
            background: `${barColor}0A`, border: `1px solid ${barColor}18`,
            fontSize: '10px', fontWeight: 600, color: `${barColor}CC`, letterSpacing: '0.04em', textTransform: 'uppercase'
          }}>
            {cat.direction === 'up' ? 'Pressuring' : cat.direction === 'down' ? 'Easing' : 'Neutral'}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── DRIVER CARD ──────────────────────────────────────────────────────────────
const DriverCard = ({ driver, index }) => {
  const [hovered, setHovered] = useState(false);
  const roleLabel = driver.role || (driver.weight >= 40 ? 'Primary' : driver.weight >= 25 ? 'Supporting' : 'Offset');
  const roleColor = roleLabel === 'Primary' ? '#5EA7FF' : roleLabel === 'Offset' ? '#F26A6A' : '#5CD8A0';
  const roleGlow = roleLabel === 'Primary' ? 'rgba(94,167,255,0.15)' : roleLabel === 'Offset' ? 'rgba(242,106,106,0.15)' : 'rgba(92,216,160,0.15)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...ENTRY, delay: index * 0.08 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.div
        animate={{
          y: hovered ? -2 : 0,
          boxShadow: hovered
            ? `inset 0 1px 0 rgba(255,255,255,0.12), 0 12px 40px rgba(0,0,0,0.32)`
            : GLASS.card.boxShadow
        }}
        transition={SPRING}
        style={{ ...GLASS.card, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}
      >
        <div style={SPECULAR} />
        <motion.div
          style={{
            position: 'absolute', inset: 0, borderRadius: '20px', pointerEvents: 'none',
            background: `radial-gradient(ellipse at 0% 50%, ${roleGlow} 0%, transparent 65%)`
          }}
          animate={{ opacity: hovered ? 1 : 0.4 }}
          transition={SPRING}
        />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px', position: 'relative', zIndex: 2 }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.94)', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
            {driver.name}
          </h4>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px', flexShrink: 0,
            padding: '4px 10px 4px 8px', borderRadius: '999px',
            background: `${roleColor}0C`, border: `1px solid ${roleColor}22`,
            fontSize: '10px', fontWeight: 600, color: roleColor, letterSpacing: '0.05em', textTransform: 'uppercase'
          }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: roleColor, boxShadow: `0 0 5px ${roleColor}80` }} />
            {roleLabel}
          </div>
        </div>

        <ProgressBar value={driver.weight} maxVal={100} color={`linear-gradient(90deg, rgba(94,167,255,0.80), rgba(160,120,255,0.65))`} delay={0.12 + index * 0.09} />

        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.52)', lineHeight: 1.55, margin: '8px 0 0', position: 'relative', zIndex: 2 }}>
          {driver.reason}
        </p>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)',
          marginTop: '12px', position: 'relative', zIndex: 2
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <BarChart2 className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.40)' }} strokeWidth={2} />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.52)', fontWeight: 500 }}>
              {driver.weight}% weight
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CATEGORY_DATA = [
  { name: 'Services',   yoy: 4.9,  direction: 'up',   note: 'Medical care 3.2%, personal care 5.4%' },
  { name: 'Food',       yoy: 2.9,  direction: 'up',   note: 'Beef and coffee prices remain elevated' },
  { name: 'Shelter',    yoy: 3.0,  direction: 'flat', note: 'Biggest CPI weight, slowly cooling' },
  { name: 'Core Goods', yoy: 1.1,  direction: 'flat', note: 'Used cars deflating, apparel stable' },
  { name: 'Energy',     yoy: -0.1, direction: 'down', note: 'Gasoline down 7.5%, electricity up 6.3%' },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function InflationSection({ data }) {
  if (!data) return null;

  const d = {
    timestamp_display: data.timestamp_display || '',
    delta_summary: data.delta_summary || '',
    confidence: data.confidence || 0,
    headline_state: data.headline_state || { arrow: 'flat', label: 'Headline CPI', status: '' },
    core_state: data.core_state || { arrow: 'flat', label: 'Core CPI', status: '' },
    services_state: data.services_state || { arrow: 'flat', label: 'Services', status: '' },
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

  const stagger = (i) => ({
    initial: { opacity: 0, y: 16, scale: 0.985 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { ...ENTRY, delay: i * 0.07 }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...ENTRY, delay: 0.05 }}
      style={{ ...GLASS.panel, padding: '28px 26px 26px', position: 'relative', overflow: 'visible' }}
    >
      {/* Top specular edge */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        borderRadius: '999px', pointerEvents: 'none'
      }} />

      {/* Ambient colored bloom */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '140px',
        background: `radial-gradient(ellipse at 50% 0%, ${regimeTheme.glow.replace('0.15', '0.08')} 0%, transparent 70%)`,
        borderRadius: '28px 28px 0 0', pointerEvents: 'none'
      }} />

      {/* ── HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '18px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${regimeTheme.color}10`, border: `1px solid ${regimeTheme.color}20`,
            boxShadow: `0 0 12px ${regimeTheme.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`
          }}>
            <Activity className="w-5 h-5" style={{ color: regimeTheme.color }} strokeWidth={2} />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.01em', lineHeight: 1.2, marginBottom: '3px' }}>
              Inflation
            </h2>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.48)', lineHeight: 1.4 }}>
              {d.timestamp_display ? `Last updated ${d.timestamp_display}` : 'Real-time price pressure signals.'}
            </p>
          </div>
        </div>

        {/* Regime pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '5px 12px 5px 10px', borderRadius: '999px',
          background: `${regimeTheme.color}0C`, border: `1px solid ${regimeTheme.color}22`,
          backdropFilter: 'blur(12px)', fontSize: '11px', fontWeight: 700,
          color: regimeTheme.color, letterSpacing: '0.06em', textTransform: 'uppercase'
        }}>
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '6px', height: '6px', borderRadius: '50%', background: regimeTheme.color, boxShadow: `0 0 6px ${regimeTheme.color}` }}
          />
          {regimeTheme.label}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '20px' }} />

      {/* ── DELTA BANNER ── */}
      {d.delta_summary && (
        <motion.div {...stagger(0)} style={{ ...GLASS.card, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', position: 'relative', overflow: 'hidden' }}>
          <div style={SPECULAR} />
          <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(92,216,160,0.85)', letterSpacing: '0.14em', textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0 }}>
            Δ Since last update
          </span>
          <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.5 }}>
            {d.delta_summary}
          </span>
        </motion.div>
      )}

      {/* ── THREE STATE CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px' }}>
        {[d.headline_state, d.core_state, d.services_state].map((state, i) => (
          <StateCard key={i} state={state} index={i} />
        ))}
      </div>

      {/* ── FED IMPLICATION ── */}
      {d.fed_implication && (
        <motion.div {...stagger(3)} style={{ ...GLASS.card, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', position: 'relative', overflow: 'hidden' }}>
          <div style={SPECULAR} />
          <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0 }}>
            Fed Implication
          </span>
          <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.5 }}>
            {d.fed_implication}
          </span>
        </motion.div>
      )}

      {/* ── INFLATION BY CATEGORY | KEY DRIVERS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
        {/* Categories */}
        <motion.div {...stagger(4)} style={{ ...GLASS.card, padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={SPECULAR} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{
              width: '26px', height: '26px', borderRadius: '7px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
            }}>
              <BarChart2 className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.55)' }} strokeWidth={2} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
              By Category
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {CATEGORY_DATA.map((cat, idx) => (
              <CategoryCard key={idx} cat={cat} index={idx} />
            ))}
          </div>
        </motion.div>

        {/* Key Drivers */}
        <motion.div {...stagger(5)} style={{ ...GLASS.card, padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={SPECULAR} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{
              width: '26px', height: '26px', borderRadius: '7px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
            }}>
              <Flame className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.55)' }} strokeWidth={2} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
              Key Drivers
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {d.drivers.slice(0, 3).map((driver, idx) => (
              <DriverCard key={idx} driver={driver} index={idx} />
            ))}
            {d.drivers.length === 0 && (
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.38)', textAlign: 'center', padding: '24px 0' }}>
                Driver data pending.
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── WINNERS + LOSERS | WHAT TO WATCH ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
        {/* Winners + Losers side-by-side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {/* Winners */}
          <motion.div {...stagger(6)} style={{
            ...GLASS.card,
            background: 'linear-gradient(180deg, rgba(92,216,160,0.06) 0%, rgba(92,216,160,0.03) 100%)',
            border: '1px solid rgba(92,216,160,0.12)',
            padding: '16px', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ ...SPECULAR, background: 'linear-gradient(90deg, transparent, rgba(92,216,160,0.15), transparent)' }} />
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(92,216,160,0.85)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Winners
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {d.winners.slice(0, 4).map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.78)' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(92,216,160,0.70)', flexShrink: 0, marginTop: '4px', boxShadow: '0 0 5px rgba(92,216,160,0.40)' }} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Losers */}
          <motion.div {...stagger(7)} style={{
            ...GLASS.card,
            background: 'linear-gradient(180deg, rgba(242,106,106,0.06) 0%, rgba(242,106,106,0.03) 100%)',
            border: '1px solid rgba(242,106,106,0.12)',
            padding: '16px', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ ...SPECULAR, background: 'linear-gradient(90deg, transparent, rgba(242,106,106,0.15), transparent)' }} />
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(242,106,106,0.85)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Losers
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {d.losers.slice(0, 4).map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.78)' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(242,106,106,0.70)', flexShrink: 0, marginTop: '4px', boxShadow: '0 0 5px rgba(242,106,106,0.40)' }} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* What to Watch */}
        <motion.div {...stagger(8)} style={{ ...GLASS.card, padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={SPECULAR} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{
              width: '26px', height: '26px', borderRadius: '7px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
            }}>
              <Wind className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.55)' }} strokeWidth={2} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
              What to Watch
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: '10px', letterSpacing: '0.04em' }}>
                30–60 Days
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {d.watch_short.slice(0, 4).map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', fontSize: '12px', color: 'rgba(255,255,255,0.68)', lineHeight: 1.45 }}>
                    <ChevronRight className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.30)', flexShrink: 0, marginTop: '2px' }} strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: '10px', letterSpacing: '0.04em' }}>
                6–12 Months
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {d.watch_long.slice(0, 4).map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', fontSize: '12px', color: 'rgba(255,255,255,0.68)', lineHeight: 1.45 }}>
                    <ChevronRight className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.30)', flexShrink: 0, marginTop: '2px' }} strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── HOW TO READ THE DATA ── */}
      <motion.div {...stagger(9)} style={{ ...GLASS.card, padding: '18px 20px', display: 'flex', alignItems: 'stretch', gap: '0', position: 'relative', overflow: 'hidden', marginBottom: '14px' }}>
        <div style={SPECULAR} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginRight: '20px', flexShrink: 0 }}>
          <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1.4 }}>
            HOW TO<br />READ THE DATA
          </span>
        </div>
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.07)', marginRight: '20px', flexShrink: 0 }} />
        {[
          { label: 'CPI', value: d.cpi_pce_collapsed?.split('/')[0]?.trim() || '2.4%', desc: d.cpi_plain, color: '#5EA7FF' },
          { label: 'PCE', value: d.cpi_pce_collapsed?.split('/')[1]?.trim() || '2.5%', desc: d.pce_plain, color: '#B47FFF' },
          { label: 'Gap', value: '0.1%', desc: d.why_fed_prefers, color: '#FFB020' },
        ].map((item, idx) => (
          <div key={idx} style={{
            flex: 1, padding: '12px 14px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            marginRight: idx < 2 ? '10px' : 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.90)' }}>{item.label}</span>
              <span style={{
                fontSize: '11px', fontWeight: 700, padding: '1px 7px', borderRadius: '999px',
                background: `${item.color}10`, color: item.color, border: `1px solid ${item.color}20`
              }}>{item.value}</span>
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* ── TOP WEIGHTED SOURCES ── */}
      <motion.div {...stagger(10)} style={{ ...GLASS.card, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', overflow: 'hidden' }}>
        <div style={SPECULAR} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <Database className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.40)' }} strokeWidth={2} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.88)', whiteSpace: 'nowrap' }}>
            Top Weighted Sources
          </span>
          <div style={{
            fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px',
            background: 'rgba(94,167,255,0.12)', color: 'rgba(140,195,255,0.95)',
            border: '1px solid rgba(94,167,255,0.22)',
          }}>
            {d.sources.length}
          </div>
        </div>
        <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />
        <div style={{ display: 'flex', gap: '8px', flex: 1, overflow: 'hidden' }}>
          {d.sources.slice(0, 5).map((source, idx) => (
            <a
              key={idx}
              href={source.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '5px 12px', borderRadius: '999px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.65)', fontSize: '12px', fontWeight: 500,
                textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
                transition: 'all 0.16s ease-out',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = 'rgba(255,255,255,0.94)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              {source.name}
              <ExternalLink className="w-2.5 h-2.5" style={{ opacity: 0.5 }} strokeWidth={2} />
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}