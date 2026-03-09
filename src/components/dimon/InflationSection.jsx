import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, BarChart2, Database, ChevronRight, Flame, Wind, Activity, ExternalLink } from 'lucide-react';

const SPRING = { type: 'spring', stiffness: 380, damping: 40, mass: 0.8 };
const ENTRY  = { type: 'spring', stiffness: 320, damping: 35, mass: 0.85 };

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
    borderRadius: '16px',
  }
};

const SPECULAR = {
  position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
  pointerEvents: 'none',
};

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
    <div style={{ position: 'relative', height: '2px', borderRadius: '999px', background: 'rgba(255,255,255,0.07)', overflow: 'visible', flex: 1 }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(pct, 2)}%` }}
        transition={{ duration: 0.9, delay, ease: [0.22, 0.61, 0.36, 1] }}
        style={{ position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: '999px', background: color }}
      >
        <div style={{
          position: 'absolute', right: '-3px', top: '50%', transform: 'translateY(-50%)',
          width: '5px', height: '5px', borderRadius: '50%', background: color,
          boxShadow: `0 0 5px 1px ${color}88`,
        }} />
      </motion.div>
    </div>
  );
};

const CATEGORY_DATA = [
  { name: 'Services',   yoy: 4.9,  direction: 'up',   note: 'Medical +3.2%, personal care +5.4%' },
  { name: 'Food',       yoy: 2.9,  direction: 'up',   note: 'Beef and coffee remain elevated' },
  { name: 'Shelter',    yoy: 3.0,  direction: 'flat', note: 'Biggest CPI weight, slowly cooling' },
  { name: 'Core Goods', yoy: 1.1,  direction: 'flat', note: 'Used cars deflating, apparel stable' },
  { name: 'Energy',     yoy: -0.1, direction: 'down', note: 'Gas -7.5%, electricity +6.3%' },
];

export default function InflationSection({ data }) {
  if (!data) return null;

  const d = {
    timestamp_display: data.timestamp_display || '',
    delta_summary: data.delta_summary || '',
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
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { ...ENTRY, delay: i * 0.06 }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...ENTRY, delay: 0.05 }}
      style={{ ...GLASS.panel, padding: '22px 22px 20px', position: 'relative', overflow: 'visible' }}
    >
      {/* Top specular */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        borderRadius: '999px', pointerEvents: 'none'
      }} />
      {/* Ambient bloom */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '100px',
        background: `radial-gradient(ellipse at 50% 0%, ${regimeTheme.glow.replace('0.15','0.07')} 0%, transparent 70%)`,
        borderRadius: '28px 28px 0 0', pointerEvents: 'none'
      }} />

      {/* ── HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '9px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${regimeTheme.color}10`, border: `1px solid ${regimeTheme.color}20`,
            boxShadow: `0 0 10px ${regimeTheme.glow}`
          }}>
            <Activity className="w-4 h-4" style={{ color: regimeTheme.color }} strokeWidth={2} />
          </div>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'rgba(255,255,255,0.96)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              Inflation
            </h2>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.40)', margin: 0 }}>
              {d.timestamp_display ? `Updated ${d.timestamp_display}` : 'Real-time price pressure signals.'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Delta pill */}
          {d.delta_summary && (
            <div style={{ ...GLASS.card, padding: '5px 12px', fontSize: '11px', color: 'rgba(255,255,255,0.72)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span style={{ color: 'rgba(92,216,160,0.85)', fontWeight: 700, marginRight: '6px' }}>Δ</span>
              {d.delta_summary}
            </div>
          )}
          {/* Regime chip */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '5px 12px 5px 10px', borderRadius: '999px',
            background: `${regimeTheme.color}0C`, border: `1px solid ${regimeTheme.color}22`,
            fontSize: '10px', fontWeight: 700, color: regimeTheme.color, letterSpacing: '0.06em', textTransform: 'uppercase'
          }}>
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: '5px', height: '5px', borderRadius: '50%', background: regimeTheme.color, boxShadow: `0 0 5px ${regimeTheme.color}` }}
            />
            {regimeTheme.label}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '14px' }} />

      {/* ── ROW A: THREE STATE CARDS + FED IMPLICATION ── */}
      <motion.div {...stagger(0)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr', gap: '10px', marginBottom: '10px' }}>
        {[d.headline_state, d.core_state, d.services_state].map((state, i) => {
          const t = getRegimeTheme(state.arrow);
          return (
            <div key={i} style={{ ...GLASS.card, padding: '12px 14px', position: 'relative', overflow: 'hidden' }}>
              <div style={SPECULAR} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <t.Icon className="w-3 h-3" style={{ color: t.color }} strokeWidth={2.5} />
                <span style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                  {state.label}
                </span>
              </div>
              <p style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.88)', lineHeight: 1.4, margin: 0 }}>
                {state.status}
              </p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '8px',
                padding: '2px 8px 2px 6px', borderRadius: '999px',
                background: `${t.color}0C`, border: `1px solid ${t.color}22`,
                fontSize: '9px', fontWeight: 600, color: t.color, letterSpacing: '0.05em', textTransform: 'uppercase'
              }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: t.color }} />
                {t.label}
              </div>
            </div>
          );
        })}
        {/* Fed implication — 4th column */}
        {d.fed_implication && (
          <div style={{ ...GLASS.card, padding: '12px 14px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={SPECULAR} />
            <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
              Fed Implication
            </span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.80)', lineHeight: 1.5 }}>
              {d.fed_implication}
            </span>
          </div>
        )}
      </motion.div>

      {/* ── ROW B: CATEGORY LIST | DRIVERS LIST ── */}
      <motion.div {...stagger(1)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        {/* Categories — compact list */}
        <div style={{ ...GLASS.card, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
          <div style={SPECULAR} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <BarChart2 className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.40)' }} strokeWidth={2} />
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.40)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
              By Category
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {CATEGORY_DATA.map((cat, idx) => {
              const barColor = getCategoryColor(cat.yoy);
              const arrowChar = cat.direction === 'up' ? '↑' : cat.direction === 'down' ? '↓' : '→';
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.82)', width: '76px', flexShrink: 0 }}>{cat.name}</span>
                  <MiniBar value={cat.yoy} maxVal={6} color={barColor} delay={0.08 + idx * 0.05} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: barColor, width: '44px', textAlign: 'right', flexShrink: 0 }}>
                    {arrowChar}{cat.yoy >= 0 ? '+' : ''}{cat.yoy.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drivers — compact list */}
        <div style={{ ...GLASS.card, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
          <div style={SPECULAR} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <Flame className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.40)' }} strokeWidth={2} />
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.40)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
              Key Drivers
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {d.drivers.slice(0, 4).map((driver, idx) => {
              const roleLabel = driver.role || (driver.weight >= 40 ? 'Primary' : driver.weight >= 25 ? 'Supporting' : 'Offset');
              const roleColor = roleLabel === 'Primary' ? '#5EA7FF' : roleLabel === 'Offset' ? '#F26A6A' : '#5CD8A0';
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.88)', flex: 1 }}>{driver.name}</span>
                    <span style={{
                      fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '999px',
                      background: `${roleColor}0C`, border: `1px solid ${roleColor}22`,
                      color: roleColor, letterSpacing: '0.04em', textTransform: 'uppercase', flexShrink: 0
                    }}>{roleLabel}</span>
                  </div>
                  <MiniBar value={driver.weight} maxVal={100} color={`linear-gradient(90deg, rgba(94,167,255,0.80), rgba(160,120,255,0.65))`} delay={0.1 + idx * 0.07} />
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', margin: '4px 0 0', lineHeight: 1.4 }}>{driver.reason}</p>
                </div>
              );
            })}
            {d.drivers.length === 0 && (
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '12px 0' }}>Driver data pending.</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── ROW C: WINNERS | LOSERS | WHAT TO WATCH ── */}
      <motion.div {...stagger(2)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '10px', marginBottom: '10px' }}>
        {/* Winners */}
        <div style={{
          ...GLASS.card,
          background: 'linear-gradient(180deg, rgba(92,216,160,0.05) 0%, rgba(92,216,160,0.02) 100%)',
          border: '1px solid rgba(92,216,160,0.10)',
          padding: '14px 16px', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ ...SPECULAR, background: 'linear-gradient(90deg, transparent, rgba(92,216,160,0.12), transparent)' }} />
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(92,216,160,0.80)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>Winners</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {d.winners.slice(0, 4).map((item, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(92,216,160,0.70)', flexShrink: 0, marginTop: '4px', boxShadow: '0 0 4px rgba(92,216,160,0.40)' }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Losers */}
        <div style={{
          ...GLASS.card,
          background: 'linear-gradient(180deg, rgba(242,106,106,0.05) 0%, rgba(242,106,106,0.02) 100%)',
          border: '1px solid rgba(242,106,106,0.10)',
          padding: '14px 16px', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ ...SPECULAR, background: 'linear-gradient(90deg, transparent, rgba(242,106,106,0.12), transparent)' }} />
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(242,106,106,0.80)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>Losers</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {d.losers.slice(0, 4).map((item, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(242,106,106,0.70)', flexShrink: 0, marginTop: '4px', boxShadow: '0 0 4px rgba(242,106,106,0.40)' }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* What to Watch */}
        <div style={{ ...GLASS.card, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
          <div style={SPECULAR} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Wind className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.40)' }} strokeWidth={2} />
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.40)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>What to Watch</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: '30–60 Days', items: d.watch_short },
              { label: '6–12 Months', items: d.watch_long },
            ].map(({ label, items }) => (
              <div key={label}>
                <div style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: '7px', letterSpacing: '0.04em' }}>{label}</div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {items.slice(0, 3).map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.68)', lineHeight: 1.4 }}>
                      <ChevronRight className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.28)', flexShrink: 0, marginTop: '1px' }} strokeWidth={2} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── ROW D: CPI/PCE + SOURCES — single row ── */}
      <motion.div {...stagger(3)} style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '10px' }}>
        {/* CPI/PCE */}
        <div style={{ ...GLASS.card, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', overflow: 'hidden' }}>
          <div style={SPECULAR} />
          <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.30)', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0 }}>
            HOW TO READ
          </span>
          <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />
          {[
            { label: 'CPI', value: d.cpi_pce_collapsed?.split('/')[0]?.trim() || '2.4%', color: '#5EA7FF', desc: d.cpi_plain },
            { label: 'PCE', value: d.cpi_pce_collapsed?.split('/')[1]?.trim() || '2.5%', color: '#B47FFF', desc: d.pce_plain },
            { label: 'Gap', value: '0.1%', color: '#FFB020', desc: d.why_fed_prefers },
          ].map((item, idx) => (
            <div key={idx} style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{item.label}</span>
                <span style={{
                  fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '999px',
                  background: `${item.color}10`, color: item.color, border: `1px solid ${item.color}20`
                }}>{item.value}</span>
              </div>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.40)', lineHeight: 1.4, margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Sources */}
        <div style={{ ...GLASS.card, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px', position: 'relative', overflow: 'hidden' }}>
          <div style={SPECULAR} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <Database className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.38)' }} strokeWidth={2} />
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Sources</span>
            <div style={{
              fontSize: '9px', fontWeight: 700, padding: '1px 6px', borderRadius: '999px',
              background: 'rgba(94,167,255,0.12)', color: 'rgba(140,195,255,0.90)',
              border: '1px solid rgba(94,167,255,0.20)',
            }}>{d.sources.length}</div>
          </div>
          <div style={{ display: 'flex', gap: '6px', flex: 1, overflow: 'hidden', flexWrap: 'wrap' }}>
            {d.sources.slice(0, 4).map((source, idx) => (
              <a key={idx} href={source.url || '#'} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '3px 10px', borderRadius: '999px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.60)', fontSize: '11px', fontWeight: 500,
                  textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
                  transition: 'all 0.14s ease-out',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = 'rgba(255,255,255,0.90)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.60)'; }}
              >
                {source.name}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}